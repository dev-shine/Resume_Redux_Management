import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import { HomeHeader } from './../landing/PageHeader';
import ResumeList from './ResumeList';
import { NotificationManager } from 'react-notifications';
import constants from './../../constants/Constants';
import resumeActions from './../../action/ResumeAction';

class ResumeContainer extends React.Component {
    constructor() {
        super();
        this.newHandler = this.newHandler.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.resumeCreationHandler = this.resumeCreationHandler.bind(this);
    }
    componentDidMount() {
        this.props.action.getAllResumes();
    }


    newHandler() {
        this.props.history.push('resume/create');
    }

    resumeCreationHandler(id)
    {
      this.props.action.resumeCreation(id)
        .then(function(response){
          if(response.data.message === "Conflict")
          {
           toastr.error(constants.RESUME_CREATE_ERROR_MESSAGE);
          }
          else {
            toastr.success(constants.RESUME_CREATE_SUCCESS_MESSAGE);
          }


        })
        .catch(error => {
              toastr.error(error);
          });
    }

    editHandler(id)
    {
      this.props.action.getAllResumeDetailsById(id);
      this.props.history.push('/resume/' + id);
    }

    deleteHandler(id)
    {
      this.props.action.resumeDelete(id)
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
        return (
            <div>
                <HomeHeader type={ constants.RESUME }
                            title={ 'abc' }
                            newLabel={ constants.NEW_RESUME }
                            actions={[{ value: constants.NEW_RESUME, label: constants.NEW_RESUME }]}
                            itemCount={ 1 }
                            views={[{ id: 1, name: constants.RESUME_LIST }]}
                            viewId='1'
                            onNew={ this.newHandler }
                            />
                <ResumeList resumes={ this.props.resumes } editHandler = {this.editHandler}  deleteHandler = {this.deleteHandler} resumeCreationHandler = {this.resumeCreationHandler} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    resumes: state.resumeReducer.resumes
});



const mapDispatchToProps = dispatch => ({
    action: bindActionCreators(resumeActions, dispatch)
});



ResumeContainer.PropTypes = {
    resumes: PropTypes.array,
    action: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    editHandler : PropTypes.func,
    deleteHandler : PropTypes.func,
    resumeCreationHandler : PropTypes.func
};


export default connect(mapStateToProps, mapDispatchToProps)(ResumeContainer);
