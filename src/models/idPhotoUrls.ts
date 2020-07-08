export interface S3SignedUrl { 
    filename: string
    url: string
}

export interface IdPhotoSignedUrls {
    idFront: S3SignedUrl
    idBack: S3SignedUrl
}