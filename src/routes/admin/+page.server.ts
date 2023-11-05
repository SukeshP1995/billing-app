import type { Actions, PageServerLoad } from './$types';
import { z } from "zod";
import { defaultValues, message, superValidate } from 'sveltekit-superforms/server';

import { Accessory } from '$lib/server/accessory.model.js';
import { isType, type JSONObject } from '$lib/utils';

const schema = z.object({
  model: z.string().optional(),
  halfKitItems: z.array(
    z.object({
      name: z.string().min(1),
    })
  ),
  fullKitItems: z.array(
    z.object({
      name: z.string().min(1),
    })
  ),
  halfKitHsn: z.string(),
  fullKitHsn: z.string(),
  halfKitPrice: z.number(),
  fullKitPrice: z.number(),
  halfKitQuantity: z.number(),
  fullKitQuantity: z.number(),
  accessories: z.array(
    z.object({
      name: z.string(),
      hsn: z.string(),
      price: z.number(),
      quantity: z.number(),
    })
  ),
});

async function getModels() {
  const queryData = await Accessory.find({}, 'model');
  return queryData.map(({ model }) => `${model}`);
}

export const load = (async ({ url }) => {
  const model = url.searchParams.get('model');
  const accessory = (await Accessory.findOne({ model }).select('-_id -accessories._id -__v'))?.toObject();

  const form = await superValidate(schema);
  form.data = defaultValues(schema);
  if (model && accessory) {
    accessory.halfKitItems = accessory.halfKitItems.map((name: string) => ({name}));
    accessory.fullKitItems = accessory.fullKitItems.map((name: string) => ({name}));
    form.data = { ...form.data, ...(accessory as unknown as z.infer<typeof schema>) };
  }
  console.log(JSON.stringify(form.data, null, 2));
  const models = await getModels();
  return { models, form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
    const form = await superValidate(request, schema);
    console.log('POST', form);
    const data: JSONObject = structuredClone(form.data);
    const { model } = data;
    delete data.model;
    if (isType<{name: string}[]>(data.halfKitItems)) {
      data.halfKitItems = data.halfKitItems.map(({name}) => (name))
    }
    if (isType<{name: string}[]>(data.fullKitItems)) {
      data.fullKitItems = data.fullKitItems.map(({name}) => (name))
    }
    await Accessory.updateOne({ model }, {$set: data}, {upsert: true});
    const models = await getModels()
    return {models, ...(message(form, "submitted"))};
	},
} satisfies Actions;