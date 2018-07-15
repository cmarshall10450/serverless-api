'use strict'
const AWS = require('aws-sdk')
const generateResponse = require('../utils/generateResponse')

AWS.config.setPromisesDependency(require('bluebird'))

const ec2 = new AWS.EC2()

exports.handler = async (event) => {
  try {
    const instances = await ec2.describeInstances({}).promise()
    return generateResponse({ instances })
  } catch (error) {
    return generateResponse({ error }, 500)
  }
}