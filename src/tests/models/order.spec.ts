import { Order, OrderStore } from '../../models/order.model'
import { ProductStore } from '../../models/product.model'
import { UserStore } from '../../models/user.model'

const oderStore = new OrderStore()

const productStore = new ProductStore()
const userStore = new UserStore()

describe('Order Model', () => {
  let order: Order

  beforeAll(async () => {
    const user = await userStore.create({
      user_name: 'username',
      password: 'password',
      first_name: 'First',
      last_name: 'Last'
    })

    const product = await productStore.create({
      name: 'Product Fake',
      category: 'Category Fake',
      price: 10
    })

    order = {
      user_id: user.id!,
      status: 'NEW',
      products: [
        {
          ...product,
          quantity: 2
        }
      ]
    }
  })

  it('should have an index method', () => {
    expect(oderStore.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(oderStore.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(oderStore.create).toBeDefined()
  })

  it('create method should add a order', async () => {
    const result = await oderStore.create(order)
    order.id = result.id

    expect(result).toEqual({
      id: result.id,
      user_id: order.user_id,
      status: order.status
    })
  })

  it('addProduct method add a product to order', async () => {
    const product_id = order.products![0].id!
    const order_id = order.id!

    const result = await oderStore.addProduct(1, order.id!, product_id)

    expect(result).toEqual({
      quantity: 1,
      product_id: product_id,
      order_id: order_id
    })
  })
})
