import React from 'react'
import { Select as AntSelect } from 'antd';

function Select(props, ref) {
  const {onChange, value, data, style = {}, ...otherProps} = props
  let defaultValue;
  if (value) defaultValue = value
  return(
    <AntSelect ref={ref} defaultValue={defaultValue} value={value}
      onChange={(value) => onChange(value)} {...otherProps}
      style={{ width: 120, ...style }}>
      {data.map(({value, label}) => (
        <AntSelect.Option key={value} value={value}>
          {label || value}
        </AntSelect.Option>
      ))}
    </AntSelect>
  )
}

export default React.forwardRef(Select)
