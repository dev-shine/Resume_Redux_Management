import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as roleAction from '../../action/RoleAction';
import { HomeHeader } from './../landing/PageHeader';
import RoleFormWindow from './RoleFormWindow';
import RoleFormWrapper from './RoleFormWrapper';
import RoleList from './RoleList';
import constants from '../../constants/Constants';

class RoleContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllRoles();
  }
  newHandler() {
    this.props.action.openAddRoleWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeRoleWindow();
    this.props.history.replace('/roles');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const role = {
        _id: values._id,
        RoleName: values.RoleName,
        IsActive : values.IsActive
      };
      this.props.action.roleUpdate(role)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        }
        this.props.action.closeRoleWindow();
        this.props.history.push('/roles');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const role = {
        RoleName: values.RoleName,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.roleInsert(role)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        }
        this.props.action.closeRoleWindow();
        this.props.history.push('/roles');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getRoleById(id);
    this.props.action.openUpdateRoleWindow();
    this.props.history.push('/role/' + id);
  }
  deleteHandler(id) {
    this.props.action.roleDelete(id)
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
    const { roleList } = this.props;
    if (!roleList) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_ROLE }
                    actions={[{ value: constants.LBL_NEW, label: constants.NEW_ROLE }]}
                    itemCount={ this.props.roles.length }
                    views={[{ id: 1, name: constants.ROLE_LIST }]}
                    viewId={ constants.LBL_ONE }
                    onNew={ this.newHandler } />
        <RoleList roles={ roleList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingRole ? <RoleFormWindow initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateRole ? <RoleFormWrapper role={ this.props.role } initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={this.saveHandler} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const roleId = ownProps.match.params.id;
  if (roleId && state.roleReducer.role && roleId === state.roleReducer.role._id) {
    return {
      initialValues : state.roleReducer.role,
      roles: state.roleReducer.roles,
      roleList: state.roleReducer.roleList,
      role: state.roleReducer.role,
      addingRole: state.roleReducer.addingRole,
      updateRole: state.roleReducer.updateRole
    };
  } else {
    return {
      roles: state.roleReducer.roles,
      roleList: state.roleReducer.roleList,
      role: state.roleReducer.role,
      addingRole: state.roleReducer.addingRole,
      updateRole: state.roleReducer.updateRole,
    };
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(roleAction, dispatch)
});

RoleContainer.propTypes = {
  roles: PropTypes.array,
  roleList: PropTypes.array,
  role: PropTypes.object,
  addingRole: PropTypes.bool,
  updateRole: PropTypes.bool,
  initialValues : PropTypes.object,
  action: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleContainer);