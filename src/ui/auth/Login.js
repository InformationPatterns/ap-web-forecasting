import React, {useState} from 'react'
import { Form, Icon, Input, Button } from 'antd';
import AppState from '../../states/appState'
import ResetPassword from './ResetPassword'

export default function Login() {
  const [reset, setReset] = useState(false)
  if (reset) return <ResetPassword login={() => setReset(false)} />
  return <_Login resetPassword={() => setReset(true)}/>
}

function _Login({resetPassword}) {
  const {actions: {signIn}, t, td} = AppState.useContainer()
  , [email, setEmail] = useState('')
  , [password, setPassword] = useState('')
  , [error, setError] = useState('')
  , [loading, setLoading] = useState('')
  return (
    <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Form style={{width: 300}} onSubmit={e => {
          e.preventDefault();
          setLoading(true)
          if (email && password) signIn(email, password).then(e => {
            if (e) { //if no error this component will be removed
              setError(e)
              setLoading(false)
            }
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
        <Form.Item>
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder={t`Password`}
          />
        </Form.Item>
        <Form.Item help={error ? td(error) : ''} validateStatus={error ? 'error' : ''}>
          <Button disabled={loading || !email || !password}
            type="primary" htmlType="submit" style={{width: "100%"}}>
            {t`Login`}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="dashed" style={{width: "100%"}} onClick={resetPassword}>{t`Reset_Password`}</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
