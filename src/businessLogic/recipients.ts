import * as uuid from 'uuid'
import { RecipientAccess } from '../dataLayer/recipientAccess'
import { Recipient } from '../models/recipient'
import { CreateRecipientRequest } from '../requests/createRecipientRequest'
import { parseUserId } from '../auth/utils'

const recipientAccess = new RecipientAccess()

export async function getAllRecipients(jwtToken: string): Promise<Recipient[]> {
    const userId = parseUserId(jwtToken)
    return recipientAccess.getAllRecipients(userId)
}

export async function getRecipient(userId: string, recipientId: string): Promise<Recipient> {
    // const userId = parseUserId(jwtToken)
    return recipientAccess.getRecipient(userId, recipientId)
}

export async function createRecipient(
    createRecipientRequest: CreateRecipientRequest,
    userId: string
  ): Promise<Recipient> {
  
    const recipientId = uuid.v4()
    // const userId = parseUserId(jwtToken)
    const date = new Date().toISOString()
  
    return await recipientAccess.createRecipient({
      userId: userId,
      recipientId: recipientId,
      wechatId: createRecipientRequest.wechatId,
      wechatNickname: createRecipientRequest.wechatNickname,
      fullname: createRecipientRequest.fullname,
      mobile: createRecipientRequest.mobile,
      division: createRecipientRequest.division,
      address: createRecipientRequest.address,
      idCode: createRecipientRequest.idCode,
      idFrontFilename: createRecipientRequest.idFrontFilename,
      idBackFilename: createRecipientRequest.idBackFilename,
      comment: createRecipientRequest.comment,
      createdAt: date,
      updatedAt: date
    })
  }