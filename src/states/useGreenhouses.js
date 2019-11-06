import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {FullGreenhouse} from '/imports/api/apollo/greenhouses/fragments'

export default function useGreenhouse() {
  const { data = {}, loading } = useQuery(GET_BLOCK)
  return {loading, data: data.Greenhouses}
}

const GET_BLOCK = gql`
  query ProductionPlan {
    Greenhouses {
      ...FullGreenhouse
    }
  }, ${FullGreenhouse}
`
