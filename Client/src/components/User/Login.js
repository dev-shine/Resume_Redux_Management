import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import * as loginActions from '../../action/LoginAction';
import classNames from 'classnames';
import '../../assets/styles/loginstyle.css';
import constants from '../../constants/Constants';
var userData = [];

class Login extends React.Component {
  constructor() {
    super();
    this.state = { userRecord: [], validateUser: { Email: false, Password: false } };
    this.saveHandler = this.saveHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  saveHandler(e) {
    e.preventDefault();
    var routePath = this.props.history;
    if (!this.showFormErrors()) {
      this.props.action.loginUser(this.state.userRecord)
      .then((loginResponse) => {
        if (loginResponse.data.message === constants.OK) {
          routePath.push('/home');
        }
        else if (loginResponse.data.message === constants.LBL_INACTIVE) {
          toastr.warning(constants.USER_STATUS_MESSAGE)
        }
        else {
          toastr.warning(constants.INVALID_EMAIL_MESSAGE)
        }

        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
      })
      .catch(error => {
        toastr.error(error);
      });
    }
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
    const isPassword = refName === constants.PASSWORD;
    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
      }
      else if (validity.typeMismatch) {
        error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
      }
      else if (isPassword && validity.patternMismatch) {
        error.textContent = constants.PWD_LENGTH_MESSAGE;
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
    this.setState({ userRecord : userData });
  }
  render() {
    return (
      <div className='login'>
          <hgroup>
              <h2>{ constants.SIGNIN_HEADER }</h2>
          </hgroup>
          <form>
              <div>
                  <label id={ constants.EMAIL_LABEL }>{ constants.EMAIL }</label>
              </div>
              <div className='groupLoginForm'>
                  <input className={classNames({'form-control': true, 'BorderRed': this.state.validateUser.Email})} type='email' name={ constants.EMAIL } ref={ constants.EMAIL } value={ this.state.userRecord.Email ? this.state.userRecord.Email : '' } onChange={ this.handleChange } autoFocus required />
                  <div className={classNames({'error': this.state.validateUser.Email, 'displayNone': !this.state.validateUser.Email})} id={ constants.EMAIL_ERROR }></div>
              </div>

              <div>
                  <label id={ constants.PASSWORD_LABEL }>{ constants.PASSWORD }</label>
              </div>
              <div className='groupLoginForm'>
                  <input className={classNames({'form-control': true, 'BorderRed': this.state.validateUser.Password})} type='password' id={ constants.PASSWORD } name={ constants.PASSWORD } ref={ constants.PASSWORD } pattern='[a-zA-Z0-9@#$%^&*]{8,}$' value={ this.state.userRecord.Password ? this.state.userRecord.Password : '' } onChange={ this.handleChange } required />
                  <div className={classNames({'error': this.state.validateUser.Password, 'displayNone': !this.state.validateUser.Password})} id={ constants.PASSWORD_ERROR }></div>
              </div>
              <button className='button btn-primary' onClick={ this.saveHandler }>{ constants.LOGIN }</button>
              <a href='/ForgetPassword' className='marginForgotLink65P'>{ constants.FORGOTPASSWORDLINK }</a>
          </form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loginResponse: state.loginReducer.loginResponse
  }
};

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(loginActions, dispatch)
});

Login.propTypes = {
  loginResponse: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);