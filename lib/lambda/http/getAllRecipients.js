import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getAllRecipients } from '../../businessLogic/recipients';
import { getJwtToken, getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
const logger = createLogger('getAllRecipients');
export const handler = middy(async (event) => {
    try {
        const userId = getUserId(event);
        const jwtToken = getJwtToken(event);
        logger.info(`Get all recipients: User ID: ${userId}`);
        const items = await getAllRecipients(jwtToken);
        return {
            statusCode: 200,
            body: JSON.stringify({
                items
            })
        };
    }
    catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
});
handler.use(cors({
    credentials: true
}));
//# sourceMappingURL=getAllRecipients.js.map