import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './Modal.scss';

class Modal extends Component {
  state = {
    isOpen: true
  }

  toggleModal = () => {
    this.close();
    this.props.onClick();
  }

  close = () => {
    this.setState({ isOpen: false });
  }

  render() {
    if (!this.state.isOpen) {
      return null;
    }

    return (
      <div styleName={`${this.props.type}`}>
        <div styleName="wrapper" className="clearfix">
          <button styleName="close" onClick={this.close}>X</button>
          <div styleName="title">{this.props.title}</div>
          <div styleName="text">{this.props.text}</div>
          <div styleName="footer">
            <button styleName="accept" onClick={this.toggleModal}>Yes</button>
            <button styleName="decline" onClick={this.close}>No</button>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  text: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default cssModules(styles)(Modal);
