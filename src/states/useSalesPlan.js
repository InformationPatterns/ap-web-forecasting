import {useMemo} from 'react'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {FullSalesPlan} from '/imports/api/apollo/salesPlan/fragments'
import State from '/imports/states/appState'

export default function useSalesPlan(cropId, year, week) {
  const {moment} = State.useContainer()
  const { loading, data = {Plan: {crops: []}} } = useQuery(GET_SALES_PLAN, {
    variables: {year, week},
    skip: !year || !week
  })
  return {
    loading: loading || !cropId,
    data: useMemo(() => {
      let rawPlan = data.Plan.crops.find(({cropId: c}) => c == cropId)
      , plan;
      if (rawPlan) {
        plan = {...rawPlan, id: data.Plan.id+cropId}
        plan.days = rawPlan.days.map(day => {
          return {
            date: moment(day.date, 'x').format('YYYY-MM-DD'),
            percentage: day.percentage
          }
        })
      } else{
        plan = {
          id: 'empty'+cropId,
          cropId,
          boxes: 0,
          days: []
        }
        let lotWeek = moment()
        lotWeek.isoWeekYear(year)
        lotWeek.week(week)
        lotWeek.startOf('week')
        lotWeek.subtract(1, 'day')
        for (let i = 1; i < 8; i++) {
          lotWeek.add(1, 'day')
          plan.days.push({
            date: lotWeek.format('YYYY-MM-DD'),
            percentage: 0
          })
        }
      }
      return plan
    }, [data.Plan.id, cropId, year, week])
  }
}

const GET_SALES_PLAN = gql`
  query SalesPlan($year: Int!, $week: Int!) {
    Plan: SalesPlan(year: $year, week: $week) { ...FullSalesPlan }
  }, ${FullSalesPlan}
`
