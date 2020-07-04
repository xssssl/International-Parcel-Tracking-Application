import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getRecipient } from '../../businessLogic/recipients'
import { getJwtToken, getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getRecipient')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
        const userId = getUserId(event)
        const { recipientId } = event.pathParameters
        logger.info(`Get a recipient: User ID: ${userId}, Recipient ID: ${recipientId}`)

        const jwtToken = getJwtToken(event)
        const result = await getRecipient(jwtToken, recipientId)
        const item = !!result ? result : {}

        return {
            statusCode: 200,
            body: JSON.stringify({
                item
            })
        }
    } catch(error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: error.message
            })
        }
    }
})

handler.use(
    cors()
)