<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <v-icon left color="primary">mdi-cog</v-icon>
          Settings
        </h1>
      </div>
    </div>

    <!-- Settings Content -->
    <div class="settings-content">
      <v-row>
        <!-- Profile Settings -->
        <v-col cols="12" md="6">
          <v-card class="settings-card">
            <v-card-title>
              <v-icon left color="primary">mdi-account</v-icon>
              Profile Information
            </v-card-title>
            
            <v-card-text>
              <div class="profile-section">
                <div class="profile-avatar">
                  <v-avatar size="80" class="avatar-large">
                    <v-img 
                      :src="authStore.userInfo?.picture || 'https://via.placeholder.com/150'" 
                      alt="Profile Picture"
                    />
                  </v-avatar>
                  <v-btn 
                    color="primary" 
                    variant="text" 
                    size="small"
                    @click="changeProfilePicture"
                  >
                    Change Photo
                  </v-btn>
                </div>

                <v-form ref="profileForm" v-model="profileValid">
                  <v-text-field
                    v-model="profileData.name"
                    label="Full Name"
                    :rules="[v => !!v || 'Name is required']"
                    required
                    prepend-inner-icon="mdi-account"
                  />
                  
                  <v-text-field
                    v-model="profileData.email"
                    label="Email Address"
                    type="email"
                    :rules="[v => !!v || 'Email is required', v => /.+@.+/.test(v) || 'Email must be valid']"
                    required
                    prepend-inner-icon="mdi-email"
                    readonly
                  />
                  
                  <v-text-field
                    v-model="profileData.phone"
                    label="Phone Number"
                    type="tel"
                    prepend-inner-icon="mdi-phone"
                  />
                  
                  <v-textarea
                    v-model="profileData.bio"
                    label="Bio"
                    rows="3"
                    prepend-inner-icon="mdi-information"
                  />
                </v-form>
              </div>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer />
              <v-btn 
                color="primary" 
                @click="saveProfile"
                :disabled="!profileValid || savingProfile"
                :loading="savingProfile"
              >
                Save Profile
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Trading Preferences -->
        <v-col cols="12" md="6">
          <v-card class="settings-card">
            <v-card-title>
              <v-icon left color="primary">mdi-chart-line</v-icon>
              Trading Preferences
            </v-card-title>
            
            <v-card-text>
              <v-form ref="preferencesForm" v-model="preferencesValid">
                <v-select
                  v-model="preferencesData.defaultOrderType"
                  :items="['MARKET', 'LIMIT', 'STOP_LOSS', 'STOP_LOSS_MARKET']"
                  label="Default Order Type"
                  prepend-inner-icon="mdi-format-list-bulleted-type"
                />
                
                <v-text-field
                  v-model.number="preferencesData.defaultQuantity"
                  label="Default Quantity"
                  type="number"
                  min="1"
                  prepend-inner-icon="mdi-numeric"
                />
                
                <v-switch
                  v-model="preferencesData.autoRefresh"
                  label="Auto-refresh market data"
                  color="primary"
                  inset
                />
                
                <v-text-field
                  v-model.number="preferencesData.refreshInterval"
                  label="Refresh Interval (seconds)"
                  type="number"
                  min="5"
                  max="300"
                  :disabled="!preferencesData.autoRefresh"
                  prepend-inner-icon="mdi-clock-outline"
                />
                
                <v-switch
                  v-model="preferencesData.soundNotifications"
                  label="Enable sound notifications"
                  color="primary"
                  inset
                />
                
                <v-switch
                  v-model="preferencesData.emailNotifications"
                  label="Enable email notifications"
                  color="primary"
                  inset
                />
              </v-form>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer />
              <v-btn 
                color="primary" 
                @click="savePreferences"
                :disabled="!preferencesValid || savingPreferences"
                :loading="savingPreferences"
              >
                Save Preferences
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Security Settings -->
        <v-col cols="12" md="6">
          <v-card class="settings-card">
            <v-card-title>
              <v-icon left color="primary">mdi-shield-lock</v-icon>
              Security Settings
            </v-card-title>
            
            <v-card-text>
              <div class="security-section">
                <v-list dense>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Two-Factor Authentication</v-list-item-title>
                      <v-list-item-subtitle>Enabled</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn text color="primary" size="small">Manage</v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="info">mdi-email</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Email Verification</v-list-item-title>
                      <v-list-item-subtitle>Verified</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn text color="primary" size="small">Change</v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="warning">mdi-clock</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Session Timeout</v-list-item-title>
                      <v-list-item-subtitle>30 minutes</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn text color="primary" size="small">Edit</v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
                
                <v-divider class="my-4" />
                
                <v-btn 
                  color="warning" 
                  variant="outlined" 
                  block 
                  class="mb-2"
                  @click="changePassword"
                >
                  <v-icon left>mdi-lock-reset</v-icon>
                  Change Password
                </v-btn>
                
                <v-btn 
                  color="error" 
                  variant="outlined" 
                  block
                  @click="showLogoutDialog = true"
                >
                  <v-icon left>mdi-logout</v-icon>
                  Sign Out All Devices
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- API Settings -->
        <v-col cols="12" md="6">
          <v-card class="settings-card">
            <v-card-title>
              <v-icon left color="primary">mdi-api</v-icon>
              API Settings
            </v-card-title>
            
            <v-card-text>
              <div class="api-section">
                <v-alert
                  type="info"
                  variant="tonal"
                  class="mb-4"
                >
                  API access allows you to integrate with third-party applications.
                </v-alert>
                
                <v-switch
                  v-model="apiData.enabled"
                  label="Enable API Access"
                  color="primary"
                  inset
                />
                
                <template v-if="apiData.enabled">
                  <v-text-field
                    v-model="apiData.key"
                    label="API Key"
                    readonly
                    prepend-inner-icon="mdi-key"
                  >
                    <template v-slot:append>
                      <v-btn icon size="small" @click="regenerateApiKey">
                        <v-icon>mdi-refresh</v-icon>
                      </v-btn>
                      <v-btn icon size="small" @click="copyApiKey">
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                  
                  <v-text-field
                    v-model="apiData.secret"
                    label="API Secret"
                    readonly
                    type="password"
                    prepend-inner-icon="mdi-lock"
                  >
                    <template v-slot:append>
                      <v-btn icon size="small" @click="showApiSecret = !showApiSecret">
                        <v-icon>{{ showApiSecret ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                      </v-btn>
                      <v-btn icon size="small" @click="copyApiSecret">
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                  
                  <v-select
                    v-model="apiData.permissions"
                    :items="['Read Only', 'Trading', 'Full Access']"
                    label="Permissions"
                    multiple
                    chips
                    prepend-inner-icon="mdi-shield-check"
                  />
                  
                  <v-text-field
                    v-model="apiData.webhookUrl"
                    label="Webhook URL (Optional)"
                    type="url"
                    prepend-inner-icon="mdi-webhook"
                  />
                </template>
              </div>
            </v-card-text>
            
            <v-card-actions v-if="apiData.enabled">
              <v-spacer />
              <v-btn 
                color="primary" 
                @click="saveApiSettings"
                :loading="savingApi"
              >
                Save API Settings
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Account Actions -->
        <v-col cols="12">
          <v-card class="settings-card">
            <v-card-title>
              <v-icon left color="error">mdi-alert-circle</v-icon>
              Account Actions
            </v-card-title>
            
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-btn 
                    color="warning" 
                    variant="outlined" 
                    block 
                    class="mb-2"
                    @click="exportData"
                    :loading="exportingData"
                  >
                    <v-icon left>mdi-download</v-icon>
                    Export Account Data
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn 
                    color="error" 
                    variant="outlined" 
                    block
                    @click="showDeleteDialog = true"
                  >
                    <v-icon left>mdi-delete</v-icon>
                    Delete Account
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Logout Dialog -->
    <v-dialog v-model="showLogoutDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Sign Out All Devices</v-card-title>
        <v-card-text>
          Are you sure you want to sign out from all devices? This will end all active sessions.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showLogoutDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="logoutAllDevices">Sign Out All</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Account Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Delete Account</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            This action cannot be undone. All your data will be permanently deleted.
          </v-alert>
          <p>Please type "DELETE" to confirm:</p>
          <v-text-field
            v-model="deleteConfirmation"
            label="Type DELETE to confirm"
            :rules="[v => v === 'DELETE' || 'Please type DELETE']"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn 
            color="error" 
            @click="deleteAccount"
            :disabled="deleteConfirmation !== 'DELETE'"
            :loading="deletingAccount"
          >
            Delete Account
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Form validation
const profileValid = ref(false)
const preferencesValid = ref(false)

// Loading states
const savingProfile = ref(false)
const savingPreferences = ref(false)
const savingApi = ref(false)
const exportingData = ref(false)
const deletingAccount = ref(false)

// Dialog states
const showLogoutDialog = ref(false)
const showDeleteDialog = ref(false)
const showApiSecret = ref(false)

// Form data
const profileData = reactive({
  name: '',
  email: '',
  phone: '',
  bio: ''
})

const preferencesData = reactive({
  defaultOrderType: 'MARKET',
  defaultQuantity: 1,
  autoRefresh: true,
  refreshInterval: 30,
  soundNotifications: true,
  emailNotifications: false
})

const apiData = reactive({
  enabled: false,
  key: 'pk_test_1234567890abcdef',
  secret: 'sk_test_abcdef1234567890',
  permissions: ['Read Only'],
  webhookUrl: ''
})

const deleteConfirmation = ref('')

// Methods
const changeProfilePicture = () => {
  alert('Profile picture change functionality would be implemented here')
}

const saveProfile = async () => {
  if (!profileValid.value) return
  
  savingProfile.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update user info in store
    authStore.userInfo = {
      ...authStore.userInfo,
      name: profileData.name,
      phone: profileData.phone,
      bio: profileData.bio
    }
    
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Save profile error:', error)
    alert('Failed to update profile. Please try again.')
  } finally {
    savingProfile.value = false
  }
}

const savePreferences = async () => {
  if (!preferencesValid.value) return
  
  savingPreferences.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Save preferences to localStorage
    localStorage.setItem('tradingPreferences', JSON.stringify(preferencesData))
    
    alert('Preferences saved successfully!')
  } catch (error) {
    console.error('Save preferences error:', error)
    alert('Failed to save preferences. Please try again.')
  } finally {
    savingPreferences.value = false
  }
}

const changePassword = () => {
  alert('Password change functionality would redirect to secure password reset flow')
}

const logoutAllDevices = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout all devices error:', error)
  }
}

const regenerateApiKey = () => {
  apiData.key = 'pk_test_' + Math.random().toString(36).substr(2, 16)
  apiData.secret = 'sk_test_' + Math.random().toString(36).substr(2, 32)
}

const copyApiKey = async () => {
  try {
    await navigator.clipboard.writeText(apiData.key)
    alert('API key copied to clipboard!')
  } catch (error) {
    console.error('Copy API key error:', error)
  }
}

const copyApiSecret = async () => {
  try {
    await navigator.clipboard.writeText(apiData.secret)
    alert('API secret copied to clipboard!')
  } catch (error) {
    console.error('Copy API secret error:', error)
  }
}

const saveApiSettings = async () => {
  savingApi.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Save API settings to localStorage
    localStorage.setItem('apiSettings', JSON.stringify(apiData))
    
    alert('API settings saved successfully!')
  } catch (error) {
    console.error('Save API settings error:', error)
    alert('Failed to save API settings. Please try again.')
  } finally {
    savingApi.value = false
  }
}

const exportData = async () => {
  exportingData.value = true
  
  try {
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const exportData = {
      profile: profileData,
      preferences: preferencesData,
      apiSettings: apiData,
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `1cliq-account-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export data error:', error)
    alert('Failed to export data. Please try again.')
  } finally {
    exportingData.value = false
  }
}

const deleteAccount = async () => {
  if (deleteConfirmation.value !== 'DELETE') return
  
  deletingAccount.value = true
  
  try {
    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Delete account error:', error)
    alert('Failed to delete account. Please try again.')
  } finally {
    deletingAccount.value = false
  }
}

// Load settings on mount
onMounted(() => {
  // Load user data
  if (authStore.userInfo) {
    profileData.name = authStore.userInfo.name || ''
    profileData.email = authStore.userInfo.email || ''
    profileData.phone = authStore.userInfo.phone || ''
    profileData.bio = authStore.userInfo.bio || ''
  }
  
  // Load saved preferences
  const savedPreferences = localStorage.getItem('tradingPreferences')
  if (savedPreferences) {
    Object.assign(preferencesData, JSON.parse(savedPreferences))
  }
  
  // Load saved API settings
  const savedApiSettings = localStorage.getItem('apiSettings')
  if (savedApiSettings) {
    Object.assign(apiData, JSON.parse(savedApiSettings))
  }
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 24px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.settings-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.settings-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.settings-card .v-card-text {
  flex: 1;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar-large {
  border: 3px solid #e0e0e0;
}

.security-section {
  padding: 0;
}

.api-section {
  padding: 0;
}

.v-list-item {
  padding-left: 0;
  padding-right: 0;
}

.v-list-item__icon {
  margin-right: 16px;
}

.v-divider {
  margin: 16px 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .settings-content {
    padding: 16px;
  }
  
  .profile-section {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .settings-content {
    padding: 12px;
  }
  
  .profile-avatar {
    gap: 8px;
  }
  
  .avatar-large {
    width: 64px !important;
    height: 64px !important;
  }
}
</style>