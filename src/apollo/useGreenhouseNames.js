import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function useGreenhouseNames() {
  const { data = {}, loading } = useQuery(GET_GREENHOUSE_NAMES)
  return {loading, data: data.GreenhouseNames || []}
}

const GET_GREENHOUSE_NAMES = gql`
  query GreenhouseNames {
    GreenhouseNames {
      id
      name
    }
  }
`
