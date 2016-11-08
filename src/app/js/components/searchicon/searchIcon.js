import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './searchIcon.scss';

class SearchIcon extends Component {
  state = {
    mouseX: 0,
    mouseY: 0
  }

  static propTypes = {
    nodeInfo: PropTypes.shape({
      image: PropTypes.shape({}).isRequired
    })
  }

  onMouseEnter = (e) => {
    this.setState({ mouseX: e.pageX, mouseY: e.pageY });
  }

  imagePath(group) {
    if (group === 'gray_mastery') {
      return 'mastery';
    } else if (group === 'spell') {
      return 'summoner';
    }

    return group;
  }

  descriptionText(group, nodeInfo) {
    switch (group) {
      case 'champion':
        return `${nodeInfo.name}, ${nodeInfo.title}`;
      case 'spell':
        return nodeInfo.name;
      case 'gray_mastery':
        return nodeInfo.name;
      case 'profileicon':
        return null;
      case 'item':
        return nodeInfo.name;
      case 'rune':
        return (<div>
          <div>{nodeInfo.name}</div>
          <div>{nodeInfo.description}</div>
        </div>);
    }
  }

  render() {
    if (!this.props.nodeInfo) {
      const emptyItem = {
        backgroundImage: 'url(./img/random.jpg)',
        backgroundSize: 'cover',
        width: '48px',
        height: '48px',
        display: 'inline-block'
      };

      return <div style={emptyItem} />;
    }

    const isProfileIcon = () => (this.props.nodeInfo.image.group === 'profileicon');

    const { nodeInfo } = this.props;
    const { image, description } = nodeInfo;

    const iconStyle = {
      backgroundImage: `url(./img/sprites/${this.imagePath(image.group)}/${image.sprite})`,
      backgroundPosition: `${-image.x}px ${-image.y}px`,
      width: image.w,
      height: image.h
    };

    const descriptionStyle = {
      opacity: isProfileIcon() ? '0' : '1',
      top: `${this.state.mouseY}px`,
      left: `${this.state.mouseX + 20}px`
    };

    return (
      <div
        styleName="wrapper"
        onMouseMove={this.onMouseEnter}>
        <div style={iconStyle}>
          <div
            styleName="description"
            style={descriptionStyle}
          >
            { this.descriptionText(image.group, nodeInfo)}
          </div>
          {this.props.level ? <div styleName="level">{this.props.level}</div> : null}
        </div>
      </div>
    );
  }
}

export default cssModules(SearchIcon, styles);