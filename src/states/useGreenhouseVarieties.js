import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function useGreenhouseVarieties(greenhouse) {
  const { data = {}, loading } = useQuery(GET_BLOCK_VARIETIES, {
    variables: {greenhouse},
    skip: !greenhouse
  })
  return {loading, data: data.GreenhouseVarieties}
}

const GET_BLOCK_VARIETIES = gql`
  query GreenhouseVarieties($greenhouse: String!) {
    GreenhouseVarieties(greenhouse: $greenhouse) {
      id
      greenhouse
      locations {
        location
        varietyId
        anchorDate {
          year
          week
          day
          calendar
        }
        lot {
          year
          week
          day
          calendar
        }
        events
      }
    }
  }
`
