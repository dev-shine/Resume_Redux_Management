import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldInput from '../common/FieldInput';
import TextArea from '../common/TextArea';
import SelectInput from '../common/SelectInput';
import CheckboxInput from '../common/CheckboxInput';
import Multiselect from '../common/Multiselect';
import constants from '../../constants/Constants';

export const ProjectForm = ({ handleSubmit, pristine, reset, submitting, saveHandler, cancelHandler, domainsActive, operatingSystemsActive, databasesActive, technologiesActive, project }) => {
  return (
    <form onSubmit={ handleSubmit(saveHandler) }>
      <div className='slds-modal__content'>
        <Field type="text" name={ constants.PROJECTNAME } label={ constants.PROJECT } placeholder={ constants.PROJECT } component={ FieldInput } autoFocus />
        <Field type="text" name={ constants.TEAM_SIZE } label={ constants.TEAMSIZE } placeholder={ constants.TEAMSIZE } component={ FieldInput } />
        <Field name={ constants.DESCRIPTION } label={ constants.DESCRIPTION } placeholder={ constants.DESCRIPTION } component={ TextArea } />
        <Field name={ constants.OTHER_TOOLS } label={ constants.OTHERTOOLS } placeholder={ constants.OTHERTOOLS } component={ TextArea } />
        <Field name="DomainId" label={ constants.DOMAIN } placeholder={ constants.DROPDOWN_PLACEHOLDER } options={ domainsActive } component={ SelectInput } valueField='_id' labelField='DomainName' selectedValue={ project !== undefined ? project.DomainId : '' } />
        <Field name="OperatingSystemId" label={ constants.OPERATINGSYSTEM } placeholder={ constants.DROPDOWN_PLACEHOLDER } options={ operatingSystemsActive } component={ SelectInput } valueField='_id' labelField='OperatingSystemName' selectedValue={ project !== undefined ? project.OperatingSystemId : '' } />
        <Field name="DatabaseId" label={ constants.DATABASE } placeholder={ constants.DROPDOWN_PLACEHOLDER } options={ databasesActive } component={ SelectInput } valueField='_id' labelField='DatabaseName' selectedValue={ project !== undefined ? project.DatabaseId : '' } />
        <Field name="technologies" label={ constants.TECHNOLOGY } placeholder={ constants.DROPDOWN_PLACEHOLDER } options={ technologiesActive } component={ Multiselect } valueField='_id' labelField='TechnologyName' />
        <Field type="checkbox" name={ constants.LBL_ISACTIVE } label={ constants.STATUS } component={ CheckboxInput } />
      </div>
      <div className='slds-modal__footer'>
        <button type="submit" disabled={ submitting } className="btn btn-primary slds-button slds-button--neutral slds-button--brand"><i className="fa fa-paper-plane-o" aria-hidden="true" />{ constants.SUBMIT }</button>
        <button type="button" className="btn btn-default btn-space" onClick={ cancelHandler }>{ constants.CANCEL }</button>
      </div>
    </form>
  );
};

const validate = values => {
  const errors = {};
  if (!values.ProjectName) {
      errors.ProjectName = constants.REQUIRED_MESSAGE + ' ' + constants.PROJECT;
  }
  if(!values.TeamSize) {
    errors.TeamSize = constants.REQUIRED_MESSAGE + ' ' + constants.TEAMSIZE;
  }
  else if(isNaN(Number(values.TeamSize))) {
    errors.TeamSize = constants.VALIDITY_MESSAGE + ' ' + constants.TEAMSIZE;
  }
  else if (values.TeamSize < 1 || values.TeamSize > 99) {
    errors.TeamSize = constants.TEAM_SIZE_MESSAGE;
  }
  if(!values.Description) {
    errors.Description = constants.REQUIRED_MESSAGE + ' ' + constants.DESCRIPTION;
  }
  if(!values.OtherTools) {
    errors.OtherTools = constants.REQUIRED_MESSAGE + ' ' + constants.OTHERTOOLS;
  }
  if (!values.DomainId) {
      errors.DomainId = constants.SELECT_MESSAGE + ' ' + constants.DOMAIN;
  }
  if (!values.OperatingSystemId) {
      errors.OperatingSystemId = constants.SELECT_MESSAGE + ' ' + constants.OPERATINGSYSTEM;
  }
  if (!values.DatabaseId) {
      errors.DatabaseId = constants.SELECT_MESSAGE + ' ' + constants.DATABASE;
  }
  if (!values.technologies || values.technologies.length === 0) {
      errors.technologies = constants.SELECT_MESSAGE + ' ' + constants.TECHNOLOGY;
  }

  return errors;
};

ProjectForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  saveHandler: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  domainsActive: PropTypes.array,
  operatingSystemsActive: PropTypes.array,
  databasesActive: PropTypes.array,
  technologiesActive: PropTypes.array
};

export default reduxForm({
  form: 'ProjectForm',
  validate
})(ProjectForm);