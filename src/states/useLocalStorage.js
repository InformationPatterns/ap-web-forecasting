import { useState } from 'react';

export default function useLocalStorage(name, defaultValue) {
  let [value, _setValue] = useState(localStorage.getItem(name) || defaultValue)
  const setValue = (newValue) => {
    _setValue(newValue)
    localStorage.setItem(name, newValue)
  }
  return [value, setValue]
}
