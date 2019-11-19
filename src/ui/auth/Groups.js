import React, { useState } from 'react'
import { List, Button } from 'antd';
import AppState from '../../states/appState'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function Groups() {
  const {actions: {setGroupId, signOut}, t} = AppState.useContainer()
  , [hover, setHover] = useState()
  , { data = {}, loading } = useQuery(GET_GROUPS);
  return <List
    loading={loading}
    style={{ margin: '5vh 10vw', flex: 1}}
    header={<h1>
      {t`Select_Group`}
      <Button type='dashed' style={{float: 'right'}} onClick={signOut}>{t`Logout`}</Button>
    </h1>}
    bordered
    dataSource={data.Groups}
    renderItem={(group) => {
      let {id} = group, style = {cursor: 'pointer', fontSize: '1.5em'}
      if (id === hover) style['background'] = '#e6f7ff';
      return <List.Item style={style}
        onMouseEnter={() => setHover(id) } onMouseLeave={() => setHover()}
        onClick={() => setGroupId(group)}>
        {group.name}
      </List.Item>
    }}
  />
}

const GET_GROUPS = gql`
  query findGroupsForUser {
   Groups: findGroupsForUser {
     id
     name
     weekStart
   }
  }
`
