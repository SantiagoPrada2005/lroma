import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const menuCollection = defineCollection({
  loader: file("src/content/menu/menu.json"),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    category: z.enum([
      "pizzas",
      "burgers",
      "hots",
      "sandwiches",
      "pastas",
      "grill",
      "picadas",
      "alitas",
      "drinks",
    ]),
    image: z.string(), // URL (Unsplash)
    featured: z.boolean().default(false),
  }),
});

export const collections = { menu: menuCollection };
