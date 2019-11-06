import State from '/imports/states/appState'

export default function useDaysOfWeek(year, week) {
  const {moment} = State.useContainer()
  let date = moment()
  if (year) date.isoWeekYear(year)
  if (week) date.week(week)
  date.startOf('week')
  date.subtract(1, 'days')
  let days = []
  for (let i = 1; i < 8; i++) {
    date.add(1, 'days')
    days.push({
      value: date.format('YYYY-MM-DD'),
      label: date.format('dddd'),
      moment: moment(date)
    })
  }
  return days
}
