import client from '../database'
import { Product } from './product.model'

export type Order = {
  id?: number
  user_id: number
  status: string
  products?: (Product & { quantity: number })[]
}

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const query = `SELECT * FROM orders`

      const poolClient = await client.connect()

      const result = await poolClient.query(query)

      poolClient.release()

      return result.rows
    } catch (err) {
      throw new Error(`Unable get order: ${err}`)
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const query = `SELECT * FROM orders WHERE id=($1)`

      const poolClient = await client.connect()

      const result = await poolClient.query(query, [id])

      poolClient.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`)
    }
  }

  async create(_order: Order): Promise<Order> {
    try {
      const query = `INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *`

      const poolClient = await client.connect()

      const result = await poolClient.query(query, [
        _order.user_id,
        _order.status
      ])

      const product = result.rows[0]

      poolClient.release()

      return product
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`)
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM orders WHERE id=($1)`
      const deleteOrderProduct = `DELETE FROM order_products WHERE order_id=($1)`

      const poolClient = await client.connect()

      await poolClient.query(deleteOrderProduct, [id])

      await poolClient.query(query, [id])

      poolClient.release()

      return true
    } catch (err) {
      throw new Error(`Could not delete order. Error: ${err}`)
    }
  }

  async addProduct(
    quantity: number,
    orderId: string | number,
    productId: string | number
  ): Promise<{
    quantity: number
    product_id: number
    order_id: number
  }> {
    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'

      const conn = await client.connect()

      const result = await conn.query(sql, [quantity, orderId, productId])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      )
    }
  }

  async getOrderByUserId(user_id: string | number): Promise<Order[]> {
    try {
      const queryOrders = `SELECT id, status FROM orders WHERE user_id=($1)`

      const queryOrderProduct = `SELECT p.id, name, price, category, quantity FROM order_products OP INNER JOIN products p ON op.product_id=p.id WHERE order_id=($1)`

      const poolClient = await client.connect()

      let orderResponse: Order[]

      const order = await poolClient.query(queryOrders, [user_id])

      orderResponse = order.rows

      for (const item of orderResponse) {
        if (item) {
          const orderProduct = await poolClient.query(queryOrderProduct, [
            item.id
          ])

          item.products = orderProduct.rows
        }
      }

      poolClient.release()

      return orderResponse
    } catch (err) {
      throw new Error(
        `Could not find order with user_id ${user_id}. Error: ${err}`
      )
    }
  }
}
