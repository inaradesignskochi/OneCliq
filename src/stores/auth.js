import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userInfo = computed(() => user.value)
  const authError = computed(() => error.value)

  // Actions
  const setUser = (userData) => {
    user.value = userData
  }

  const setToken = (authToken) => {
    token.value = authToken
    localStorage.setItem('token', authToken)
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const loginWithGoogle = async () => {
    try {
      isLoading.value = true
      clearError()
      
      // Initialize Google OAuth
      const authUrl = await initializeGoogleAuth()
      
      // Redirect to Google OAuth
      window.location.href = authUrl
      
    } catch (err) {
      setError(err.message || 'Failed to initialize Google authentication')
      console.error('Google Auth Error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const initializeGoogleAuth = async () => {
    // Google OAuth 2.0 configuration
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'
    const redirectUri = `${window.location.origin}/auth/callback`
    const scope = 'openid email profile'
    const responseType = 'code'
    const state = generateRandomState()
    
    // Store state for CSRF protection
    sessionStorage.setItem('oauth_state', state)
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      response_type: responseType,
      state: state,
      access_type: 'offline',
      prompt: 'consent'
    })
    
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  const handleAuthCallback = async (code, state) => {
    try {
      isLoading.value = true
      clearError()
      
      // Verify state for CSRF protection
      const storedState = sessionStorage.getItem('oauth_state')
      if (state !== storedState) {
        throw new Error('Invalid state parameter')
      }
      
      // Exchange code for tokens (this would typically be done server-side)
      // For demo purposes, we'll simulate a successful authentication
      const mockUser = {
        id: '12345',
        email: 'user@example.com',
        name: 'Demo User',
        picture: 'https://via.placeholder.com/150'
      }
      
      const mockToken = 'mock_jwt_token_' + Date.now()
      
      setUser(mockUser)
      setToken(mockToken)
      
      // Clear stored state
      sessionStorage.removeItem('oauth_state')
      
      return { success: true }
      
    } catch (err) {
      setError(err.message || 'Authentication failed')
      console.error('Auth Callback Error:', err)
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    sessionStorage.removeItem('oauth_state')
    clearError()
  }

  const checkAuthStatus = () => {
    // Check if token exists and is valid
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      // In a real app, you would validate the token with your backend
      // For now, we'll simulate a valid user
      if (!user.value) {
        const mockUser = {
          id: '12345',
          email: 'user@example.com',
          name: 'Demo User',
          picture: 'https://via.placeholder.com/150'
        }
        setUser(mockUser)
        setToken(storedToken)
      }
    }
  }

  // Helper functions
  const generateRandomState = () => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userInfo,
    authError,
    
    // Actions
    loginWithGoogle,
    handleAuthCallback,
    logout,
    checkAuthStatus,
    clearError
  }
})