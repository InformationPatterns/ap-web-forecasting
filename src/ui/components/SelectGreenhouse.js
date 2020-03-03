import React, { useMemo } from 'react'
import useGreenhouseNames from '../../apollo/useGreenhouseNames'
import {Select} from 'ap-web-general'

export default function SelectGreenhouse(props) {
  const { data } = useGreenhouseNames()
  , greenhouses = useMemo(() => data.map(({name: value}) => ({value})), [data])

  return <Select data={greenhouses} {...props} />
}
