import React from 'react';
import ProjectForm from './ProjectForm';
import constants from '../../constants/Constants';

export default class ProjectFormWindow extends React.Component {
  render() {
    return (
      <div>
        <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
          <div className='slds-modal__container modelWidth40'>
            <div className='slds-modal__header'>
              <h4 className='slds-text-heading--medium header'>{ constants.NEW_PROJECT }</h4>
            </div>
            <ProjectForm initialValues={ this.props.initialValues } databasesActive={ this.props.databasesActive } domainsActive={ this.props.domainsActive } operatingSystemsActive={ this.props.operatingSystemsActive } technologiesActive={ this.props.technologiesActive } saveHandler={ this.props.saveHandler } cancelHandler={ this.props.cancelHandler } />
          </div>
        </div>
        <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
      </div>
    );
  }
}