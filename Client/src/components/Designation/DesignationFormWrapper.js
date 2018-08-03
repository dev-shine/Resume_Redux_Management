import React from 'react';
import DesignationForm from './DesignationForm';
import constants from '../../constants/Constants';

export default class DesignationFormWrapper extends React.Component {
  render() {
    return (
      <div>
        <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
          <div className='slds-modal__container'>
            <div className='slds-modal__header'>
              <h4 className='slds-text-heading--medium header'>{ constants.EDIT_DESIGNATION }</h4>
            </div>
            <DesignationForm initialValues={ this.props.initialValues } saveHandler={ this.props.saveHandler } cancelHandler={ this.props.cancelHandler } />
          </div>
        </div>
        <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
      </div>
    );
  }
}