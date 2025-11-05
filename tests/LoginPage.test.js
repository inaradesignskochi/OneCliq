import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginPage from '../src/pages/LoginPage.vue'

// Initialize Pinia for tests
setActivePinia(createPinia())

describe('LoginPage', () => {
  it('renders the main title', () => {
    const wrapper = mount(LoginPage, {
      global: {
        stubs: {
          'v-btn': {
            template: '<button><slot /></button>'
          },
          'v-icon': {
            template: '<span><slot /></span>'
          },
          'v-alert': {
            template: '<div><slot /></div>'
          }
        }
      }
    })
    expect(wrapper.text()).toContain('1Cliq')
    expect(wrapper.text()).toContain('One Click Trading Platform')
  })

  it('has Google sign-in buttons', () => {
    const wrapper = mount(LoginPage, {
      global: {
        stubs: {
          'v-btn': {
            template: '<button><slot /></button>'
          },
          'v-icon': {
            template: '<span><slot /></span>'
          },
          'v-alert': {
            template: '<div><slot /></div>'
          }
        }
      }
    })
    expect(wrapper.text()).toContain('Sign in with Google')
    expect(wrapper.text()).toContain('Sign up with Google')
  })

  it('displays feature highlights', () => {
    const wrapper = mount(LoginPage, {
      global: {
        stubs: {
          'v-btn': {
            template: '<button><slot /></button>'
          },
          'v-icon': {
            template: '<span><slot /></span>'
          },
          'v-alert': {
            template: '<div><slot /></div>'
          }
        }
      }
    })
    expect(wrapper.text()).toContain('One-click trade execution')
    expect(wrapper.text()).toContain('Secure and encrypted')
    expect(wrapper.text()).toContain('Real-time market data')
  })
})