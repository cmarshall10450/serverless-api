const AWS = require('aws-sdk')
const generateResponse = require('../utils/generateResponse')

const s3 = new AWS.S3()

exports.handler = async (event) => {
  try {
    const { bucket, key, expression } = event.queryStringParameters

    const result = await s3.selectObjectContent({
      Bucket: bucket,
      Key: key,
      Expression: expression,
      ExpressionType: 'SQL',
      InputSerialization: {
        CSV: {
          FieldHeaderInfo: 'USE',
          FieldDelimiter: ',',
          RecordDelimiter: '\n',
        },
        CompressionType: 'NONE'
      },
      OutputSerialization: {
        CSV: {
          FieldDelimiter: ',',
          RecordDelimiter: '\n'
        }
      },
      RequestProgress: {
        Enabled: true
      }
    })

    return generateResponse({ result })
  } catch (error) {
    console.log(error)
    return generateResponse({ error }, 500)
  }
}