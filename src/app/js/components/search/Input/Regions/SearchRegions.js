import React, { PropTypes, Component } from 'react';
import cssModules from 'react-css-modules';
import { map } from 'lodash';
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
      <div styleName="regions_wrapper">
        <button onClick={this.toggleList}>{this.props.selectedRegion.full}</button>
      </div>
    );
    const listOfRegions = map(this.props.regions, (region) => {
      return (
        <li
          key={region.short}
          onClick={() => this.props.selectRegion(region)}
        >
          {region.full}
        </li>
      );
    });

    if (this.state.opened) {
      return (
        <div styleName="regions_wrapper">
          {selected}
          <ul styleName="regions_list">
            {listOfRegions}
          </ul>
        </div>
      );
    }

    return selected;
  }
}

