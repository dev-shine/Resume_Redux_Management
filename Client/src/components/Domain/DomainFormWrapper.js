import React from 'react';
import DomainForm from './DomainForm';
import constants from '../../constants/Constants';

export default class DomainFormWrapper extends React.Component {
  render() {
    return (
      <div>
        <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
          <div className='slds-modal__container'>
            <div className='slds-modal__header'>
              <h4 className='slds-text-heading--medium header'>{ constants.EDIT_DOMAIN }</h4>
            </div>
            <DomainForm initialValues={ this.props.initialValues } saveHandler={ this.props.saveHandler } cancelHandler={ this.props.cancelHandler } />
          </div>
        </div>
        <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
      </div>
    );
  }
}