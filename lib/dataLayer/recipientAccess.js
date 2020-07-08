import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger';
const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('recipientAccess');
export class RecipientAccess {
    constructor(docClient = createDynamoDBClient(), recipientsTable = process.env.RECIPIENTS_TABLE, s3Client = new XAWS.S3({ signatureVersion: 'v4' }), s3BucketName = process.env.RECIPIENTS_ID_PHOTOS_S3_BUCKET, signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION) {
        this.docClient = docClient;
        this.recipientsTable = recipientsTable;
        this.s3Client = s3Client;
        this.s3BucketName = s3BucketName;
        this.signedUrlExpiration = signedUrlExpiration;
    }
    async getAllRecipients(userId) {
        logger.info(`Getting all recipients: User ID: ${userId}`);
        const result = await this.docClient.query({
            TableName: this.recipientsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise();
        const items = result.Items;
        return items;
    }
    async getRecipient(userId, recipientId) {
        logger.info(`Getting a recipient: User ID: ${userId}, Recipient ID: ${recipientId}`);
        const result = await this.docClient.get({
            TableName: this.recipientsTable,
            Key: {
                userId: userId,
                recipientId: recipientId
            }
        }).promise();
        const item = result.Item;
        return item;
    }
    async createRecipient(recipient) {
        logger.info(`Creating a recipient: User ID: ${recipient.userId}, Recipient ID: ${recipient.recipientId}`);
        await this.docClient.put({
            TableName: this.recipientsTable,
            Item: recipient
        }).promise();
        return recipient;
    }
    async updateRecipient(recipientUpdate, recipientId, userId) {
        logger.info(`Updating a recipient: User ID: ${userId}, Recipient ID: ${recipientId}`);
        const { updateExpression, expressionAttributeNames, expressionAttributeValues } = this.generateUpdateExpressions(recipientUpdate);
        const params = {
            TableName: this.recipientsTable,
            Key: {
                userId: userId,
                recipientId: recipientId
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };
        const result = await this.docClient.update(params).promise();
        const attributes = result.Attributes;
        return attributes;
    }
    async deleteRecipient(recipientId, userId) {
        logger.info(`Deleting a recipient: User ID: ${userId}, Recipient ID: ${recipientId}`);
        const params = {
            TableName: this.recipientsTable,
            Key: {
                userId: userId,
                recipientId: recipientId
            },
            ReturnValues: 'ALL_OLD'
        };
        const result = await this.docClient.delete(params).promise();
        logger.info(`Delete action is completed: Response: ${result}`);
        return recipientId;
    }
    async generateUploadUrl(filename) {
        logger.info(`Generating image upload URL: Filename: ${filename}`);
        const url = await this.s3Client.getSignedUrlPromise('putObject', {
            Bucket: this.s3BucketName,
            Key: filename,
            Expires: this.signedUrlExpiration
        });
        return {
            filename,
            url
        };
    }
    /**
     * Generate UpdateExpression, ExpressionAttributeNames and ExpressionAttributeValues
     * for updating an item in DynamoDB table
     * Have to do that as there are optional keys in the item.
     * If get value directly with the non-existed key name would get undefined and then cause error
     * Get a user id from an API Gateway event
     * @param recipientUpdate the recipient need to be updated
     *
     * @returns UpdateExpression, ExpressionAttributeNames and ExpressionAttributeValues
     */
    generateUpdateExpressions(recipientUpdate) {
        const convertEmptyValues = Item => {
            return JSON.parse(JSON.stringify(Item, (_key, value) => {
                if (value === "" || value === null || value === undefined) {
                    return undefined;
                }
                return value;
            }));
        };
        recipientUpdate = convertEmptyValues(recipientUpdate);
        const keyCount = Object.keys(recipientUpdate).length;
        var expressionAttributeNames = {};
        var expressionAttributeValues = {};
        const updateExpression = 'SET ' + Object.keys(Array.apply(null, { length: keyCount })).map(item => {
            return String.fromCharCode(parseInt(item) + 97);
        }).map(item => {
            return `#${item} = :${item}`;
        }).join(', ');
        Object.keys(recipientUpdate).forEach((key, index) => {
            let alphabetIndex = String.fromCharCode(index + 97);
            expressionAttributeNames[`#${alphabetIndex}`] = key;
            expressionAttributeValues[`:${alphabetIndex}`] = recipientUpdate[key];
        });
        return {
            'updateExpression': updateExpression,
            'expressionAttributeNames': expressionAttributeNames,
            'expressionAttributeValues': expressionAttributeValues
        };
    }
}
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance');
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        });
    }
    return new XAWS.DynamoDB.DocumentClient();
}
//# sourceMappingURL=recipientAccess.js.map