import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Select from './Select'

export default function SelectBlocks(props) {
  const { data = {Names: []} } = useQuery(GET_GREENHOUSE_NAMES)
  let blocks = []
  if (data.Names) {
    blocks = data.Names.map(({name}) => ({value: name}))
    if (blocks.length && !props.value) props.onChange(blocks[0].value)
  }
  return <Select data={blocks} {...props} />
}

const GET_GREENHOUSE_NAMES = gql`
  query GreenhouseNames {
    Names: GreenhouseNames {
      id
      name
    }
  }
`
