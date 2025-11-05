<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo">
          <svg width="80" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="80" fill="none"/>
            <path d="M52.7842 10.916L33.1458 24.3542C27.7968 28.6272 26.0082 33.9103 27.7799 40.2035C28.0294 41.0277 28.7959 43.981 32.6275 46.7169C33.9332 47.6492 36.7844 48.9064 41.1812 50.4883L41.081 50.5552L31.7038 56.8097C27.5674 60.1313 26.893 64.3206 29.6805 69.3773C32.0874 72.4947 36.5668 73.3427 40.1251 71.9675C42.4973 71.0507 48.3707 67.1525 57.7452 60.2727C60.7991 56.7157 62.0527 52.8355 61.506 48.632C60.6666 43.5019 57.2919 39.7936 51.3819 37.5071L47.3571 35.7936L61.905 25.3834L52.7842 10.916Z" fill="#C42B1E"/>
            <path d="M37.067 21.6277C34.3841 25.8233 34.9701 29.3447 38.8249 32.1917C43.0036 34.0863 45.8088 35.3109 47.2406 35.8655L56.0284 37.6177L61.9052 25.3834C56.0805 16.1464 53.0403 11.324 52.7844 10.916C52.3823 11.2065 47.1432 14.7771 37.067 21.6277Z" fill="#C42B1E"/>
            <path d="M70.4677 14.8808L64.2677 29.4233C63.4459 31.3509 61.2238 32.2476 59.3046 31.4263C58.5527 31.1045 57.9255 30.5464 57.5172 29.8359L48.0812 13.4164C47.0389 11.6028 47.6604 9.28197 49.4694 8.23272C50.1781 7.82165 51.0001 7.65213 51.8121 7.7496L67.4482 9.62656C69.5207 9.87534 70.9969 11.7636 70.7454 13.844C70.7022 14.201 70.6087 14.5501 70.4677 14.8808Z" fill="#C42B1E"/>
          </svg>
        </div>
        <h1 class="app-title">1Cliq</h1>
        <p class="app-subtitle">One Click Trading Platform</p>
      </div>

      <!-- Welcome Message -->
      <div class="welcome-section">
        <h2 class="welcome-title">Welcome Back!</h2>
        <p class="welcome-text">
          Sign in to access your trading dashboard and start executing trades with just one click.
        </p>
      </div>

      <!-- Google Sign-In Buttons -->
      <div class="auth-section">
        <v-btn
          @click="handleGoogleSignIn"
          :loading="authStore.isLoading"
          class="google-signin-btn"
          size="x-large"
          block
          elevation="2"
        >
          <v-icon left class="google-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285f4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34a853"/>
              <path d="M3.964 10.807c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.661H.957C.347 5.969 0 7.286 0 8.8s.348 2.831.957 4.139l3.007-2.332z" fill="#fbbc04"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.661L3.964 6.993c.708-2.127 2.692-3.413 5.036-3.413z" fill="#ea4335"/>
            </svg>
          </v-icon>
          Sign in with Google
        </v-btn>

        <v-btn
          @click="handleGoogleSignUp"
          :loading="authStore.isLoading"
          class="google-signup-btn"
          variant="outlined"
          size="x-large"
          block
          elevation="0"
        >
          <v-icon left class="google-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285f4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34a853"/>
              <path d="M3.964 10.807c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.661H.957C.347 5.969 0 7.286 0 8.8s.348 2.831.957 4.139l3.007-2.332z" fill="#fbbc04"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.661L3.964 6.993c.708-2.127 2.692-3.413 5.036-3.413z" fill="#ea4335"/>
            </svg>
          </v-icon>
          Sign up with Google
        </v-btn>
      </div>

      <!-- Error Message -->
      <v-alert
        v-if="authStore.authError"
        type="error"
        variant="tonal"
        class="error-alert"
        closable
        @click:close="authStore.clearError"
      >
        {{ authStore.authError }}
      </v-alert>

      <!-- Features -->
      <div class="features-section">
        <div class="feature-item">
          <v-icon color="success" class="feature-icon">mdi-check-circle</v-icon>
          <span class="feature-text">One-click trade execution</span>
        </div>
        <div class="feature-item">
          <v-icon color="success" class="feature-icon">mdi-shield-check</v-icon>
          <span class="feature-text">Secure and encrypted</span>
        </div>
        <div class="feature-item">
          <v-icon color="success" class="feature-icon">mdi-chart-line</v-icon>
          <span class="feature-text">Real-time market data</span>
        </div>
        <div class="feature-item">
          <v-icon color="success" class="feature-icon">mdi-cellphone-link</v-icon>
          <span class="feature-text">Works on all devices</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer-section">
        <p class="footer-text">
          By signing in, you agree to our 
          <a href="#" class="footer-link">Terms of Service</a> and 
          <a href="#" class="footer-link">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleGoogleSignIn = async () => {
  try {
    await authStore.loginWithGoogle()
  } catch (error) {
    console.error('Sign in error:', error)
  }
}

const handleGoogleSignUp = async () => {
  try {
    // For signup, we use the same flow as signin
    // In a real app, you might have different flows
    await authStore.loginWithGoogle()
  } catch (error) {
    console.error('Sign up error:', error)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
  text-align: center;
}

.logo-section {
  margin-bottom: 30px;
}

.logo {
  margin-bottom: 15px;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #C42B1E;
  margin: 0;
  margin-bottom: 5px;
}

.app-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.welcome-section {
  margin-bottom: 30px;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.welcome-text {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}

.auth-section {
  margin-bottom: 25px;
}

.google-signin-btn {
  background: #4285f4 !important;
  color: white !important;
  font-weight: 500;
  margin-bottom: 15px;
  text-transform: none;
  font-size: 1rem;
  border-radius: 8px;
}

.google-signin-btn:hover {
  background: #357ae8 !important;
}

.google-signup-btn {
  border: 2px solid #4285f4 !important;
  color: #4285f4 !important;
  font-weight: 500;
  text-transform: none;
  font-size: 1rem;
  border-radius: 8px;
}

.google-signup-btn:hover {
  background: #f8f9fa !important;
}

.google-icon {
  margin-right: 8px;
}

.error-alert {
  margin-bottom: 20px;
}

.features-section {
  margin-bottom: 30px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.feature-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.feature-text {
  font-size: 0.9rem;
  color: #555;
}

.footer-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.footer-text {
  font-size: 0.8rem;
  color: #888;
  margin: 0;
}

.footer-link {
  color: #C42B1E;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .welcome-title {
    font-size: 1.3rem;
  }
  
  .google-signin-btn,
  .google-signup-btn {
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .login-container {
    padding: 25px 15px;
  }
  
  .app-title {
    font-size: 1.8rem;
  }
  
  .welcome-title {
    font-size: 1.2rem;
  }
}
</style>