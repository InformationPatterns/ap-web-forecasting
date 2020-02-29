import { useState, useEffect } from 'react';
import { createContainer } from "unstated-next"
import { gql } from 'apollo-boost';
import { useApolloClient } from '@apollo/react-hooks';
import {navigate} from 'hookrouter';
import useMoment from './moment'
import sha256 from 'sha256'
import { useCookies } from 'react-cookie';

import enT9n from './t9n/en.json'
import esT9n from './t9n/es.json'

/*global process*/
let COOKIE_OPTIONS, COOKIE_NAME = 'local';
if (process.env.REACT_APP_NODE_DEV) {
  COOKIE_OPTIONS = { path: '/', expires: new Date('Tue, 19 Jan 2038 03:14:07 UTC') }
} else if (process.env.REACT_APP_NODE_ENV === "production") {
  COOKIE_NAME = 'production'
  COOKIE_OPTIONS = { path: '/' , domain: '.agropatterns.com' , secure: true, expires: new Date('Tue, 19 Jan 2038 03:14:07 UTC') }
} else if (process.env.REACT_APP_NODE_ENV === "staging") {
  COOKIE_NAME = 'staging'
  COOKIE_OPTIONS = { path: '/', domain: '.agropatterns.com', secure: true, expires: new Date('Tue, 19 Jan 2038 03:14:07 UTC') }
}

function useAppState() {
  const [cookies, setCookie, removeCookie] = useCookies([COOKIE_NAME])
  , {userId, passhex, groupId, username, roles: userRoles = []
    , language = (navigator.language || navigator.userLanguage).split('-')[0] } = cookies[COOKIE_NAME] || {}
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
        setCookie(COOKIE_NAME, {
          groupId, passhex,
          userId: user.id,
          language: user.language,
          username: user.name,
          roles: user.roles
        }, COOKIE_OPTIONS)
      }
      if (group) setGroup(group)
      setLoading(false)
    }).catch(e => {
      console.warn(e);
    })
  }, [])
  const setGroupId = (group) => {
    setCookie(COOKIE_NAME, {
      groupId: group.id
      , passhex, userId, language
      , username , roles: userRoles
    }, COOKIE_OPTIONS)
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
      setCookie(COOKIE_NAME, {
        passhex,
        userId: user.id,
        language: user.language,
        username: user.name,
        roles: user.roles
      }, COOKIE_OPTIONS)
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
      setCookie(COOKIE_NAME, {
        passhex,
        userId: user.id,
        language: user.language,
        username: user.name,
        roles: user.roles
      }, COOKIE_OPTIONS)
    }
    navigate('/')
  }
  const signOut = () => {
    setLoading(true)
    localStorage.clear()
    client.resetStore()
    removeCookie(COOKIE_NAME, COOKIE_OPTIONS)
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
