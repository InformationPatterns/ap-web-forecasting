import React from 'react';
import es from '../t9n/es';
import en from '../t9n/en';
import { App } from 'ap-web-general'
import Router from './router'

export default function AppRoot() {
  return <App languageFiles={{en, es}}> <Router /> </App>
}
