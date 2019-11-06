import React from 'react'
import { Spin } from 'antd';

export function DataSelectView(props) {
  return <div style={{ display: 'flex', justifyContent: 'center', padding: 25 }}>
    {props.children}
  </div>
}

export function CenterView(props) {
  return <Spin spinning={props.loading || false}>
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      {props.children}
    </div>
  </Spin>
}
