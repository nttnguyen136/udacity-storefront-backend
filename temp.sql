select *,
  o.id
from orders o
  join order_products op ON op.order_id = o.id
  JOIN products p ON op.product_id = p.id
WHERE user_id =($1) -- 
  --