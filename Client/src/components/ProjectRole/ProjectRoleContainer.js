import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as projectRoleAction from '../../action/ProjectRoleAction';
import { HomeHeader } from './../landing/PageHeader';
import ProjectRoleFormWindow from './ProjectRoleFormWindow';
import ProjectRoleFormWrapper from './ProjectRoleFormWrapper';
import ProjectRoleList from './ProjectRoleList';
import constants from '../../constants/Constants';

class ProjectRoleContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllProjectRoles();
  }
  newHandler() {
    this.props.action.openAddProjectRoleWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeProjectRoleWindow();
    this.props.history.replace('/projectRoles');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const projectRole = {
        _id: values._id,
        ProjectRoleName: values.ProjectRoleName,
        IsActive : values.IsActive
      };
      this.props.action.projectRoleUpdate(projectRole)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        }
        this.props.action.closeProjectRoleWindow();
        this.props.history.push('/projectRoles');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const projectRole = {
        ProjectRoleName: values.ProjectRoleName,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.projectRoleInsert(projectRole)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        }
        this.props.action.closeProjectRoleWindow();
        this.props.history.push('/projectRoles');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getProjectRoleById(id);
    this.props.action.openUpdateProjectRoleWindow();
    this.props.history.push('/projectRole/' + id);
  }
  deleteHandler(id) {
    this.props.action.projectRoleDelete(id)
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
    const { projectRoleList } = this.props;
    if (!projectRoleList) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_PROJECTROLE }
                    actions={[{ value: constants.LBL_NEW, label: constants.NEW_PROJECTROLE }]}
                    itemCount={ this.props.projectRoles.length }
                    views={[{ id: 1, name: constants.PROJECTROLE_LIST }]}
                    viewId={ constants.LBL_ONE }
                    onNew={ this.newHandler } />
        <ProjectRoleList projectRoles={ projectRoleList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingProjectRole ? <ProjectRoleFormWindow initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateProjectRole ? <ProjectRoleFormWrapper projectRole={ this.props.projectRole } initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={this.saveHandler} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const projectRoleId = ownProps.match.params.id;
  if (projectRoleId && state.projectRoleReducer.projectRole && projectRoleId === state.projectRoleReducer.projectRole._id) {
    return {
      initialValues : state.projectRoleReducer.projectRole,
      projectRoles: state.projectRoleReducer.projectRoles,
      projectRoleList: state.projectRoleReducer.projectRoleList,
      projectRole: state.projectRoleReducer.projectRole,
      addingProjectRole: state.projectRoleReducer.addingProjectRole,
      updateProjectRole: state.projectRoleReducer.updateProjectRole
    };
  } else {
    return {
      projectRoles: state.projectRoleReducer.projectRoles,
      projectRoleList: state.projectRoleReducer.projectRoleList,
      projectRole: state.projectRoleReducer.projectRole,
      addingProjectRole: state.projectRoleReducer.addingProjectRole,
      updateProjectRole: state.projectRoleReducer.updateProjectRole,
    };
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(projectRoleAction, dispatch)
});

ProjectRoleContainer.propTypes = {
  projectRoles: PropTypes.array,
  projectRoleList: PropTypes.array,
  projectRole: PropTypes.object,
  addingProjectRole: PropTypes.bool,
  updateProjectRole: PropTypes.bool,
  initialValues : PropTypes.object,
  action: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectRoleContainer);