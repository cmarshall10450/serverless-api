const AWS = require('aws-sdk')
const generateResponse = require('../utils/generateResponse')

const s3 = new AWS.S3()

exports.handler = async (event) => {
  try {
    const { bucket } = event.pathParameters

    const objects = await s3.listObjectsV2({
      Bucket: bucket
    }).promise()

    return generateResponse({ objects })
  } catch (error) {
    return generateResponse({ error }, 500)
  }
}