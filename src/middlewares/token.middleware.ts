import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { jwtVerify } from '../utils/jwt'

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      throw new Error('Unauthorized')
    }

    const token = authorizationHeader.split(' ')[1]

    const decoded = jwtVerify(token) as JwtPayload

    res.locals.user = decoded['user']

    next()
  } catch (error) {
    res.status(401)
    res.json({ error: 'Unauthorized' })
  }
}

export { verifyAuthToken }
