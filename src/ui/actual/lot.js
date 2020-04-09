import React, {useState, useEffect} from 'react'
import {UI, ApolloHooks} from 'ap-web-general'
import SelectGreenhouse from '../components/SelectGreenhouse'
import Vega from '../components/Vega'
import useActualGreenhouse from './states/useActualGreenhouse'
const {Select, DataSelectView, CenterView} = UI


export default function ActualBlock() {
  const [block, setBlock] = useState('')
  , ALL_CROPS = 'All Crops'
  , [crop, setCrop] = useState(ALL_CROPS)
  , [cropDisplay, setCropDisplay] = useState('date')
  , {loading: blockLoading, data: blockData} = ApolloHooks.useGreenhouse(block)
  , {loading: planLoading, data} = useActualGreenhouse(block)
  , loading = blockLoading || planLoading || !block
  let schema, crops = [{value: ALL_CROPS}]

  useEffect(() => {
    setCrop(ALL_CROPS)
    setCropDisplay('date')
  }, [block])

  if (blockData && data) schema = getReportType(crop, cropDisplay, blockData, data, ALL_CROPS)
  if (data) {
    data.reduce((memo, {crop}) => {
      if (!crop) return memo
      if (!memo.includes(crop)) memo.push(crop)
      return memo
    }, []).forEach(value => crops.push({value}))
  }
  return (
    <div style={{flex: 1}}>
      <DataSelectView>
        <SelectGreenhouse value={block} onChange={setBlock} />
        <Select data={crops} value={crop} onChange={setCrop} style={{marginLeft: 10, width: 260}}/>
      </DataSelectView>
      <CenterView>
        <Vega schema={schema} loading={loading}/>
      </CenterView>
    </div>
  )
}

function getReportType(crop, cropDisplay, block, data, ALL_CROPS) {
  if (crop === ALL_CROPS) return REPORT_TYPE['report'](block, data)
  let schemaData = data.filter(({crop: c}) => c === crop)
  return REPORT_TYPE['report'](block, schemaData)
}

const REPORT_TYPE = {
  report(block, data) {
    return {
      mark: "geoshape",
      data: {
        format: {feature: "block", type: "topojson"},
        values: block
      },
      projection: {
        rotate: [0, block.angle, 0]
      },
      transform: [
        {
          from: {
            key: 'location',
            fields: ['location', 'lot_display', 'lot_day'],
            data: {values: data}
          },
          lookup: "properties.location"
        }
        , {"calculate": "datum.lot_display || ' n/a'", "as": "lot_display2"}
        , {"calculate": "datum.lot_day || 'n/a'", "as": "lot_day2"}
      ],
      encoding: {
        color: { field: "lot_display2", type: "nominal", title: "Lot" },
        "tooltip": [
          { "field": "properties.display_location", "type": "nominal", title: "Location" },
          { "field": "lot_display2", "type": "nominal", title: "Lot" },
          { "field": "lot_day2", "type": "nominal", title: "Sublot" }
        ]
      },
      width: 400,
      height: 600
    }
  }
}
