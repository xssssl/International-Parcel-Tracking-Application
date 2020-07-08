import { parseUserId } from "../auth/utils";
/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event) {
    const jwtToken = getJwtToken(event);
    return parseUserId(jwtToken);
}
/**
 * Get JwtToken from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a JwtToken from the Authorization headers
 */
export function getJwtToken(event) {
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    return jwtToken;
}
//# sourceMappingURL=utils.js.map