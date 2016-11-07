import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './Talents.scss';

const TalentNode = ({
  active,
  mastery,
  masteryState,
  addMastery,
  removeMastery,
  mouseY,
  mouseX,
  currentPoints
}) => {
  const { name, description, rank } = mastery;
  const getCurrentDescription = () => {
    const foundMastery = _.find(masteryState, { name });

    if (description) {
      if (foundMastery && foundMastery.activePoints > 0) {
        return description[foundMastery.activePoints - 1];
      }
    }
    return description[0];
  };

  const onWheel = (e, changedMastery) => {
    if (e.deltaY < 0) {
      addMastery(changedMastery);
    } else if (e.deltaY > 0) {
      removeMastery(changedMastery);
    }
  };

  const computedStyles = {
    masteryIcon: {
      backgroundImage: `url(./img/sprites/mastery/mastery0${active ? '' : 'bw'}.png)`,
      border: `1px solid ${active ? 'yellow' : 'gray'}`,
      backgroundPosition: `${-mastery.image.x}px ${-mastery.image.y}px`,
    },
    description: {
      top: `${mouseY}px`,
      left: `${mouseX + 20}px`
    },
    masteryCount: {
      border: `1px solid ${active ? 'yellow' : 'lightgray'}`,
      color: `${active ? 'yellow' : 'lightgray'}`
    }
  };

  return (
    <div
      styleName="mastery_icon_wrapper"
      onContextMenu={() => removeMastery(mastery)}
      onClick={() => addMastery(mastery)}
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
          {currentPoints}/{rank}
        </div>
      </div>
      <div
        style={computedStyles.description}
        styleName="mastery_description"
      >
        <div>{decodeURIComponent(name).replace(/_+/g, ' ')}</div>
        <br />
        {getCurrentDescription()}
      </div>
    </div>
  );
};

TalentNode.propTypes = {
  addMastery: PropTypes.func.isRequired,
  removeMastery: PropTypes.func.isRequired,
  currentPoints: PropTypes.number.isRequired,
  active: PropTypes.bool,
  mastery: PropTypes.shape({
    name: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    active: PropTypes.bool,
    description: PropTypes.arrayOf(PropTypes.string).isRequired
  }),
  mouseX: PropTypes.number.isRequired,
  mouseY: PropTypes.number.isRequired,
};

export default cssModules(styles)(TalentNode);
