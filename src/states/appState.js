import { useState, useEffect } from 'react';
import { createContainer } from "unstated-next"
import { gql } from 'apollo-boost';
import { useApolloClient } from '@apollo/react-hooks';
import useMoment from './moment'
import sha256 from 'sha256'

import enT9n from './t9n/en.json'
import esT9n from './t9n/es.json'

function useAppState() {
  const [groupId, _setGroupId] = useState(localStorage.getItem('groupid'))
  , [userId, setUserId] = useState(localStorage.getItem('authorizationid'))
  , [group, setGroup] = useState()
  , [loading, setLoading] = useState(false)
  , [language, setLanguage] = useState((navigator.language || navigator.userLanguage).split('-')[0])
  , client = useApolloClient()
  , moment = useMoment(language, group)

  useEffect(() => {
    setLoading(true)
    client.query({
      query: gql`
        query GetAuth {
          user: me {
            id
            language
          }
          group: currentGroup {
            id
            weekStart
          }
        }
      `
    })
    .then(({data}) => {
      if (data.user) setLanguage(data.user.language)
      setGroup(data.group)
      setLoading(false)
    }).catch(e => {
      console.warn(e);
    })
  }, []) // eslint-disable-next-line


  const setGroupId = (group) => {
    localStorage.setItem("groupid", group.id)
    _setGroupId(group.id)
    setGroup(group)
  }
  const signIn = (email, password) => {
    let passhex = sha256(password);
    setLoading(true);
    client.mutate(
      {mutation: gql`
      mutation login($email: String!, $passhex: String!) {
        login(email: $email, passhex:$passhex) {
          id
          language
        }
      }
      `, variables: {email, passhex}}).then(({data: {login}}) => {
      if (login) {
        localStorage.setItem("authorizationid", login.id)
        localStorage.setItem("authorizationhex", passhex)
        setLanguage(login.language)
        setUserId(login.id)
      }
      setLoading(false)
    }).catch((e) => {
      console.warn(e);
      setLoading(false)
    })
  }
  const signOut = () => {
    setLoading(true)
    localStorage.clear()
    client.resetStore()
    _setGroupId()
    setUserId()
    setLoading(false)
  }

  useEffect(() => {
    if (!useAppState.translationFiles[language]) return
    useAppState.translations = useAppState.translationFiles[language]
  }, [language])

  const t = (strings, ...values) => {
    let str = '';
     strings.forEach((string, i) => {
       let t9n;
       if (useAppState.translations) {
         if (!useAppState.translations[string]) console.warn(`Missing T9n (${language}): ${string}`);
         else t9n = useAppState.translations[string]
       }
       str += (t9n || string) + (values[i] || '');
     });
     return str;
  }

  return {
    actions: {signIn, signOut, setGroupId}
    ,loading, setLoading
    , groupId, group
    , userId, moment, language, t
  }
}
useAppState.translationFiles = {
  en: enT9n,
  es: esT9n
}

export default createContainer(useAppState);
