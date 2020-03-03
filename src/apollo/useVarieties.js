import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function useVarieties() {
  const { data: {Varieties} = {}, loading } = useQuery(GET_VARIETIES)
  return {loading, data: Varieties || []}
}

const GET_VARIETIES = gql`
  query Varieties {
    Varieties {
      id
      line
      process
      name
      shape
      color
      breeder
      events
    }
  }
`
