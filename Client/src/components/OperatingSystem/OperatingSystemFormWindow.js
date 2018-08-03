import React from 'react';
import OperatingSystemForm from './OperatingSystemForm';
import constants from '../../constants/Constants';

export default class OperatingSystemFormWindow extends React.Component {
  render() {
    return (
      <div>
        <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
          <div className='slds-modal__container modelWidth35'>
            <div className='slds-modal__header'>
              <h4 className='slds-text-heading--medium header'>{ constants.NEW_OPERATINGSYSTEM }</h4>
            </div>
            <OperatingSystemForm saveHandler={ this.props.saveHandler } initialValues={ this.props.initialValues } cancelHandler={ this.props.cancelHandler } />
          </div>
        </div>
        <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
      </div>
    );
  }
}