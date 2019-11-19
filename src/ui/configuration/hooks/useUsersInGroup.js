import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function useUsersInGroup() {
  const { data = {}, loading } = useQuery(GET_USERS_IN_GROUP)
  return {loading, data: data.usersInGroup}
}

export const GET_USERS_IN_GROUP = gql`
  query usersInGroup {
    usersInGroup {
      id,
      name
      email
      roles
      language
    }
  }
`
