import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as languageAction from '../../action/LanguageAction';
import { HomeHeader } from './../landing/PageHeader';
import LanguageFormWindow from './LanguageFormWindow';
import LanguageFormWrapper from './LanguageFormWrapper';
import LanguageList from './LanguageList';
import constants from '../../constants/Constants';

class LanguageContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllLanguages();
  }
  newHandler() {
    this.props.action.openAddLanguageWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeLanguageWindow();
    this.props.history.replace('/languages');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const language = {
        _id: values._id,
        LanguageName: values.LanguageName,
        IsActive : values.IsActive
      };
      this.props.action.languageUpdate(language)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        }
        this.props.action.closeLanguageWindow();
        this.props.history.push('/languages');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const language = {
        LanguageName: values.LanguageName,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.languageInsert(language)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        }
        this.props.action.closeLanguageWindow();
        this.props.history.push('/languages');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getLanguageById(id);
    this.props.action.openUpdateLanguageWindow();
    this.props.history.push('/language/' + id);
  }
  deleteHandler(id) {
    this.props.action.languageDelete(id)
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
    const { languageList } = this.props;
    if (!languageList) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_LANGUAGE }
                    actions={[{ value: constants.LBL_NEW, label: constants.NEW_LANGUAGE }]}
                    itemCount={ this.props.languages.length }
                    views={[{ id: 1, name: constants.LANGUAGE_LIST }]}
                    viewId={ constants.LBL_ONE }
                    onNew={ this.newHandler } />
        <LanguageList languages={ languageList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingLanguage ? <LanguageFormWindow initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateLanguage ? <LanguageFormWrapper language={ this.props.language } initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={this.saveHandler} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const languageId = ownProps.match.params.id;
  if (languageId && state.languageReducer.language && languageId === state.languageReducer.language._id) {
    return {
      initialValues : state.languageReducer.language,
      languages: state.languageReducer.languages,
      languageList: state.languageReducer.languageList,
      language: state.languageReducer.language,
      addingLanguage: state.languageReducer.addingLanguage,
      updateLanguage: state.languageReducer.updateLanguage
    };
  } else {
    return {
      languages: state.languageReducer.languages,
      languageList: state.languageReducer.languageList,
      language: state.languageReducer.language,
      addingLanguage: state.languageReducer.addingLanguage,
      updateLanguage: state.languageReducer.updateLanguage,
    };
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(languageAction, dispatch)
});

LanguageContainer.propTypes = {
  languages: PropTypes.array,
  languageList: PropTypes.array,
  language: PropTypes.object,
  addingLanguage: PropTypes.bool,
  updateLanguage: PropTypes.bool,
  initialValues : PropTypes.object,
  action: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageContainer);