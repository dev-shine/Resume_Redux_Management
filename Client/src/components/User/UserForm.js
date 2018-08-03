import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldInput from '../common/FieldInput';
import CheckboxInput from '../common/CheckboxInput';
import constants from '../../constants/Constants';

export const UserForm = ({ handleSubmit, pristine, reset, submitting, saveHandler, cancelHandler, user }) => {
  var inputPassword = '';
  var inputCnfPassword = '';
  var txtEmail = '';
  if (user !== undefined && user.length !== 0 && user._id) {
    txtEmail = <Field type="text" name={ constants.EMAIL } label={ constants.EMAIL } placeholder={ constants.EMAIL } component={ FieldInput } disabled={ true } />
    inputPassword = <Field type="password" name={ constants.PASSWORD } className="displayNone" label={ constants.PASSWORD } placeholder={ constants.PASSWORD } component={ FieldInput } />
    inputCnfPassword = <Field type="password" name={ constants.CONFIRM_PASSWORD } className="displayNone" label={ constants.CONFIRMPASSWORD } placeholder={ constants.CONFIRMPASSWORD } component={ FieldInput } />
  }
  else {
    txtEmail = <Field type="text" name={ constants.EMAIL } label={ constants.EMAIL } placeholder={ constants.EMAIL } component={ FieldInput } />
    inputPassword = <Field type="password" name={ constants.PASSWORD } label={ constants.PASSWORD } placeholder={ constants.PASSWORD } component={ FieldInput } />
    inputCnfPassword = <Field type="password" name={ constants.CONFIRM_PASSWORD } label={ constants.CONFIRMPASSWORD } placeholder={ constants.CONFIRMPASSWORD } component={ FieldInput } />
  }
  return (
    <form onSubmit={ handleSubmit(saveHandler) }>
      <div className='slds-modal__content'>
        <Field type="text" name={ constants.FIRST_NAME } label={ constants.FIRSTNAME } placeholder={ constants.FIRSTNAME } component={ FieldInput } autoFocus />
        <Field type="text" name={ constants.LAST_NAME } label={ constants.LASTNAME } placeholder={ constants.LASTNAME } component={ FieldInput } />
        <Field type="text" name={ constants.CONTACT_NUMBER } label={ constants.CONTACTNUMBER } placeholder={ constants.CONTACTNUMBER } component={ FieldInput } />
        { txtEmail }
        { inputPassword }
        { inputCnfPassword }
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
  const re = /[a-zA-Z]+/g;
  if (!values.FirstName) {
    errors.FirstName = constants.REQUIRED_MESSAGE + ' ' + constants.FIRSTNAME;
  }
  else if (!re.test(values.FirstName)) {
    errors.FirstName = constants.VALIDITY_MESSAGE + ' ' + constants.FIRSTNAME;
  }
  if (!values.LastName) {
    errors.LastName = constants.REQUIRED_MESSAGE + ' ' + constants.LASTNAME;
  }
  else if (!re.test(values.LastName)) {
    errors.LastName = constants.VALIDITY_MESSAGE + ' ' + constants.LASTNAME;
  }
  if (!values.ContactNumber) {
    errors.ContactNumber = constants.REQUIRED_MESSAGE + ' ' + constants.CONTACTNUMBER;
  }
  else if(isNaN(Number(values.ContactNumber))) {
    errors.ContactNumber = constants.VALIDITY_MESSAGE + ' ' + constants.CONTACTNUMBER;
  }
  else if (values.ContactNumber.length < 10) {
    errors.ContactNumber = constants.VALIDITY_MESSAGE + ' ' + constants.CONTACTNUMBER;
  }
  if (!values.Email) {
    errors.Email = constants.REQUIRED_MESSAGE + ' ' + constants.EMAIL;
  }
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.Email)) {
    errors.Email = constants.VALIDITY_MESSAGE + ' ' + constants.EMAIL;
  }
  if (!values.Password) {
    errors.Password = constants.REQUIRED_MESSAGE + ' ' + constants.PASSWORD;
  }
  else if (values.Password.length < 8) {
    errors.Password = constants.PWD_LENGTH_MESSAGE;
  }
  if (!values._id && values.Password !== values.ConfirmPassword) {
    errors.ConfirmPassword = constants.MATCH_PASSWORD_MESSAGE;
  }

  return errors;
};

UserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  saveHandler: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'UserForm',
  validate
})(UserForm);