import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import {ConfigProvider} from 'antd'
import es from 'antd/lib/locale/es_ES';
import en from 'antd/lib/locale/en_US';
import AppState from '../states/appState'
import client from './apollo'
import Router from './router'
import { CookiesProvider } from 'react-cookie';

export default function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <CookiesProvider>
          <AppState.Provider>
            <AppConfig />
          </AppState.Provider>
        </CookiesProvider>
      </ApolloProvider>
    </div>
  );
}

function AppConfig() {
  const {language} = AppState.useContainer()
  , local = language === 'es' ? es : en
  return <ConfigProvider locale={local}>
    <div style={{minHeight: '100vh', display: 'flex'}}>
      <Router />
    </div>
  </ConfigProvider>
}
