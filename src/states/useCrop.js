import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {FullCrop} from '/imports/api/apollo/crops/fragments'

export default function useCrop(cropId) {
  const { data: {Crop} = {}, loading } = useQuery(GET_CROP, {
    variables: {cropId}, skip: !cropId
  })
  return {Crop, loading}
}

const GET_CROP = gql`
  query Crop($cropId: ID!) {
    Crop(cropId: $cropId) { ...FullCrop }
  }, ${FullCrop}
`
