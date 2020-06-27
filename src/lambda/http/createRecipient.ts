import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { createRecipient } from '../../businessLogic/recipients'
import { CreateRecipientRequest} from '../../requests/createRecipientRequest'

const logger = createLogger('createRecipient')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newRecipient: CreateRecipientRequest = JSON.parse(event.body)
    // const jwtToken = getJwtToken(event)
    // const userId = getUserId(event)
    const userId = 'fakeUser3'
    logger.info(`Create a recipient: User ID: ${userId}`)

    const item = await createRecipient(newRecipient, userId)
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