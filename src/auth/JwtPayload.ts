/**
 * A payload of a JWT token
 */

export interface JwtPayload {
    iss: string
    sub: string
    email: string
    token_use: string
    iat: number
    exp: number
  }
  