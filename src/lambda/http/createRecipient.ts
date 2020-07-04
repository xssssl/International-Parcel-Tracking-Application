import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { createRecipient } from '../../businessLogic/recipients'
import { CreateRecipientRequest} from '../../requests/createRecipientRequest'
// import { getJwtToken, getUserId } from '../utils'

const logger = createLogger('createRecipient')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = event.queryStringParameters
    const newRecipient: CreateRecipientRequest = JSON.parse(event.body)
    if(!userId) {
      throw new Error('QueryString parameter userId is required')
    }
    logger.info(`Create a recipient: User ID: ${userId}`)

    const item = await createRecipient(newRecipient, userId)
    return {
        statusCode: 201,
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