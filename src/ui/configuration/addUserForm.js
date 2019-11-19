import React from 'react'
import {Button, Form, Input} from 'antd'
import TreeSelect from '../components/TreeSelect'
import State from '../../states/appState'
import Select from '../components/Select'
import useEditUserInGroup from './hooks/useEditUserInGroup'

function _AddUserForm({form, user, close, defaultLanguage}) {
  const {t} = State.useContainer()
  , [addUser, error] = useEditUserInGroup()
  , { getFieldDecorator } = form;
  console.log('mutaion error:', error);
  if (!user) return null
  return <Form onSubmit={(e) => {
      e.preventDefault()
      form.validateFields((err, values) => {
        if (!err) addUser(values)
      })
    }}>
    <Form.Item>
      {getFieldDecorator('name', {
        rules: [{ required: true, message: 'Please input a username!' }],
        initialValue: user.name
      })(
        <Input placeholder={t`Name`} />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('email', {
        rules: [{ required: true, message: 'Please input an email!' }],
        initialValue: user.email
      })(
        <Input type="email" placeholder={t`Email`} />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('language', {
        rules: [{ required: true, message: 'Please input a language!' }],
        initialValue: user.language || defaultLanguage
      })(
        <Select placeholder={t`Language`} data={[
          {value: 'en', label: t`en`},
          {value: 'es', label: t`es`},
        ]} />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('roles', {
        rules: [{ required: true, message: 'Please input at least one Role!' }],
        initialValue: user.roles
      })(
        <TreeSelect placeholder={t`Roles`} data={[
          {value: 'health_mobile', label: t`Health_Mobile`},
          {value: 'health_browser', label: t`Health_Browser`},
          {value: 'plant_age_mobile', label: t`Plant_Age_Mobile`},
          {value: 'admin', label: t`Admin`}
        ]}/>
      )}
    </Form.Item>
    <Form.Item error={!!error} help={error}>
      <Button type="primary" htmlType="submit" style={{width: '100%'}}>
        {t`Save`}
      </Button>
    </Form.Item>
    <Form.Item>
      <Button onClick={close} style={{width: '100%'}}>
        {t`Cancle`}
      </Button>
    </Form.Item>
  </Form>
}

export default Form.create({ name: 'add_user_form' })(_AddUserForm);
