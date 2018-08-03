import React from 'react';
import { Router, Route, Switch,Redirect } from 'react-router-dom';
import Login from '../User/Login';
import LogOut from './../User/LogOut';
import ChangePassword from './../User/ChangePassword';
import ForgetPassword from './../User/ForgetPassword';
import ApplicationContainer from './../Application/ApplicationContainer';
import DatabaseContainer from '../Database/DatabaseContainer';
import DesignationContainer from '../Designation/DesignationContainer';
import DomainContainer from '../Domain/DomainContainer';
import FrameworkContainer from '../Framework/FrameworkContainer';
import LanguageContainer from '../Language/LanguageContainer';
import OperatingSystemContainer from '../OperatingSystem/OperatingSystemContainer';
import ProjectContainer from '../Project/ProjectContainer';
import ProjectRoleContainer from '../ProjectRole/ProjectRoleContainer';
import RoleContainer from '../Role/RoleContainer';
import TechnologyContainer from '../Technology/TechnologyContainer';
import ResumeContainer from './../Resume/ResumeContainer';
import ResumeFormWindow from './../Resume/ResumeFormWindow';
import ResumeFormContainer from './../Resume/ResumeFormContainer';
import UserContainer from '../User/UserContainer';
import UserPermissionContainer from '../UserPermission/UserPermissionContainer';
import RolePermissionContainer from '../RolePermission/RolePermissionContainer';
import AssignRoleContainer from '../AssignRole/AssignRoleContainer';
import createBrowserHistory from 'history/createBrowserHistory';
import { isMenuByRolePermission } from '../common/Common';
import PageNotFound from './PageNotFound';
import constants from '../../constants/Constants';
import Shell from './Shell';
import Home from './../Home/HomeScreen';

const history = createBrowserHistory();

const requireAuth = (nextState, replace) => {
  if (!localStorage.ls_userSession) {
    window.location.href = "/home";
  }
};

const checkSession = (nextState, replace) => {
  if (localStorage.ls_userSession) {
    window.location.href = "/home";
  }
};

const authorize = (nextState) => {
  var userData = JSON.parse(localStorage.getItem('userData'));
  if (isMenuByRolePermission(userData, nextState)) {
    return true;
  }
  else {
    return false;
  }
};

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed(rest.value) === true
        ? <Component {...props} />
        :  localStorage.ls_userSession ? <Redirect to={{pathname: '/home', state: {from: props.location}}} /> : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
};

const App = () => {
    return (
        <div >
            <Router history={history}>
                <div>
                <Shell/>
                    <Switch>
                        <Route authed={authorize} exact path="/login" component={Login} onEnter={checkSession} />                        
                        <Route path="/home" component={Home} onEnter={requireAuth} />
                        //// Application route
                        <Route authed={authorize} path="/applications" component={ApplicationContainer}  value={constants.LOOKUPS_APPLICATION} />
                        <Route authed={authorize} path="/application/:id" component={ApplicationContainer}  value={constants.LOOKUPS_APPLICATION} />
                        //// Database route
                        <PrivateRoute authed={authorize} path="/databases" component={DatabaseContainer} value={constants.LOOKUPS_DATABASE} />
                        <PrivateRoute authed={authorize} path="/database/:id" component={DatabaseContainer} value={constants.LOOKUPS_DATABASE} />
                        //// Designation route
                        <PrivateRoute path="/designations" authed={authorize} component={DesignationContainer} value={constants.LOOKUPS_DESIGNATION} />
                        <PrivateRoute authed={authorize} path="/designation/:id" component={DesignationContainer}  value={constants.LOOKUPS_DESIGNATION} />
                        //// Domain route
                        <PrivateRoute authed={authorize} path="/domains" component={DomainContainer}  value={constants.LOOKUPS_DOMAIN} />
                        <PrivateRoute authed={authorize} path="/domain/:id" component={DomainContainer}  value={constants.LOOKUPS_DOMAIN} />
                        //// Framework route
                        <PrivateRoute authed={authorize} path="/frameworks" component={FrameworkContainer}  value={constants.LOOKUPS_FRAMEWORK} />
                        <PrivateRoute authed={authorize} path="/framework/:id" component={FrameworkContainer}  value={constants.LOOKUPS_FRAMEWORK} />
                        //// Language route
                        <PrivateRoute authed={authorize} path="/languages" component={LanguageContainer}  value={constants.LOOKUPS_LANGUAGE} />
                        <PrivateRoute authed={authorize} path="/language/:id" component={LanguageContainer}  value={constants.LOOKUPS_LANGUAGE} />
                        //// Operating System route
                        <PrivateRoute authed={authorize} path="/operatingSystems" component={OperatingSystemContainer}  value={constants.LOOKUPS_OPERATINGSYSTEM} />
                        <PrivateRoute authed={authorize} path="/operatingSystem/:id" component={OperatingSystemContainer}  value={constants.LOOKUPS_OPERATINGSYSTEM} />
                        //// Project route
                        <PrivateRoute authed={authorize} path="/projects" component={ProjectContainer}  value={constants.LOOKUPS_PROJECT} />
                        <PrivateRoute authed={authorize} path="/project/:id" component={ProjectContainer}  value={constants.LOOKUPS_PROJECT} />
                        //// Project Role route
                        <PrivateRoute authed={authorize} path="/projectRoles" component={ProjectRoleContainer}  value={constants.LOOKUPS_ROLE} />
                        <PrivateRoute authed={authorize} path="/projectRole/:id" component={ProjectRoleContainer} value={constants.LOOKUPS_ROLE} />
                        //// Role route
                        <PrivateRoute authed={authorize} path="/roles" component={RoleContainer} value={constants.ROLE_MANAGEROLES} />
                        <PrivateRoute authed={authorize} path="/role/:id" component={RoleContainer} value={constants.ROLE_MANAGEROLES} />
                        //// Technology route
                        <PrivateRoute authed={authorize} path="/technologies" component={TechnologyContainer} value={constants.LOOKUPS_TECHNOLOGY} />
                        <PrivateRoute authed={authorize} path="/technology/:id" component={TechnologyContainer}  value={constants.LOOKUPS_TECHNOLOGY} />
                        //// User route
                        <PrivateRoute authed={authorize} path="/users" component={UserContainer}  value={constants.USER_MANAGEUSERS} />
                        <PrivateRoute authed={authorize} path="/user/:id" component={UserContainer} value={constants.USER_MANAGEUSERS} />
                        //// User permission route
                        <PrivateRoute authed={authorize} path='/userpermission' component={UserPermissionContainer} value={constants.USER_USERPERMISSIONS} />
                        //// Role permission route
                        <PrivateRoute authed={authorize} path='/rolepermission' component={RolePermissionContainer}  value={constants.ROLE_ROLEPERMISSIONS} />
                        //// Assign role route
                        <PrivateRoute authed={authorize} path='/assignroles' component={AssignRoleContainer}  value={constants.ROLE_ASSIGNROLE} />

                        ////Resume
                        <PrivateRoute authed={authorize} path="/resumes" component={ResumeContainer} value={constants.RESUMELIST_RESUMELIST} />
                        <PrivateRoute authed={authorize} path="/resume/create" component={ResumeFormContainer} value={constants.RESUMELIST_RESUMELIST} />
                        <PrivateRoute authed={authorize} path="/resume/:id" component={ResumeFormContainer} value={constants.RESUMELIST_RESUMELIST} />

                        //// Login
                        <Route path='/changePassword' component={ChangePassword} onEnter={requireAuth} />
                        <Route path='/forgetPassword' component={ForgetPassword} onEnter={checkSession}/>
                        <Route path='/logout' component={LogOut}/>
                        <Route component={PageNotFound} />
                    </Switch>
                </div>
            </Router>
        </div>
    );
};

export default App;