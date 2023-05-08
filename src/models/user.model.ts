import client from '../database'
import { bcryptHashSync, bcryptCompareSync } from '../utils/bcrypt'

export type User = {
  id?: number
  user_name: string
  first_name?: string
  last_name?: string
  password: string
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const query = `SELECT * FROM users`

      const poolClient = await client.connect()

      const result = await poolClient.query(query)

      poolClient.release()

      return result.rows
    } catch (err) {
      throw new Error(`Unable get user: ${err}`)
    }
  }

  async show(id: string): Promise<User> {
    try {
      const query = `SELECT * FROM users WHERE id=($1)`

      const poolClient = await client.connect()

      const result = await poolClient.query(query, [id])

      poolClient.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`)
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM users WHERE id=($1)`

      const poolClient = await client.connect()

      await poolClient.query(query, [id])

      poolClient.release()

      return true
    } catch (err) {
      throw new Error(`Could not delete user. Error: ${err}`)
    }
  }

  async create(_user: User): Promise<User> {
    try {
      const { user_name, password, first_name, last_name } = _user

      const hashingPassword = bcryptHashSync(password)

      const query = `INSERT INTO users (user_name, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *`

      const poolClient = await client.connect()

      const result = await poolClient.query(query, [
        user_name,
        first_name,
        last_name,
        hashingPassword
      ])

      const product = result.rows[0]

      poolClient.release()

      return product
    } catch (err) {
      throw new Error(`Could not add new user. Error: ${err}`)
    }
  }

  async authenticate(
    user_name: string,
    password: string
  ): Promise<User | null> {
    const conn = await client.connect()

    const sql = `SELECT * FROM users WHERE user_name=($1)`

    const result = await conn.query(sql, [user_name])

    if (result.rows.length) {
      const user = result.rows[0]

      if (bcryptCompareSync(password, user.password)) {
        return user
      }
    }

    return null
  }
}
