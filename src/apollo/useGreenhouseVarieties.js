import { useMemo } from 'react'
import useGreenhouseVarietiesAll from './useGreenhouseVarietiesAll'

export default function useGreenhouseVarieties(greenhouse) {
  const { data, loading } = useGreenhouseVarietiesAll()
  return useMemo(() => {
    return {
      loading,
      data: data.find(({greenhouse: g}) => g === greenhouse)
    }
  }, [loading, greenhouse])
}
