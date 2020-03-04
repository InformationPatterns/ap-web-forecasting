import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function useAllGreenhouseVarieties() {
  const { data = {}, loading } = useQuery(GET_GREENHOUSE_VARIETIES)
  return {loading, data: data.AllGreenhouseVarieties || []}
}

const GET_GREENHOUSE_VARIETIES = gql`
  query AllGreenhouseVarieties {
    AllGreenhouseVarieties {
      id
      greenhouse
      locations {
        location
        varietyId
        anchorDate {
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
