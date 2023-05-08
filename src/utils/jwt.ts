import { SignOptions, VerifyOptions, sign, verify } from 'jsonwebtoken'

const TOKEN_SECRET = process.env.TOKEN_SECRET!

export function jwtVerify(
  token: string,
  options?: VerifyOptions & { complete: true }
) {
  return verify(token, TOKEN_SECRET, options)
}

export function jwtSign(
  payload: string | Buffer | object,
  options?: SignOptions & { algorithm: 'none' }
) {
  return sign(payload, TOKEN_SECRET, options)
}
