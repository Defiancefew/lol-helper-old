import React, { PropTypes, Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './talentNode.scss';


@CSSModules(styles)
export default class TalentNode extends Component {

  state = {
    
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    rank: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    pointsReq: PropTypes.string.isRequired
  }

  render(){
    const divStyle = {
      backgroundImage: `url(./img/${encodeURIComponent(this.props.name)}.png)`
    };

    return (
      <div style={divStyle} styleName="mastery_icon">

        <div styleName="mastery_count"></div>
        {/*<div styleName="mastery_description">{this.props.description}</div>*/}
      </div>
    );
  }
}
