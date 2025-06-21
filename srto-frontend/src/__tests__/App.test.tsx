import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from '../App'
import { store } from '../store/store'

// Mock the store module since it might not exist yet
vi.mock('../store/store', () => ({
  store: {
    getState: () => ({}),
    dispatch: vi.fn(),
    subscribe: vi.fn(),
    replaceReducer: vi.fn(),
  }
}))

const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <ConfigProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ConfigProvider>
  </Provider>
)

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    expect(document.body).toBeTruthy()
  })
})
