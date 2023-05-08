import supertest from 'supertest'
import { User } from '../../models/user.model'
import app from '../../server'
import { jwtVerify } from '../../utils/jwt'
import { JwtPayload } from 'jsonwebtoken'
import { Product } from '../../models/product.model'

const request = supertest(app)

describe('Product Handler', () => {
  const product: Product = {
    name: 'Test Product',
    category: 'Category test',
    price: 1000
  }

  const user: User = {
    user_name: 'product_user',
    password: 'product_password',
    first_name: 'First Name',
    last_name: 'Last Name'
  }

  let jwt: string

  beforeAll(async () => {
    const userRegister = await request.post('/users/register').send(user)

    const { body } = userRegister
    jwt = body.jwt
    const jwtPayload = jwtVerify(body.jwt) as JwtPayload

    user.id = jwtPayload['user'].id
  })

  it('should post the create endpoint', async () => {
    const res = await request
      .post('/products')
      .set('Authorization', `bearer ${jwt}`)
      .send(product)

    const { body, status } = res

    product.id = body.id

    expect(body).toEqual(product)
    expect(status).toBe(200)
  })

  it('should gets the products endpoint', async () => {
    const res = await request
      .get('/products')
      .set('Authorization', `bearer ${jwt}`)

    const { body, status } = res

    expect(status).toBe(200)
    expect(body.length).toBeGreaterThan(0)
  })

  it('should gets the show endpoint', async () => {
    const res = await request
      .get(`/products/${product.id}`)
      .set('Authorization', `bearer ${jwt}`)

    const { body, status } = res

    expect(body).toEqual(product)
    expect(status).toBe(200)
  })
})
