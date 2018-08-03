import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import ResumeTabs from './ResumeTabs';
import ResumeActions from './../../action/ResumeAction';
import DatabaseActions from './../../action/DatabaseAction';
import DesignationAction from './../../action/DesignationAction';
import TechnologyAction from './../../action/TechnologyAction';
import DomainAction from './../../action/DomainAction';
import OperatingSystemAction from './../../action/OperatingSystemAction';
import LanguageAction from './../../action/LanguageAction';
import ApplicationAction from './../../action/ApplicationAction';
import FrameworkAction from './../../action/FrameworkAction';
import ProjectAction from './../../action/ProjectAction';
import RoleAction from './../../action/RoleAction';
import ProjectRoleAction from './../../action/ProjectRoleAction';
import constants from './../../constants/Constants';
import { confirm } from './../landing/Confirm';

class ResumeFormContainer extends React.Component {

  constructor()
  {
    super()
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this) ;
    this.onTabSelect = this.onTabSelect.bind(this);
    this.saveProjectClick = this.saveProjectClick.bind(this);
    this.addProjectClick = this.addProjectClick.bind(this);
    this.customConfirm = this.customConfirm.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.saveProjectDetails = this.saveProjectDetails.bind(this);
  }

  componentDidMount()
  {
    this.props.action.getAllApplications();
    this.props.action.getAllDatabases();
    this.props.action.getAllDesignations();
    this.props.action.getAllTechnologies();
    this.props.action.getAllDomains();
    this.props.action.getAllOperatingSystems();
    this.props.action.getAllLanguages();
    this.props.action.getAllFrameworks();
    this.props.action.getAllProjects();
    this.props.action.getAllRoles();
    this.props.action.getAllProjectRoles();
  }


  onAfterSaveCell(row, cellName, cellValue) {
    if(cellName=== 'RoleName')
    {
      var role = this.props.roles.filter((ex) => ex.RoleName.toString()=== row['RoleName']);
      row['RoleId'] = role[0]._id;
    }
    return true;
  }

  saveProjectDetails()
  {
    if(this.props.resumeGeneralDetails !== undefined)
    {
          var resumeRecord = [];
          var resumeHistory = this.props.history;
          var resumeAction = this.props.action;
          resumeRecord = this.props.resumeGeneralDetails;
           resumeRecord["Application"] = this.props.resumeGeneralDetails.applications;
           resumeRecord["Domain"] = this.props.resumeGeneralDetails.domains;
           resumeRecord["Database"] = this.props.resumeGeneralDetails.databases;
           resumeRecord["OperatingSystem"] = this.props.resumeGeneralDetails.os;
           resumeRecord["Framework"] = this.props.resumeGeneralDetails.frameworks;
           resumeRecord["Language"] = this.props.resumeGeneralDetails.languages;
           resumeRecord["Technology"] = this.props.resumeGeneralDetails.technologies;
           resumeRecord['Projects'] = this.props.projectDetails;
          if (this.props.resumeGeneralDetails._id === undefined) {
            this.props.action.resumeInsert(resumeRecord)
            .then((response) => {
                    resumeAction.clearCandidateDetails();
                    resumeHistory.push('/resumes');
                        if(response.data.message === "Conflict")
                        {
                         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
                        }
                        else {
                          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
                        }
                      }).catch(error => {
                          toastr.error(error);
                      });
          }
          else {
            resumeRecord['CandidateId'] = this.props.resumeGeneralDetails._id;
            this.props.action.resumeUpdate(resumeRecord)
            .then((response) => {
              resumeAction.clearCandidateDetails();
              resumeHistory.push('/resumes');
              if(response.data.message === "Conflict")
              {
               toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
              }
              else {
                toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
              }

                      }).catch(error => {
                          toastr.error(error);
                      });
          }
    }
    else {
      toastr.warning(constants.RESUME_CREATE_ERROR_MESSAGE);
    }
  }

  onTabSelect(selectedTab)
  {
    this.props.action.setSelectedTab(selectedTab);
  }

  handleSave(values){
    if(values !== undefined)
    {
      this.props.action.storeGeneralDetails(values);
      toastr.success(constants.GENERAL_DETAILS_SAVED_SUCCESSFULLY);
    }
  }

  handleCancel(){
      this.props.action.setSelectedTab(0);
      this.props.action.clearResumeDetails();
      this.props.history.push('/resumes');
  }

  saveProjectClick(values)
  {
      let proDetails = this.props.projectDetails;
      if (proDetails.map(x=>x.ProjectId).indexOf(values.Project) !== -1)
      {
           toastr.warning(constants.PROJECT_ADDED_MESSAGE);
      }
      else {
        let proData = {
            ProjectName:this.props.projects.filter(x=>x._id=== values.Project)[0].ProjectName,
            ProjectId:values.Project,
            RoleId:values.Role,
            RoleName:this.props.projectRoles.filter(x=>x._id=== values.Role)[0].ProjectRoleName,
            Responsibilities : values.Responsibilities
        };
        proDetails.push(proData);
        this.props.action.setProjectDetails(proDetails);
      }
  }

  customConfirm(next, rowKeys) {
    let projectDetails = this.props.projectDetails;
       if (rowKeys.length > 0)
       {
          confirm(constants.DELETE_CONFIRMATION).then(() => {
                  for(var index = 0; index<rowKeys.length; index++)
                  {
                    projectDetails = projectDetails.filter(x=>x.ProjectId !== rowKeys[index]);
                  }

                  this.props.action.setProjectDetails(projectDetails);
                  if(rowKeys.length !== 1)
                  {
                     toastr.success(constants.DELETE_SUCCESS_MESSAGE_MULTIPLE);
                     rowKeys = [];
                 }
                 else
                 {
                     toastr.success(constants.DELETE_SUCCESS_MESSAGE);
                     rowKeys = [];
                 }

                   next();
              });
        }
 }

  addProjectClick()
  {
    if (this.props.projectDetailsDivCount.length=== 0)
     {
       this.props.action.addProjectDetailDivCount();
     }
  }


    render() {
        return (
            <div className='slds-m-around--medium'>
                <ResumeTabs
                  resume={ this.props.resume }
                  databases={ this.props.databases }
                  designations={ this.props.designations }
                  technologies={ this.props.technologies }
                  domains={ this.props.domains }
                  operatingsystems={ this.props.operatingsystems }
                  languages={ this.props.languages }
                  applications={ this.props.applications }
                  frameworks={ this.props.frameworks }
                  projects={ this.props.projects }
                  projectRoles = {this.props.projectRoles}
                  // roles={ this.props.roles }
                  handleSave = {this.handleSave}
                  handleCancel = {this.handleCancel}
                  tabIndex = {this.props.tabIndex}
                  onTabSelect = {this.onTabSelect}
                  saveProjectClick = {this.saveProjectClick}
                  addProjectClick ={this.addProjectClick}
                  projectDetailsDivCount = {this.props.projectDetailsDivCount}
                  projectDetails = {this.props.projectDetails}
                  customConfirm = {this.customConfirm}
                  saveProjectDetails = {this.saveProjectDetails}
                  resumeGeneralDetails = {this.props.resumeGeneralDetails}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
      resume : state.resumeReducer.resume,
      databases : state.databaseReducer.databaseList,
      designations: state.designationReducer.designationList,
      technologies : state.technologyReducer.technologyList,
      domains : state.domainReducer.domainList,
      operatingsystems: state.operatingSystemReducer.operatingSystemList,
      languages: state.languageReducer.languageList,
      applications : state.applicationsReducer.applicationList,
      frameworks: state.frameworkReducer.frameworkList,
      resumeGeneralDetails : state.resumeReducer.resumeGeneralDetails,
      projects :  state.projectReducer.projectList ,
      projectRoles : state.projectRoleReducer.projectRoleList ,      
      tabIndex : state.resumeReducer.tabIndex,
      projectDetailsDivCount : state.resumeReducer.projectDetailsDivCount,
      projectDetails : state.resumeReducer.projectDetails,
      test : state.resumeReducer.test
    }
  }


const mapDispatchToProps = dispatch => ({
    action: bindActionCreators({
      ...ResumeActions,
      ...DatabaseActions,
      ...DesignationAction,
      ...TechnologyAction,
      ...DomainAction,
      ...OperatingSystemAction,
      ...LanguageAction,
      ...ApplicationAction,
      ...FrameworkAction,
       ...ProjectAction,
       ...RoleAction,
      ...ProjectRoleAction,
    }, dispatch)
});



ResumeFormContainer.propTypes = {
    action: PropTypes.object.isRequired,
    history: PropTypes.object,
    databases: PropTypes.array,
    designations : PropTypes.array,
    technologies : PropTypes.array,
    domains : PropTypes.array,
    operatingsystems :  PropTypes.array,
    languages :  PropTypes.array,
    applications :  PropTypes.array,
    frameworks :  PropTypes.array,
    roles :  PropTypes.array,
    projects :  PropTypes.array,
    resumeGeneralDetails : PropTypes.object,
    match: PropTypes.object.isRequired,
    tabIndex : PropTypes.number,
    saveProjectClick : PropTypes.func,
    projectRoles : PropTypes.array,
    onTabSelect : PropTypes.func,
    addProjectClick : PropTypes.func,
    projectDetailsDivCount : PropTypes.array,
    resume :  PropTypes.array,
    projectDetails : PropTypes.array,
    customConfirm : PropTypes.func,
    onAfterSaveCell : PropTypes.func,
    saveProjectDetails : PropTypes.func
};



export default connect(mapStateToProps, mapDispatchToProps)(ResumeFormContainer);
