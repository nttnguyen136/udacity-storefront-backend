import { Application, Request, Response } from 'express'
import { Order, OrderStore } from '../models/order.model'
import { verifyAuthToken } from '../middlewares/token.middleware'

const orderRouter = (app: Application) => {
  // app.get('/orders', index)

  app.get('/orders/user', verifyAuthToken, getOrder)
  app.post('/orders', verifyAuthToken, create)

  // add product
  app.post('/orders/:id/products', verifyAuthToken, addProduct)
}

const store = new OrderStore()

const index = async (_: Request, res: Response) => {
  const orders = await store.index()

  res.json(orders)
}

const show = async (request: Request, res: Response) => {
  const order = await store.show(request.params.id)

  res.json(order)
}

const create = async (req: Request, res: Response) => {
  const user_id = res.locals.user.id

  const _order: Order = {
    user_id,
    status: 'NEW'
  }
  const order = await store.create(_order)

  res.json(order)
}

const addProduct = async (req: Request, res: Response) => {
  const orderId: string = req.params.id
  const productId: string = req.body.productId
  const quantity: number = parseInt(req.body.quantity)

  try {
    const addedProduct = await store.addProduct(quantity, orderId, productId)
    res.json(addedProduct)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}
const getOrder = async (req: Request, res: Response) => {
  try {
    const user_id = res.locals.user.id

    const addedProduct = await store.getOrderByUserId(user_id)

    res.json(addedProduct)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

export default orderRouter
