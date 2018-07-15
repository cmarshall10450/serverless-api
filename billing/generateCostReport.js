'use strict'
const { CostExplorer, S3 } = require('aws-sdk')
const moment = require('moment')
const jsonexport = require('jsonexport')
const { promisify } = require('util')
const generateResponse = require('../utils/generateResponse')

const billing = new CostExplorer({
  region: 'us-east-1'
})

const s3 = new S3()

exports.handler = async () => {
  try {
    const start = moment()
      .subtract(3, 'months')
      .toISOString()
      .split('T')[0]
    const end = moment()
      .toISOString()
      .split('T')[0]

    // Get cost report as JSON
    const costs = await getCostReport(start, end)

    // Convert cost report from JSON to CSV
    const exportToCsv = promisify(jsonexport)
    const csv = await exportToCsv(costs.ResultsByTime)

    // Invoke lambda function to upload csv data to S3 file
    const prefix = end.replace(/-/g, '')
    const filename = `${prefix}-client-cost-report.csv`

    const upload = await s3.upload({
      Bucket: 'cm28299-discovery',
      Key: filename,
      Body: csv
    }).promise()

    console.log(upload)

    return generateResponse({ csv })
  } catch (error) {
    return generateResponse(error)
  }
}

const getCostReport = async (start, end) => {
  return await
    billing.getCostAndUsage({
      TimePeriod: {
        Start: start,
        End: end
      },
      Granularity: 'MONTHLY',
      GroupBy: [{
        Key: 'Client',
        Type: 'TAG'
      }],
      Metrics: ['UnblendedCost']
    }).promise()
}