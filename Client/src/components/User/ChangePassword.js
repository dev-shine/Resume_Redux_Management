import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginActions from '../../action/LoginAction';
import toastr from 'toastr';
import { browserHistory } from 'react-router';
import constants from '../../constants/Constants';
import classNames from 'classnames';
var userData = [];

class ChangePassword extends React.Component {
  constructor() {
    super();
    this.state = { passwordDetails: [], validateUser: { OldPassword: false, Password: false, ConfirmPassword: false } };
    this.saveHandler = this.saveHandler.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  saveHandler(e) {
    e.preventDefault();
    if (!this.showFormErrors()) {
      this.props.action.changePassword(this.state.passwordDetails.oldpassword, this.state.passwordDetails.password)
      .then((changePasswordResponse) => {
        if (changePasswordResponse.data.message === constants.OK) {
          toastr.success(constants.CHANGE_PASSWORD_SUCCESS_MESSAGE);
          setTimeout(() => window.location.href = '/logout', 1000);
        }
        else {
          toastr.warning(constants.REQUIRED_OLDPWD_MESSAGE);
        }
      })
      .catch(error => {
        toastr.error(error);
      });
    }
  }
  onCancel(e) {        
    this.props.history.push('/home');
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
    this.setState({ passwordDetails : userData });
  }
  showFormErrors() {
    const inputs = document.querySelectorAll('input[name]');
    const currentState = this.state.validateUser;
    var isFormValid = false;
    inputs.forEach(input => {
      if (!this.showInputError(input)) {
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
    if (e.target === undefined) {
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
    const isOldPassword = refName === constants.LBL_OLDPASSWORD;
    const isPassword = refName === constants.LBL_PASSWORD;
    const isConfirmPassword = refName === constants.LBL_CONFIRMPASSWORD;

    if (isConfirmPassword) {
      if (this.refs.password.value !== '' && this.refs.password.value !== this.refs.confirmPassword.value) {
        this.refs.confirmPassword.setCustomValidity(constants.MATCH_PASSWORD_MESSAGE);
      } else {
        this.refs.confirmPassword.setCustomValidity('');
      }
    }

    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
      } else if (( isPassword || isOldPassword || isConfirmPassword) && validity.patternMismatch) {
        error.textContent = constants.PWD_LENGTH_MESSAGE;
      } else if (isConfirmPassword && validity.customError) {
        error.textContent = constants.MATCH_PASSWORD_MESSAGE;
      }

      return false;
    }

    error.textContent = '';
    return true;
  }
  render() {
    return (
      <div>
        <hgroup>
            <h2>{ constants.CHANGEPASSWORD }</h2>
        </hgroup>
          <div className='changePasswordBox'>
              <div className='groupLoginForm'>
                  <div>
                      <label id={ constants.OLDPASSWORD_LABEL } className='control-label'>{ constants.OLDPASSWORD }</label>
                  </div>
                  <div>
                      <input className={classNames({'form-control': true, 'BorderRed': this.state.validateUser.oldpassword})} type='password' name={ constants.LBL_OLDPASSWORD } ref={ constants.LBL_OLDPASSWORD } pattern='[a-zA-Z0-9@#$%^&*]{8,}$' onChange={ this.handleChange } autoFocus required />
                      <div className={classNames({'error': this.state.validateUser.oldpassword, 'displayNone': !this.state.validateUser.oldpassword})} id={ constants.OLDPASSWORD_ERROR }></div>
                  </div>
              </div>
              <div className='groupLoginForm'>
                <div ref={constants.LBLPASSWORD} >
                    <label id={ constants.PASSWORDLABEL } className='control-label'>{ constants.NEWPASSWORD }</label>
                </div>
                <div ref={ constants.INPUT_PASSWORD }>
                    <input className={classNames({'form-control': true, 'BorderRed': this.state.validateUser.password})} type='password' name={ constants.LBL_PASSWORD } ref={ constants.LBL_PASSWORD } pattern='[a-zA-Z0-9@#$%^&*]{8,}$' onChange={ this.handleChange } required />
                    <div className={classNames({'error': this.state.validateUser.password, 'displayNone': !this.state.validateUser.password})} id={ constants.PASSWORDERROR }></div>
                </div>
              </div>
              <div className='groupLoginForm'>
                  <div ref={constants.LBLCONFIRMPASSWORD}>
                      <label id={ constants.CONFIRM_PASSWORD_LABEL } className='control-label'>{ constants.CONFIRMPASSWORD }</label>
                  </div>
                  <div ref={ constants.INPUT_CONFIRM_PASSWORD }>
                      <input className={classNames({'form-control': true, 'BorderRed': this.state.validateUser.confirmPassword})} type='password' name={ constants.LBL_CONFIRMPASSWORD } ref={ constants.LBL_CONFIRMPASSWORD } pattern='[a-zA-Z0-9@#$%^&*]{8,}$' onChange={ this.handleChange } required />
                      <div className={classNames({'error': this.state.validateUser.confirmPassword, 'displayNone': !this.state.validateUser.confirmPassword})} id={ constants.CONFIRM_PASSWORD_ERROR }></div>
                  </div>
              </div>
                <button className='twoButton buttonBlue' onClick={ this.saveHandler }>{ constants.SUBMIT }</button>
                <button className='twoButton2 marginLeft8P' onClick={ this.onCancel }>{ constants.CANCEL }</button>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    changePasswordResponse: state.loginReducer.changePasswordResponse
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(loginActions, dispatch)
});

ChangePassword.propTypes = {
  changePasswordResponse: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);