import React from 'react'
import { TreeSelect as ANT_TreeSelect } from 'antd';

function TreeSelect(props, ref) {
  const {onChange, value, data = [], style = {}, ...otherProps} = props
  let defaultValue;
  if (value) defaultValue = value
  let treeData = data.map(({value, label}) => {
    return {
      title: label || value,
      key: value,
      value
    }
  })
  return (
    <ANT_TreeSelect
      ref={ref}
      treeCheckable={true}
      defaultValue={defaultValue}
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      allowClear
      treeDefaultExpandAll
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
      maxTagCount={4}
      onChange={(value) => onChange(value)}
      {...otherProps}
      sytle={{width: 120, ...style}}
      treeData={treeData}
    />
  );
}

export default React.forwardRef(TreeSelect)
