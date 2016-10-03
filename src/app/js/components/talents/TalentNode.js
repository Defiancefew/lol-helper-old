import React, { PropTypes, Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './Talents.scss';


@CSSModules(styles)
export default class TalentNode extends Component {

  state = {}

  static propTypes = {
    name: PropTypes.string.isRequired,
    rank: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    pointsReq: PropTypes.string.isRequired
  }

  onMouseEnter() {
    this.setState({ mousemoving: true });
  }

  onMouseLeave() {
    this.setState({ mousemoving: false });
  }

  onMouseMove(e){
    this.setState({ mouseX : e.pageX, mouseY: e.pageY});
  }

  render() {
    const nodeStyle = {
      backgroundImage: `url(./img/${encodeURIComponent(this.props.name)}.png)`,
    };

    const descStyle = {
      position: 'absolute',
      top: `${this.state.mouseY}`,
      left: `${this.state.mouseX + 20}`
    }

    return (
      <div styleName="mastery_icon_wrapper">
          <div style={nodeStyle}
               styleName="mastery_icon"
               onMouseLeave={::this.onMouseLeave}
               onMouseEnter={::this.onMouseEnter}
               onMouseMove={::this.onMouseMove}
          >
            <div styleName="mastery_count">0/5</div>
          </div>
        <div style={descStyle} styleName="mastery_description">{this.props.description}</div>
      </div>
    );
  }
}
