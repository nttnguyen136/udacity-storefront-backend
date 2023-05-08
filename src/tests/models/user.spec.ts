import { User, UserStore } from '../../models/user.model'
import { bcryptCompareSync, bcryptHashSync } from '../../utils/bcrypt'

const store = new UserStore()

describe('User Model', () => {
  const user: User = {
    user_name: 'username2',
    password: 'password',
    first_name: 'First',
    last_name: 'Last'
  }

  afterAll((done) => {
    store.delete(user.id!).then(() => {
      done()
    })
  })

  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('create method should add a user', async () => {
    const result = await store.create(user)

    if (result) {
      user.id = result.id
      expect({
        ...result,
        password: user.password
      }).toEqual(user)

      const cp = bcryptCompareSync(user.password, result?.password)
      expect(cp).toBeTrue()
    }
  })

  it('authenticate method should return a username', async () => {
    const result = await store.authenticate(user.user_name, user.password)

    if (result) {
      expect({
        ...result,
        password: user.password
      }).toEqual(user)

      const cp = bcryptCompareSync(user.password, result?.password)
      expect(cp).toBeTrue()
    }
  })
})
