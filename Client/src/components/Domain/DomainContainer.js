import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as domainAction from '../../action/DomainAction';
import { HomeHeader } from './../landing/PageHeader';
import DomainFormWindow from './DomainFormWindow';
import DomainFormWrapper from './DomainFormWrapper';
import DomainList from './DomainList';
import constants from '../../constants/Constants';

class DomainContainer extends React.Component {
  constructor() {
    super();
    this.newHandler = this.newHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  componentDidMount() {
    this.props.action.getAllDomains();
  }
  newHandler() {
    this.props.action.openAddDomainWindow();
  }
  cancelHandler() {
    event.preventDefault();
    this.props.action.closeDomainWindow();
    this.props.history.replace('/domains');
  }
  saveHandler(values) {
    if(values._id !== undefined)
    {
      const domain = {
        _id: values._id,
        DomainName: values.DomainName,
        IsActive : values.IsActive
      };
      this.props.action.domainUpdate(domain)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.UPDATE_SUCCESS_MESSAGE);
        }
        this.props.action.closeDomainWindow();
        this.props.history.push('/domains');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
    else {
      const domain = {
        DomainName: values.DomainName,
        IsActive : values.IsActive !== undefined ? values.IsActive : 'true'
      };

      this.props.action.domainInsert(domain)
      .then((response) => {
        if(response.data.message === "Conflict")
        {
         toastr.error(constants.UPDATE_REFERENCE_EXIST_MESSAGE);
        }
        else {
          toastr.success(constants.INSERT_SUCCESS_MESSAGE);
        }
        this.props.action.closeDomainWindow();
        this.props.history.push('/domains');
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  editHandler(id) {
    this.props.action.getDomainById(id);
    this.props.action.openUpdateDomainWindow();
    this.props.history.push('/domain/' + id);
  }
  deleteHandler(id) {
    this.props.action.domainDelete(id)
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
    const { domainList } = this.props;
    if (!domainList) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <HomeHeader newLabel={ constants.NEW_DOMAIN }
                    actions={[{ value: constants.LBL_NEW, label: constants.NEW_DOMAIN }]}
                    itemCount={ this.props.domains.length }
                    views={[{ id: 1, name: constants.DOMAIN_LIST }]}
                    viewId={ constants.LBL_ONE }
                    onNew={ this.newHandler } />
        <DomainList domains={ domainList } editHandler={ this.editHandler } deleteHandler={ this.deleteHandler } />
        { this.props.addingDomain ? <DomainFormWindow initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={ this.saveHandler } /> : null }
        { this.props.updateDomain ? <DomainFormWrapper domain={ this.props.domain } initialValues={this.props.initialValues} cancelHandler={ this.cancelHandler } saveHandler={this.saveHandler} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const domainId = ownProps.match.params.id;
  if (domainId && state.domainReducer.domain && domainId === state.domainReducer.domain._id) {
    return {
      initialValues : state.domainReducer.domain,
      domains: state.domainReducer.domains,
      domainList: state.domainReducer.domainList,
      domain: state.domainReducer.domain,
      addingDomain: state.domainReducer.addingDomain,
      updateDomain: state.domainReducer.updateDomain
    };
  } else {
    return {
      domains: state.domainReducer.domains,
      domainList: state.domainReducer.domainList,
      domain: state.domainReducer.domain,
      addingDomain: state.domainReducer.addingDomain,
      updateDomain: state.domainReducer.updateDomain,
    };
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(domainAction, dispatch)
});

DomainContainer.propTypes = {
  domains: PropTypes.array,
  domainList: PropTypes.array,
  domain: PropTypes.object,
  addingDomain: PropTypes.bool,
  updateDomain: PropTypes.bool,
  initialValues : PropTypes.object,
  action: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DomainContainer);