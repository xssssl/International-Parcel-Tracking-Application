import 'source-map-support/register'
import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import Jimp from 'jimp/es'
import { createLogger } from '../../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3()

// The watermark image path has to be hardcoded here
// As it seems like require does not support dynamic path or it needs a plugin?
// Would make the code nicer later
const watermarkImg = require('../../../images/watermark.png')

const logger = createLogger('idPhotosAddWatermark')

// Configuration
const s3BaseImgBucket = process.env.RECIPIENTS_ID_PHOTOS_S3_BUCKET
const s3CompositedImgBucket = process.env.RECIPIENTS_ID_PHOTOS_WATERMARK_S3_BUCKET
const watermark_path = watermarkImg.default
const watermark_margin_percentage = parseInt(process.env.WATERMARK_MARGIN_PERCENTAGE)
const maxSize = 3145728

export const handler: SNSHandler = async (event: SNSEvent) => {
    for (const snsRecord of event.Records) {
        const s3Event = JSON.parse(snsRecord.Sns.Message)
    
        for (const s3Record of s3Event.Records) {
            await addWatermark(s3Record)
        }
    }
}

async function addWatermark(s3Record: S3EventRecord) {
    const { key, size } = s3Record.s3.object
    logger.info(`S3 Record: Key: ${key}, Size: ${size}`)
    if(size >= maxSize) {
        throw new Error('File size is larger than the allowed maxium size')
    }

    const response = await s3.getObject({
        Bucket: s3BaseImgBucket,
        Key: key
    }).promise()
    const body = response.Body
    // console.log(body)

    const base_image = await Jimp.read(Buffer.from(body))
    const watermark = await Jimp.read(watermark_path)

    logger.info(`base_image read successfully: Width: ${base_image.bitmap.width}, Height: ${base_image.bitmap.height}`)

    const xMargin = Math.floor((base_image.bitmap.width * watermark_margin_percentage) / 100);
    const yMargin = Math.floor((base_image.bitmap.width * watermark_margin_percentage) / 100);
  
    watermark.resize(Math.min(base_image.bitmap.width, base_image.bitmap.height) - xMargin * 2, Jimp.AUTO);
    if(watermark.bitmap.height > (Math.min(base_image.bitmap.width, base_image.bitmap.height) - yMargin * 2)) {
        watermark.resize(Jimp.AUTO, Math.min(base_image.bitmap.width, base_image.bitmap.height) - yMargin * 2);
    }
  
    const X = Math.ceil((base_image.bitmap.width - watermark.bitmap.width)) / 2
    const Y = Math.ceil((base_image.bitmap.height - watermark.bitmap.height)) / 2

    const compositedImg = base_image.composite(watermark, X, Y, 
        {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 0.4,
            opacityDest: 1.0
        }
    )

    logger.info(`Writing image back to S3 bucket: ${s3CompositedImgBucket}, ${key}`)
    const convertedBuffer = await compositedImg.getBufferAsync(compositedImg.getMIME())
    await s3.putObject({
      Bucket: s3CompositedImgBucket,
      Key: key,
      Body: convertedBuffer
    }).promise()
}