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

    const titleClass = `modal_title modal_${this.props.type}`;

    return (
      <div styleName="modal_wrapper">
        <div styleName="modal_inner_wrapper" className="clearfix">
          <button styleName="modal_close" onClick={this.close}>X</button>
          <div styleName={titleClass}>{this.props.title}</div>
          <div styleName="modal_text">{this.props.text}</div>
          <div styleName="modal_footer">
            <button styleName="modal_button" onClick={this.toggleModal}>Yes</button>
            <button styleName="modal_button" onClick={this.close}>No</button>
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

export default cssModules(Modal, styles, { allowMultiple: true });
