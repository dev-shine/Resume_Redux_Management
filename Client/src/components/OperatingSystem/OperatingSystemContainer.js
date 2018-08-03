import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as operatingSystemAction from '../../action/OperatingSystemAction';
import { HomeHeader } from './../landing/PageHeader';
import OperatingSystemFormWindow from './OperatingSystemFormWindow';
import OperatingSystemFormWrapper from './OperatingSystemFormWrapper';
import OperatingSystemList from './OperatingSystemList';
import constants from '../../constants/Constants';

class OperatingSystemContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllOperatingSystems();
  }
  newHandler() {
    this.props.action.openAddOperatingSystemWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeOperatingSystemWindow();
    this.props.history.replace('/operatingSystems');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const operatingSystem = {
        _id: values._id,
        OperatingSystemName: values.OperatingSystemName,
        IsActive : values.IsActive
      };
      this.props.action.operatingSystemUpdate(operatingSystem)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        }
        this.props.action.closeOperatingSystemWindow();
        this.props.history.push('/operatingSystems');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const operatingSystem = {
        OperatingSystemName: values.OperatingSystemName,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.operatingSystemInsert(operatingSystem)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        }
        this.props.action.closeOperatingSystemWindow();
        this.props.history.push('/operatingSystems');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getOperatingSystemById(id);
    this.props.action.openUpdateOperatingSystemWindow();
    this.props.history.push('/operatingSystem/' + id);
  }
  deleteHandler(id) {
    this.props.action.operatingSystemDelete(id)
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
    const { operatingSystemList } = this.props;
    if (!operatingSystemList) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_OPERATINGSYSTEM }
                    actions={[{ value: constants.LBL_NEW, label: constants.NEW_OPERATINGSYSTEM }]}
                    itemCount={ this.props.operatingSystems.length }
                    views={[{ id: 1, name: constants.OPERATINGSYSTEM_LIST }]}
                    viewId={ constants.LBL_ONE }
                    onNew={ this.newHandler } />
        <OperatingSystemList operatingSystems={ operatingSystemList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingOperatingSystem ? <OperatingSystemFormWindow initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateOperatingSystem ? <OperatingSystemFormWrapper operatingSystem={ this.props.operatingSystem } initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={this.saveHandler} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const operatingSystemId = ownProps.match.params.id;
  if (operatingSystemId && state.operatingSystemReducer.operatingSystem && operatingSystemId === state.operatingSystemReducer.operatingSystem._id) {
    return {
      initialValues : state.operatingSystemReducer.operatingSystem,
      operatingSystems: state.operatingSystemReducer.operatingSystems,
      operatingSystemList: state.operatingSystemReducer.operatingSystemList,
      operatingSystem: state.operatingSystemReducer.operatingSystem,
      addingOperatingSystem: state.operatingSystemReducer.addingOperatingSystem,
      updateOperatingSystem: state.operatingSystemReducer.updateOperatingSystem
    };
  } else {
    return {
      operatingSystems: state.operatingSystemReducer.operatingSystems,
      operatingSystemList: state.operatingSystemReducer.operatingSystemList,
      operatingSystem: state.operatingSystemReducer.operatingSystem,
      addingOperatingSystem: state.operatingSystemReducer.addingOperatingSystem,
      updateOperatingSystem: state.operatingSystemReducer.updateOperatingSystem,
    };
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(operatingSystemAction, dispatch)
});

OperatingSystemContainer.propTypes = {
  operatingSystems: PropTypes.array,
  operatingSystemList: PropTypes.array,
  operatingSystem: PropTypes.object,
  addingOperatingSystem: PropTypes.bool,
  updateOperatingSystem: PropTypes.bool,
  initialValues : PropTypes.object,
  action: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(OperatingSystemContainer);