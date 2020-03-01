import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import {ConfigProvider} from 'antd'
import antEs from 'antd/lib/locale/es_ES';
import antEn from 'antd/lib/locale/en_US';
import es from '../states/t9n/es';
import en from '../states/t9n/en';
import {ApolloClient, AppState} from 'ap-web-general'
import Router from './router'
import { CookiesProvider } from 'react-cookie';
const client = ApolloClient()

export default function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <CookiesProvider>
          <AppState.Provider initialState={{en, es}}>
            <AppConfig />
          </AppState.Provider>
        </CookiesProvider>
      </ApolloProvider>
    </div>
  );
}

function AppConfig() {
  const {language} = AppState.useContainer()
  , local = language === 'es' ? antEs : antEn
  return <ConfigProvider locale={local}>
    <div style={{minHeight: '100vh', display: 'flex'}}>
      <Router />
    </div>
  </ConfigProvider>
}
