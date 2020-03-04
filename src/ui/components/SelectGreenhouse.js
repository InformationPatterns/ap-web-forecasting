import React, { useMemo } from 'react'
import {UI, ApolloHooks} from 'ap-web-general'

export default function SelectGreenhouse(props) {
  const { data } = ApolloHooks.useGreenhouseNames()
  , greenhouses = useMemo(() => data.map(({name: value}) => ({value})), [data])

  return <UI.Select data={greenhouses} {...props} />
}
