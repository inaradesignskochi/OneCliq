<template>
  <div class="dashboard">
    <!-- Navigation Header -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <svg width="32" height="32" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M52.7842 10.916L33.1458 24.3542C27.7968 28.6272 26.0082 33.9103 27.7799 40.2035C28.0294 41.0277 28.7959 43.981 32.6275 46.7169C33.9332 47.6492 36.7844 48.9064 41.1812 50.4883L41.081 50.5552L31.7038 56.8097C27.5674 60.1313 26.893 64.3206 29.6805 69.3773C32.0874 72.4947 36.5668 73.3427 40.1251 71.9675C42.4973 71.0507 48.3707 67.1525 57.7452 60.2727C60.7991 56.7157 62.0527 52.8355 61.506 48.632C60.6666 43.5019 57.2919 39.7936 51.3819 37.5071L47.3571 35.7936L61.905 25.3834L52.7842 10.916Z" fill="#C42B1E"/>
            <path d="M37.067 21.6277C34.3841 25.8233 34.9701 29.3447 38.8249 32.1917C43.0036 34.0863 45.8088 35.3109 47.2406 35.8655L56.0284 37.6177L61.9052 25.3834C56.0805 16.1464 53.0403 11.324 52.7844 10.916C52.3823 11.2065 47.1432 14.7771 37.067 21.6277Z" fill="#C42B1E"/>
            <path d="M70.4677 14.8808L64.2677 29.4233C63.4459 31.3509 61.2238 32.2476 59.3046 31.4263C58.5527 31.1045 57.9255 30.5464 57.5172 29.8359L48.0812 13.4164C47.0389 11.6028 47.6604 9.28197 49.4694 8.23272C50.1781 7.82165 51.0001 7.65213 51.8121 7.7496L67.4482 9.62656C69.5207 9.87534 70.9969 11.7636 70.7454 13.844C70.7022 14.201 70.6087 14.5501 70.4677 14.8808Z" fill="#C42B1E"/>
          </svg>
          <span class="brand-text">1Cliq</span>
        </div>
        
        <div class="nav-menu">
          <v-btn text class="nav-btn" to="/dashboard">
            <v-icon left>mdi-view-dashboard</v-icon>
            Dashboard
          </v-btn>
          <v-btn text class="nav-btn" to="/orders">
            <v-icon left>mdi-format-list-bulleted</v-icon>
            Orders
          </v-btn>
          <v-btn text class="nav-btn" to="/settings">
            <v-icon left>mdi-cog</v-icon>
            Settings
          </v-btn>
        </div>

        <div class="nav-user">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" text class="user-btn">
                <v-avatar size="32" class="user-avatar">
                  <v-img :src="authStore.userInfo?.picture || 'https://via.placeholder.com/150'" />
                </v-avatar>
                <span class="user-name">{{ authStore.userInfo?.name || 'User' }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="$router.push('/settings')">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item @click="handleLogout">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-container">
        <!-- Trading Panel -->
        <div class="trading-panel">
          <v-card class="trading-card">
            <v-card-title class="trading-title">
              <v-icon left color="primary">mdi-lightning-bolt</v-icon>
              Quick Trade Execution
            </v-card-title>
            
            <v-card-text>
              <div class="trade-form">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="selectedSymbol"
                      :items="symbols"
                      label="Select Symbol"
                      outlined
                      dense
                      prepend-icon="mdi-chart-line"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="quantity"
                      label="Quantity"
                      type="number"
                      outlined
                      dense
                      prepend-icon="mdi-numeric"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="orderType"
                      :items="orderTypes"
                      label="Order Type"
                      outlined
                      dense
                      prepend-icon="mdi-format-list-bulleted-type"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="price"
                      label="Price"
                      type="number"
                      outlined
                      dense
                      prepend-icon="mdi-currency-usd"
                      :disabled="orderType === 'MARKET'"
                    />
                  </v-col>
                </v-row>

                <div class="action-buttons">
                  <v-btn
                    color="success"
                    size="large"
                    elevation="2"
                    class="buy-btn"
                    @click="executeTrade('BUY')"
                    :loading="isExecuting"
                  >
                    <v-icon left>mdi-arrow-up</v-icon>
                    BUY
                  </v-btn>
                  
                  <v-btn
                    color="error"
                    size="large"
                    elevation="2"
                    class="sell-btn"
                    @click="executeTrade('SELL')"
                    :loading="isExecuting"
                  >
                    <v-icon left>mdi-arrow-down</v-icon>
                    SELL
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Market Overview -->
        <div class="market-overview">
          <v-card class="market-card">
            <v-card-title>
              <v-icon left color="primary">mdi-trending-up</v-icon>
              Market Overview
            </v-card-title>
            
            <v-card-text>
              <div class="market-stats">
                <div class="stat-item">
                  <div class="stat-label">NIFTY 50</div>
                  <div class="stat-value positive">18,234.50</div>
                  <div class="stat-change positive">+125.30 (+0.69%)</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">BANK NIFTY</div>
                  <div class="stat-value positive">42,156.80</div>
                  <div class="stat-change positive">+234.50 (+0.56%)</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">SENSEX</div>
                  <div class="stat-value negative">61,234.50</div>
                  <div class="stat-change negative">-45.20 (-0.07%)</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Recent Orders -->
        <div class="recent-orders">
          <v-card class="orders-card">
            <v-card-title>
              <v-icon left color="primary">mdi-history</v-icon>
              Recent Orders
            </v-card-title>
            
            <v-card-text>
              <v-data-table
                :headers="orderHeaders"
                :items="recentOrders"
                :items-per-page="5"
                class="orders-table"
                density="compact"
              >
                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="getStatusColor(item.status)"
                    size="small"
                    label
                  >
                    {{ item.status }}
                  </v-chip>
                </template>
                
                <template v-slot:item.type="{ item }">
                  <v-chip
                    :color="item.type === 'BUY' ? 'success' : 'error'"
                    size="small"
                    label
                  >
                    {{ item.type }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Trading form data
const selectedSymbol = ref('NIFTY50')
const quantity = ref(1)
const orderType = ref('MARKET')
const price = ref('')
const isExecuting = ref(false)

// Available options
const symbols = [
  'NIFTY50',
  'BANKNIFTY',
  'RELIANCE',
  'TCS',
  'HDFC',
  'INFY',
  'ITC',
  'SBIN'
]

const orderTypes = [
  'MARKET',
  'LIMIT',
  'STOP_LOSS',
  'STOP_LOSS_MARKET'
]

// Order headers for data table
const orderHeaders = [
  { title: 'Order ID', key: 'id', sortable: false },
  { title: 'Symbol', key: 'symbol', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Quantity', key: 'quantity', sortable: false },
  { title: 'Price', key: 'price', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Time', key: 'time', sortable: false }
]

// Mock recent orders
const recentOrders = ref([
  {
    id: 'ORD001',
    symbol: 'NIFTY50',
    type: 'BUY',
    quantity: 50,
    price: '18,150.00',
    status: 'EXECUTED',
    time: '10:30:15'
  },
  {
    id: 'ORD002',
    symbol: 'BANKNIFTY',
    type: 'SELL',
    quantity: 25,
    price: '42,050.00',
    status: 'EXECUTED',
    time: '10:25:42'
  },
  {
    id: 'ORD003',
    symbol: 'RELIANCE',
    type: 'BUY',
    quantity: 100,
    price: '2,450.00',
    status: 'PENDING',
    time: '10:20:30'
  },
  {
    id: 'ORD004',
    symbol: 'TCS',
    type: 'SELL',
    quantity: 75,
    price: '3,250.00',
    status: 'CANCELLED',
    time: '10:15:18'
  },
  {
    id: 'ORD005',
    symbol: 'HDFC',
    type: 'BUY',
    quantity: 50,
    price: '1,650.00',
    status: 'EXECUTED',
    time: '10:10:05'
  }
])

// Methods
const executeTrade = async (type) => {
  if (!selectedSymbol.value || !quantity.value) {
    alert('Please fill in all required fields')
    return
  }
  
  isExecuting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Add new order to recent orders
    const newOrder = {
      id: `ORD${String(recentOrders.value.length + 1).padStart(3, '0')}`,
      symbol: selectedSymbol.value,
      type: type,
      quantity: quantity.value,
      price: orderType.value === 'MARKET' ? 'MARKET' : price.value,
      status: 'EXECUTED',
      time: new Date().toLocaleTimeString('en-IN', { hour12: false })
    }
    
    recentOrders.value.unshift(newOrder)
    
    // Show success message
    alert(`${type} order executed successfully!`)
    
  } catch (error) {
    console.error('Trade execution error:', error)
    alert('Failed to execute trade. Please try again.')
  } finally {
    isExecuting.value = false
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'EXECUTED':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'CANCELLED':
      return 'error'
    default:
      return 'info'
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #C42B1E;
}

.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-btn {
  text-transform: none !important;
  font-weight: 500;
}

.nav-user {
  display: flex;
  align-items: center;
}

.user-btn {
  text-transform: none !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  border: 2px solid #e0e0e0;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.main-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.trading-panel {
  grid-column: 1 / -1;
}

.trading-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.trading-title {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 20px 24px 16px;
}

.trade-form {
  padding: 0 24px 24px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.buy-btn,
.sell-btn {
  flex: 1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.market-card,
.orders-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.market-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.stat-value.positive {
  color: #4caf50;
}

.stat-value.negative {
  color: #f44336;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #4caf50;
}

.stat-change.negative {
  color: #f44336;
}

.recent-orders {
  grid-column: 1 / -1;
}

.orders-table {
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .nav-menu {
    display: none;
  }
  
  .content-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .market-stats {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .nav-brand {
    gap: 8px;
  }
  
  .brand-text {
    font-size: 1.25rem;
  }
  
  .user-name {
    display: none;
  }
  
  .trading-title {
    padding: 16px 16px 12px;
    font-size: 1.125rem;
  }
  
  .trade-form {
    padding: 0 16px 16px;
  }
}
</style>