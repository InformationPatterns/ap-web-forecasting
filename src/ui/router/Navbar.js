import React from 'react'
import { Menu } from 'antd'
import {getWorkingPath} from 'hookrouter';
import {A} from 'hookrouter';
import {AppState} from 'ap-web-general'

export default function Navbar({modules}) {
  const {group, actions: {signOut}, t} = AppState.useContainer()
  return <Menu onClick={({key}) => setRoute(key, signOut)}
    style={{ lineHeight: '64px' }}
    selectedKeys={["/"+getWorkingPath().split('/')[1]]} mode="horizontal">
    <Menu.Item disabled>{group?.name}</Menu.Item>
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
  if (key === 'signOut') return signOut()
}
