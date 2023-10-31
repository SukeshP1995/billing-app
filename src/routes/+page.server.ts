import { Accessory } from '$lib/server/accessory.model';
import type { Actions, PageServerLoad } from './$types';
import { z } from "zod";
import { defaultValues, superValidate } from 'sveltekit-superforms/server';

const schema = z.object({
  customerName: z.string().min(1),
  model: z.string().min(1),
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
  halfKitHsn: z.string().min(1),
  fullKitHsn: z.string().min(1),
  halfKitPrice: z.number(),
  fullKitPrice: z.number(),
  halfKitQuantity: z.number(),
  fullKitQuantity: z.number(),
  halfKitTotalPrice: z.number(),
  fullKitTotalPrice: z.number(),
  accessories: z.array(
    z.object({
      name: z.string().min(1),
      hsn: z.string().min(1),
      price: z.number(),
      quantity: z.number(),
      totalPrice: z.number()
    })
  ),
});

export const load = (async ({url}) => {
  const model = url.searchParams.get('model');
  
  const queryData = await Accessory.find({}, 'model');
  const models = queryData.map(({model}) => `${model}`);
  const accessory = (await Accessory.findOne({model}).select('-_id -accessories._id -__v'))?.toObject();
  
  const form = await superValidate(schema);
  form.data = defaultValues(schema);
  if (model && accessory) {
    accessory.halfKitQuantity = 0;
    accessory.fullKitQuantity = 0;
    accessory.halfKitItems = accessory.halfKitItems.map((name: string) => ({name}));
    accessory.fullKitItems = accessory.fullKitItems.map((name: string) => ({name}));
    accessory.accessories = accessory.accessories.map((acc: Record<string, unknown>) => {
      acc.quantity = 0;
      acc.totalPrice = 0;
      return acc;
    })
    form.data = {...form.data, ...(accessory as unknown as z.infer<typeof schema>)};
  }
  return { models, form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({request}) => {
		// TODO log the user in
    const form = await superValidate(request, schema);
    console.log('POST', form);
	},
} satisfies Actions;
