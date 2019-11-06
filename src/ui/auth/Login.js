import React, {useState} from 'react'
import { Form, Icon, Input, Button } from 'antd';
import AppState from '../../states/appState'

export default function Login() {
  const {actions: {signIn}} = AppState.useContainer()
  , [email, setEmail] = useState('')
  , [password, setPassword] = useState('')
  return (
    <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Form style={{width: 300}} onSubmit={e => {
          e.preventDefault();
          if (email && password) signIn(email, password)
        }} className="login-form">
        <Form.Item>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item>
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{width: "100%"}}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
