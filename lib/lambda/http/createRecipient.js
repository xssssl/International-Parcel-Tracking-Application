import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { createRecipient } from '../../businessLogic/recipients';
// import { getJwtToken, getUserId } from '../utils'
const logger = createLogger('createRecipient');
export const handler = middy(async (event) => {
    try {
        const { userId } = event.queryStringParameters;
        const contentType = event.headers['Content-Type'];
        if (!userId) {
            throw new Error('QueryString parameter userId is required');
        }
        if (contentType !== 'application/json') {
            throw new Error(`Unsupported content type: ${contentType}`);
        }
        const newRecipient = JSON.parse(event.body);
        logger.info(`Create a recipient: User ID: ${userId}`);
        const item = await createRecipient(newRecipient, userId);
        return {
            statusCode: 201,
            body: JSON.stringify({
                item
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
handler.use(cors());
//# sourceMappingURL=createRecipient.js.map