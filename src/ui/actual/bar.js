import React, {useState, useEffect} from 'react'
import {UI} from 'ap-web-general'
import SelectGreenhouse from '../components/SelectGreenhouse'
import Vega from '../components/Vega'
import useActualGreenhouse from './states/useActualGreenhouse'
const {Select, DataSelectView, CenterView} = UI

export default function ActualBlock() {
  const [greenhouse, setGreenhouse] = useState('')
    , [variety, setVariety] = useState('')
    , [crops, setCrops] = useState([])
    , [cropDisplay, setCropDisplay] = useState('anchor-week')
    , {loading, data} = useActualGreenhouse(greenhouse)
  let schema, cropDisplays = [
    {value: "anchor-week", label: "Anchor Week"},
    {value: "anchor-day", label: "Anchor Day"},
    {value: "harvest-week", label: "Estimated Harvest Week"},
    {value: "harvest-day", label: "Estimated Harvest Day"},
  ];

  useEffect(() => {
    setCropDisplay('anchor-week')
  }, [greenhouse])

  useEffect(() => {
    let _varieties = []
    if (data) _varieties = data.reduce((memo, {variety}) => {
      if (!variety) return memo
      if (!memo.includes(variety)) memo.push(variety)
      return memo
    }, []).map(value => ({value}))
    setCrops(_varieties)
    if (_varieties[0]) setVariety(_varieties[0].value)
  }, [data])
  if (data) schema = getReportType(cropDisplay, variety, data)

  return (
    <div style={{flex: 1}}>
      <DataSelectView>
        <SelectGreenhouse value={greenhouse} onChange={setGreenhouse} />
        <Select data={crops} value={variety} onChange={setVariety}
          style={{marginLeft: 10, width: 260}}/>
        <Select data={cropDisplays} value={cropDisplay} onChange={setCropDisplay}
          style={{marginLeft: 10, width: 200}}/>
      </DataSelectView>
      <CenterView>
        <Vega schema={schema} loading={loading || !greenhouse}/>
      </CenterView>
    </div>
  )
}

function getReportType(cropDisplay, variety,  data) {
  if (!variety || !data) return
  const schemaData = data.filter(({variety: v}) => v === variety)
  if (!schemaData.length) return
  if (cropDisplay === 'anchor-week') return REPORT_TYPE['cropsByWeekAnchor'](schemaData)
  if (cropDisplay === 'anchor-day') return REPORT_TYPE['cropsByDayAnchor'](schemaData)
  if (cropDisplay === 'harvest-week') return REPORT_TYPE['cropsByWeekHarvest'](schemaData)
  if (cropDisplay === 'harvest-day') return REPORT_TYPE['cropsByDayHarvest'](schemaData)
  return
}

const REPORT_TYPE = {
  cropsByWeekAnchor(data) {
    let min = Infinity, max = 0, inRange = [];
    data.forEach(row => {
      if (!row.varieties) return
      if (row.anchor_week_year < min) min = row.anchor_week_year
      if (row.anchor_week_year > max) max = row.anchor_week_year
      if (!inRange.includes(row.anchor_week_year)) inRange.push(row.anchor_week_year)
    })
    let values = [...data]
      , range = Array.from({length: max-min+1}, (v, k) => k+min)
    range.forEach(r => {
      if (!inRange.includes(r)) {
        values.push({
          anchor_week_year: r
        })
      }
    })
    return {
      mark: "bar",
      data: {values},
      transform: [
        {"calculate": "datum.lot_display || 'n/a'", "as": "lot_display2"}
        , {"calculate": "datum.lot_day || 'n/a'", "as": "lot_day2"}
        , {"calculate": "datum.anchor_day || ' n/a'", "as": "anchor_day2"}
        , {"calculate": "datum.anchor_week || ' n/a'", "as": "anchor_week2"}
      ],
      encoding: {
        color: {
          field: "anchor_day2"
          , type: "nominal"
          , legend: { orient: 'bottom', title: "Day" }
        },
        x: {
          field: "anchor_week_year"
          , type: "nominal"
          , title: "Week"
          , "scale": {"nice": 1}
          , axis: {
            labelAngle: -90 ,
            values: range,
            "labelExpr": "substring(datum.value, 0, 4)+' - '+substring(datum.value, 4, 6)"
          }
        },
        y: {
          type: "quantitative"
          , aggregate: "count"
          , title: "Squares"
        },
        "tooltip": [
          { "field": "lot_display2", "type": "nominal", title: "Lot" },
          { "field": "lot_day2", "type": "nominal", title: "Sublot" }
        ]
      },
      width: 800,
      height: 400
    }
  },
  cropsByDayAnchor(data) {
    return {
      mark: "bar",
      data: {
        values: data,
        "format": {
          "parse": {"anchor_calendar": "date:'%Y-%m-%d'"}
        }
      },
      transform: [
        {"calculate": "datum.lot_display || 'n/a'", "as": "lot_display2"}
        , {"calculate": "datum.lot_day || 'n/a'", "as": "lot_day2"}
        , {"calculate": "datum.anchor_day || ' n/a'", "as": "anchor_day2"}
        , {"calculate": "datum.anchor_calendar || ' n/a'", "as": "anchor_calendar2"}
      ],
      encoding: {
        color: {
          field: "anchor_day2"
          , type: "nominal"
          , legend: { orient: 'bottom', title: "Day" }
        },
        x: {
          field: "anchor_calendar"
          , type: "temporal"
          , axis: { labelAngle: -90, "format": "%x" }
          , title: "Date"
        },
        y: {
          type: "quantitative"
          , aggregate: "count"
          , title: "Squares"
        },
        "tooltip": [
          { "field": "lot_display2", "type": "nominal", title: "Lot" },
          { "field": "lot_day2", "type": "nominal", title: "Sublot" }
        ]
      },
      width: 800,
      height: 400
    }
  },
  cropsByWeekHarvest(data) {
    let min = Infinity, max = 0, inRange = [];
    data.forEach(row => {
      if (!row.varieties) return
      if (row.estimated_harvest_week_year < min) min = row.estimated_harvest_week_year
      if (row.estimated_harvest_week_year > max) max = row.estimated_harvest_week_year
      if (!inRange.includes(row.estimated_harvest_week_year)) inRange.push(row.estimated_harvest_week_year)
    })
    let values = [...data]
      , range = Array.from({length: max-min+1}, (v, k) => k+min)
    range.forEach(r => {
      if (!inRange.includes(r)) {
        values.push({
          estimated_harvest_week_year: r
        })
      }
    })
    return {
      mark: "bar",
      data: {values},
      transform: [
        {"calculate": "datum.lot_display || 'n/a'", "as": "lot_display2"}
        , {"calculate": "datum.lot_day || 'n/a'", "as": "lot_day2"}
        , {"calculate": "datum.estimated_harvest_day || ' n/a'", "as": "harvest_day"}
        , {"calculate": "datum.estimated_harvest_week || ' n/a'", "as": "harvest_week"}
      ],
      encoding: {
        color: {
          field: "harvest_day"
          , type: "nominal"
          , legend: { orient: 'bottom', title: "Day" }
        },
        x: {
          field: "estimated_harvest_week_year"
          , type: "nominal"
          , title: "Week"
          , "scale": {"nice": 1}
          , axis: {
            labelAngle: -90 ,
            values: range,
            "labelExpr": "substring(datum.value, 0, 4)+' - '+substring(datum.value, 4, 6)"
          }
        },
        y: {
          type: "quantitative"
          , aggregate: "count"
          , title: "Squares"
        },
        "tooltip": [
          { "field": "lot_display2", "type": "nominal", title: "Lot" },
          { "field": "lot_day2", "type": "nominal", title: "Sublot" }
        ]
      },
      width: 800,
      height: 400
    }
  },
  cropsByDayHarvest(data) {
    return {
      mark: "bar",
      data: {
        values: data,
        "format": {
          "parse": {"estimated_harvest_calendar": "date:'%Y-%m-%d'"}
        }
      },
      transform: [
        {"calculate": "datum.lot_display || 'n/a'", "as": "lot_display2"}
        , {"calculate": "datum.lot_day || 'n/a'", "as": "lot_day2"}
        , {"calculate": "datum.estimated_harvest_day || ' n/a'", "as": "harvest_day"}
      ],
      encoding: {
        color: {
          field: "harvest_day"
          , type: "nominal"
          , legend: { orient: 'bottom', title: "Day" }
        },
        x: {
          field: "estimated_harvest_calendar"
          , type: "temporal"
          , axis: { labelAngle: -90, "format": "%x" }
          , title: "Date"
        },
        y: {
          type: "quantitative"
          , aggregate: "count"
          , title: "Squares"
        },
        "tooltip": [
          { "field": "lot_display2", "type": "nominal", title: "Lot" },
          { "field": "lot_day2", "type": "nominal", title: "Sublot" }
        ]
      },
      width: 800,
      height: 400
    }
  },
}
