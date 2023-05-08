import bcrypt from 'bcrypt'

function bcryptHashSync(password: string) {
  const pepper = process.env.BCRYPT_PASSWORD as string
  const salt = process.env.SALT_ROUNDS as string

  const hashPassword = bcrypt.hashSync(password + pepper, parseInt(salt))

  return hashPassword
}

function bcryptCompareSync(password: string, decodedPassword: string) {
  const pepper = process.env.BCRYPT_PASSWORD as string

  return bcrypt.compareSync(password + pepper, decodedPassword)
}

export { bcryptHashSync, bcryptCompareSync }
