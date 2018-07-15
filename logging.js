const AWS = require('aws-sdk');
const request = require('request-promise')

const ssm = new AWS.SSM()
const cloudwatch = new AWS.CloudWatch()

module.exports.logger = async (event, context, callback) => {
    const param = await ssm.getParameter({
        Name: "Endpoints"
    }).promise()

    const endpoints = param.Parameter.Value.split(",")

    const results = await Promise.all(
        endpoints.map(async (endpoint) => {
            try {
                const {
                    statusCode,
                    timingPhases
                } = await request({
                    uri: endpoint,
                    method: 'GET',
                    resolveWithFullResponse: true,
                    simple: false,
                    time: true,
                    timeout: 5000
                })

                return {
                    url: endpoint,
                    statusCode,
                    latency: Math.ceil(timingPhases.total)
                }
            } catch (error) {
                console.log(error)
                return error
            }
        })
    )

    results.forEach(async (result) => {
        console.log(`${result.url} responded with:`, result);
        try {
            await cloudwatch.putMetricData({
                Namespace: "DiscoveryStatus",
                MetricData: [{
                        MetricName: "Status Code",
                        Dimensions: [{
                            Name: "Status Code",
                            Value: result.url
                        }],
                        StatisticValues: {
                            SampleCount: 1,
                            Sum: result.statusCode,
                            Minimum: 0,
                            Maximum: 1000
                        },
                        Unit: 'None'
                    },
                    {
                        MetricName: "Latency",
                        Dimensions: [{
                            Name: "Latency",
                            Value: result.url
                        }],
                        StatisticValues: {
                            SampleCount: 1,
                            Sum: result.latency,
                            Minimum: 0,
                            Maximum: 30000
                        },
                        Unit: 'Milliseconds'
                    }
                ]
            }).promise()
        } catch (error) {
            console.log(error)
        }
    })

    callback(null, results)
}