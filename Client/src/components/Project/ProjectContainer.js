import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as projectAction from '../../action/ProjectAction';
import * as databaseAction from '../../action/DatabaseAction';
import * as domainAction from '../../action/DomainAction';
import * as operatingSystemAction from '../../action/OperatingSystemAction';
import * as technologyAction from '../../action/TechnologyAction';
import { HomeHeader } from './../landing/PageHeader';
import ProjectFormWindow from './ProjectFormWindow';
import ProjectFormWrapper from './ProjectFormWrapper';
import ProjectList from './ProjectList';
import constants from '../../constants/Constants';

class ProjectContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllProjects();
    this.props.action.getAllActiveDatabases();
    this.props.action.getAllActiveDomains();
    this.props.action.getAllActiveOperatingSystems();
    this.props.action.getAllActiveTechnologies();
  }
  newHandler() {
    this.props.action.openAddProjectWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeProjectWindow();
    this.props.history.replace('/projects');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const project = {
        _id: values._id,
        ProjectName: values.ProjectName,
        TeamSize: values.TeamSize,
        Description: values.Description,
        OtherTools: values.OtherTools,
        DomainId: values.DomainId,
        OperatingSystemId: values.OperatingSystemId,
        Technology: values.technologies,
        DatabaseId: values.DatabaseId,
        IsActive : values.IsActive
      };
      this.props.action.projectUpdate(project)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        }
        this.props.action.closeProjectWindow();
        this.props.history.push('/projects');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const project = {
        ProjectName: values.ProjectName,
        TeamSize: values.TeamSize,
        Description: values.Description,
        OtherTools: values.OtherTools,
        DomainId: values.DomainId,
        OperatingSystemId: values.OperatingSystemId,
        Technology: values.technologies,
        DatabaseId: values.DatabaseId,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.projectInsert(project)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        }
        this.props.action.closeProjectWindow();
        this.props.history.push('/projects');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getProjectById(id);
    this.props.action.openUpdateProjectWindow();
    this.props.history.push('/project/' + id);
  }
  deleteHandler(id) {
    this.props.action.projectDelete(id)
    .then(function(response){
          if(response.data.message === "Conflict")
          {
           toastr.error(constants.REFERENCE_EXIST_MESSAGE);
          }
          else {
            toastr.success(constants.DELETE_SUCCESS_MESSAGE);
          }
    })
    .catch(error => {
      toastr.error(error);
    });
  }
  render() {
    const { projectList } = this.props;
    if (!projectList) {
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_PROJECT }
              actions={[{ value: constants.LBL_NEW, label: constants.NEW_PROJECT }]}
              itemCount={ this.props.projects.length }
              views={[{ id: 1, name: constants.PROJECT_LIST }]}
              viewId={ constants.LBL_ONE }
              onNew={ this.newHandler } />
        <ProjectList projects={ projectList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingProject ? <ProjectFormWindow initialValues={ this.props.initialValues } databasesActive={ this.props.databasesActive } domainsActive={ this.props.domainsActive } operatingSystemsActive={ this.props.operatingSystemsActive } technologiesActive={ this.props.technologiesActive } cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateProject ? <ProjectFormWrapper initialValues={ this.props.initialValues } project={ this.props.project } databasesActive={ this.props.databasesActive } domainsActive={ this.props.domainsActive } operatingSystemsActive={ this.props.operatingSystemsActive } technologiesActive={ this.props.technologiesActive } cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const projectId = ownProps.match.params.id;
  if (projectId && state.projectReducer.project && projectId === state.projectReducer.project._id) {
    return {
      initialValues : state.projectReducer.project,
      projects: state.projectReducer.projects,
      projectList: state.projectReducer.projectList,
      project: state.projectReducer.project,
      addingProject: state.projectReducer.addingProject,
      updateProject: state.projectReducer.updateProject,
      databasesActive: state.databaseReducer.databasesActive,
      domainsActive: state.domainReducer.domainsActive,
      operatingSystemsActive: state.operatingSystemReducer.operatingSystemsActive,
      technologiesActive: state.technologyReducer.technologiesActive
    };
  } else {
    return {
      projects: state.projectReducer.projects,
      projectList: state.projectReducer.projectList,
      project: state.projectReducer.project,
      addingProject: state.projectReducer.addingProject,
      updateProject: state.projectReducer.updateProject,
      databasesActive: state.databaseReducer.databasesActive,
      domainsActive: state.domainReducer.domainsActive,
      operatingSystemsActive: state.operatingSystemReducer.operatingSystemsActive,
      technologiesActive: state.technologyReducer.technologiesActive
    };
  }
};

const mapDispatchToProps = dispatch => ({
    action: bindActionCreators({...projectAction, ...databaseAction, ...domainAction, ...operatingSystemAction, ...technologyAction}, dispatch)
});

ProjectContainer.propTypes = {
    projects: PropTypes.array,
    projectList: PropTypes.array,
    project: PropTypes.array,
    addingProject: PropTypes.bool,
    updateProject: PropTypes.bool,
    initialValues : PropTypes.object,
    databasesActive: PropTypes.array,
    domainsActive: PropTypes.array,
    operatingSystemsActive: PropTypes.array,
    technologiesActive: PropTypes.array,
    action: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectContainer);