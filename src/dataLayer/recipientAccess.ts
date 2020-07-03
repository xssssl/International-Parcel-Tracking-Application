import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Recipient } from '../models/recipient'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('recipientAccess')

export class RecipientAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly recipientsTable = process.env.RECIPIENTS_TABLE
    ) {}
    
    async getAllRecipients(userId: string): Promise<Recipient[]> {
        logger.info(`Getting all recipients: User ID: ${userId}`)
        const result = await this.docClient.query({
          TableName: this.recipientsTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        }).promise()
        const items = result.Items
        return items as Recipient[]
      }

      async getRecipient(userId: string, recipientId: string): Promise<Recipient> {
        logger.info(`Getting a recipient: User ID: ${userId}, Recipient ID: ${recipientId}`)
        // const result = await this.docClient.query({
        //   TableName: this.recipientsTable,
        //   KeyConditionExpression: 'userId = :userId AND recipientId = :recipientId',
        //   ExpressionAttributeValues: {
        //     ':userId': userId,
        //     ':recipientId': recipientId
        //   },
        //   ScanIndexForward: false
        // }).promise()
        const result = await this.docClient.get({
          TableName: this.recipientsTable,
          Key: {
            userId: userId, 
            recipientId: recipientId
          }
        }).promise()
        const item = result.Item
        return item as Recipient
      }

      async createRecipient(recipient: Recipient): Promise<Recipient> {
        logger.info(`Creating a recipient: User ID: ${recipient.userId}, Recipient ID: ${recipient.recipientId}`)
        await this.docClient.put({
          TableName: this.recipientsTable,
          Item: recipient
        }).promise()
        return recipient
      }
}

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }