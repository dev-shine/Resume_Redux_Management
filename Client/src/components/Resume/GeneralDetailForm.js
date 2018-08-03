import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldInput from '../common/FieldInput';
import SelectInput from '../common/SelectInput';
import appconstants from './../../constants/AppConstants';
import constants from './../../constants/Constants';
import TextArea from './../common/TextArea';
import Multiselect from './../common/Multiselect';


export const GeneralDetailForm = ({ handleSubmit, pristine, reset, submitting, designations, databases, applications,languages,technologies,frameworks, operatingsystems,domains,selectedDatabases, handleSave, handleCancel }) => {
    return (
        <form onSubmit={handleSubmit(handleSave)}>


          <div className='col-md-12'>
              <div className='col-md-6'>

                        <Field
                            type="text"
                            name={ constants.CANDIDATENAME }
                            label= { constants.CANDIDATENAME }
                            placeholder= { constants.CANDIDATENAME }
                            component={FieldInput}
                        />

                        <Field
                            type="text"
                            name={ constants.EDUCATIONDESCRIPTION }
                            label= { constants.EDUCATIONDESCRIPTION }
                            placeholder= { constants.EDUCATIONDESCRIPTION }
                            component={TextArea}
                            note = { constants.SENTENCE_NOTE}
                        />


                     <Field
                         type="text"
                         name={ constants.CURRENT_COMPANYNAME }
                         label= { constants.CURRENT_COMPANYNAME }
                         placeholder= { constants.CURRENT_COMPANYNAME }
                         component={FieldInput}
                     />


                <Field
                    name="DesignationId"
                    label={ appconstants.CURRENT_DESIGNATION }
                    options={designations !== undefined ? designations : []}
                    component={SelectInput}
                    placeholder={ constants.DROPDOWN_PLACEHOLDER }
                    labelField='DesignationName'
                    valueField='_id'
                />

                <Field
                    type="text"
                    name={ constants.EXPERIENCE }
                    label= { constants.EXPERIENCE }
                    placeholder= { constants.EXPERIENCE }
                    component={FieldInput}
                />


                  <Field
                      type="text"
                      name={ constants.TEAM_SIZE }
                      label= { constants.TEAM_SIZE }
                      placeholder= { constants.TEAM_SIZE }
                      component={FieldInput}
                  />


                  <Field
                      type="text"
                      name={ constants.PROJECTCOUNT }
                      label= { appconstants.PROJECT_COUNT }
                      placeholder= { constants.PROJECTCOUNT }
                      component={FieldInput}
                  />


                  <Field
                      type="text"
                      name={ constants.KNOWLEDGEDESCRIPTION }
                      label= { appconstants.KNOWLEDGE_DESCRIPTION }
                      placeholder=  { appconstants.KNOWLEDGE_DESCRIPTION }
                      component={TextArea}
                      note = { constants.SENTENCE_NOTE}
                  />

             </div>
             <div className='col-md-6'>

                <Field
                    type="text"
                    name={ constants.WORKDESCRIPTION }
                    label= { appconstants.WORK_DESCRIPTION }
                    placeholder=  { appconstants.WORK_DESCRIPTION }
                    component={TextArea}
                    note = { constants.SENTENCE_NOTE}
                />

                  <Field
                    id={ constants.DOMAIN }
                    name='domains'
                    label= { appconstants.DOMAIN }
                    labelField='DomainName'
                    valueField='_id'
                    options={ domains }
                    component={Multiselect}
                    placeholder={ constants.DROPDOWN_PLACEHOLDER }
                    />

                  <Field
                    name='applications'
                    id={ constants.APPLICATION }
                    label= { appconstants.APPLICATION }
                    labelField='ApplicationName'
                    valueField='_id'
                    options={ applications !== undefined ? applications : [] }
                    component={Multiselect}
                    placeholder={ constants.DROPDOWN_PLACEHOLDER }/>

                  <Field
                    name='os'
                    id={ constants.OPERATING_SYSTEM }
                    label= { appconstants.OS }
                    labelField='OperatingSystemName'
                    valueField='_id'
                    options={ operatingsystems }
                    component={Multiselect}
                    placeholder={ constants.DROPDOWN_PLACEHOLDER }/>



                  <Field
                    name='technologies'
                    id={ constants.TECHNOLOGY }
                    label= { appconstants.TECHNOLOGY }
                    labelField='TechnologyName'
                    valueField='_id'
                    options={ technologies }
                    component={Multiselect}
                    placeholder={ constants.DROPDOWN_PLACEHOLDER }/>


                  <Field
                   name='frameworks'
                   id={ constants.FRAMEWORK }
                   label= { appconstants.FRAMEWORK }
                   labelField='FrameworkName'
                   valueField='_id'
                   options={ frameworks }
                   component={Multiselect}
                   placeholder={ constants.DROPDOWN_PLACEHOLDER }/>

                  <Field
                  id={ constants.LANGUAGE }
                  name='languages'
                  label= { appconstants.LANGUAGE }
                  labelField='LanguageName'
                  valueField='_id'
                  options={ languages }
                  component={Multiselect}
                  placeholder={ constants.DROPDOWN_PLACEHOLDER }/>



                  <Field
                    id={ constants.DATABASE }
                    // name={ constants.DROPDOWN_DATABASE }
                    name = 'databases'
                    options={ databases }
                    labelField='DatabaseName'
                    valueField='_id'
                    label = { appconstants.DATABASE }
                    selectedValues = {selectedDatabases}
                  component={Multiselect}
                  placeholder={ constants.DROPDOWN_PLACEHOLDER }/>
             </div>
          </div>
            <div>
              <button type="button" className='btn floatRight' onClick={ handleCancel }>{ constants.CANCEL }</button>              
              <button className='btn btn-primary marginBtnCancel slds-button slds-button--neutral slds-button--brand floatRight'>{ constants.SAVE_GENERALDETAILS }</button>
            </div>
        </form>
    );
};


const validate = values => {
    const errors = {};
     const re = /[0-9]+/g;
    if (!values.CandidateName) {
        errors.CandidateName = constants.REQUIRED_MESSAGE + ' ' + constants.CANDIDATENAME;
    }

    if(!values.Experience)
    {
        errors.Experience = constants.REQUIRED_MESSAGE + ' ' + constants.EXPERIENCE;
    }
    else {
      if(isNaN(Number(values.Experience)))
      {
        errors.Experience = constants.VALIDITY_MESSAGE + ' ' + constants.EXPERIENCE;
      }
    }

    if (!values.DesignationId) {
        errors.DesignationId = constants.REQUIRED_MESSAGE + ' '  +  appconstants.CURRENT_DESIGNATION;
    }

    if (!values.CurrentCompanyName) {
        errors.CurrentCompanyName = constants.REQUIRED_MESSAGE + ' ' + constants.CURRENT_COMPANYNAME ;
    }

    if (!values.EducationDescription) {
        errors.EducationDescription = constants.REQUIRED_MESSAGE + ' ' + constants.EDUCATIONDESCRIPTION;
    }

    if (!values.databases || values.databases.length == 0) {
        errors.databases = constants.REQUIRED_MESSAGE + ' ' + constants.DATABASE;
    }

    if (!values.languages || values.languages.length == 0 ) {
        errors.languages = constants.REQUIRED_MESSAGE + ' ' + constants.LANGUAGE;
    }

    if (!values.applications || values.applications.length == 0) {
        errors.applications = constants.REQUIRED_MESSAGE + ' ' + constants.APPLICATION;
    }

    if (!values.frameworks || values.frameworks.length == 0) {
        errors.frameworks = constants.REQUIRED_MESSAGE + ' ' + constants.FRAMEWORK;
    }

    if (!values.technologies || values.technologies.length == 0) {
        errors.technologies = constants.REQUIRED_MESSAGE + ' ' + constants.TECHNOLOGY;
    }

    if (!values.TeamSize) {
        errors.TeamSize = constants.REQUIRED_MESSAGE + ' ' + constants.TEAMSIZE;
    }
    else {
      if(isNaN(Number(values.TeamSize)))
      {
        errors.TeamSize = constants.VALIDITY_MESSAGE + ' ' + constants.TEAMSIZE;
      }
    }

    if (!values.ProjectCount) {
        errors.ProjectCount = constants.REQUIRED_MESSAGE + ' ' + appconstants.PROJECT_COUNT ;
    }
    else {
      if(isNaN(Number(values.ProjectCount)))
      {
        errors.ProjectCount = constants.VALIDITY_MESSAGE + ' ' + constants.PROJECT_COUNT;
      }
    }

    if (!values.KnowledgeDescription) {
        errors.KnowledgeDescription = constants.REQUIRED_MESSAGE + ' ' +  appconstants.KNOWLEDGE_DESCRIPTION  ;
    }

    if (!values.WorkDescription) {
        errors.WorkDescription = constants.REQUIRED_MESSAGE + ' ' +   appconstants.WORK_DESCRIPTION   ;
    }

    if (!values.os || values.os.length == 0) {
        errors.os = constants.REQUIRED_MESSAGE + ' ' +  appconstants.OS;
    }

    if (!values.domains || values.domains.length == 0) {
        errors.domains = constants.REQUIRED_MESSAGE + ' ' +  appconstants.DOMAIN;
    }

    return errors;
};



GeneralDetailForm.PropTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    databases : PropTypes.array,
    designations:PropTypes.array,
    databases:PropTypes.array,
    applications:PropTypes.array,
    languages:PropTypes.array,
    technologies : PropTypes.array,
    operatingsystems: PropTypes.array,
    domains : PropTypes.array
};



export default reduxForm({
    form: 'GeneralDetailForm',
    validate
})(GeneralDetailForm);
