import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Modal from '../Modal';

describe('Modal', () => {
  it('render properly', () => {
    const spyOnClick = jest.fn();
    const wrapper = shallow(
      <Modal onClick={spyOnClick} type="error" title="Test" text="Testing"/>
    );

    expect(shallowToJson(wrapper)).toMatchSnapshot();

  });
});