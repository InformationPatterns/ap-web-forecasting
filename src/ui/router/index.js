import React from 'react'
import {useRoutes, useRedirect} from 'hookrouter';
import { Layout } from 'antd'
import AppState from '../../states/appState'

import NotFoundPage from './NotFoundPage'
import Loading from '../components/Loading'
import Navbar from './Navbar'
import Sidbar from './Sidbar'
//
import Login from '../auth/Login'
import Groups from '../auth/Groups'

// import EstimatesWeeks from '../estimates/weeks'
// import EstimatesDays from '../estimates/days'
// //
// import SalesTable from '../sales/table'
// import SalesEdit from '../sales/edit'
// //
// import ProgrammedEdit from '../production/edit';
// import ProgrammedByCrop from '../production/crop';
// import ProgrammedByCropDay from '../production/day';
//
import ActualBlock from '../actual/block'
import ActualBar from '../actual/bar'
import ActualLot from '../actual/lot'


/* eslint-disable react/display-name */
const routes = {
  // '/estimates/weeks': () => <EstimatesWeeks />,
  // '/estimates/days': () => <EstimatesDays />,
  // '/demand/table': () => <SalesTable />,
  // '/demand/edit': () => <SalesEdit />,
  // '/production/reports/week': () => <ProgrammedByCrop />,
  // '/production/reports/day': () => <ProgrammedByCropDay type='harvest' />,
  // '/production/edit': () => <ProgrammedEdit />,
  '/actual/block': () => <ActualBlock />,
  '/actual/bar': () => <ActualBar />,
  '/actual/lot': () => <ActualLot />
};
/* eslint-enable react/display-name */

export default function Router() {
  const {userId, groupId, loading} = AppState.useContainer()
  , routeResult = useRoutes(routes);
  useRedirect('/', '/actual/block')
  if (loading) return <Loading />
  if (!userId) return <Login />
  if (!groupId) return <Groups />
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
