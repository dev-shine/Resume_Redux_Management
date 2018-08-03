import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as technologyAction from '../../action/TechnologyAction';
import { HomeHeader } from './../landing/PageHeader';
import TechnologyFormWindow from './TechnologyFormWindow';
import TechnologyFormWrapper from './TechnologyFormWrapper';
import TechnologyList from './TechnologyList';
import constants from '../../constants/Constants';

class TechnologyContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllTechnologies();
  }
  newHandler() {
    this.props.action.openAddTechnologyWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeTechnologyWindow();
    this.props.history.replace('/technologies');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const technology = {
        _id: values._id,
        TechnologyName: values.TechnologyName,
        IsActive : values.IsActive
      };
      this.props.action.technologyUpdate(technology)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        }
        this.props.action.closeTechnologyWindow();
        this.props.history.push('/technologies');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const technology = {
        TechnologyName: values.TechnologyName,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.technologyInsert(technology)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        }
        this.props.action.closeTechnologyWindow();
        this.props.history.push('/technologies');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getTechnologyById(id);
    this.props.action.openUpdateTechnologyWindow();
    this.props.history.push('/technology/' + id);
  }
  deleteHandler(id) {
    this.props.action.technologyDelete(id)
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
    const { technologyList } = this.props;
    if (!technologyList) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_TECHNOLOGY }
                    actions={[{ value: constants.LBL_NEW, label: constants.NEW_TECHNOLOGY }]}
                    itemCount={ this.props.technologies.length }
                    views={[{ id: 1, name: constants.TECHNOLOGY_LIST }]}
                    viewId={ constants.LBL_ONE }
                    onNew={ this.newHandler } />
        <TechnologyList technologies={ technologyList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingTechnology ? <TechnologyFormWindow initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateTechnology ? <TechnologyFormWrapper technology={ this.props.technology } initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={this.saveHandler} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const technologyId = ownProps.match.params.id;
  if (technologyId && state.technologyReducer.technology && technologyId === state.technologyReducer.technology._id) {
    return {
      initialValues : state.technologyReducer.technology,
      technologies: state.technologyReducer.technologies,
      technologyList: state.technologyReducer.technologyList,
      technology: state.technologyReducer.technology,
      addingTechnology: state.technologyReducer.addingTechnology,
      updateTechnology: state.technologyReducer.updateTechnology
    };
  } else {
    return {
      technologies: state.technologyReducer.technologies,
      technologyList: state.technologyReducer.technologyList,
      technology: state.technologyReducer.technology,
      addingTechnology: state.technologyReducer.addingTechnology,
      updateTechnology: state.technologyReducer.updateTechnology,
    };
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(technologyAction, dispatch)
});

TechnologyContainer.propTypes = {
  technologies: PropTypes.array,
  technologyList: PropTypes.array,
  technology: PropTypes.object,
  addingTechnology: PropTypes.bool,
  updateTechnology: PropTypes.bool,
  initialValues : PropTypes.object,
  action: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(TechnologyContainer);