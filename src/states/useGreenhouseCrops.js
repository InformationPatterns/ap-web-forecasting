import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function useGreenhouseCrops(greenhouse) {
  const { data = {}, loading } = useQuery(GET_BLOCK_CROPS, {
    variables: {greenhouse},
    skip: !greenhouse
  })
  return {loading, data: data.GreenhouseVarieties}
}

const GET_BLOCK_CROPS = gql`
  query GreenhouseVarieties($greenhouse: String!) {
    GreenhouseVarieties(greenhouse: $greenhouse) {
      id
      greenhouse
      locations {
        location
        varietyId
        line
        name
        anchorDate {
          calendar
          year
          week
          day
        }
        estimatedHarvestDate {
          calendar
          year
          week
          day
        }
        lot {
          calendar
          year
          week
          day
        }
        events
      }
    }
  }
`
