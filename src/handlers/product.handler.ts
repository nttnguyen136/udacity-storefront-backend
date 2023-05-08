import { Application, Request, Response } from 'express'
import { Product, ProductStore } from '../models/product.model'
import { verifyAuthToken } from '../middlewares/token.middleware'

const productRouter = (app: Application) => {
  app.get('/products', index)
  app.get('/products/:id', show)
  app.post('/products', verifyAuthToken, create)
}

const store = new ProductStore()

const index = async (_: Request, res: Response) => {
  const orders = await store.index()

  res.json(orders)
}

const show = async (request: Request, res: Response) => {
  const order = await store.show(request.params.id)

  res.json(order)
}

const create = async (request: Request, res: Response) => {
  const product: Product = {
    name: request.body.name,
    price: parseInt(request.body.price),
    category: request.body.category
  }

  const createdProduct = await store.create(product)

  res.json(createdProduct)
}

export default productRouter
