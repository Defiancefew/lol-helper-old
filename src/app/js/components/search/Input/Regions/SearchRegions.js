import React, { PropTypes, Component } from 'react';
import cssModules from 'react-css-modules';
import styles from './SearchRegions.scss';

@cssModules(styles)
export default class Regions extends Component {
  state = {
    opened: false
  }

  static propTypes = {
    regions: PropTypes.shape({}),
    selectRegion: PropTypes.func.isRequired
  }

  toggleList = () => {
    this.setState({ opened: !this.state.opened });
  }

  render() {
    const selected = (
      <div styleName="wrapper">
        <button styleName="button" onClick={this.toggleList}>{this.props.selectedRegion.short}</button>
      </div>
    );

    const listOfRegions = _.map(this.props.regions, (region, regionShort) => {
      return (
        <li
          styleName="region"
          key={region.short}
          onClick={() => this.props.selectRegion(region)}
        >
          {region.full}
        </li>
      );
    });
    if (this.state.opened) {
      return (
        <div styleName="wrapper">
          {selected}
          <ul styleName="list">
            {listOfRegions}
          </ul>
        </div>
      );
    }

    return selected;
  }
}

