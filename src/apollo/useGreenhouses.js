import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function useGreenhouses() {
  const { data = {}, loading } = useQuery(GET_GREENHOUSES)
  return {loading, data: data.Greenhouses || []}
}

const GET_GREENHOUSES = gql`
  query Greenhouses {
    Greenhouses {
      id
      type
      name
      bbox
      arcs
      angle
      objects {
        block {
          type
          geometries {
            type
            arcs
            properties {
              display_nave
              display_bed
              display_square
              display_location
              location
              system_nave
              system_bed
              system_square
              area
            }
          }
        }
      }
    }
  }
`
