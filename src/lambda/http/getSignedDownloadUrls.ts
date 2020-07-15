import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getRecipient, generateDownloadUrls } from '../../businessLogic/recipients'
import { getJwtToken, getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getSignedDownloadUrls')

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const userId = getUserId(event)
            const { recipientId } = event.pathParameters
            logger.info(`Get a recipient: User ID: ${userId}, Recipient ID: ${recipientId}`)

            const jwtToken = getJwtToken(event)
            const result = await getRecipient(recipientId, jwtToken)
            if(!result) {
                throw new Error(`Request recipientId does not existed: Recipient ID: ${recipientId}`)
            }
            
            const { idFrontFilename, idBackFilename } = result
            logger.info(`Generate ID photo download Urls: User ID: ${userId}, Recipient ID: ${recipientId}`)

            const downloadUrls = await generateDownloadUrls(idFrontFilename, idBackFilename)
            return {
                statusCode: 200,
                body: JSON.stringify({
                    ...downloadUrls
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