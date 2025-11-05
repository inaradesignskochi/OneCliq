<template>
  <div class="orders-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <v-icon left color="primary">mdi-format-list-bulleted</v-icon>
          Orders Management
        </h1>
        <v-btn color="primary" @click="showNewOrderDialog = true">
          <v-icon left>mdi-plus</v-icon>
          New Order
        </v-btn>
      </div>
    </div>

    <!-- Orders Content -->
    <div class="orders-content">
      <!-- Filters -->
      <v-card class="filters-card">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Status"
                clearable
                dense
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="symbolFilter"
                :items="symbolOptions"
                label="Symbol"
                clearable
                dense
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="typeFilter"
                :items="typeOptions"
                label="Order Type"
                clearable
                dense
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="searchQuery"
                label="Search Orders"
                prepend-inner-icon="mdi-magnify"
                clearable
                dense
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Orders Table -->
      <v-card class="orders-table-card">
        <v-card-text>
          <v-data-table
            :headers="orderHeaders"
            :items="filteredOrders"
            :loading="loading"
            :items-per-page="itemsPerPage"
            :page="currentPage"
            @update:page="currentPage = $event"
            class="orders-table"
            density="compact"
          >
            <!-- Order ID Column -->
            <template v-slot:item.id="{ item }">
              <div class="order-id">
                <v-chip size="small" label color="primary" variant="outlined">
                  {{ item.id }}
                </v-chip>
              </div>
            </template>

            <!-- Status Column -->
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                label
                class="status-chip"
              >
                <v-icon left size="12">{{ getStatusIcon(item.status) }}</v-icon>
                {{ item.status }}
              </v-chip>
            </template>

            <!-- Type Column -->
            <template v-slot:item.type="{ item }">
              <v-chip
                :color="item.type === 'BUY' ? 'success' : 'error'"
                size="small"
                label
                class="type-chip"
              >
                <v-icon left size="12">{{ item.type === 'BUY' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
                {{ item.type }}
              </v-chip>
            </template>

            <!-- Price Column -->
            <template v-slot:item.price="{ item }">
              <div class="price-cell">
                <span class="price-value">₹{{ item.price }}</span>
                <span class="price-type">{{ item.orderType }}</span>
              </div>
            </template>

            <!-- Quantity Column -->
            <template v-slot:item.quantity="{ item }">
              <div class="quantity-cell">
                <span class="quantity-value">{{ item.quantity }}</span>
                <span class="quantity-unit">shares</span>
              </div>
            </template>

            <!-- Actions Column -->
            <template v-slot:item.actions="{ item }">
              <div class="action-buttons">
                <v-btn
                  v-if="item.status === 'PENDING'"
                  icon
                  size="small"
                  color="warning"
                  variant="text"
                  @click="cancelOrder(item)"
                  title="Cancel Order"
                >
                  <v-icon size="16">mdi-close</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  color="info"
                  variant="text"
                  @click="viewOrderDetails(item)"
                  title="View Details"
                >
                  <v-icon size="16">mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  color="secondary"
                  variant="text"
                  @click="duplicateOrder(item)"
                  title="Duplicate Order"
                >
                  <v-icon size="16">mdi-content-copy</v-icon>
                </v-btn>
              </div>
            </template>

            <!-- Empty State -->
            <template v-slot:no-data>
              <div class="empty-state">
                <v-icon size="64" color="grey lighten-1">mdi-inbox</v-icon>
                <h3>No orders found</h3>
                <p>Start by creating your first order</p>
                <v-btn color="primary" @click="showNewOrderDialog = true">
                  <v-icon left>mdi-plus</v-icon>
                  Create Order
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>

    <!-- New Order Dialog -->
    <v-dialog v-model="showNewOrderDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <v-icon left color="primary">mdi-plus</v-icon>
          Create New Order
        </v-card-title>
        
        <v-card-text>
          <v-form ref="newOrderForm" v-model="newOrderValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newOrder.symbol"
                  :items="symbolOptions"
                  label="Symbol *"
                  :rules="[v => !!v || 'Symbol is required']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="newOrder.quantity"
                  label="Quantity *"
                  type="number"
                  :rules="[v => !!v || 'Quantity is required', v => v > 0 || 'Quantity must be positive']"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newOrder.type"
                  :items="['BUY', 'SELL']"
                  label="Order Type *"
                  :rules="[v => !!v || 'Order type is required']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newOrder.orderType"
                  :items="['MARKET', 'LIMIT', 'STOP_LOSS', 'STOP_LOSS_MARKET']"
                  label="Execution Type *"
                  :rules="[v => !!v || 'Execution type is required']"
                  required
                />
              </v-col>
            </v-row>

            <v-row v-if="newOrder.orderType !== 'MARKET'">
              <v-col cols="12">
                <v-text-field
                  v-model.number="newOrder.price"
                  label="Price *"
                  type="number"
                  step="0.01"
                  :rules="[v => !!v || 'Price is required', v => v > 0 || 'Price must be positive']"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showNewOrderDialog = false">Cancel</v-btn>
          <v-btn color="primary" :disabled="!newOrderValid" @click="createOrder" :loading="creatingOrder">
            Create Order
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Order Details Dialog -->
    <v-dialog v-model="showOrderDetails" max-width="500px">
      <v-card>
        <v-card-title>
          <v-icon left color="primary">mdi-eye</v-icon>
          Order Details
        </v-card-title>
        
        <v-card-text v-if="selectedOrder">
          <v-list dense>
            <v-list-item>
              <v-list-item-title>Order ID</v-list-item-title>
              <v-list-item-subtitle>{{ selectedOrder.id }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Symbol</v-list-item-title>
              <v-list-item-subtitle>{{ selectedOrder.symbol }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Type</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  :color="selectedOrder.type === 'BUY' ? 'success' : 'error'"
                  size="small"
                  label
                >
                  {{ selectedOrder.type }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Quantity</v-list-item-title>
              <v-list-item-subtitle>{{ selectedOrder.quantity }} shares</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Price</v-list-item-title>
              <v-list-item-subtitle>₹{{ selectedOrder.price }} ({{ selectedOrder.orderType }})</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Status</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  :color="getStatusColor(selectedOrder.status)"
                  size="small"
                  label
                >
                  {{ selectedOrder.status }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Created Time</v-list-item-title>
              <v-list-item-subtitle>{{ selectedOrder.time }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showOrderDetails = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Reactive data
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const searchQuery = ref('')
const statusFilter = ref('')
const symbolFilter = ref('')
const typeFilter = ref('')

// Dialog states
const showNewOrderDialog = ref(false)
const showOrderDetails = ref(false)
const creatingOrder = ref(false)
const newOrderValid = ref(false)
const selectedOrder = ref(null)

// New order form data
const newOrder = ref({
  symbol: '',
  quantity: 1,
  type: 'BUY',
  orderType: 'MARKET',
  price: ''
})

// Filter options
const statusOptions = ['PENDING', 'EXECUTED', 'CANCELLED', 'REJECTED']
const symbolOptions = ['NIFTY50', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFC', 'INFY', 'ITC', 'SBIN']
const typeOptions = ['BUY', 'SELL']

// Order headers for data table
const orderHeaders = [
  { title: 'Order ID', key: 'id', sortable: false, width: '120px' },
  { title: 'Symbol', key: 'symbol', sortable: false },
  { title: 'Type', key: 'type', sortable: false, width: '100px' },
  { title: 'Quantity', key: 'quantity', sortable: false, width: '120px' },
  { title: 'Price', key: 'price', sortable: false, width: '150px' },
  { title: 'Status', key: 'status', sortable: false, width: '120px' },
  { title: 'Time', key: 'time', sortable: false, width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' }
]

// Mock orders data
const orders = ref([
  {
    id: 'ORD001',
    symbol: 'NIFTY50',
    type: 'BUY',
    quantity: 50,
    price: '18,150.00',
    orderType: 'LIMIT',
    status: 'EXECUTED',
    time: '10:30:15'
  },
  {
    id: 'ORD002',
    symbol: 'BANKNIFTY',
    type: 'SELL',
    quantity: 25,
    price: '42,050.00',
    orderType: 'MARKET',
    status: 'EXECUTED',
    time: '10:25:42'
  },
  {
    id: 'ORD003',
    symbol: 'RELIANCE',
    type: 'BUY',
    quantity: 100,
    price: '2,450.00',
    orderType: 'STOP_LOSS',
    status: 'PENDING',
    time: '10:20:30'
  },
  {
    id: 'ORD004',
    symbol: 'TCS',
    type: 'SELL',
    quantity: 75,
    price: '3,250.00',
    orderType: 'LIMIT',
    status: 'CANCELLED',
    time: '10:15:18'
  },
  {
    id: 'ORD005',
    symbol: 'HDFC',
    type: 'BUY',
    quantity: 50,
    price: '1,650.00',
    orderType: 'MARKET',
    status: 'EXECUTED',
    time: '10:10:05'
  },
  {
    id: 'ORD006',
    symbol: 'INFY',
    type: 'SELL',
    quantity: 80,
    price: '1,850.00',
    orderType: 'STOP_LOSS_MARKET',
    status: 'PENDING',
    time: '09:45:20'
  },
  {
    id: 'ORD007',
    symbol: 'ITC',
    type: 'BUY',
    quantity: 200,
    price: '450.00',
    orderType: 'LIMIT',
    status: 'EXECUTED',
    time: '09:30:10'
  },
  {
    id: 'ORD008',
    symbol: 'SBIN',
    type: 'SELL',
    quantity: 150,
    price: '650.00',
    orderType: 'MARKET',
    status: 'REJECTED',
    time: '09:15:05'
  }
])

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Apply filters
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }
  if (symbolFilter.value) {
    filtered = filtered.filter(order => order.symbol === symbolFilter.value)
  }
  if (typeFilter.value) {
    filtered = filtered.filter(order => order.type === typeFilter.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.symbol.toLowerCase().includes(query) ||
      order.type.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
const getStatusColor = (status) => {
  switch (status) {
    case 'EXECUTED':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'CANCELLED':
    case 'REJECTED':
      return 'error'
    default:
      return 'info'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'EXECUTED':
      return 'mdi-check-circle'
    case 'PENDING':
      return 'mdi-clock-outline'
    case 'CANCELLED':
      return 'mdi-close-circle'
    case 'REJECTED':
      return 'mdi-alert-circle'
    default:
      return 'mdi-help-circle'
  }
}

const createOrder = async () => {
  if (!newOrderValid.value) return
  
  creatingOrder.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const order = {
      id: `ORD${String(orders.value.length + 1).padStart(3, '0')}`,
      symbol: newOrder.value.symbol,
      type: newOrder.value.type,
      quantity: newOrder.value.quantity,
      price: newOrder.value.orderType === 'MARKET' ? 'MARKET' : newOrder.value.price,
      orderType: newOrder.value.orderType,
      status: 'PENDING',
      time: new Date().toLocaleTimeString('en-IN', { hour12: false })
    }
    
    orders.value.unshift(order)
    
    // Reset form
    newOrder.value = {
      symbol: '',
      quantity: 1,
      type: 'BUY',
      orderType: 'MARKET',
      price: ''
    }
    
    showNewOrderDialog.value = false
    
  } catch (error) {
    console.error('Create order error:', error)
    alert('Failed to create order. Please try again.')
  } finally {
    creatingOrder.value = false
  }
}

const cancelOrder = async (order) => {
  if (!confirm(`Are you sure you want to cancel order ${order.id}?`)) return
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = orders.value.findIndex(o => o.id === order.id)
    if (index !== -1) {
      orders.value[index].status = 'CANCELLED'
    }
    
  } catch (error) {
    console.error('Cancel order error:', error)
    alert('Failed to cancel order. Please try again.')
  }
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showOrderDetails.value = true
}

const duplicateOrder = (order) => {
  newOrder.value = {
    symbol: order.symbol,
    quantity: order.quantity,
    type: order.type,
    orderType: order.orderType,
    price: order.price === 'MARKET' ? '' : order.price
  }
  showNewOrderDialog.value = true
}

// Load orders on mount
onMounted(async () => {
  loading.value = true
  try {
    // Simulate API call to load orders
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Load orders error:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.orders-page {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.orders-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.filters-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

.orders-table-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.orders-table {
  border-radius: 8px;
}

.order-id {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.status-chip,
.type-chip {
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.price-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-value {
  font-weight: 600;
  font-size: 0.9rem;
}

.price-type {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
}

.quantity-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.quantity-value {
  font-weight: 600;
  font-size: 0.9rem;
}

.quantity-unit {
  font-size: 0.75rem;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #666;
}

.empty-state h3 {
  margin: 16px 0 8px;
  font-size: 1.25rem;
  font-weight: 600;
}

.empty-state p {
  margin-bottom: 24px;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .orders-content {
    padding: 16px;
  }
  
  .filters-card .v-card-text {
    padding: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 2px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .orders-content {
    padding: 12px;
  }
  
  .empty-state {
    padding: 32px 16px;
  }
}
</style>