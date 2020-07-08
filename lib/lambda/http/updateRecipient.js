import 'source-map-support/register';
import { updateRecipient } from '../../businessLogic/recipients';
import { getJwtToken, getUserId } from '../utils';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
const logger = createLogger('updatetRecipient');
export const handler = middy(async (event) => {
    try {
        const userId = getUserId(event);
        const jwtToken = getJwtToken(event);
        const { recipientId } = event.pathParameters;
        const contentType = event.headers['Content-Type'];
        if (!recipientId) {
            throw new Error('Path parameter recipientId is required');
        }
        if (contentType !== 'application/json') {
            throw new Error(`Unsupported content type: ${contentType}`);
        }
        const updateRecipientRequest = JSON.parse(event.body);
        logger.info(`Update a recipient: User ID: ${userId}, Recipient ID: ${recipientId}`);
        const item = await updateRecipient(updateRecipientRequest, recipientId, jwtToken);
        return {
            statusCode: 200,
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
handler.use(cors({
    credentials: true
}));
//# sourceMappingURL=updateRecipient.js.map