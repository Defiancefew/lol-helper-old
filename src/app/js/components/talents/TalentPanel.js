import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as talentActions from '../../modules/talents';
import { map } from 'lodash';
import CSSModules from 'react-css-modules';

import testMasteries from '../../../../../masteries.json';

import TalentNode from './TalentNode';
import styles from './talentNode.scss';

// @connect(({ talents }) => ({ ...talents }), { ...talentActions })
@CSSModules(styles)
export default class TalentPanel extends Component {
  state = {}
  static propTypes = {}

  renderBranches() {
    return map(testMasteries, (branch, branchName) => {
      const tiers = map(branch, (tierMasteries, key) => {
        const masteries = map(tierMasteries, mastery => {
          return (<TalentNode {...mastery} key={mastery.name}/>);
        })

        return (<div>{key} {masteries}</div>)
      });

      return (
        <div key={branchName} styleName="talent_branch">
          {tiers}
          {branchName}
          </div>
      )
    })
  }

  render() {
    return (
      <div>
        {this.renderBranches()}
      </div>
    );
  }
}