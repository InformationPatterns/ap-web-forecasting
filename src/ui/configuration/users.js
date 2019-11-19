import React, {useState} from 'react'
import {Table, Button, Drawer} from 'antd'
import State from '../../states/appState'
import AddUserForm from './addUserForm'
import useUsersInGroup from './hooks/useUsersInGroup'


export default function ConfigurationUsers() {
  const {t, td, language} = State.useContainer()
  , [editUser, setEditUser] = useState()
  , {loading, data: users} = useUsersInGroup()
  if (loading) return <div />
  return <div style={{ margin: 16 }}>
    <Button onClick={() => setEditUser({roles: []})} type="primary" style={{ marginBottom: 16 }}>
      {t`Add_User`}
    </Button>
    <Table rowKey='id' dataSource={users} columns={getColumns(t, td, setEditUser)} pagination={false} />
    <Drawer title="Basic Drawer" placement="right" closable={false}
      onClose={() => setEditUser()} visible={!!editUser}>
      <AddUserForm user={editUser} close={() => setEditUser()} defaultLanguage={language} />
    </Drawer>
  </div>
}

function getColumns(t, td, setEditUser) {
 return [
   {
     title: t`Name`,
     dataIndex: 'name',
     key: 'name',
   },
   {
     title: t`Roles`,
     dataIndex: 'roles',
     key: 'roles',
     render: (roles) => roles.map(role => td(role)).join(', ')
   },
   {
     title: t`Email`,
     dataIndex: 'email',
     key: 'email',
   },
   {
     title: t`Language`,
     dataIndex: 'language',
     key: 'language',
     render: (language) => td(language)
   },
   {
     title: t`Actions`,
     key: 'actions',
     render: function actions(user) {
       return <Button onClick={() => setEditUser(user)}>
         Edit
       </Button>
     }
   }
 ]
}
