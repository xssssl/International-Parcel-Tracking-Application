import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllRecipientsByMobile } from '../../businessLogic/recipients'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getRecipientByMobile')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { mobile } = event.pathParameters
        logger.info(`Get all recipients: Mobile: ${mobile}`)
    
        const items = await getAllRecipientsByMobile(mobile)
    
        return {
            statusCode: 200,
            body: JSON.stringify({
                items
            })
        }
    } catch (error) {
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