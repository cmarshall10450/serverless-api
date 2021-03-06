const generateResponse = (body, statusCode = 200) => {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body),
  }
}

module.exports = generateResponse