import { z } from "zod";

export const schema = z.object({
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
