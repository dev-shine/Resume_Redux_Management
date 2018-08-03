import React from 'react';
import DatabaseForm from './DatabaseForm';
import constants from '../../constants/Constants';

export default class DatabaseFormWindow extends React.Component {
  render() {
    return (
      <div>
        <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
          <div className='slds-modal__container'>
            <div className='slds-modal__header'>
              <h4 className='slds-text-heading--medium header'>{ constants.NEW_DATABASE }</h4>
            </div>
            <DatabaseForm saveHandler={ this.props.saveHandler } initialValues={ this.props.initialValues } cancelHandler={ this.props.cancelHandler } />            
          </div>
        </div>
        <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
      </div>
    );
  }
}