import type { z } from 'zod';
import type { PageServerLoad } from './$types';
import { defaultValues, superValidate } from 'sveltekit-superforms/server';

import { Accessory } from '$lib/server/accessory.model.js';
import { schema } from '$lib/server/utils.js';

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