
# International Parcel Tracking Application (Backend)
[![Serverless Badge](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)  

The application is a **Serverless Application** that entirely build on cloud (AWS).

This application is an attempt to automate the daily repetitive tasks of [Daigou Shoppers](https://en.wikipedia.org/wiki/Daigou).

It is a self-service application that allow customers to upload their delivery information and tracking their pacels. Customer's delivery information would only be seen by their shopping representatives (Daigou). Customers could track their parcels by recipient's mobile. Don't need to care which forwarding agent it is and don't need to copy/paste the hard-to-remember tracking number any more.

# Stack

* AWS 
  * API Gateway (API endpoints)
  * Lambdas (serverless functions)
  * Cognito (Authentication&Authorization)
  * DynamoDB (database)
  * S3 (storage of images)
  * SNS (messaging/fanout)
  * X-Ray (distributed tracing)
* Infrastructure as Code (IaC)
  * [Serverless Framework](https://serverless.com/)
  *  AWS CloudFormation
* API Documentation and Test
  * [Swagger](https://swagger.io/)
  * [Postman](https://www.postman.com/)
* CI/CD
  * [Travis CI](https://www.travis-ci.org/)

![Stack.png](https://github.com/xssssl/International-Parcel-Tracking-Application/blob/dev/media/Stack.PNG)

# Infrastructure Architecture

![Architecture.png](https://github.com/xssssl/International-Parcel-Tracking-Application/blob/dev/media/Architecture.PNG)


# Specification

[![Swagger Badge](https://validator.swagger.io/validator?url=https://api.swaggerhub.com/apis/xssl/Recipients-n-Parcels-Management/0.1.0)](https://app.swaggerhub.com/apis-docs/xssl/Recipients-n-Parcels-Management/0.1.0)

All APIs and schemas are designed and documented on Swagger following OpenAPI 3. The detailed specifications could be see [here](https://app.swaggerhub.com/apis-docs/xssl/Recipients-n-Parcels-Management/0.1.0).

### APIs

Restful API design principals are applied. There are four endpoints. 
* `/recipients`
* `/users`
* `/logistics`
* `/parcels`

Each endpoint has CRUD methods.

### Schemas

Each endpoint has its own schemas(model). List recipient schema here to demonstrate. Each recipient item contains the following fields:
* `userId` (string) - a unique id for a user which is parsed from [AWS Cognito JWT](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html)
* `recipientId` (string) - a unique id for a recipient
* `wechatId` (string) - WeChat ID of the customer
* `wechatNickname` (string) - WeChat nickname of the customer
* `fullname` (string) - fullname
* `mobile` (string) - mobile
* `division` (string) - division (province-city-district)
* `address` (string) - address (street-unit/flat-number)
* `idCode` (string) - identity card number
* `idFrontFilename` (string)(optional) - a unique filename of the front side photo of identity card
* `idBackFilename` (string)(optional) - a unique filename of the back side photo of identity card
* `comment` (string)(optional) - comment
* `createdAt` (string) - date and time that the recipient is created
* `updatedAt` (string) - date and time that the recipient is last updated


# Deployment


  CI/CD pipeline would be implemented automatically if Travis CI is well configured. Or deploy the application manually.
  
```
  
npm install

sls deploy -v

```

# Test

All the APIs are tested through postman. More information of postman collection could see [here](https://github.com/xssssl/International-Parcel-Tracking-Application/blob/dev/test/postman/Serverless%20International%20Parcel%20Tracking%20Application.postman_collection.json).