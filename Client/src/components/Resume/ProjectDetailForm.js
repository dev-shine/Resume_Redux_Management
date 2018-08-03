import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldInput from '../common/FieldInput';
import SelectInput from '../common/SelectInput';
import appconstants from './../../constants/AppConstants';
import constants from './../../constants/Constants';
import TextArea from './../common/TextArea';
import Multiselect from './../common/Multiselect';


export const ProjectDetailForm = ({ handleSubmit, pristine, reset, submitting, projects, projectRoles, saveProjectClick }) => {
    return (
        <form onSubmit={handleSubmit(saveProjectClick)}>
          <div id='ProjectDetails'>
              <div className='formDiv'>
                  <div className='form-group col-md-12'>
                      <Field
                        name={constants.PROJECT}
                        label={ appconstants.PROJECT }
                        type="text"
                        options={ projects }
                        component={SelectInput}
                        placeholder={ constants.DROPDOWN_PLACEHOLDER }
                        labelField='ProjectName'
                        valueField='_id'
                      />

                      <Field
                        name={constants.ROLE}
                        type="text"
                        label={ appconstants.ROLE }
                        options={ projectRoles }
                        component={SelectInput}
                        placeholder={ constants.DROPDOWN_PLACEHOLDER }
                        labelField='ProjectRoleName'
                        valueField='_id'
                      />

                      <Field
                          type="text"
                          name= {constants.RESPONSIBILITIES}
                          label= { appconstants.RESPONSIBILITIES }
                          placeholder=  { appconstants.RESPONSIBILITIES }
                          component={TextArea}
                          note = { constants.SENTENCE_NOTE}
                      />

                  </div>
                  <div className='form-group col-md-12'>
                      <div className='col-md-4'>
                      </div>
                      <div className='col-md-8 form-group'>
                         <button className='btn btn-primary pull-right'>{ constants.SAVE_PROJECT }</button>
                      </div>
                  </div>
                   </div>
          </div>
        </form>
    );
};


const validate = values => {
    const errors = {};

    if (!values.Project) {
        errors.Project = constants.REQUIRED_MESSAGE + ' ' + constants.PROJECT;
    }

    if (!values.Role) {
        errors.Role = constants.REQUIRED_MESSAGE + ' ' + constants.ROLE;
    }

    if (!values.Responsibilities) {
        errors.Responsibilities = constants.REQUIRED_MESSAGE + ' ' + constants.RESPONSIBILITIES;
    }

    return errors;
};



ProjectDetailForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    projects : PropTypes.array,
    roles : PropTypes.array,
    saveProjectClick :PropTypes.func
};



export default reduxForm({
    form: 'ProjectDetailForm',
    validate
})(ProjectDetailForm);
