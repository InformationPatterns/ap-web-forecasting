import React, {useState, useEffect} from 'react'
import State from '../../states/appState'
import useGreenhouse from '../../states/useGreenhouse'
import useActualBlock from './states/useActualBlock'
import Vega from '../components/Vega'
import {DataSelectView, CenterView} from '../components/Views'
import Select from '../components/Select'
import SelectBlocks from '../components/SelectBlocks'


export default function ActualBlock() {
  const {t} = State.useContainer()
  , [block, setBlock] = useState('')
  , ALL_CROPS = 'All Crops'
  , [crop, setCrop] = useState(ALL_CROPS)
  , [cropDisplay, setCropDisplay] = useState('date')
  , {loading: blockLoading, data: blockData} = useGreenhouse(block)
  , {loading: planLoading, data} = useActualBlock(block)
  , loading = blockLoading || planLoading || !block
  let schema, crops = [{value: ALL_CROPS}], cropDisplays = [
    {value: "date", label: t`Anchor`},
    {value: "week", label: t`Age - Week`},
    {value: "day", label: t`Age - Day`},
  ];

  useEffect(() => {
    setCrop(ALL_CROPS)
    setCropDisplay('date')
  }, [block])

  if (blockData && data) schema = getReportType(crop, cropDisplay, blockData, data, ALL_CROPS, t)
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
        <SelectBlocks value={block} onChange={setBlock} />
        <Select data={crops} value={crop} onChange={setCrop} style={{marginLeft: 10, width: 260}}/>
        {crop != ALL_CROPS ?
          <Select data={cropDisplays} value={cropDisplay} onChange={setCropDisplay}
            style={{marginLeft: 10, width: 140}}/>
        : null}
      </DataSelectView>
      <CenterView>
        <Vega schema={schema} loading={loading} />
      </CenterView>
    </div>
  )
}

function getReportType(crop, cropDisplay, block, data, ALL_CROPS, t) {
  if (crop == ALL_CROPS) return REPORT_TYPE['allCrops'](block, data, t)
  else {
    let schemaData = data.filter(({crop: c}) => c == crop)
    if (cropDisplay == 'date') return REPORT_TYPE['cropsByDate'](crop, block, schemaData, t)
    if (cropDisplay == 'week') return REPORT_TYPE['cropsByWeek'](crop, block, schemaData, t)
    if (cropDisplay == 'day') return REPORT_TYPE['cropsByDay'](crop, block, schemaData, t)
  }
  return undefined
}

const REPORT_TYPE = {
  allCrops(block, data, t) {
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
            fields: ['location', 'crop', 'lot_display', 'lot_day'],
            data: {values: data}
          },
          lookup: "properties.location"
        }
        , {"calculate": "datum.lot_display || 'n/a'", "as": "lot_display2"}
        , {"calculate": "datum.lot_day || 'n/a'", "as": "lot_day2"}
        , {"calculate": "datum.crop || ' n/a'", "as": "crop2"}
      ],
      encoding: {
        color: { field: "crop2", type: "nominal", title: t`Crop` },
        "tooltip": [
          { "field": "properties.display_location", "type": "nominal", title: t`Location` },
          { "field": "lot_display2", "type": "nominal", title: t`Lot` },
          { "field": "lot_day2", "type": "nominal", title: t`Sublot` }
        ]
      },
      width: 400,
      height: 600
    }
  },
  cropsByDate(crop, block, data, t) {
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
            fields: ['location','anchor_calendar', 'lot_display', 'lot_day'],
            data: {values: data}
          },
          lookup: "properties.location"
        }
        , {"calculate": "datum.lot_display || 'n/a'", "as": "lot_display2"}
        , {"calculate": "datum.lot_day || 'n/a'", "as": "lot_day2"}
        , {"calculate": "datum.anchor_calendar || ' n/a'", "as": "anchor_calendar2"}
      ],
      encoding: {
        color: { field: "anchor_calendar2", type: "nominal", title: t`Date` },
        "tooltip": [
          { "field": "properties.display_location", "type": "nominal", title: t`Location` },
          { "field": "anchor_calendar2", "type": "nominal", title: t`Date` },
          { "field": "lot_display2", "type": "nominal", title: t`Lot` },
          { "field": "lot_day2", "type": "nominal", title: t`Sublot` }
        ]
      },
      width: 400,
      height: 600
    }
  },
  cropsByWeek(crop, block, data, t) {
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
            fields: ['location','age_weeks', 'lot_display', 'lot_day'],
            data: {values: data}
          },
          lookup: "properties.location"
        }
        , {"calculate": "datum.lot_display || 'n/a'", "as": "lot_display2"}
        , {"calculate": "datum.lot_day || 'n/a'", "as": "lot_day2"}
        , {"calculate": "datum.age_weeks || ' n/a'", "as": "age_weeks2"}
      ],
      encoding: {
        color: { field: "age_weeks2", type: "nominal", title: t`Weeks` },
        "tooltip": [
          { "field": "properties.display_location", "type": "nominal", title: t`Location` },
          { "field": "age_weeks2", "type": "nominal", title: t`Week` },
          { "field": "lot_display2", "type": "nominal", title: t`Lot` },
          { "field": "lot_day2", "type": "nominal", title: t`Sublot` }
        ]
      },
      width: 400,
      height: 600
    }
  },
  cropsByDay(crop, block, data, t) {
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
            fields: ['location','age_days', 'lot_display', 'lot_day'],
            data: {values: data}
          },
          lookup: "properties.location"
        }
        , {"calculate": "datum.lot_display || 'n/a'", "as": "lot_display2"}
        , {"calculate": "datum.lot_day || 'n/a'", "as": "lot_day2"}
        , {"calculate": "datum.age_days || ' n/a'", "as": "age_days2"}
      ],
      encoding: {
        color: { field: "age_days2", type: "nominal", title: t`Days` },
        "tooltip": [
          { "field": "properties.display_location", "type": "nominal", title: t`Location` },
          { "field": "age_days2", "type": "nominal", title: t`Day` },
          { "field": "lot_display2", "type": "nominal", title: t`Lot` },
          { "field": "lot_day2", "type": "nominal", title: t`Sublot` }
        ]
      },
      width: 400,
      height: 600
    }
  },
}
