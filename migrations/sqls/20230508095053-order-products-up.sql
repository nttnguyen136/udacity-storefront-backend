CREATE TABLE order_products (
  quantity integer NOT NULL,
  product_id integer NOT NULL REFERENCES products(id),
  order_id integer NOT NULL REFERENCES orders(id)
);