import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function useGreenhouse(name) {
  const { data = {}, loading } = useQuery(GET_BLOCK, {
    variables: {name},
    skip: !name
  })

  return {loading, data: data.Greenhouse}
}

const GET_BLOCK = gql`
  query Greenhouse($name: String!) {
    Greenhouse(name: $name) {
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
