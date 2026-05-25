import { pgTable, serial, text, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(), // Link de afiliado
  category: text('category'), // Categoria (ex: Eletrônicos, Casa, Moda)
  origin: text('origin'), // Origem (ex: shopee, amazon, mercadolivre)
  imageUrl: text('image_url'), // Link da imagem do produto
  price: numeric('price', { precision: 10, scale: 2 }), // Preço opcional
  description: text('description'), // Descrição / subtítulo opcional
  active: boolean('active').default(true), // Status de visibilidade
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
