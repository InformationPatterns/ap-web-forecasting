import React, {useState} from 'react'
import { Form, Icon, Input, Button } from 'antd';
import AppState from '../../states/appState'

export default function ResetPassword({login}) {
  const {actions: {resetPassword}, t, td} = AppState.useContainer()
  , [email, setEmail] = useState('')
  , [error, setError] = useState('')
  , [loading, setLoading] = useState('')
  return (
    <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Form style={{width: 300}} onSubmit={e => {
          e.preventDefault();
          setLoading(true)
          if (email) resetPassword(email).then(result => {
            if (result === '_success_') setError('Email_Sent')
            else setError(result)
            setLoading(false)
          })
        }} className="login-form">
        <Form.Item>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder={t`Email`}
          />
        </Form.Item>
        <Form.Item help={error ? td(error) : ''} validateStatus={error ? 'error' : ''}>
          <Button disabled={loading || !email}
            type="primary" htmlType="submit" style={{width: "100%"}}>
            {t`Request_Password_Reset`}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="dashed" style={{width: "100%"}} onClick={login}>{t`Login`}</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
