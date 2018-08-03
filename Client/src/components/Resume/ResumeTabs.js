import React from 'react';
import { confirm } from './../landing/Confirm';
import { browserHistory } from 'react-router';
import { NotificationManager } from 'react-notifications';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import constants from './../../constants/Constants';
import GeneralDetailForm from './GeneralDetailForm';
import ProjectGrid from './ProjectGrid';
import ProjectDetailForm from './ProjectDetailForm';
import resumeActions from './../../action/ResumeAction';
import _ from 'lodash';

export default class ResumeTabs extends React.Component {
    constructor() {
        super();
    }

    render() {
        var TabHeaderText = [];
            TabHeaderText.push(<Tab key= "1"> { constants.GENERAL_DETAILS } </Tab>);
            TabHeaderText.push(<Tab key="2"> { constants.PROJECT_DETAILS } </Tab>);
        var TabContent = [];
         TabContent.push(
         <TabPanel key="1" className='slds-m-around--medium'>
         <div>
          <GeneralDetailForm
          initialValues = { this.props.resumeGeneralDetails != undefined ? this.props.resumeGeneralDetails : this.props.resume!= undefined ?
            this.props.resume[0].candidates != undefined ? this.props.resume[0].candidates : this.props.resume[0] : undefined }
          selectedDatabases = { this.props.resume!= undefined ? this.props.resume[0] != undefined ? this.props.resume[0].databases : undefined : undefined }
          databases={ this.props.databases }
          designations={ this.props.designations }
          technologies={ this.props.technologies }
          domains={ this.props.domains }
          operatingsystems={ this.props.operatingsystems }
          languages={ this.props.languages }
          applications={ this.props.applications }
          frameworks={ this.props.frameworks }
          handleSave = {this.props.handleSave}
          handleCancel = {this.props.handleCancel}
          />
          </div>
         </TabPanel>
          );
         TabContent.push(
           <TabPanel key="2" className='slds-m-around--medium'>

         <div>
             <div className='form-group col-md-12'>
             </div>
             <div className='form-group col-md-12'>
                 <div className='form-group col-md-3'>
                     <div>
                        <button onClick={ this.props.addProjectClick } className='btn btn-primary'>{ constants.ADD_PROJECT }</button>
                     </div>
                 </div>
                 <div className='form-group col-md-6'>
                     <div>
                        <div id='dynamicDiv'>
                         {
                             this.props.projectDetailsDivCount.map((item) => (
                              <ProjectDetailForm
                                key = {item}
                                 projects={this.props.projects}
                                 projectRoles ={this.props.projectRoles}
                                 saveProjectClick = {this.props.saveProjectClick}
                                 />
                             ))
                         }
                        </div>

                    </div>
                 </div>
                 <div className='form-group col-md-3'>

                 <div>

                 </div>

                 </div>
                 </div>
             </div>
             <div className='form-group col-md-12'>
             <div className='form-group col-md-3'></div>
             <div className='form-group col-md-6'>
             <ProjectGrid
               projectDetails = {this.props.projectDetails != undefined ? this.props.projectDetails : [] }
               customConfirm = {this.props.customConfirm}
               onAfterSaveCell = {this.props.onAfterSaveCell}
               roles={this.props.projectRoles}
             />
             </div>
             <div className='form-group col-md-3'></div>
             </div>
             <div className='form-group col-md-12'>
             <div className='form-group col-md-3'></div>
             <div className='form-group col-md-6'>
             <button className='btn marginBtn floatRight' onClick = {this.props.handleCancel}>{ constants.CANCEL }</button>
             <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand floatRight MarginLeft1Per' onClick={ this.props.saveProjectDetails }>{ constants.SAVE_PROJECT_DETAILS }</button>
             </div>
             <div className='form-group col-md-3'></div>
             </div>
             </TabPanel>
           );

    return (
            <div>
                <div>
                    <Tabs selectedIndex={ this.props.tabIndex } onSelect={ this.props.onTabSelect }>
                        <TabList>
                            { TabHeaderText }
                        </TabList>
                        { TabContent }
                    </Tabs>
                </div>
                <br/>
            </div>
          );
    }
}
