import React, {useRef, useEffect} from 'react';
import { Empty } from 'antd';
import {Loading} from 'ap-web-general'

/*global vegaEmbed */
export default function Vega(props) {
  let {loading, schema} = props
  if (loading) return <Loading />
  if (schema) return <VegaDiv {...props} />
  return <Empty />
}


export function VegaDiv(props) {
  const vega = useRef(null)
  , schema = JSON.parse(JSON.stringify(props.schema))
  useEffect(() => {
    vegaEmbed(vega.current, schema)
  }, [props.schema])
  return <div id="vegaRef" ref={vega} />
}
