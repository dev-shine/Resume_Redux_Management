import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginActions from '../../action/LoginAction';
import toastr from 'toastr';
import { browserHistory } from 'react-router';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var userData = [];

class ForgetPassword extends React.Component {
  constructor() {
    super();
    this.state = { userRecord: [], validateUser: { Email: false } };
    this.saveHandler = this.saveHandler.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  saveHandler(e) {
    e.preventDefault();
    var routePath = this.props.history;
    if (!this.showFormErrors()) {
      this.props.action.forgotPassword(this.state.userRecord)
      .then((forgotPasswordResponse) => {
        if (forgotPasswordResponse.data.message === constants.OK) {
          routePath.push('/login');
          setTimeout(() => toastr.success(constants.PWD_SEND_MESSAGE), 1000);
        }
        else {
          toastr.warning(constants.USER_STATUS_MESSAGE);
        }
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  onCancel() {
    browserHistory.goBack();
  }
  showFormErrors() {
    const inputs = document.querySelectorAll('input[name]');
    const currentState = this.state.validateUser;
    var isFormValid = false;
    inputs.forEach(input => {
      if(!this.showInputError(input)) {
        currentState[input.name] = true;
        isFormValid = true;
      }

      return isFormValid;
    });

    this.setState({ validateUser : currentState });
    return isFormValid;
  }
  showInputError(e) {
    let validity, refName;
    if(e.target === undefined) {
      refName = e.name;
    }
    else {
      refName = e.target.name;
    }

    if (e.target === undefined) {
      validity = e.validity;
    }
    else {
      validity = e.target.validity;
    }

    const label = document.getElementById(`${refName}Label`).textContent;
    const error = document.getElementById(`${refName}Error`);
    if (!validity.valid)
    {
      if (validity.valueMissing) {
        error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
      }
      else if (validity.typeMismatch) {
        error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
      }

      return false;
    }

    error.textContent = '';
    return true;
  }
  handleChange(e) {
    const currentState = this.state.validateUser;
    userData[e.target.name] = e.target.value;
    if(!this.showInputError(e)) {
      currentState[e.target.name] = true;
    }
    else {
      currentState[e.target.name] = false;
    }

    this.setState({ validateUser : currentState });
    this.setState({userRecord : userData});
  }
  render() {
    return (
      <div className='login'>
          <hgroup>
              <h2>{ constants.FORGOTPASSWORD }</h2>
          </hgroup>
          <form id={constants.LBL_FORGOTPASSWORDFORM}>
              <div className='form-group'>
                  <label id={constants.EMAIL_LABEL} className='control-label'>{ constants.EMAIL }</label>
              </div>
              <div className='groupLoginForm'>
                  <input className={classNames({'form-control': true, 'BorderRed': this.state.validateUser.Email})} type='email' name={ constants.EMAIL } ref={ constants.EMAIL } value={ this.state.userRecord.Email ? this.state.userRecord.Email : '' } onChange={ this.handleChange } autoFocus required />
                  <div className={classNames({'error': this.state.validateUser.Email, 'displayNone': !this.state.validateUser.Email})} id={ constants.EMAIL_ERROR }></div>
              </div>
              <button className='twoButton button btn-primary' onClick={ this.saveHandler }>{ constants.SUBMIT }</button>
              <button className='twoButton2 marginLeft8P' onClick={ this.onCancel }>{ constants.CANCEL }</button>
          </form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    forgotPasswordResponse: state.loginReducer.forgotPasswordResponse
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(loginActions, dispatch)
});

ForgetPassword.propTypes = {
  forgotPasswordResponse: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);