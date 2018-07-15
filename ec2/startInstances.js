const AWS = require('aws-sdk')
const generateResponse = require('../utils/generateResponse')

ec2 = new AWS.EC2()

exports.handler = async (event) => {
  try {
    const instanceIds = event.data.body.instanceIds

    const startedInstances = await ec2.startInstances({
      InstanceIds: instanceIds
    }).promise()

    return generateResponse({ startedInstances })
  } catch (error) {
    return generateResponse({ error }, 500)
  }
}