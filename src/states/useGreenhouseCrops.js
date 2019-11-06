import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function useGreenhouseCrops(greenhouse) {
  const { data = {}, loading } = useQuery(GET_BLOCK_CROPS, {
    variables: {greenhouse},
    skip: !greenhouse
  })
  return {loading, data: data.GreenhouseCrops}
}

const GET_BLOCK_CROPS = gql`
  query GreenhouseCrops($greenhouse: String!) {
    GreenhouseCrops(greenhouse: $greenhouse) {
      id
      block
      locations {
        location
        cropId
        crop
        variety
        anchorDate {
          year
          week
          day
          calendar
        }
        estimatedHarvestDate {
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
        stages
      }
    }
  }
`
