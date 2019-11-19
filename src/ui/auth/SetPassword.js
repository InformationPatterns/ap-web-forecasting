import React, {useState} from 'react'
import { Form, Icon, Input, Button } from 'antd';
import AppState from '../../states/appState'

export default function SetPassword({token}) {
  const {actions: {setPassword}, t, td} = AppState.useContainer()
  , [password, _setPassword] = useState('')
  , [error, setError] = useState('')
  , [loading, setLoading] = useState('')
  return (
    <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Form style={{width: 300}} onSubmit={e => {
          e.preventDefault();
          setLoading(true)
          if (password && token) setPassword(password, token).then(e => {
            if (e) setError(e) //if no error this component will be removed
            setLoading(false)
          })
        }} className="login-form">
        <Form.Item>
          <Input
            value={password}
            onChange={e => _setPassword(e.target.value)}
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder={t`Password`}
          />
        </Form.Item>
        <Form.Item help={error ? td(error) : ''} validateStatus={error ? 'error' : ''}>
          <Button disabled={loading || !password}
            type="primary" htmlType="submit" style={{width: "100%"}}>
            {t`Login`}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
