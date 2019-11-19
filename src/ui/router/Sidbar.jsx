import React from 'react'
import { Menu, Layout } from 'antd';
import {getWorkingPath} from 'hookrouter';
import {A} from 'hookrouter';
const { Sider } = Layout
// const { SubMenu } = Menu;
import State from '../../states/appState'

export default function Navbar() {
  const {t} = State.useContainer()
  , path = getWorkingPath().split('/')
  , parent = `/${path[1]}/${path[2]}`
  , child = `/${path[1]}/${path[2]}/${path[3]}`
  , subChild = `/${path[1]}/${path[2]}/${path[3]}/${path[4]}`
  , location = [parent, child, subChild]
  if (!ROUTES[path[1]]) return null
  let ui = ROUTES[path[1]](t)
  return <Sider>
    <Menu key={parent} style={{ height: '100%', borderRight: 0 }} defaultOpenKeys={location}
      selectedKeys={location} mode="inline">
      {ui}
    </Menu>
  </Sider>
}

const ROUTES = {
  actual(t) {
    return [
      <Menu.Item key="/actual/block">
        <A href='/actual/block' >{t`Block`}</A>
      </Menu.Item>,
      <Menu.Item key="/actual/bar">
        <A href='/actual/bar'>{t`Bar`}</A>
      </Menu.Item>,
      <Menu.Item key="/actual/lot">
        <A href='/actual/lot'>{t`Lot`}</A>
      </Menu.Item>
    ]
  },
  configuration(t) {
    return [
      <Menu.Item key="/configuration/users">
        <A href='/configuration/users'>{t`Users`}</A>
      </Menu.Item>,
    ]
  }
}
