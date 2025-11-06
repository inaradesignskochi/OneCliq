// Minimal Netlify Function: return user profile from ID token
// This decodes the JWT payload without signature verification (demo-only).

function decodeJwtNoVerify(token) {
  try {
    const payload = token.split('.')[1]
    const json = Buffer.from(payload, 'base64').toString('utf8')
    return JSON.parse(json)
  } catch (_) {
    return null
  }
}

exports.handler = async (event) => {
  const auth = event.headers.authorization || event.headers.Authorization
  let token = null

  if (auth && auth.startsWith('Bearer ')) {
    token = auth.slice(7)
  }

  const cookieHeader = event.headers.cookie || event.headers.Cookie
  if (!token && cookieHeader) {
    const parts = cookieHeader.split(';').map((s) => s.trim())
    const found = parts.find((p) => p.startsWith('session_token='))
    if (found) token = found.split('=')[1]
  }

  if (!token) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' })
    }
  }

  const payload = decodeJwtNoVerify(token)
  if (!payload) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid token' })
    }
  }

  const user = {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user })
  }
}