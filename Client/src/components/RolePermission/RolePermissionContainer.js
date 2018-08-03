import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tree, { TreeNode } from 'rc-tree';
import toastr from 'toastr';
import classNames from 'classnames';
import Ddl from'../common/Ddl';
import constants from '../../constants/Constants';
import * as permissionModuleActions from '../../action/PermissionModuleAction';
import * as roleActions from '../../action/RoleAction';
import * as rolePermissionActions from '../../action/RolePermissionAction';
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
class RolePermissionContainer extends React.Component {
  constructor() {
    super();
    this.state = { role: [], rolePermissionInsertStatus: '', checkedKeys: [], validateRole: { Role : false, checkedKeys: [] } };
    this.onChangeRole = this.onChangeRole.bind(this);
    this.onLoadData = this.onLoadData.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
    this.onUnSelectAll = this.onUnSelectAll.bind(this);
  }
  componentWillMount() {
    this.props.action.getAllActiveRoles();
    this.props.action.getAllPermissionModules();
  }
  onChangeRole(e) {
    const currentState = this.state.validateRole;
    if(e === '0') {
      currentState['Role'] = true;
    }
    else {
      currentState['Role'] = false;
    }

    selectedList['RoleId'] = e;
    this.setState({ validateRole : currentState });
    this.setState({ role : selectedList }, function() {
      if (this.state.role.RoleId !== undefined) {
        this.props.action.getRolePermissionById(this.state.role.RoleId)
        .then(() => {
          var checkedKeys = [];
          var i = 0;
          selectedNodeList = [];
          selectedList['ModuleList'] = [];
          for(i = 0; i < this.props.rolePermission.length; i++) {
            let roleData = {
              PermissionModuleId: this.props.rolePermission[i]._id,
              ModuleKey: this.props.rolePermission[i].ModuleKey
            }

            checkedKeys.push(this.props.rolePermission[i].ModuleKey);
            selectedNodeList.push(roleData);
            selectedList['ModuleList'] = selectedNodeList;
          }

          this.setState({ checkedKeys: checkedKeys });
          this.setState({ role : selectedList });
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
        let roleData = {
          PermissionModuleId: e.checkedNodes[i].props.id,
          ModuleKey: e.checkedNodes[i].key
        }

        selectedNodeList.push(roleData);
        selectedList['ModuleList'] = selectedNodeList;
      }
    }
    else {
      for(i = 0; i < this.props.permissionModuleList.length; i++) {
        let roleData = {
          PermissionModuleId: this.props.permissionModuleList[i]._id,
          ModuleKey: this.props.permissionModuleList[i].PermissionModuleName
        }

        selectedNodeList.push(roleData);
        selectedList['ModuleList'] = selectedNodeList;
      }
    }

    this.setState({ role : selectedList });
    this.setState({ checkedKeys });
  }
  checkValidations() {
    const currentState = this.state.validateRole;
    var isValid = false;
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      if(select.value === '0') {
        currentState[select.id] = true;
        isValid = true;
      }
    });

    this.setState({ validateRole : currentState });
    return isValid;
  }
  saveHandler(e) {
    e.preventDefault();
    if (!this.checkValidations()) {
      this.props.action.rolePermissionInsert(this.state.role)
      .then(() => {
        selectedList = [];
        this.setState({ role: [], checkedKeys: [] });
        toastr.success(constants.INSERT_SUCCESS_MESSAGE);
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  cancelHandler() {
    this.setState({ role: [], checkedKeys: [] });
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
      this.setState({ role: selectedList });
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
                          <h4 className='slds-truncate' title=''>{ constants.ROLE_PERMISSION }</h4>
                      </div>
                  </div>
              </div>
          </div>
          <div className='form-group col-md-12'>
              <div className='col-md-4'>
                  <label id={ constants.ROLE_LABEL } className='control-label'>{ constants.ROLE }</label>
                  <Ddl id={ constants.ROLE } name={ constants.DDL_ROLE } className={classNames({'form-control':true, 'BorderRed': this.state.validateRole.Role})} options={ this.props.rolesActive ? this.props.rolesActive : [] } value={ this.state.role.RoleId } onValueChange={ this.onChangeRole } valueField='_id' labelField='RoleName' />
                  <div className={classNames({'error': this.state.validateRole.Role, 'displayNone': !this.state.validateRole.Role})} id={ constants.ROLE_ERROR }>{ constants.SELECT_MESSAGE +' '+ constants.ROLE }</div>
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
    rolesActive: state.roleReducer.rolesActive,
    permissionModuleList: state.permissionModuleReducer.permissionModuleList,
    rolePermission: state.rolePermissionReducer.rolePermission
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators({...permissionModuleActions, ...roleActions, ...rolePermissionActions}, dispatch)
});

RolePermissionContainer.propTypes = {
  rolesActive: PropTypes.array,
  permissionModuleList: PropTypes.array,
  rolePermission: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(RolePermissionContainer);