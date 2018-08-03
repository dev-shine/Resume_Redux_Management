import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import applicationsReducer from './applicationReducer';
import resumeReducer from './resumeReducer';
import databaseReducer from './databaseReducer';
import designationReducer from './designationReducer';
import domainReducer from './domainReducer';
import frameworkReducer from './frameworkReducer';
import languageReducer from './languageReducer';
import operatingSystemReducer from './operatingSystemReducer';
import projectReducer from './projectReducer';
import projectRoleReducer from './projectRoleReducer';
import roleReducer from './roleReducer';
import technologyReducer from './technologyReducer';
import userReducer from './userReducer';
import loginReducer from './loginReducer';
import permissionModuleReducer from './permissionModuleReducer';
import userPermissionReducer from './userPermissionReducer';
import rolePermissionReducer from './rolePermissionReducer';
import userRoleReducer from './userRoleReducer';
import apiReducer from './apiReducer';

export default combineReducers({
    applicationsReducer,
    resumeReducer,
    databaseReducer,
    designationReducer,
    domainReducer,
    frameworkReducer,
    languageReducer,
    operatingSystemReducer,
    projectReducer,
    projectRoleReducer,
    roleReducer,
    technologyReducer,
    userReducer,
    loginReducer,
    permissionModuleReducer,
    userPermissionReducer,
    rolePermissionReducer,
    userRoleReducer,
    apiReducer,
    form: formReducer
});