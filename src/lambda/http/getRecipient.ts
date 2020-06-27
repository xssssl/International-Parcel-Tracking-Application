import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getRecipient } from '../../businessLogic/recipients'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getRecipient')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = 'fakeUser1'
    const { recipientId } = event.pathParameters
    logger.info(`Get a recipient: User ID: ${userId}, Recipient ID: ${recipientId}`)
    const result = await getRecipient(userId, recipientId)
    const item = !!result ? result : {}

    return {
        statusCode: 200,
        body: JSON.stringify({
            item
        })
      }
})

handler.use(
    cors()
)