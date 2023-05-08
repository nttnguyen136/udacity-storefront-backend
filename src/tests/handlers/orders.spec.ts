import supertest from 'supertest'
import { User } from '../../models/user.model'
import app from '../../server'
import { jwtVerify } from '../../utils/jwt'
import { JwtPayload } from 'jsonwebtoken'
import { Product } from '../../models/product.model'
import { Order } from '../../models/order.model'

const request = supertest(app)

describe('Product Handler', () => {
  const product: Product = {
    name: 'Test Product',
    category: 'Category test',
    price: 1000
  }

  const user: User = {
    user_name: 'order_user',
    password: 'password',
    first_name: 'First Name',
    last_name: 'Last Name'
  }

  let order: Order

  let jwt: string

  beforeAll(async () => {
    // Set up User
    const userRegister = await request.post('/users/register').send(user)
    jwt = userRegister.body.jwt
    const jwtPayload = jwtVerify(jwt) as JwtPayload
    user.id = jwtPayload['user'].id

    // Set up product
    const newProduct = await request
      .post('/products')
      .set('Authorization', `bearer ${jwt}`)
      .send(product)

    product.id = newProduct.body.id

    order = {
      user_id: user.id!,
      status: 'NEW',
      products: [
        {
          ...product,
          quantity: 1
        }
      ]
    }
  })

  it('should post the create endpoint', async () => {
    const res = await request
      .post('/orders')
      .set('Authorization', `bearer ${jwt}`)
      .send()

    order.id = res.body.id

    expect(res.status).toBe(200)
  })

  it('should post the addProduct endpoint', async () => {
    const res = await request
      .post(`/orders/${order.id}/products`)
      .set('Authorization', `bearer ${jwt}`)
      .send({
        productId: order.products![0].id,
        quantity: order.products![0].quantity
      })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ quantity: 1, product_id: 1, order_id: 1 })
  })

  it('should gets the getOrder endpoint', async () => {
    const res = await request
      .get('/orders/user')
      .set('Authorization', `bearer ${jwt}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
      {
        id: order.id,
        status: 'NEW',
        products: [
          {
            ...product,
            quantity: 1
          }
        ]
      }
    ])
  })
})
