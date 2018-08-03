import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import constants from '../../constants/Constants';
import Roles from './Roles';
import Users from './Users';
import './AssignRole.css';
import * as roleActions from '../../action/RoleAction';
import * as userActions from '../../action/UserAction';
import * as userRoleActions from '../../action/UserRoleAction';
var i = 0;
var selectedUserRoleData = [];

class AssignRole extends React.Component {
  constructor() {
    super();
    this.state = { users: [], roles: [], validateRole: { UserId: '', RoleId: '' }, selectedUserRoles: [], userRole: [] };
    this.onRoleChange = this.onRoleChange.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleRoleClick = this.handleRoleClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillMount() {
    this.props.action.getAllActiveUsers();
    this.props.action.getAllActiveRoles();
  }
  onRoleChange() {
    let roleList =  this.props.roles;
    roleList.map((role,index) => (
      role["isSelected"] = false
    ));

    this.setState({ roles : roleList });
  }
  onUserChange() {
    let userList = this.props.users;
    userList.map((user,index) => (
      user["isSelected"] = false
    ));

    this.setState({ users : userList });
  }
  handleUserClick(e) {
    var selectedUsers = this.props.users.slice();
    let selected = selectedUsers.map((user,index) => (this.getSelectedUser(user,e)));
    for (i = 0; i < selected.length; i++) {
      if (selected[i].isSelected === true) {
        selectedUserRoleData['UserId'] = selected[i]._id;
        selectedUserRoleData['RoleId'] = '';
      }
    }

    this.setState({ selectedUserRoles : selectedUserRoleData }, function() {
      if (this.state.selectedUserRoles.UserId !== undefined || this.state.selectedUserRoles.UserId !== '') {
        this.props.action.getUserRoleById(this.state.selectedUserRoles.UserId)
        .then(() => {
          this.setState({ userRole: this.props.userRole }, function() {
            this.onRoleChange();
            if (this.state.userRole.length !== 0) {
              var roles = this.props.roles;
              for (i = 0; i < roles.length; i++) {
                if (roles[i]._id === this.state.userRole[0].RoleId[0]) {
                  roles[i].isSelected = true;
                  selectedUserRoleData['RoleId'] = this.state.userRole[0].RoleId[0];
                }
              }

              this.setState({ roles: roles });
              this.setState({ selectedUserRoles : selectedUserRoleData });
            }
            else {
              this.onRoleChange();
            }
          });
        })
        .catch(error => {
          toastr.error(error);
        });
      }
    });
  }
  handleRoleClick(e) {
    var selectedRoles = this.props.roles.slice();
    let selected = selectedRoles.map((role,index) => (this.getSelectedRole(role,e)));
    for (i = 0; i < selected.length; i++) {
      if (selected[i].isSelected === true) {
        selectedUserRoleData['RoleId'] = selected[i]._id;
      }
    }

    this.setState({ roles : selected });
    this.setState({ selectedUserRoles : selectedUserRoleData });
  }
  getSelectedRole(role, roleInput) {
    if (role._id === roleInput.target.id) {
      role["isSelected"] = true;
    }
    else {
      role["isSelected"] = false;
    }

    return role;
  }
  getSelectedUser(user, userInput) {
    if (user._id === userInput.target.id) {
      user["isSelected"] = true;
    }
    else {
      user["isSelected"] = false;
    }

    return user;
  }
  checkValidations() {
    var isValid = false;
    if (this.state.selectedUserRoles.UserId === undefined && this.state.selectedUserRoles.RoleId === undefined) {
      toastr.error(constants.REQUIRED_SELECT_MESSAGE);
      isValid = true;
    }
    else if (this.state.selectedUserRoles.UserId === undefined || this.state.selectedUserRoles.UserId === '') {
      toastr.error(constants.REQUIRED_USER_MESSAGE);
      isValid = true;
    }
    else if (this.state.selectedUserRoles.RoleId === undefined || this.state.selectedUserRoles.RoleId === '') {
      toastr.error(constants.REQUIRED_ROLE_MESSAGE);
      isValid = true;
    }

    return isValid;
  }
  onSubmit(e) {
    e.preventDefault();
    if (!this.checkValidations()) {
      this.props.action.userRoleInsert(this.state.selectedUserRoles)
      .then(() => {
        toastr.success(constants.INSERT_SUCCESS_MESSAGE)
        this.onRoleChange();
        this.onUserChange();
        selectedUserRoleData['UserId'] = '';
        selectedUserRoleData['RoleId'] = '';
        this.setState({ selectedUserRoles: selectedUserRoleData });
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  render() {
    return(
      <div className="container col-md-12 containerStyle">
        <div className="panel panel-info">
          <div className="panel-heading">{ constants.ASSIGN_ROLES }</div>
          <div className="panel-body">
            <div className="col-md-12">
              <div className="col-md-6">
                <label className="control-label fontforlabel" htmlFor="Users">Users</label>
                <div className="well divStyle">
                  <Users users={ this.props.users } onClick={ (e) => this.handleUserClick(e) }/>
                </div>
              </div>
              <div className="col-md-6">
                <label className="control-label fontforlabel" htmlFor="Groups">Roles</label>
                <div className="well wellStyle">
                  <Roles roles={ this.props.roles } onRoleClick={ (e) => this.handleRoleClick(e) }/>
                </div>
              </div>
            </div>

            <div id="ActionButton" className="form-group pull-right">
              <button className='btn btn-primary marginRight' onClick={ this.onSubmit }>{ constants.SAVE }</button>
              <button className='btn' onClick={ () => history.go(-1) }>{ constants.CANCEL }</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.userReducer.usersActive,
    roles: state.roleReducer.rolesActive,
    userRole: state.userRoleReducer.userRole
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators({ ...userActions, ...roleActions, ...userRoleActions }, dispatch)
});

AssignRole.propTypes = {
  users: PropTypes.array,
  roles: PropTypes.array,
  userRole: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignRole);