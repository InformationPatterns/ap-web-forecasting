import {useMemo} from 'react'
import {AppState, ApolloHooks} from 'ap-web-general'

export default function useActualGreenhouse(greenhouse) {
  const {moment} = AppState.useContainer()
  , {loading: loadingGV, data} = ApolloHooks.useGreenhouseVarieties(greenhouse)
  , {loading: loadingV, data: varieties} = ApolloHooks.useVarieties()
  , loading = loadingV && loadingGV
  let finalData = useMemo(() => {
    if (!data) return
    const varietiesHash = varieties.reduce((memo, i) => {
      memo[i.id] = i
      return memo
    }, {})
    return data.locations.map((square) => {
      if (!square.varietyId) return {
        location: square.location,
        anchor_week_year: 0,
        estimated_harvest_week_year: 0
      }
      let anchorDateMoment = moment(square.anchorDate.calendar, "YYYY-MM-DD")
      return {
        location: square.location,
        varietyId: square.varietyId,
        variety: `${varietiesHash[square.varietyId].line} - ${varietiesHash[square.varietyId].name}`,
        anchor_calendar: square.anchorDate.calendar,
        anchor_week_year: square.anchorDate.year * 100 + square.anchorDate.week,
        anchor_year: square.anchorDate.year,
        anchor_week: square.anchorDate.week,
        anchor_day: square.anchorDate.day,
        // estimated_harvest_calendar: square.estimatedHarvestDate.calendar,
        // estimated_harvest_week_year: square.estimatedHarvestDate.year * 100 + square.estimatedHarvestDate.week,
        // estimated_harvest_year: square.estimatedHarvestDate.year,
        // estimated_harvest_week: square.estimatedHarvestDate.week,
        // estimated_harvest_day: square.estimatedHarvestDate.day,
        age_days: moment().diff(anchorDateMoment, 'days') + 1,
        age_weeks: moment().diff(anchorDateMoment, 'weeks') + 1,
        // lot_display: `${square.lot.year} - ${square.lot.week}`,
        // lot_day: square.lot.day,
      }
    })
  }, [loadingV, loadingGV, greenhouse])
  return {loading, data: finalData}
}
