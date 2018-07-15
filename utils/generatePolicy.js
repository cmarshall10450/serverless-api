const jwt = require('jsonwebtoken')

const generatePolicy = (token, methodArn) => {
  const decodedToken = decodeToken(token)
  if (decodedToken !== null) {
    const { user } = decodedToken
    return generatePolicyDocument(user, 'Allow', methodArn)
  } else {
    throw new Error('Unauthorized')
  }
}

const generatePolicyDocument = (principalId, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = principalId

  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = {}

    const statement = {}
    statement.Action = 'execute-api:Invoke'
    statement.Effect = effect
    statement.Resource = resource

    console.log('Statement:', statement)

    policyDocument.Statement[0] = statement
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