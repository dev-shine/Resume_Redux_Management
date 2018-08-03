import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldInput from '../common/FieldInput';
import CheckboxInput from '../common/CheckboxInput';
import SelectInput from '../common/SelectInput';
import Constants from './../../constants/Constants';
const  { DOM: { input, select, textarea } } = React

export const ApplicationForm = ({ handleSubmit, pristine, reset, submitting, saveHandler, cancelHandler }) => {
    return (
        <form onSubmit = {handleSubmit(saveHandler)}>
            <div className='slds-modal__content'>
            <Field
                type="text"
                name="ApplicationName"
                label={Constants.APPLICATION_DISPLAY_NAME}
                placeholder={Constants.APPLICATION_DISPLAY_NAME}
                component={FieldInput}
                autoFocus
            />

            <Field
              name="IsActive"
              label = "Status"
              component={CheckboxInput}
              type="checkbox"
            />
          </div>
            <div className='slds-modal__footer'>
                <button type="submit" disabled={submitting} className="btn btn-primary slds-button slds-button--neutral slds-button--brand"><i className="fa fa-paper-plane-o" aria-hidden="true" /> Submit</button>
                <button type="button" className="btn btn-default btn-space" onClick={cancelHandler}>Cancel</button>
            </div>
        </form>
    );
};

const validate = values => {
    const errors = {};

    if (!values.ApplicationName) {
        errors.ApplicationName = Constants.REQUIRED_MESSAGE + ' ' + Constants.APPLICATION_DISPLAY_NAME;
    }

    return errors;
};

ApplicationForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveHandler: PropTypes.func.isRequired,
    cancelHandler: PropTypes.func.isRequired
};

export default reduxForm({
    form: 'ApplicationForm',
    validate
})(ApplicationForm);