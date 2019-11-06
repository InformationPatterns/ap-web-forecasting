import State from '/imports/states/appState'

export default function useTime(maxYears = 0) {
  const {moment, group = {createdAt: (new Date()).getTime()}} = State.useContainer()
  const createdDate = moment(group.createdAt, "x")
  , createDateFarmTime = createdDate.getFarmTime()
  , endDate = moment().add(maxYears, "years")
  , endDateFarmTime = endDate.getFarmTime()
  let createDateMaxWeeks = createdDate.weeksInYear()
  , data = {
    years: [createDateFarmTime.year]
    , weeks: {[createDateFarmTime.year]: []}
  }
  if (createDateFarmTime.year == endDateFarmTime.year) {
    let subtraction = createdDate.weeksInYear() - endDateFarmTime.week
    createDateMaxWeeks = createDateMaxWeeks - subtraction
  }
  for (let i = createDateFarmTime.week; i < createDateMaxWeeks + 1; i++) {
    data.weeks[createDateFarmTime.year].push(i)
  }
  data.weeks[createDateFarmTime.year].reverse()
  for (let i = createDateFarmTime.year+1; i <= endDateFarmTime.year; i++) {
    data.years.push(i)
    data.weeks[i] = Array.from({length: moment().year(i).weeksInYear()}, (x,i) => i+1).reverse()
  }
  data.years.reverse()
  return data
}
