import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateRecipientRequest } from '../../requests/updateRecipientRequest'
import { updateRecipient } from '../../businessLogic/recipients'
import { getJwtToken, getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updatetRecipient')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userId = getUserId(event)
        const jwtToken = getJwtToken(event)
        const { recipientId } = event.pathParameters
        const updateRecipientRequest: UpdateRecipientRequest = JSON.parse(event.body)
        logger.info(`Update a recipient: User ID: ${userId}, Recipient ID: ${recipientId}`)

        const item = await updateRecipient(updateRecipientRequest, recipientId, jwtToken)

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
  }
)

handler.use(
  cors({
    credentials: true
  })
)
