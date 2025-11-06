// Minimal Netlify Function: Google OAuth code exchange
// Expects server-side environment variables set in Netlify UI:
// GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI

exports.handler = async (event) => {
  try {
    const { code, state } = event.queryStringParameters || {}

    if (!code) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing code parameter' })
      }
    }

    const client_id = process.env.GOOGLE_CLIENT_ID
    const client_secret = process.env.GOOGLE_CLIENT_SECRET
    const redirect_uri = process.env.GOOGLE_REDIRECT_URI

    if (!client_id || !client_secret || !redirect_uri) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Server misconfigured. Missing Google OAuth environment variables.' })
      }
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code'
      }).toString()
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: tokens.error || 'Token exchange failed',
          details: tokens
        })
      }
    }

    const access_token = tokens.access_token
    const id_token = tokens.id_token

    // Fetch basic user info from Google
    let user = null
    try {
      const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      })
      if (userRes.ok) {
        user = await userRes.json()
      }
    } catch (_) {
      // Ignore userinfo failure and continue
    }

    // Set an HTTP-only session cookie with the ID token (demo-only)
    const maxAge = 60 * 60 * 24 * 7 // 7 days
    const cookie = `session_token=${id_token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie
      },
      body: JSON.stringify({ success: true, user, id_token, access_token, expires_in: tokens.expires_in, state })
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error', message: err.message })
    }
  }
}