import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { find } from 'lodash';
import styles from './Talents.scss';

const { string, number, bool, func } = PropTypes;

const TalentNode = (props) => {
  const { name, description, rank } = props.mastery;
  const { active, mastery } = props;
  const getCurrentDescription = () => {
    const foundMastery = find(props.masteryState, { name });

    if (description) {
      if (foundMastery && foundMastery.activePoints > 0) {
        return description[foundMastery.activePoints - 1];
      }
    }
    return description[0];
  };

  const onWheel = (e,changedMastery) => {
    if (e.deltaY < 0) {
      props.addMastery(changedMastery);
    } else if (e.deltaY > 0) {
      props.removeMastery(changedMastery);
    }
  };

  const computedStyles = {
    masteryIcon: {
      backgroundImage: `url(./img/${encodeURIComponent(name)}${active ? '' : '-bw'}.png)`,
      border: `1px solid ${active ? 'yellow' : 'gray'}`
    },
    description: {
      top: `${props.mouseY}px`,
      left: `${props.mouseX + 20}px`
    },
    masteryCount: {
      border: `1px solid ${active ? 'yellow' : 'lightgray'}`,
      color: `${active ? 'yellow' : 'lightgray'}`
    }
  };

  return (
    <div
      styleName="mastery_icon_wrapper"
      onContextMenu={() => props.removeMastery(mastery)}
      onClick={() => props.addMastery(mastery)}
      onWheel={e => onWheel(e, mastery)}
    >
      <div
        style={computedStyles.masteryIcon}
        styleName="mastery_icon"
      >
        <div
          style={computedStyles.masteryCount}
          styleName="mastery_count"
        >
          {props.currentPoints}/{rank}
        </div>
      </div>
      <div
        style={computedStyles.description}
        styleName="mastery_description">
        <div>{decodeURIComponent(name).replace(/_+/g, ' ')}</div>
        <br />
        {getCurrentDescription()}
      </div>
    </div>
  );
};

TalentNode.propTypes = {
  addMastery: func.isRequired,
  removeMastery: func.isRequired,
  currentPoints: number.isRequired,
  active: bool.isRequired,
  mastery: PropTypes.shape({
    name: string.isRequired,
    rank: string.isRequired,
    active: bool,
    description: PropTypes.arrayOf(string).isRequired
  }),
  mouseX: number.isRequired,
  mouseY: number.isRequired,
};

export default cssModules(styles)(TalentNode);
