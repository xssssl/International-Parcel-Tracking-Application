import * as uuid from 'uuid'
import { RecipientAccess } from '../dataLayer/recipientAccess'
import { Recipient } from '../models/recipient'
import { RecipientGetByMobile } from '../models/recipientGetByMobile'
import { RecipientUpdate } from '../models/recipientUpdate'
import { IdPhotoSignedUrls } from '../models/idPhotoUrls'
import { CreateRecipientRequest } from '../requests/createRecipientRequest'
import { UpdateRecipientRequest } from '../requests/updateRecipientRequest'
import { parseUserId } from '../auth/utils'

const recipientAccess = new RecipientAccess()

export async function getAllRecipients(jwtToken: string): Promise<Recipient[]> {
  const userId = parseUserId(jwtToken)
  return recipientAccess.getAllRecipients(userId)
}

export async function getRecipient(recipientId: string, jwtToken: string): Promise<Recipient> {
  const userId = parseUserId(jwtToken)
  return recipientAccess.getRecipient(userId, recipientId)
}

export async function getAllRecipientsByMobile(mobile: string): Promise<RecipientGetByMobile[]> {
  return recipientAccess.getAllRecipientsByMobile(mobile)
}

export async function createRecipient(createRecipientRequest: CreateRecipientRequest, 
                                      userId: string): Promise<Recipient> {
  const recipientId = uuid.v4()
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

export async function updateRecipient(
  updateRecipientRequest: UpdateRecipientRequest,
  recipientId: string,
  jwtToken: string
): Promise<RecipientUpdate> {
  const userId = parseUserId(jwtToken)
  const date = new Date().toISOString()
  const recipientUpdate: RecipientUpdate = {
                                              'wechatId': updateRecipientRequest.wechatId,
                                              'wechatNickname': updateRecipientRequest.wechatNickname,
                                              'fullname': updateRecipientRequest.fullname,
                                              'mobile': updateRecipientRequest.mobile,
                                              'division': updateRecipientRequest.division,
                                              'address': updateRecipientRequest.address,
                                              'idCode': updateRecipientRequest.idCode,
                                              'idFrontFilename': updateRecipientRequest.idFrontFilename,
                                              'idBackFilename': updateRecipientRequest.idBackFilename,
                                              'comment': updateRecipientRequest.comment,
                                              'updatedAt': date
                                            }
  return await recipientAccess.updateRecipient(recipientUpdate, recipientId, userId)
}

export async function deleteRecipient(recipientId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken)
  return await recipientAccess.deleteRecipient(recipientId, userId)
}

export async function generateUploadUrls(idFrontFilename: string, idBackFilename: string): Promise<IdPhotoSignedUrls> {
  const idFrontFilenameExt = idFrontFilename.split('.').slice(-1)
  const idBackFilenameExt = idBackFilename.split('.').slice(-1)
  const newIdFrontFilename: string = uuid.v4() + '.' + idFrontFilenameExt
  const newIdBackFilename: string = uuid.v4() + '.' + idBackFilenameExt

  return {
          idFront: await recipientAccess.generateUploadUrl(newIdFrontFilename),
          idBack: await recipientAccess.generateUploadUrl(newIdBackFilename)
  }
}

export async function generateDownloadUrls(idFrontFilename: string, idBackFilename: string): Promise<IdPhotoSignedUrls> {
  return {
          idFront: await recipientAccess.generateDownloadUrl(idFrontFilename),
          idBack: await recipientAccess.generateDownloadUrl(idBackFilename)
  }
}