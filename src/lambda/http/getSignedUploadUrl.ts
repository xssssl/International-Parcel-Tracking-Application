import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/recipients'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getUploadUrl')

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const userId = getUserId(event)
            const { recipientId } = event.pathParameters
            const { idFrontFilename, idBackFilename } = event.queryStringParameters
            logger.info(`Generate ID photo upload Urls: User ID: ${userId}, Recipient ID: ${recipientId}`)

            const uploadUrls = await generateUploadUrl(idFrontFilename, idBackFilename)
            return {
                statusCode: 200,
                body: JSON.stringify({
                    ...uploadUrls
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