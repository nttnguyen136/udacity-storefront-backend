import client from '../database'

export type Product = {
  id?: number
  name: string
  price: number
  category: string
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const query = `SELECT * FROM products`

      const poolClient = await client.connect()

      const result = await poolClient.query(query)

      poolClient.release()

      return result.rows
    } catch (err) {
      throw new Error(`Unable get product: ${err}`)
    }
  }

  async show(id: number | string): Promise<Product> {
    try {
      const query = `SELECT * FROM products WHERE id=($1)`

      const poolClient = await client.connect()

      const result = await poolClient.query(query, [id])

      poolClient.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`)
    }
  }

  async create(_product: Product): Promise<Product> {
    try {
      const query = `INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *`

      const poolClient = await client.connect()

      const result = await poolClient.query(query, [
        _product.name,
        _product.price,
        _product.category
      ])

      const product = result.rows[0]

      poolClient.release()

      return product
    } catch (err) {
      throw new Error(`Could not add new product. Error: ${err}`)
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM products WHERE id=($1)`

      const poolClient = await client.connect()

      await poolClient.query(query, [id])

      poolClient.release()

      return true
    } catch (err) {
      throw new Error(`Could not delete product. Error: ${err}`)
    }
  }
}
