import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as frameworkAction from '../../action/FrameworkAction';
import { HomeHeader } from './../landing/PageHeader';
import FrameworkFormWindow from './FrameworkFormWindow';
import FrameworkFormWrapper from './FrameworkFormWrapper';
import FrameworkList from './FrameworkList';
import constants from '../../constants/Constants';

class FrameworkContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllFrameworks();
  }
  newHandler() {
    this.props.action.openAddFrameworkWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeFrameworkWindow();
    this.props.history.replace('/frameworks');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const framework = {
        _id: values._id,
        FrameworkName: values.FrameworkName,
        IsActive : values.IsActive
      };
      this.props.action.frameworkUpdate(framework)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        }
        this.props.action.closeFrameworkWindow();
        this.props.history.push('/frameworks');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const framework = {
        FrameworkName: values.FrameworkName,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.frameworkInsert(framework)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        }
        this.props.action.closeFrameworkWindow();
        this.props.history.push('/frameworks');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getFrameworkById(id);
    this.props.action.openUpdateFrameworkWindow();
    this.props.history.push('/framework/' + id);
  }
  deleteHandler(id) {
    this.props.action.frameworkDelete(id)
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
    const { frameworkList } = this.props;
    if (!frameworkList) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_FRAMEWORK }
                    actions={[{ value: constants.LBL_NEW, label: constants.NEW_FRAMEWORK }]}
                    itemCount={ this.props.frameworks.length }
                    views={[{ id: 1, name: constants.FRAMEWORK_LIST }]}
                    viewId={ constants.LBL_ONE }
                    onNew={ this.newHandler } />
        <FrameworkList frameworks={ frameworkList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingFramework ? <FrameworkFormWindow initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateFramework ? <FrameworkFormWrapper framework={ this.props.framework } initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={this.saveHandler} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const frameworkId = ownProps.match.params.id;
  if (frameworkId && state.frameworkReducer.framework && frameworkId === state.frameworkReducer.framework._id) {
    return {
      initialValues : state.frameworkReducer.framework,
      frameworks: state.frameworkReducer.frameworks,
      frameworkList: state.frameworkReducer.frameworkList,
      framework: state.frameworkReducer.framework,
      addingFramework: state.frameworkReducer.addingFramework,
      updateFramework: state.frameworkReducer.updateFramework
    };
  } else {
    return {
      frameworks: state.frameworkReducer.frameworks,
      frameworkList: state.frameworkReducer.frameworkList,
      framework: state.frameworkReducer.framework,
      addingFramework: state.frameworkReducer.addingFramework,
      updateFramework: state.frameworkReducer.updateFramework,
    };
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(frameworkAction, dispatch)
});

FrameworkContainer.propTypes = {
  frameworks: PropTypes.array,
  frameworkList: PropTypes.array,
  framework: PropTypes.object,
  addingFramework: PropTypes.bool,
  updateFramework: PropTypes.bool,
  initialValues : PropTypes.object,
  action: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FrameworkContainer);