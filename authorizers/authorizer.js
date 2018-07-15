const generatePolicy = require('../utils/generatePolicy')

exports.handler = async (event) => {
  try {
    const { authorizationToken, methodArn } = event
    console.log('Token:', authorizationToken)
    const policy = generatePolicy(authorizationToken, methodArn)
    console.log('Policy:', policy)
    return policy
  } catch (error) {
    return error
  }
}