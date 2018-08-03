import React from 'react';
import * as loginActions from '../../action/LoginAction';

export default class LogOut extends React.Component {
  constructor() {
    super();
    this.onLogOut();
    loginActions.logOutUser();
  }
  onLogOut() {
    window.location.href = '/login';
  }
  render() {
    return (
      <div>
      </div>
    );
  }
}