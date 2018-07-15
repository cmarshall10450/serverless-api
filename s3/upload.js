const AWS = require('aws-sdk')

const s3 = new AWS.S3()

exports.handler = async (event) => {
  try {
    const { bucket, key, body } = event

    console.log(bucket, key, body)

    return await s3.upload({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(body)
    }).promise()
  } catch (error) {
    console.log(error)
    return false
  }
}

