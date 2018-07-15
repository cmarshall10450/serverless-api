const AWS = require('aws-sdk')
const generateResponse = require('../utils/generateResponse')

const s3 = new AWS.S3()

exports.handler = async (event) => {
  try {
    const { bucket, key } = event.data.params

    const object = await s3.getObject({
      Bucket: bucket,
      Key: key
    }).promise()

    return generateResponse({ object })
  } catch (error) {
    return generateResponse({ error }, 500)
  }
}