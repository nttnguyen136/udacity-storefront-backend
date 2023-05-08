import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import productRouter from './handlers/product.handler'
import orderRouter from './handlers/orders.handler'
import userRouter from './handlers/users.handler'

const app: express.Application = express()
const address: string = '0.0.0.0:3000'

app.use(bodyParser.json())

app.get('/', (_req: Request, res: Response) => {
  res.send('OK')
})

userRouter(app)
productRouter(app)
orderRouter(app)

app.listen(3000, function () {
  console.log(`Starting app on: ${address}`)
})

export default app
