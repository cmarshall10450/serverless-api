'use strict'
const AWS = require('aws-sdk')
const generateResponse = require('../utils/generateResponse')

AWS.config.setPromisesDependency(require('bluebird'))

const ec2 = new AWS.EC2()

exports.handler = async (event) => {
  try {
    const { body } = event.data

    const result = await ec2.runInstances({
      BlockDeviceMappings: body.BlockDeviceMappings ? body.BlockDeviceMappings : [],
      ImageId: body.ImageId,
      InstanceType: body.InstanceType,
      Ipv6AddressCount: body.Ipv6AddressCount,
      Ipv6Addresses: body.Ipv6Addresses,
      KernelId: body.KernelId,
      KeyName: body.KeyName,
      MaxCount: body.MaxCount ? body.MaxCount : 1,
      MinCount: body.MinCount ? body.MinCount : 1,
      Monitoring: {
        Enabled: !!body.Monitoring
      },
      Placement: body.Placement ? body.Placement : {},
      RamdiskId: body.RamdiskId,
      SecurityGroupIds: body.SecurityGroupIds ? body.SecurityGroupIds : [],
      SubnetId: body.SubnetId,
      UserData: body.UserData,
      TagSpecifications: [{
        ResourceType: 'instance',
        Tags: body.Tags ? body.Tags : [],
      }]
    }).promise()

    return generateResponse({ result })
  } catch (error) {
    return generateResponse({ error }, 500)
  }
}