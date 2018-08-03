//This is to ensure that we can see the entirety of the store

export default {
    apiReducer: {
        apiCallsInProgress: 0
    },
    applicationReducer : {
      applications: [],
      applicationList: [],
      application: undefined,
      addingApplication: false,
      updateApplication: false,      
    },

    resumeReducer : {
      tabIndex : 0,
      resumes : [],
      databases : [],
      designations: [],
      technologies : [],
      domains : [],
      operatingsystems: [],
      languages: [],
      applications :[],
      frameworks: [],
      projects : [],
      roles :[],

      ///ResumeTab
      resume : undefined,
      resumeGeneralDetails : undefined,
      projectDetailsDivCount : [],
      projectDetails : [],
      test : 0
    },

    databaseReducer : {
      databases: [],
      databaseList: [],
      database: undefined,
      databasesActive: [],
      addingDatabase: false,
      updateDatabase: false
    },
    designationReducer : {
      designations: [],
      designationList: [],
      designation: undefined,
      addingDesignation: false,
      updateDesignation: false
    },
    domainReducer : {
      domains: [],
      domainList: [],
      domain: undefined,
      domainsActive:[],
      addingDomain: false,
      updateDomain: false
    },
    frameworkReducer : {
      frameworks: [],
      frameworkList: [],
      framework: undefined,
      addingFramework: false,
      updateFramework: false
    },
    languageReducer : {
      languages: [],
      languageList: [],
      language: [],
      addingLanguage: false,
      updateLanguage: false
    },
    operatingSystemReducer : {
      operatingSystems: [],
      operatingSystemList: [],
      operatingSystem: [],
      operatingSystemsActive: [],
      addingOperatingSystem: false,
      updateOperatingSystem: false
    },
    projectReducer : {
      projects: [],
      projectList: [],
      project: undefined,
      projectsActive: [],
      addingProject: false,
      updateProject: false,
    },
    projectRoleReducer : {
      projectRoles: [],
      projectRoleList: [],
      projectRole: [],
      addingProjectRole: false,
      updateProjectRole: false
    },
    roleReducer : {
      roles: [],
      roleList: [],
      role: [],
      rolesActive: [],
      addingRole: false,
      updateRole: false
    },
    technologyReducer : {
      technologies: [],
      technologyList: [],
      technology: [],
      technologiesActive: [],
      addingTechnology: false,
      updateTechnology: false
    },
    userReducer : {
      users: [],
      userList: [],
      user: [],
      usersActive: [],
      addingUser: false,
      updateUser: false
    },
    loginReducer : {
      loginResponse: [],
      changePasswordResponse: [],
      forgotPasswordResponse: []
    },
    permissionModuleReducer : {
      permissionModuleList: []
    },
    userPermissionReducer : {
      userPermission: []
    },
    rolePermissionReducer : {
      rolePermission: []
    },
    userRoleReducer : {
      userRole: []
    }
};
