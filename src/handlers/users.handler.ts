import { Application, Request, Response } from 'express'
import { User, UserStore } from '../models/user.model'
import { jwtSign } from '../utils/jwt'
import { verifyAuthToken } from '../middlewares/token.middleware'
import { bcryptCompareSync } from '../utils/bcrypt'

const store = new UserStore()

const userRouter = (app: Application) => {
  app.get('/users', verifyAuthToken, index)
  app.get('/users/:id', verifyAuthToken, show)

  app.post('/users/register', create)
  app.post('/users/login', authenticate)
}

const index = async (_: Request, res: Response) => {
  const user = await store.index()

  res.json(user)
}

const show = async (req: Request, res: Response) => {
  const user = await store.show(req.params.id)

  res.json(user)
}

const create = async (req: Request, res: Response) => {
  const { user_name, password, first_name, last_name } = req.body
  const newUser: User = {
    user_name,
    password,
    first_name,
    last_name
  }

  try {
    const user = await store.create(newUser)

    const token = jwtSign({ user })

    res.json({ jwt: token })
  } catch (error) {
    res.sendStatus(400)
    res.json({ error })
  }
}

const authenticate = async (req: Request, res: Response) => {
  const { userName, password } = req.body

  try {
    const user = await store.authenticate(userName, password)

    const token = jwtSign({ user })

    res.json({ jwt: token })
  } catch (error) {
    res.sendStatus(401)
    res.json({ error })
  }
}

export default userRouter
