import supertest from 'supertest'
import { User } from '../../models/user.model'
import app from '../../server'
import { jwtVerify } from '../../utils/jwt'
import { JwtPayload } from 'jsonwebtoken'

const request = supertest(app)

describe('User Handler', () => {
  const user: User = {
    user_name: 'user_name',
    first_name: 'First',
    last_name: 'Last',
    password: 'pass123'
  }

  let jwt: string

  it('should post the register endpoint', async () => {
    const res = await request.post('/users/register').send(user)

    const { body, status } = res

    const jwtPayload = jwtVerify(body.jwt) as JwtPayload

    user.id = jwtPayload['user'].id

    expect(status).toBe(200)
  })

  it('should post the login endpoint', async () => {
    const res = await request.post('/users/login').send({
      user_name: user.user_name,
      password: user.password
    })

    const { body, status } = res

    jwt = body.jwt

    expect(status).toBe(200)
  })

  it('should gets the index endpoint', async () => {
    const res = await request
      .get('/users')
      .set('Authorization', `bearer ${jwt}`)

    expect(res.status).toBe(200)
  })

  it('should gets the show endpoint', async () => {
    const res = await request
      .get(`/users/${user.id}`)
      .set('Authorization', `bearer ${jwt}`)

    const userRes = res.body

    expect(userRes.user_name).toEqual(user.user_name)
    expect(res.status).toBe(200)
  })
})
