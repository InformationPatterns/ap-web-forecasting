import React from 'react'
import { Menu } from 'antd'
import {getWorkingPath} from 'hookrouter';
import {A} from 'hookrouter';
import AppState from '../../states/appState'

export default function Navbar() {
  const {actions: {signOut}, t} = AppState.useContainer()
  return <Menu onClick={({key}) => setRoute(key, signOut)}
    selectedKeys={["/"+getWorkingPath().split('/')[1]]} mode="horizontal">
    <Menu.Item key="/actual">
      <A href='/actual/block'>{t`Actual`}</A>
    </Menu.Item>
    <Menu.Item key="/configuration">
      <A href='/configuration/users'>{t`Configuration`}</A>
    </Menu.Item>
    <Menu.Item key="signOut" style={{float: 'right'}}>
      {t`Logout`}
    </Menu.Item>
  </Menu>
}

function setRoute(key, signOut) {
  if (key == 'signOut') return signOut()
}
