import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldInput from '../common/FieldInput';
import CheckboxInput from '../common/CheckboxInput';
import constants from '../../constants/Constants';

export const DomainForm = ({ handleSubmit, pristine, reset, submitting, saveHandler, cancelHandler }) => {
  return (
    <form onSubmit={ handleSubmit(saveHandler) }>
      <div className='slds-modal__content'>
        <Field type="text" name={ constants.DOMAINNAME } label={ constants.DOMAIN } placeholder={ constants.DOMAIN } component={ FieldInput } autoFocus />
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
  if (!values.DomainName) {
      errors.DomainName = constants.REQUIRED_MESSAGE + ' ' + constants.DOMAIN;
  }

  return errors;
};

DomainForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  saveHandler: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'DomainForm',
  validate
})(DomainForm);