import React from 'react'
import { Menu } from 'antd'
import {getWorkingPath} from 'hookrouter';
import {A} from 'hookrouter';
import {AppState} from 'ap-web-general'

export default function Navbar({modules}) {
  const {actions: {signOut}, t} = AppState.useContainer()
  return <Menu onClick={({key}) => setRoute(key, signOut)}
    style={{ lineHeight: '64px' }}
    selectedKeys={["/"+getWorkingPath().split('/')[1]]} mode="horizontal">
    <Menu.Item key="/estimates" disabled>
      {t`Estimates`}
      {/* <A href='/estimates/weeks'>{t`Estimates`}</A> */}
    </Menu.Item>
    <Menu.Item key="/demand" disabled>
      {t`Demand`}
      {/* <A href='/demand/table'>{t`Demand`}</A> */}
    </Menu.Item>
    <Menu.Item key="/production" disabled>
      {t`Production`}
      {/* <A href='/production/reports/week'>{t`Production`}</A> */}
    </Menu.Item>
    <Menu.Item key="/actual">
      <A href='/actual/block'>{t`Actual`}</A>
    </Menu.Item>
    <Menu.Item key="signOut" style={{float: 'right'}}>
      {t`Logout`}
    </Menu.Item>
    {modules('forecasting')}
  </Menu>
}

function setRoute(key, signOut) {
  if (key == 'signOut') return signOut()
}
