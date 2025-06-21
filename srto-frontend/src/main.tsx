import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from '@store/store';
import '@styles/index.css';

const theme = {
  token: {
    colorPrimary: '#7C00EF',
    colorPrimaryHover: '#9D2FFF',
    colorPrimaryActive: '#5A00B3',
    colorSuccess: '#52C41A',
    colorWarning: '#FAAD14',
    colorError: '#FF4D4F',
    colorInfo: '#1890FF',
    borderRadius: 8,
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
