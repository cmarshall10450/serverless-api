const jwt = require('jsonwebtoken')
const generateResponse = require('../utils/generateResponse')

exports.handler = async (event) => {
  try {
    const token = jwt.sign(event.body, process.env.JWT_SECRET)

    return generateResponse({ token })
  } catch (error) {
    return generateResponse({ error }, 500)
  }
}