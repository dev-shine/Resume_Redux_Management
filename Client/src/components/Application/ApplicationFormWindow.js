import React from 'react';
import ApplicationForm from './ApplicationForm';
import constants from '../../constants/Constants';

export default class ApplicationFormWindow extends React.Component {
  render() {
    return (
      <div>
          <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
              <div className='slds-modal__container'>
                  <div className='slds-modal__header'>
                      <h4 className='slds-text-heading--medium header'>{ constants.NEW_APPLICATION }</h4>
                  </div>
                      <ApplicationForm saveHandler = {this.props.saveHandler} initialValues={this.props.initialValues}  cancelHandler={ this.props.cancelHandler }   />
              </div>
          </div>
          <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
      </div>
    );
  }
}
