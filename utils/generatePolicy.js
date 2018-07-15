const jwt = require('jsonwebtoken')

const generatePolicy = (token, methodArn) => {
  const decodedToken = decodeToken(token)
  if (decodedToken !== null) {
    const { user } = decodedToken
    console.log('User:', user)
    return generatePolicyDocument(user, 'Allow', methodArn)
  } else {
    throw new Error('Unauthorized')
  }
}

const generatePolicyDocument = function (principalId, effect, resource) {
  const authResponse = {}
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17' // default version
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke' // default action
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }

  console.log(authResponse)
  return authResponse
}

const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = generatePolicy