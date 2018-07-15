const AWS = require('aws-sdk')
const generateResponse = require('../utils/generateResponse')

const ec2 = new AWS.EC2()

exports.handler = async (event) => {
  const instanceIds = event.data.body.instanceIds

  const terminatedInstances = await ec2.terminateInstances({
    InstanceIds: instanceIds
  }).promise()

  return generateResponse({ terminatedInstances })
}