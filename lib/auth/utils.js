import { decode } from 'jsonwebtoken';
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken) {
    const decodedJwt = decode(jwtToken);
    return decodedJwt.sub;
}
/**
 * Parse a JWT token and return an email
 * @param jwtToken JWT token to parse
 * @returns an email from the JWT token
 */
export function parseUserEmail(jwtToken) {
    const decodedJwt = decode(jwtToken);
    return decodedJwt.email;
}
//# sourceMappingURL=utils.js.map