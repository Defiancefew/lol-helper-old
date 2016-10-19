import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { find } from 'lodash';
import styles from './Talents.scss';

const { string, number, arrayOf, bool } = PropTypes;

const TalentNode = (props) => {
  const getCurrentDescription = () => {
    const { masteryState, description, name } = props;
    const foundMastery = find(masteryState, { name });

    if (description) {
      if (foundMastery && foundMastery.activePoints > 0) {
        return description[foundMastery.activePoints - 1];
      }
    }
    return description[0];
  };

  const computedStyles = {
    masteryIcon: {
      backgroundImage: `url(./img/${encodeURIComponent(props.name)}${props.active ? '' : '-bw'}.png)`,
      border: `1px solid ${props.active ? 'yellow' : 'gray'}`
    },
    description: {
      top: `${props.mouseY}px`,
      left: `${props.mouseX + 20}px`
    },
    masteryCount: {
      border: `1px solid ${props.active ? 'yellow' : 'lightgray'}`,
      color: `${props.active ? 'yellow' : 'lightgray'}`
    }
  };

  return (
    <div styleName="mastery_icon_wrapper">
      <div
        style={computedStyles.masteryIcon}
        styleName="mastery_icon"
      >
        <div
          style={computedStyles.masteryCount}
          styleName="mastery_count">{props.currentPoints}/{props.rank}
        </div>
      </div>
      <div
        style={computedStyles.description}
        styleName="mastery_description">
        <div>{decodeURIComponent(props.name).replace(/_+/g, ' ')}</div>
        <br />
        {getCurrentDescription()}
      </div>
    </div>
  );
};

TalentNode.propTypes = {
  name: string.isRequired,
  mouseX: number.isRequired,
  mouseY: number.isRequired,
  rank: string.isRequired,
  active: bool.isRequired,
  currentPoints: number.isRequired,
  description: arrayOf(string).isRequired,
};

export default CSSModules(styles)(TalentNode);