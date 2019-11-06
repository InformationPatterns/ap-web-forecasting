import React from 'react'
import { Result } from 'antd'

export default function NotFoundPage() {
  return <div style={STYLE} >
    <Result
      status="404"
      title="404"
    />
  </div>
}
let STYLE = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}
