import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as applicationAction from '../../action/ApplicationAction';
import { HomeHeader } from './../landing/PageHeader';
import ApplicationFormWindow from './ApplicationFormWindow';
import ApplicationFormWrapper from './ApplicationFormWrapper';
import ApplicationList from './ApplicationList';
import { NotificationManager } from 'react-notifications';
import constants from '../../constants/Constants';


class ApplicationContainer extends React.Component {
  constructor() {
      super();
      this.newHandler = this.newHandler.bind(this);
      this.cancelHandler = this.cancelHandler.bind(this);
      this.saveHandler = this.saveHandler.bind(this);
      this.editHandler = this.editHandler.bind(this);
      this.deleteHandler = this.deleteHandler.bind(this);
  }
componentDidMount()
{
  this.props.action.getAllApplications();
}

newHandler() {
this.props.action.openAddApplicationWindow();
 }

cancelHandler() {
    event.preventDefault();
    this.props.action.closeApplicationWindow();
    this.props.history.replace('/applications');
}

deleteHandler(id){
  this.props.action.applicationDelete(id)
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

saveHandler(values) {
if(values._id !== undefined)
{
  const application = {
          _id: values._id,
          ApplicationName: values.ApplicationName,
          IsActive : values.IsActive
      };
  this.props.action.applicationUpdate(application)
  .then((response) => {
    if(response.data.message === "Conflict")
    {
     toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
    }
    else {
      toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
    }

            this.props.action.closeApplicationWindow();
                this.props.history.push('/applications');
            }).catch(error => {
                toastr.error(error);
            });
}
else {
  const application = {
          ApplicationName: values.ApplicationName,
          IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.applicationInsert(application)
      .then((response) => {
                  if(response.data.message === "Conflict")
                  {
                   toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
                  }
                  else {
                    toastr.success(constants.INSERT_SUCCESS_MESSAGE);
                  }
                  this.props.action.closeApplicationWindow();
                    this.props.history.push('/applications');
                }).catch(error => {
                    toastr.error(error);
                });
              }
}


editHandler(id) {
  this.props.action.getApplicationById(id);
  this.props.action.openUpdateApplicationWindow();
  this.props.history.push('/application/' + id);
}

  render() {
    const { applicationList } = this.props;

          if (!applicationList) {
              return (
                  <div>Loading...</div>
              );
          }

    return (
      <div>
          <HomeHeader newLabel={ constants.NEW_APPLICATION }
                      actions={[{ value: constants.LBL_NEW, label: constants.NEW_APPLICATION }]}
                      itemCount={ this.props.applications.length }
                      views={[{ id: 1, name: constants.APPLICATION_LIST }]}
                      viewId={ constants.LBL_ONE }
                      onNew={ this.newHandler } />
          <ApplicationList  applications={ applicationList } editHandler = {this.editHandler} deleteHandler = {this.deleteHandler}/>
          { this.props.addingApplication ? <ApplicationFormWindow initialValues={this.props.initialValues}  cancelHandler={ this.cancelHandler } saveHandler = {this.saveHandler} /> : null }
          { this.props.updateApplication ? <ApplicationFormWrapper initialValues={this.props.initialValues}  cancelHandler={ this.cancelHandler } saveHandler = {this.saveHandler} /> : null }
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
    const applicationId = ownProps.match.params.id; //from the path '/application/:id'

    if (applicationId && state.applicationsReducer.application && applicationId === state.applicationsReducer.application._id) {
        return {
           initialValues : state.applicationsReducer.application,
           applications: state.applicationsReducer.applications,
           applicationList: state.applicationsReducer.applicationList,
           application: state.applicationsReducer.application,
           addingApplication: state.applicationsReducer.addingApplication,
           updateApplication: state.applicationsReducer.updateApplication,
        };
    } else {
        return {
           applications: state.applicationsReducer.applications,
           applicationList: state.applicationsReducer.applicationList,
           application: state.applicationsReducer.application,
           addingApplication: state.applicationsReducer.addingApplication,
           updateApplication: state.applicationsReducer.updateApplication,
        };
    }
};

const mapDispatchToProps = dispatch => ({
    action: bindActionCreators(applicationAction, dispatch)
});



ApplicationContainer.propTypes = {
    applications: PropTypes.array,
    applicationList: PropTypes.array,
    application: PropTypes.object,
    addingApplication: PropTypes.bool,
    updateApplication: PropTypes.bool,
    action: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    initialValues : PropTypes.object
};



export default connect(mapStateToProps, mapDispatchToProps)(ApplicationContainer);
