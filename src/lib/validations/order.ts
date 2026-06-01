import { z } from "zod";

export const shippingSchema = z.object({
  name: z.string().min(2, "Full name required"),
  phone: z.string().min(6, "Phone required"),
  street: z.string().min(3, "Street address required"),
  apt: z.string().optional(),
  city: z.string().min(1, "City required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country required"),
  postal: z.string().min(1, "Postal code required"),
});

export const createOrderSchema = z.object({
  paymentIntentId: z.string().min(1),
  shipping: shippingSchema,
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      productSlug: z.string(),
      imageUrl: z.string().nullable(),
      size: z.string().nullable(),
      color: z.string().nullable(),
      price: z.number().positive(),
      quantity: z.number().int().min(1),
    })
  ).min(1, "Order must have at least one item"),
  subtotal: z.number().positive(),
  shippingCost: z.number().min(0),
});

export type ShippingInput = z.infer<typeof shippingSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
