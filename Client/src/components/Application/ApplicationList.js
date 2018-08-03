import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { NotificationManager } from 'react-notifications';
import { confirm } from '../landing/Confirm';
import { renderShowsTotal } from '../landing/Common';
import { displayStatus } from '../common/Common';
import applicationActions from '../../action/ApplicationAction';
import constants from '../../constants/Constants';

const LinkEditComponent = (props) => {
  const editHandler = () => {
    props.editHandler(props.rowData._id);
  };
  return (
    <a href= '#' onClick = {editHandler} ><center><span className='glyphicon glyphicon-edit'></span></center></a>
  );
};

//// Delete link component
const LinkDeleteComponent = (props) => {
  const deleteHandler = () => {
    confirm(constants.DELETE_CONFIRMATION).then(() => {
      props.deleteHandler(props.rowData._id);
    });
  };
  return (
    <div>
        <a href='#' onClick={ deleteHandler }><center><span className='glyphicon glyphicon-remove'></span></center></a>
    </div>
  );
};

//// Edit method
const linkEditData = (cell, row, formatExtraData) => {
  return (
    <LinkEditComponent rowData={ row } editHandler = {formatExtraData}  moduleUrl={constants.APPLICATION_URL} />
  );
};

//// Delete method
const linkDeleteData = (cell, row, formatExtraData) => {
  return (
    <LinkDeleteComponent rowData={ row } deleteHandler = {formatExtraData}/>
  );
};

export default class ApplicationList extends React.Component {
  render() {
    const options = {
      page: 1,  // which page you want to show as default
      sizePerPageList: [{
        text: '5', value: 5
      }, {
        text: '10', value: 10
      }, {
        text: 'All', value: this.props.applications.length
      }], // you can change the dropdown list for size per page
      sizePerPage: 10,  // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3,  // the pagination bar size.
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      paginationShowsTotal: renderShowsTotal,  // Accept bool or function
      hideSizePerPage: true // You can hide the dropdown for sizePerPage
    };

    return (
      <div>
        <BootstrapTable className='applicationGrid' data={ this.props.applications } striped hover search pagination={ true } options={ options } searchPlaceholder={ constants.FILTER }>
          <TableHeaderColumn isKey hidden dataField='RowNumber' width='30%' headerAlign='center' dataAlign='center'>{ constants.SR }</TableHeaderColumn>
          <TableHeaderColumn dataField='link' dataFormat={ linkEditData }  formatExtraData={this.props.editHandler} width='20' headerAlign='center'>{ constants.EDIT }</TableHeaderColumn>
          <TableHeaderColumn dataField='link' dataFormat={ linkDeleteData}  formatExtraData={this.props.deleteHandler} width='20' headerAlign='center'>{ constants.DELETE }</TableHeaderColumn>
          <TableHeaderColumn dataField='ApplicationName' dataSort={ true } width='110'>{ constants.APPLICATION }</TableHeaderColumn>
          <TableHeaderColumn dataField='IsActive' width='30' dataFormat={ displayStatus } headerAlign='center' dataAlign='center'>{ constants.STATUS }</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}