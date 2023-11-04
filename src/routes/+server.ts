import { createClient } from 'redis';
import { z } from "zod";
import type { RequestHandler } from './$types';
import { parse } from 'devalue';
import { Accessory } from '$lib/server/accessory.model';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {	
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
        hsn: z.string().min(1).optional(),
        price: z.number().optional(),
        quantity: z.number(),
        totalPrice: z.number().optional()
      })
    ),
  });

  const client = createClient({
    password: 'Q1wiC9ePciwSgo1DyVcAA1r6AvzBxRU9',
    socket: {
        host: 'redis-19171.c251.east-us-mz.azure.cloud.redislabs.com',
        port: 19171
    }
  });

  await client.connect();

  if (!(await client.get('pdiNo'))) {
    await client.set('pdiNo', 10000)
  }

  const data = schema.parse(parse(await event.request.text()));

  data["accessories"] = data["accessories"].filter(({name}) => ["HALF KIT", "FULL KIT"].includes(name));
  
  const doc = await Accessory.findOne({model: data["model"]});
  if (doc) {
    if (doc["halfKitQuantity"] > 0) {
      console.log(await Accessory.findOneAndUpdate({model: data["model"]}, {$inc: {halfKitQuantity: -data["halfKitQuantity"]}}));
    } else {
      doc['halfKitItems'].forEach((name: string) => {
        data["accessories"].push({
          name,
          quantity: data["halfKitQuantity"]
        });
      });
    }

    if (doc["fullKitQuantity"] > 0) {
      console.log(await Accessory.findOneAndUpdate({model: data["model"]}, {$inc: {fullKitQuantity: -data["fullKitQuantity"]}}));
    } else {
      doc['fullKitItems'].forEach((name: string) => {
        data["accessories"].push({
          name,
          quantity: data["fullKitQuantity"]
        });
      });
    }
  }

  await Promise.all(data["accessories"].map(async (accessory) =>  {
    return (await Accessory.findOneAndUpdate({model: data["model"], "accessories.name": accessory.name.trim()}, {"$inc": {"accessories.0.quantity": -accessory.quantity}}, {'new': true, 'safe': true, 'upsert': true})).accessories
  }));
  const sno = 'PDI' + await client.incr('pdiNo');
  return json({ sno });
};