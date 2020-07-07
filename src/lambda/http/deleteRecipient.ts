import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteRecipient } from '../../businessLogic/recipients'
import { getJwtToken, getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteRecipient')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    try {
        const userId = getUserId(event)
        const jwtToken = getJwtToken(event)
        const { recipientId } = event.pathParameters
        logger.info(`Update a recipient: User ID: ${userId}, Recipient ID: ${recipientId}`)

        var deletedRecipientId = await deleteRecipient(recipientId, jwtToken)
        return {
          statusCode: 200,
          body: JSON.stringify({
            deletedRecipientId
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
  }
)

handler.use(
  cors({
    credentials: true
  })
)
