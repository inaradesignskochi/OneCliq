<template>
  <div class="auth-callback">
    <div class="loading-container">
      <div class="spinner"></div>
      <h2 class="loading-text">Completing authentication...</h2>
      <p class="loading-subtext">Please wait while we verify your account</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    // Extract authorization code and state from URL
    const code = route.query.code
    const state = route.query.state
    const error = route.query.error
    
    if (error) {
      // Handle OAuth error
      console.error('OAuth Error:', error)
      authStore.setError(`Authentication failed: ${error}`)
      router.push('/login')
      return
    }
    
    if (!code || !state) {
      // Missing required parameters
      authStore.setError('Invalid authentication response')
      router.push('/login')
      return
    }
    
    // Handle the authentication callback
    const result = await authStore.handleAuthCallback(code, state)
    
    if (result.success) {
      // Authentication successful, redirect to dashboard
      router.push('/dashboard')
    } else {
      // Authentication failed
      router.push('/login')
    }
    
  } catch (err) {
    console.error('Auth Callback Error:', err)
    authStore.setError('Failed to complete authentication')
    router.push('/login')
  }
})
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-container {
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #C42B1E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 30px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.loading-subtext {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .loading-container {
    padding: 40px 20px;
    margin: 20px;
  }
  
  .loading-text {
    font-size: 1.3rem;
  }
  
  .loading-subtext {
    font-size: 0.9rem;
  }
}
</style>