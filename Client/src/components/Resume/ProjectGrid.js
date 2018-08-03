import React from 'react';
import constants from './../../constants/Constants';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const ProjectGrid = (props) => {

  const cellEditProp = {
    mode: 'click',
    blurToSave: true,
    afterSaveCell: props.onAfterSaveCell
  }

  const selectRowProp = {
    mode: 'checkbox'
  }

  const options = {
       handleConfirmDeleteRow: props.customConfirm
   }

    return (
      <BootstrapTable className='projectGrid' data={ props.projectDetails } striped hover pagination={ false }  selectRow={ selectRowProp }  options={ options } cellEdit={ cellEditProp } deleteRow>
           <TableHeaderColumn dataField='ProjectName' editable={ false } dataSort={ true } width='110'>{ constants.PROJECT }</TableHeaderColumn>
           <TableHeaderColumn dataField='ProjectId' hidden isKey={ true }>Product ID</TableHeaderColumn>
           <TableHeaderColumn dataField='RoleId' hidden >Role ID</TableHeaderColumn>
           <TableHeaderColumn dataField='RoleName' editable={ { type: 'select', options: { values: props.roles !== undefined ? props.roles.map(e => e.ProjectRoleName) : [] } } } dataSort={ true } width='110'>{ constants.ROLE }</TableHeaderColumn>
           <TableHeaderColumn dataField='Responsibilities' editable={ { type: 'textarea' } } dataSort={ true } width='110'>{ constants.RESPONSIBILITIES }</TableHeaderColumn>
      </BootstrapTable>
    );
};

export default ProjectGrid;
