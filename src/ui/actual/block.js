import React, {useState, useEffect} from 'react'
import {AppState, UI, ApolloHooks} from 'ap-web-general'
import SelectGreenhouse from '../components/SelectGreenhouse'
import Vega from '../components/Vega'
import useActualGreenhouse from './states/useActualGreenhouse'
const {Select, DataSelectView, CenterView} = UI

export default function ActualBlock() {
  const {t} = AppState.useContainer()
  , [greenhouse, setGreenhouse] = useState('')
  , ALL_VARIETIES = 'All Varieties'
  , [variety, setVariety] = useState(ALL_VARIETIES)
  , [cropDisplay, setCropDisplay] = useState('date')
  , {loading: blockLoading, data: blockData} = ApolloHooks.useGreenhouse(greenhouse)
  , {loading: planLoading, data} = useActualGreenhouse(greenhouse)
  , loading = blockLoading || planLoading || !greenhouse
  let schema, crops = [{value: ALL_VARIETIES}], cropDisplays = [
    {value: "date", label: t`Anchor`},
    {value: "week", label: t`Age - Week`},
    {value: "day", label: t`Age - Day`},
  ];
  useEffect(() => {
    setVariety(ALL_VARIETIES)
    setCropDisplay('date')
  }, [greenhouse])

  if (blockData && data) schema = getReportType(variety, cropDisplay, blockData, data, ALL_VARIETIES, t)
  if (data) {
    data.reduce((memo, {variety}) => {
      if (!variety) return memo
      if (!memo.includes(variety)) memo.push(variety)
      return memo
    }, []).forEach(value => crops.push({value}))
  }
  return (
    <div style={{flex: 1}}>
      <DataSelectView>
        <SelectGreenhouse value={greenhouse} onChange={setGreenhouse} />
        <Select data={crops} value={variety} onChange={setVariety} style={{marginLeft: 10, width: 260}}/>
        {variety !== ALL_VARIETIES ?
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

function getReportType(variety, cropDisplay, block, data, ALL_CROPS, t) {
  if (variety === ALL_CROPS) return REPORT_TYPE['allCrops'](block, data, t)
  else {
    let schemaData = data.filter(({variety: v}) => v === variety)
    if (cropDisplay === 'date') return REPORT_TYPE['cropsByDate'](variety, block, schemaData, t)
    if (cropDisplay === 'week') return REPORT_TYPE['cropsByWeek'](variety, block, schemaData, t)
    if (cropDisplay === 'day') return REPORT_TYPE['cropsByDay'](variety, block, schemaData, t)
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
            fields: ['location', 'variety', 'lot_display', 'lot_day'],
            data: {values: data}
          },
          lookup: "properties.location"
        }
        , {"calculate": "datum.lot_display || 'n/a'", "as": "lot_display2"}
        , {"calculate": "datum.lot_day || 'n/a'", "as": "lot_day2"}
        , {"calculate": "datum.variety || ' n/a'", "as": "variety2"}
      ],
      encoding: {
        color: { field: "variety2", type: "nominal", title: t`Variety` },
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
