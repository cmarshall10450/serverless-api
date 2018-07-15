const AWS = require('aws-sdk')
const generateResponse = require('../utils/generateResponse')

const ec2 = new AWS.EC2()

exports.handler = async (event) => {
  try {
    const instanceIds = event.data.body.instanceIds

    const stoppedInstances = await ec2.stopInstances({
      InstanceIds: instanceIds
    }).promise()

    return generateResponse({ stoppedInstances })
  } catch (error) {
    return generateResponse({ error }, 500)
  }
}