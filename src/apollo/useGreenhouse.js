import {useMemo} from 'react'
import useGreenhouses from './useGreenhouses'

export default function useGreenhouse(name) {
  const { data, loading } = useGreenhouses()
  return useMemo(() => {
    return {
      loading,
      data: data.find(({name: n}) => n === name)
    }
  }, [loading, name])
}
