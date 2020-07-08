import * as uuid from 'uuid';
import { RecipientAccess } from '../dataLayer/recipientAccess';
import { parseUserId } from '../auth/utils';
const recipientAccess = new RecipientAccess();
export async function getAllRecipients(jwtToken) {
    const userId = parseUserId(jwtToken);
    return recipientAccess.getAllRecipients(userId);
}
export async function getRecipient(recipientId, jwtToken) {
    const userId = parseUserId(jwtToken);
    return recipientAccess.getRecipient(userId, recipientId);
}
export async function createRecipient(createRecipientRequest, userId) {
    const recipientId = uuid.v4();
    const date = new Date().toISOString();
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
    });
}
export async function updateRecipient(updateRecipientRequest, recipientId, jwtToken) {
    const userId = parseUserId(jwtToken);
    const date = new Date().toISOString();
    const recipientUpdate = {
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
    };
    return await recipientAccess.updateRecipient(recipientUpdate, recipientId, userId);
}
export async function deleteRecipient(recipientId, jwtToken) {
    const userId = parseUserId(jwtToken);
    return await recipientAccess.deleteRecipient(recipientId, userId);
}
gfvport;
-rt;
loadUrl;
 > {
    const: filename = uuid.v4(),
    return: await recipientAccess.generateUploadUrl(filename)
};
//# sourceMappingURL=recipients.js.map