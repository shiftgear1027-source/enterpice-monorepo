import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configureApi } from '@company/shared-api';
import { App } from './app/App';
import { appEnv } from './app/env';
import './index.css';

configureApi({ baseURL: appEnv.apiBaseUrl, useMock: appEnv.useMockApi });
document.title = appEnv.appName;

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root was not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
