import React from 'react';
import { Progress } from 'semantic-ui-react';
import ProgressOuterValue from './ProgressOuterValue';

const ProgressBar = ({
  value,
  max,
  indicating
}) => {
  if (value / max > 0.23) {
    return (
      <div>
        <div>
          <Progress
            size='medium'
            value={value}
            total={max}
            inverted color='pink'
            progress='value'
            indicating={indicating}
          />
        </div>
      </div>
    )
  } else if (value / max > 0.11) {
    return (
      <div>
        <div>
          <Progress
            size='medium'
            value={value}
            total={max}
            inverted color='pink'
            indicating={indicating}
          />
        </div>
        <ProgressOuterValue
         style={{ paddingLeft: (value / max * 100) + '%' }}
        >
          {value}
        </ProgressOuterValue>
      </div>
    )
  } else {
    return (
      <div>
        <div>
          <Progress
            size='medium'
            value={value}
            total={max}
            inverted color='pink'
            indicating={indicating}
          />
        </div>
        <ProgressOuterValue 
          style={{ paddingLeft: '11%' }}
        >
          {value}
        </ProgressOuterValue>
      </div>
    )
  }
}

export default ProgressBar;