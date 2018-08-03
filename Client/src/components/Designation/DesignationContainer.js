import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as designationAction from '../../action/DesignationAction';
import { HomeHeader } from './../landing/PageHeader';
import DesignationFormWindow from './DesignationFormWindow';
import DesignationFormWrapper from './DesignationFormWrapper';
import DesignationList from './DesignationList';
import constants from '../../constants/Constants';

class DesignationContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllDesignations();
  }
  newHandler() {
    this.props.action.openAddDesignationWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeDesignationWindow();
    this.props.history.replace('/designations');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const designation = {
        _id: values._id,
        DesignationName: values.DesignationName,
        IsActive : values.IsActive
      };
      this.props.action.designationUpdate(designation)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        }
        this.props.action.closeDesignationWindow();
        this.props.history.push('/designations');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const designation = {
        DesignationName: values.DesignationName,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.designationInsert(designation)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        }
        this.props.action.closeDesignationWindow();
        this.props.history.push('/designations');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getDesignationById(id);
    this.props.action.openUpdateDesignationWindow();
    this.props.history.push('/designation/' + id);
  }
  deleteHandler(id) {
    this.props.action.designationDelete(id)
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
    const { designationList } = this.props;
    if (!designationList) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_DESIGNATION }
                    actions={[{ value: constants.LBL_NEW, label: constants.NEW_DESIGNATION }]}
                    itemCount={ this.props.designations.length }
                    views={[{ id: 1, name: constants.DESIGNATION_LIST }]}
                    viewId={ constants.LBL_ONE }
                    onNew={ this.newHandler } />
        <DesignationList designations={ designationList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingDesignation ? <DesignationFormWindow initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateDesignation ? <DesignationFormWrapper designation={ this.props.designation } initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={this.saveHandler} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const designationId = ownProps.match.params.id;
  if (designationId && state.designationReducer.designation && designationId === state.designationReducer.designation._id) {
    return {
      initialValues : state.designationReducer.designation,
      designations: state.designationReducer.designations,
      designationList: state.designationReducer.designationList,
      designation: state.designationReducer.designation,
      addingDesignation: state.designationReducer.addingDesignation,
      updateDesignation: state.designationReducer.updateDesignation
    };
  } else {
    return {
      designations: state.designationReducer.designations,
      designationList: state.designationReducer.designationList,
      designation: state.designationReducer.designation,
      addingDesignation: state.designationReducer.addingDesignation,
      updateDesignation: state.designationReducer.updateDesignation,
    };
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(designationAction, dispatch)
});

DesignationContainer.propTypes = {
  designations: PropTypes.array,
  designationList: PropTypes.array,
  designation: PropTypes.object,
  addingDesignation: PropTypes.bool,
  updateDesignation: PropTypes.bool,
  initialValues : PropTypes.object,
  action: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DesignationContainer);