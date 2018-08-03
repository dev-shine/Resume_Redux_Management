import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as databaseAction from '../../action/DatabaseAction';
import { HomeHeader } from './../landing/PageHeader';
import DatabaseFormWindow from './DatabaseFormWindow';
import DatabaseFormWrapper from './DatabaseFormWrapper';
import DatabaseList from './DatabaseList';
import constants from '../../constants/Constants';

class DatabaseContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllDatabases();
  }
  newHandler() {
    this.props.action.openAddDatabaseWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeDatabaseWindow();
    this.props.history.replace('/databases');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const database = {
        _id: values._id,
        DatabaseName: values.DatabaseName,
        IsActive : values.IsActive
      };
      this.props.action.databaseUpdate(database)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        }
        this.props.action.closeDatabaseWindow();
        this.props.history.push('/databases');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const database = {
        DatabaseName: values.DatabaseName,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.databaseInsert(database)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        }
        this.props.action.closeDatabaseWindow();
        this.props.history.push('/databases');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getDatabaseById(id);
    this.props.action.openUpdateDatabaseWindow();
    this.props.history.push('/database/' + id);
  }
  deleteHandler(id) {
    this.props.action.databaseDelete(id)
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
    const { databaseList } = this.props;
    if (!databaseList) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_DATABASE }
                    actions={[{ value: constants.LBL_NEW, label: constants.NEW_DATABASE }]}
                    itemCount={ this.props.databases.length }
                    views={[{ id: 1, name: constants.DATABASE_LIST }]}
                    viewId={ constants.LBL_ONE }
                    onNew={ this.newHandler } />
        <DatabaseList databases={ databaseList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingDatabase ? <DatabaseFormWindow initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateDatabase ? <DatabaseFormWrapper database={ this.props.database } initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={this.saveHandler} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const databaseId = ownProps.match.params.id;
  if (databaseId && state.databaseReducer.database && databaseId === state.databaseReducer.database._id) {
    return {
      initialValues : state.databaseReducer.database,
      databases: state.databaseReducer.databases,
      databaseList: state.databaseReducer.databaseList,
      database: state.databaseReducer.database,
      addingDatabase: state.databaseReducer.addingDatabase,
      updateDatabase: state.databaseReducer.updateDatabase
    };
  } else {
    return {
      databases: state.databaseReducer.databases,
      databaseList: state.databaseReducer.databaseList,
      database: state.databaseReducer.database,
      addingDatabase: state.databaseReducer.addingDatabase,
      updateDatabase: state.databaseReducer.updateDatabase,
    };
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(databaseAction, dispatch)
});

DatabaseContainer.propTypes = {
  databases: PropTypes.array,
  databaseList: PropTypes.array,
  database: PropTypes.object,
  addingDatabase: PropTypes.bool,
  updateDatabase: PropTypes.bool,
  initialValues : PropTypes.object,
  action: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseContainer);