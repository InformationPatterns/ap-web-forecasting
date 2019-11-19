import { useState, useEffect } from 'react';
import { createContainer } from "unstated-next"
import { gql } from 'apollo-boost';
import { useApolloClient } from '@apollo/react-hooks';
import useLocalStorage from './useLocalStorage';
import {navigate} from 'hookrouter';
import useMoment from './moment'
import sha256 from 'sha256'

import enT9n from './t9n/en.json'
import esT9n from './t9n/es.json'

function useAppState() {
  const [groupId, _setGroupId] = useLocalStorage('groupid')
  , [userId, setUserId] = useLocalStorage('authorizationid')
  , [language, setLanguage] = useLocalStorage('language'
    , (navigator.language || navigator.userLanguage).split('-')[0])
  , [username, setUsername] = useLocalStorage('username')
  , [userRoles, setUserRoles] = useLocalStorage('user_roles', [])
  , [group, setGroup] = useState()
  , [loading, setLoading] = useState(false)
  , client = useApolloClient()
  , moment = useMoment(language, group)
  , t9nFile = translationFiles[language]
  useEffect(() => {
    setLoading(true)
    client.query({
      query: gql`
        query GetAuth {
          user: me {
            id
            language
            name
            roles
          }
          group: currentGroup {
            id
            weekStart
          }
        }
      `
    })
    .then(({data: {user, group}}) => {
      if (user) {
        setUserId(user.id)
        setLanguage(user.language)
        setUsername(user.name)
        setUserRoles(user.roles)
      }
      if (group) setGroup(group)
      setLoading(false)
    }).catch(e => {
      console.warn(e);
    })
  }, [])
  const setGroupId = (group) => {
    _setGroupId(group.id)
    setGroup(group)
  }
  const signIn = async (email, password) => {
    let passhex = sha256(password);
    let {data: {login: {error, user}}} = await client.mutate({mutation: gql`
      mutation login($email: String!, $passhex: String!) {
        login(email: $email, passhex: $passhex) {
          error
          user {
            id
            language
            name
            roles
          }
        }
      }
    `, variables: {email, passhex}})
    if (error) return error
    if (user) {
      localStorage.setItem("authorizationhex", passhex)
      setUserId(user.id)
      setLanguage(user.language)
      setUsername(user.name)
      setUserRoles(user.roles)
    }
  }
  const resetPassword = async (email) => {
    let {data: {resetPassword}} = await client.mutate({mutation: gql`
      mutation resetPassword($email: String!) {
        resetPassword(email: $email)
      }
    `, variables: {email}})
    return resetPassword
  }
  const setPassword = async (password, token) => {
    let passhex = sha256(password);
    let {data: {setPassword: {error, user}}} = await client.mutate({mutation: gql`
      mutation setPassword($passhex: String!, $token: String!) {
        setPassword(passhex: $passhex, token: $token) {
          error
          user {
            id
            name
            language
          }
        }
      }
    `, variables: {passhex, token}})
    if (error) return error
    if (user) {
      localStorage.setItem("authorizationhex", passhex)
      setUserId(user.id)
      setLanguage(user.language)
      setUsername(user.name)
      setUserRoles(user.roles)
    }
    navigate('/')
  }
  const signOut = () => {
    setLoading(true)
    localStorage.clear()
    client.resetStore()
    _setGroupId()
    setUserId()
    setUsername()
    setUserRoles([])
    setLoading(false)
  }

  const t = (strings, ...values) => {
    let str = '';
     strings.forEach((string, i) => {
       let t9n;
       if (t9nFile) {
         if (!t9nFile[string]) {/**/}//console.warn(`Missing T9n (${language}): ${string}`);
         else t9n = t9nFile[string]
       }
       str += (t9n || string) + (values[i] || '');
     });
     return str;
  }
  const td = (string) => {
    if (t9nFile) {
      if (!t9nFile[string]) {
        // console.warn(`Missing T9n (${language}): ${string}`);
        return string
      } else return t9nFile[string]
    }
  }

  return {
    actions: {signIn, resetPassword, setPassword, signOut, setGroupId}
    ,loading, setLoading
    , groupId, group, username, userRoles
    , userId, moment, language, t, td
  }
}
const translationFiles = {
  en: enT9n,
  es: esT9n
}

export default createContainer(useAppState);
