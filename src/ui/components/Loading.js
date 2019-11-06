import React from 'react'
import { Spin } from 'antd'

export default function Loading() {
  return <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <Spin size="large" />
  </div>
}
