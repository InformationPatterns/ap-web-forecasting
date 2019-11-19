import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {GET_USERS_IN_GROUP} from './useUsersInGroup'

export default function useEditUserInGroup() {
  const [mutation, {data: {error} = {}}] = useMutation(EDIT_USERS_IN_GROUP, {
      update(cache, { data: { editUserInGroup } }) {
        let {user, error} = editUserInGroup
        if (error) return
        const { usersInGroup } = cache.readQuery({ query: GET_USERS_IN_GROUP });
        if (usersInGroup.find(({id}) => id === user.id)) return
        cache.writeQuery({
          query: GET_USERS_IN_GROUP,
          data: { usersInGroup: usersInGroup.concat([user]) },
        });
      }
    })
  return [(variables) => mutation({variables}), error]
}

export const EDIT_USERS_IN_GROUP = gql`
  mutation editUserInGroup($name: String!, $email: String!, $language: String!, $roles: [String]!) {
    editUserInGroup(name: $name, email: $email, language: $language, roles: $roles) {
      error
      user {
        id
        name
        email
        roles
        language
      }
    }
  }
`
