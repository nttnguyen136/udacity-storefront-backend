# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 'products'  [GET]
- Show 'products/:id'  [GET]
- Create [token required] [POST] 'products' 
- [OPTIONAL] [NOT_IMPLEMENT] Top 5 most popular products 
- [OPTIONAL] [NOT_IMPLEMENT] Products by category (args: product category) 

#### Users
- Index [token required] 'users'  [GET]
- Show [token required] 'users/:id'  [GET]
- Create [token required] 
  * [POST] 'users/register' 
  * [BODY] {
    user_name: string
    password: string,
    first_name: string,
    last_name: string
  }
- Login [token required] 
  * [POST] 'users/login'
  * [BODY] {
    user_name: string
    password: string,
  }

#### Orders
- Create [token required] 
  [POST] 'orders'
- Add product to order [token required] 
  * [POST] 'orders/:id/products'   =>   (`:id`: order id)
  * [BODY] {
    productId: string
    quantity: string,
  }
- Current Order by user [token required] 'orders/user' [GET] 
- [OPTIONAL] [NOT_IMPLEMENT] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
- id
- name
- price
- category

```sql
TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  category VARCHAR(255)
);
```

#### User
- id
- user_name
- first_name
- last_name
- password

```sql
TABLE users (
  id SERIAL PRIMARY KEY,
  user_name varchar(64) NOT NULL,
  first_name varchar(64),
  last_name varchar(64),
  password varchar(255) NOT NULL
);
```

#### Orders
- id
- user_id
- status of order (NEW or COMPLETE)

```sql
TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id),
  status varchar(64) NOT NULL
);
```

#### Orders Product
- id
- user_id
- order_id

```sql
TABLE order_products (
    quantity integer NOT NULL,
    product_id integer NOT NULL REFERENCES products(id),
    order_id integer NOT NULL REFERENCES orders(id)
);
```