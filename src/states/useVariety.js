import {useMemo} from 'react'
import useVarieties from './useVarieties'

export default function useVariety(varietyId) {
  let {data, loading} = useVarieties()
  return useMemo(() => {
    if (loading) return
    return data.find(({_id}) => _id === varietyId)
  }, [loading, varietyId])
}
