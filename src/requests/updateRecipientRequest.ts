export interface UpdateRecipientRequest {
    wechatId: string
    wechatNickname: string
    fullname: string
    mobile: string
    division: string
    address: string
    idCode: string
    idFrontFilename?: string
    idBackFilename?: string
    comment?: string
  }