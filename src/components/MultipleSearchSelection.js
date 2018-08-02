import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const selected = null;

const MultipleSearchSelection = ({traineeFilter, onChangeFilter}) => (
  <Dropdown placeholder='이름' fluid multiple search selection selected={selected} onClick={onChangeFilter} options={traineeFilter}  />
)

export default MultipleSearchSelection