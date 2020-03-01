import React from 'react'
import { Menu, Layout } from 'antd';
import {getWorkingPath} from 'hookrouter';
import {A} from 'hookrouter';
const { Sider } = Layout
const { SubMenu } = Menu;
import {AppState} from 'ap-web-general'

export default function Navbar() {
  const {t} = AppState.useContainer()
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
  estimates(t) {
    return [
      <Menu.Item key="/estimates/weeks">
        <A href='/estimates/weeks'>{t`Week`}</A>
      </Menu.Item>,
      <Menu.Item key="/estimates/days">
        <A href='/estimates/days'>{t`Days`}</A>
      </Menu.Item>
    ]
  },
  demand(t) {
    return [
      <Menu.Item key="/demand/table">
        <A href='/demand/table'>{t`Table`}</A>
      </Menu.Item>
    ]
  },
  production(t) {
    return [
      <SubMenu key='/production/reports' title='Reports'>
        <Menu.Item key="/production/reports/week">
          <A href='/production/reports/week'>{t`Week`}</A>
        </Menu.Item>,
        <Menu.Item key="/production/reports/day">
          <A href='/production/reports/day'>{t`Day`}</A>
        </Menu.Item>
      </SubMenu>,
      <Menu.Item key="/production/edit">
        <A href='/production/edit'>{t`Edit`}</A>
      </Menu.Item>
    ]
  },
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
  }
}
