import { Parcel } from './parcel';

export interface Recipient { 
    userId: string;
    recipientId: string;
    wechatId: string;
    wechatNickname: string;
    fullname: string;
    mobile: string;
    division: string;
    address: string;
    idCode: string;
    idFrontFilename?: string;
    idBackFilename?: string;
    comment?: string;
    createdAt?: string;
    updatedAt?: string;
    parcels?: Array<Parcel>;
}