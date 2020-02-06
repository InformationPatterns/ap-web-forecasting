import {useMemo} from 'react'
import State from '../../../states/appState'
import useGreenhouseCrops from '../../../states/useGreenhouseCrops'

export default function useActualBlock(block) {
  const {moment} = State.useContainer()
  , {loading, data} = useGreenhouseCrops(block)
  let finalData = useMemo(() => {
    if (!data) return
    return data.locations.map((crop) => {
      if (!crop.varietyId) return {
        location: crop.location,
        anchor_week_year: 0,
        estimated_harvest_week_year: 0
      }
      let anchorDate = moment(crop.anchorDate.calendar, "YYYY-MM-DD")
      return {
        location: crop.location,
        crop: `${crop.line} - ${crop.name}`,
        anchor_calendar: crop.anchorDate.calendar,
        anchor_week_year: crop.anchorDate.year * 100 + crop.anchorDate.week,
        anchor_year: crop.anchorDate.year,
        anchor_week: crop.anchorDate.week,
        anchor_day: crop.anchorDate.day,
        estimated_harvest_calendar: crop.estimatedHarvestDate.calendar,
        estimated_harvest_week_year: crop.estimatedHarvestDate.year * 100 + crop.estimatedHarvestDate.week,
        estimated_harvest_year: crop.estimatedHarvestDate.year,
        estimated_harvest_week: crop.estimatedHarvestDate.week,
        estimated_harvest_day: crop.estimatedHarvestDate.day,
        age_days: moment().diff(anchorDate, 'days') + 1,
        age_weeks: moment().diff(anchorDate, 'weeks') + 1,
        lot_display: `${crop.lot.year} - ${crop.lot.week}`,
        lot_day: crop.lot.day,
      }
    })
  }, [data])
  return {loading, data: finalData}
}
