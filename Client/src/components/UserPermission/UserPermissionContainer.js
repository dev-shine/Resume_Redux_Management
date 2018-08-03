import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tree, { TreeNode } from 'rc-tree';
import toastr from 'toastr';
import classNames from 'classnames';
import Ddl from'../common/Ddl';
import constants from '../../constants/Constants';
import * as permissionModuleActions from '../../action/PermissionModuleAction';
import * as userActions from '../../action/UserAction';
import * as userPermissionActions from '../../action/UserPermissionAction';
var parentNodeList = [];
var childNodeList = [];
var selectedNodeList = [];
var selectedList = [];

function generateTreeNodes(treeNode) {
  var nodeList = [];
  parentNodeList.forEach((item) => {
    nodeList = [];
    for(let i = 0; i < childNodeList.length; i++) {
      if(item._id === childNodeList[i].ParentPermissionModuleId) {
        nodeList.push({ name: childNodeList[i].DisplayName, key: childNodeList[i].PermissionModuleName, isLeaf: true, _id: childNodeList[i]._id });
        item.children = nodeList;
      }
    }
  });

  return nodeList;
}
class UserPermissionContainer extends React.Component {
  constructor() {
    super();
    this.state = { user: [], userPermissionInsertStatus: '', checkedKeys: [], validateUser: { User : false, checkedKeys: [] } };
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onLoadData = this.onLoadData.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
    this.onUnSelectAll = this.onUnSelectAll.bind(this);
  }
  componentWillMount() {
    this.props.action.getAllActiveUsers();
    this.props.action.getAllPermissionModules();
  }
  onChangeUser(e) {
    const currentState = this.state.validateUser;
    if(e === '0') {
      currentState['User'] = true;
    }
    else {
      currentState['User'] = false;
    }

    selectedList['UserId'] = e;
    this.setState({ validateUser : currentState });
    this.setState({ user : selectedList }, function() {
      if (this.state.user.UserId !== undefined) {
        this.props.action.getUserPermissionById(this.state.user.UserId)
        .then(() => {
          var checkedKeys = [];
          var i = 0;
          selectedNodeList = [];
          selectedList['ModuleList'] = [];
          for(i = 0; i < this.props.userPermission.length; i++) {
            let userData = {
              PermissionModuleId: this.props.userPermission[i]._id,
              ModuleKey: this.props.userPermission[i].ModuleKey
            }

            checkedKeys.push(this.props.userPermission[i].ModuleKey);
            selectedNodeList.push(userData);
            selectedList['ModuleList'] = selectedNodeList;
          }

          this.setState({ checkedKeys: checkedKeys });
          this.setState({ user : selectedList });
        })
        .catch(error => {
          toastr.error(error);
        });
      }
    });
  }
  onLoadData(treeNode) {
    return new Promise((resolve) => {
      const treeData = [...parentNodeList];
      this.setState({ treeData });
      parentNodeList = treeData;
      resolve();
    });
  }
  onCheck(checkedKeys, e) {
    selectedNodeList = [];
    var i = 0;
    if(e !== undefined) {
      for(i = 0; i < e.checkedNodes.length; i++) {
        let userData = {
          PermissionModuleId: e.checkedNodes[i].props.id,
          ModuleKey: e.checkedNodes[i].key
        }

        selectedNodeList.push(userData);
        selectedList['ModuleList'] = selectedNodeList;
      }
    }
    else {
      for(i = 0; i < this.props.permissionModuleList.length; i++) {
        let userData = {
          PermissionModuleId: this.props.permissionModuleList[i]._id,
          ModuleKey: this.props.permissionModuleList[i].PermissionModuleName
        }

        selectedNodeList.push(userData);
        selectedList['ModuleList'] = selectedNodeList;
      }
    }

    this.setState({ user : selectedList });
    this.setState({ checkedKeys });
  }
  checkValidations() {
    const currentState = this.state.validateUser;
    var isValid = false;
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      if(select.value === '0') {
        currentState[select.id] = true;
        isValid = true;
      }
    });

    this.setState({ validateUser : currentState });
    return isValid;
  }
  saveHandler(e) {
    e.preventDefault();
    if (!this.checkValidations()) {
      this.props.action.userPermissionInsert(this.state.user)
      .then(() => {
        selectedList = [];
        this.setState({ user: [], checkedKeys: [] });
        toastr.success(constants.INSERT_SUCCESS_MESSAGE);
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  cancelHandler() {
    this.setState({ user: [], checkedKeys: [] });
  }
  onSelectAll() {
    selectedNodeList = [];
    for(var i = 0; i < this.props.permissionModuleList.length; i++) {
      var ModuleKey = this.props.permissionModuleList[i].PermissionModuleName;
      selectedNodeList.push(ModuleKey);
    }

    this.setState({ checkedKeys: selectedNodeList }, function() {
      this.onCheck(this.state.checkedKeys);
    });
  }
  onUnSelectAll() {
    this.setState({ checkedKeys: [] }, function() {
      selectedList['ModuleList'] = [];
      this.setState({ user: selectedList });
    });
  }
  render() {
    if (this.props.permissionModuleList.length !== 0) {
      if(parentNodeList.length === 0 || childNodeList === 0) {
        for(let i = 0; i < this.props.permissionModuleList.length; i++) {
          if (this.props.permissionModuleList[i].ParentPermissionModuleId === null) {
            parentNodeList.push(this.props.permissionModuleList[i]);
          }
          else {
            childNodeList.push(this.props.permissionModuleList[i]);
          }
        }
      }
    }

    const loop = (data) => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode title={ item.DisplayName } key={ item.PermissionModuleName } id={ item._id }>{ loop(item.children) }</TreeNode>;
        }
        else {
          generateTreeNodes(item);
          if(item.key) {
            return <TreeNode title={ item.name } key={ item.key } isLeaf={ item.isLeaf } id={ item._id }></TreeNode>;
          }
          else {
            return <TreeNode title={ item.DisplayName } key={ item.PermissionModuleName } id={ item._id }></TreeNode>;
          }
        }
      });
    };
    const treeNodes = loop(parentNodeList);
    return (
      <div>
          <div className='slds-page-header'>
              <div className='slds-grid'>
                  <div className='slds-col slds-no-flex slds-has-flexi-truncate'>
                      <div className='slds-grid slds-no-space'>
                          <h4 className='slds-truncate' title=''>{ constants.USER_PERMISSION }</h4>
                      </div>
                  </div>
              </div>
          </div>
          <div className='form-group col-md-12'>
              <div className='col-md-4'>
                  <label id={ constants.USER_LABEL } className='control-label'>{ constants.USER }</label>
                  <Ddl id={ constants.USER } name={ constants.DDL_USER } className={classNames({'form-control':true, 'BorderRed': this.state.validateUser.User})} options={ this.props.usersActive ? this.props.usersActive : [] } value={ this.state.user.UserId } onValueChange={ this.onChangeUser } valueField='_id' labelField='Email' />
                  <div className={classNames({'error': this.state.validateUser.User, 'displayNone': !this.state.validateUser.User})} id={ constants.USER_ERROR }>{ constants.SELECT_MESSAGE +' '+ constants.USER }</div>
              </div>
              <div className='col-md-8'>
                  <a href='#' className='paddingRight' onClick={ this.onSelectAll }>{ constants.LBL_SELECTALL }</a>
                  <a href='#' onClick={ this.onUnSelectAll }>{ constants.LBL_UNSELECTALL} </a>
                  <Tree
                    checkable onCheck={ this.onCheck } checkedKeys={ this.state.checkedKeys }
                    loadData={ this.onLoadData }>
                    {treeNodes}
                  </Tree>
              </div>
          </div>
          <div>
              <button className='btn btn-primary marginLeft' onClick={ this.saveHandler.bind(this) }>{ constants.SAVE }</button>
              <button className='btn MarginLeft1Per' onClick={ this.cancelHandler.bind(this) }>{ constants.CANCEL }</button>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    usersActive: state.userReducer.usersActive,
    permissionModuleList: state.permissionModuleReducer.permissionModuleList,
    userPermission: state.userPermissionReducer.userPermission
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators({...permissionModuleActions, ...userActions, ...userPermissionActions}, dispatch)
});

UserPermissionContainer.propTypes = {
  usersActive: PropTypes.array,
  permissionModuleList: PropTypes.array,
  userPermission: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPermissionContainer);