import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllRecipients } from '../../businessLogic/recipients'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getAllRecipients')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = 'fakeUser3'
    logger.info(`Get all recipients: User ID: ${userId}`)
    const items = await getAllRecipients(userId)

    return {
        statusCode: 200,
        body: JSON.stringify({
          items
        })
      }
})

handler.use(
    cors()
)