import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as userAction from '../../action/UserAction';
import { HomeHeader } from './../landing/PageHeader';
import UserFormWindow from './UserFormWindow';
import UserFormWrapper from './UserFormWrapper';
import UserList from './UserList';
import constants from '../../constants/Constants';

class UserContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllUsers();
  }
  newHandler() {
    this.props.action.openAddUserWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeUserWindow();
    this.props.history.replace('/users');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const user = {
        _id: values._id,
        FirstName: values.FirstName,
        LastName: values.LastName,
        ContactNumber: values.ContactNumber,        
        IsActive : values.IsActive
      };
      this.props.action.userUpdate(user)
      .then(() => {
        toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        this.props.action.closeUserWindow();
        this.props.history.push('/users');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const user = {
        FirstName: values.FirstName,
        LastName: values.LastName,
        ContactNumber: values.ContactNumber,
        Email: values.Email,
        Password: values.Password,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.userInsert(user)
      .then(() => {
        toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        this.props.action.closeUserWindow();
        this.props.history.push('/users');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getUserById(id);
    this.props.action.openUpdateUserWindow();
    this.props.history.push('/user/' + id);
  }
  deleteHandler(id) {
    this.props.action.userDelete(id)
    .then(() => {
      toastr.success(constants.DELETE_SUCCESS_MESSAGE);
      this.props.action.closeUserWindow();
      this.props.history.push('/users');
    })
    .catch(error => {
      toastr.error(error);
    });
  }
  render() {
    const { userList } = this.props;
    if (!userList) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_USER }
                    actions={[{ value: constants.LBL_NEW, label: constants.NEW_USER }]}
                    itemCount={ this.props.users.length }
                    views={[{ id: 1, name: constants.USER_LIST }]}
                    viewId={ constants.LBL_ONE }
                    onNew={ this.newHandler } />
        <UserList users={ userList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingUser ? <UserFormWindow initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateUser ? <UserFormWrapper user={ this.props.user } initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={this.saveHandler} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const userId = ownProps.match.params.id;
  if (userId && state.userReducer.user && userId === state.userReducer.user._id) {
    return {
      initialValues : state.userReducer.user,
      users: state.userReducer.users,
      userList: state.userReducer.userList,
      user: state.userReducer.user,
      addingUser: state.userReducer.addingUser,
      updateUser: state.userReducer.updateUser
    };
  } else {
    return {
      users: state.userReducer.users,
      userList: state.userReducer.userList,
      user: state.userReducer.user,
      addingUser: state.userReducer.addingUser,
      updateUser: state.userReducer.updateUser,
    };
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(userAction, dispatch)
});

UserContainer.propTypes = {
  users: PropTypes.array,
  userList: PropTypes.array,
  user: PropTypes.object,
  addingUser: PropTypes.bool,
  updateUser: PropTypes.bool,
  initialValues : PropTypes.object,
  action: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);