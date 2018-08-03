import React from 'react';
import ProjectRoleForm from './ProjectRoleForm';
import constants from '../../constants/Constants';

export default class ProjectRoleFormWrapper extends React.Component {
  render() {
    return (
      <div>
        <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
          <div className='slds-modal__container modelWidth35'>
            <div className='slds-modal__header'>
              <h4 className='slds-text-heading--medium header'>{ constants.EDIT_PROJECTROLE }</h4>
            </div>
            <ProjectRoleForm initialValues={ this.props.initialValues } saveHandler={ this.props.saveHandler } cancelHandler={ this.props.cancelHandler } />
          </div>
        </div>
        <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
      </div>
    );
  }
}