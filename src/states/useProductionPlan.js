import {useMemo} from 'react'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {FullProductionPlan} from '/imports/api/apollo/productionPlan/fragments'
import State from '/imports/states/appState'

export default function useProductionPlan(props) {
  const {lot, type} = props
  , {moment} = State.useContainer()
  , { data: {Plan = []} = {}, loading } = useQuery(GET_PRODUCTION_PLAN, {
    variables: {lot, type},
    skip: !lot.year || !lot.week || !type
  })
  , data = useMemo(() => {
    let data = []
    for (let point of Plan) {
      let newPoint = {...point}
      let date = moment(point.date, 'YYYY-MM-DD')
      newPoint.date = date.format('l')
      newPoint.day = date.format('dddd')
      data.push(newPoint)
    }
    return data.sort((a,b) => {
      if (a.date > b.date) return 1
      if (a.date < b.date) return -1
    })
  }, [loading, lot, type])

  return {loading, data}
}

const GET_PRODUCTION_PLAN = gql`
  query ProductionPlan($lot: FarmDate!, $type: String!) {
    Plan: ProductionPlan(lot: $lot, type: $type) {
      ...FullProductionPlan
    }
  }, ${FullProductionPlan}
`
