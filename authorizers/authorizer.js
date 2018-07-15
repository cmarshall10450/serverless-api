const generatePolicy = require('../utils/generatePolicy')

exports.handler = async (event) => {
  try {
    const { authorizationToken, methodArn } = event
    return generatePolicy(authorizationToken, methodArn)
  } catch (error) {
    return error
  }
}