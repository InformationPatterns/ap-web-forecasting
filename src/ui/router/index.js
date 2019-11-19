import React from 'react'
import {useRoutes, useRedirect, usePath} from 'hookrouter';
import { Layout } from 'antd'
import AppState from '../../states/appState'

import NotFoundPage from './NotFoundPage'
import Loading from '../components/Loading'
import Navbar from './Navbar'
import Sidbar from './Sidbar'

import Login from '../auth/Login'
import SetPassword from '../auth/SetPassword'
import Groups from '../auth/Groups'

import ActualBlock from '../actual/block'
import ActualBar from '../actual/bar'
import ActualLot from '../actual/lot'

import ConfigurationUsers from '../configuration/users'

/* eslint-disable react/display-name */
const routes = {
  '/set-password/:token': ({token}) => <SetPassword token={token} />,
  '/actual/block': () => <ActualBlock />,
  '/actual/bar': () => <ActualBar />,
  '/actual/lot': () => <ActualLot />,
  '/configuration/users': () => <ConfigurationUsers />
};
/* eslint-enable react/display-name */

export default function Router() {
  const {userId, userRoles = [], groupId, loading} = AppState.useContainer()
  , routeResult = useRoutes(routes)
  , path = usePath().split('/')
  useRedirect('/', '/actual/block')
  if (path[1] && path[1] === 'set-password') return routeResult
  if (loading) return <Loading />
  if (!userId) return <Login />
  if (!groupId) return <Groups />
  if (!userRoles.includes('admin')) return <NotFoundPage />
  return <Layout>
    <Navbar />
    <Layout>
      <Sidbar />
      <Layout.Content>
        {routeResult || <NotFoundPage />}
      </Layout.Content>
    </Layout>
  </Layout>
}
