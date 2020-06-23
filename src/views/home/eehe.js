import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/ManageAssetSearch';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import '../TableSearch.css';
import LinearProgress from '@material-ui/core/LinearProgress';

class AssetSearch extends Component {

  state = {
    assetId: '',
    assetName: '',
    assetActive: true,
    page: 0,
    setPage: 0,
    rowsPerPage: 10,
    setRowsPerPage: 10,
    selectedEditAssetId: -1,
    clickEdit:false,
    spinnerVisible:false
  };

  handleClickEditRow = selectedWorkOrderId => {
        this.props.requestAssetSearchById(selectedWorkOrderId);
        this.setState({ selectedEditWorkOrderId: selectedWorkOrderId });
        this.setState({ clickEdit: true });
    }

  handleClickAdd(){
    this.props.history.push("/admin/managementasset");
  }

  handleClickSearch = event => {
      Promise.resolve(
    this.props.requestSearchAsset(
        this.state.assetId,
        this.state.assetName,
        this.state.assetActive
    )).then(()=>{
        this.setState({ spinnerVisible: false });
        this.setState({page : 0});
      });
}

handleClickReset = event => {
    this.setState({ ['assetId']: '' });
    this.setState({ ['assetName']: '' });
    this.setState({ ['assetActive']: true });
}

handleClickBack = event => {
    this.props.history.push("/adminhome");
}

handleChangePage = (event, newPage) => {
    this.setState({ ['page']: newPage });
};

handleChangeRowsPerPage = event => {
    this.setState({ ['rowsPerPage']: parseInt(event.target.value, 10) });
    this.setState({ ['page']: 0 });
};

//All text fields
handleInputChange = e => {
  const { name, value } = e.target
  this.setState({
    [name]: value
  })
}

handlecheckChange = name => event => {
  this.setState({ assetActive: event.target.checked });
};

  componentDidMount() {
    // This method is called when the component is first added to the document
    this.setState({ spinnerVisible: true });  
    this.ensureDataFetched();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.editAssetSearch.assetId !== prevProps.editAssetSearch.assetId) )
    {
        this.props.history.push({
            pathname: '/admin/managementasset',
            data: [{selectedAsset: this.props.editAssetSearch, selectedEditAssetSearch:true}] // your data array of objects
        })

        this.setState({ clickEdit: false });
    }
}

componentWillUnmount() {
    this.props.requestResetVariblesSearchSearch();
}

  ensureDataFetched() {
    //const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
    this.handleClickSearch();
  }


  render() {

    const {
        assetId,
        assetName,
        assetActive,
        page,
        rowsPerPage,
        spinnerVisible
    } = this.state;

    return (

      <div>
                <CssBaseline />
                <table style={{ minWidth: 350 }}>
                    <tbody>
                        <tr>
                            <td><h2>Asset Search</h2></td>
                            <td>
                                <Fab
                                    color="primary"
                                    aria-label="add"
                                    onClick={() => this.handleClickAdd()}
                                >
                                    <AddIcon />
                                </Fab>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <form autoComplete="off" style={{ minWidth: 350 }}>

                <TextField
                        id="outlined-dense-multiline"
                        label="Asset Number"
                        margin="dense"
                        variant="outlined"
                        style={{ minWidth: 350 }}
                        name="assetId"
                        onChange={this.handleInputChange}
                        value={assetId}
                />
                <br></br>
                <TextField
                        id="outlined-dense-multiline"
                        label="Asset Name"
                        margin="dense"
                        variant="outlined"
                        style={{ minWidth: 350 }}
                        name="assetName"
                        onChange={this.handleInputChange}
                        value={assetName}
                />
                <br></br>
                <FormControl component="fieldset">
                    <FormGroup>                   
                        <FormControlLabel                        
                            control={

                                <Checkbox
                                    color="primary"
                                    onChange={this.handlecheckChange('assetActive')} 
                                    checked={assetActive}                                   
                                />
                            }
                            label="Asset Active"
                        />
                    </FormGroup>
                </FormControl>
                <br></br>
                <br></br>
                </form>
        <Button
            variant="outlined"
            size="large"
            color="primary"
            style={{ margin: 5, minWidth: 120, minHeight:50 }}
            onClick={() => this.handleClickBack()}
        >
            Back
        </Button>
        <Button
            variant="outlined"
            size="large"
            color="primary"
            style={{ margin: 5, minWidth: 120, minHeight:50 }}
            onClick={() => this.handleClickReset()}
        >
            Reset
        </Button>
        <Button
            variant="outlined"
            size="large"
            color="primary"
            style={{ margin: 5, minWidth: 120, minHeight:50 }}
            onClick={() => this.handleClickSearch()}
        >
            Search
        </Button>        
        <br></br>
        <br></br>
        <div>
            <Paper className="root">
                {spinnerVisible ?
                    <LinearProgress aria-disabled={true}/>
                    :null}
                <Table className="table" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell >Action</TableCell>
                            <TableCell align="center">Asset Id</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Creation Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.assetsearchdata
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(row => (
                                <TableRow key={row.assetId}>
                                    <TableCell component="th" scope="row">
                                        <Fab color="primary" aria-label="edit" size="medium" onClick={() => this.handleClickEditRow(row.assetId)}>
                                            <EditIcon />
                                        </Fab>
                                    </TableCell>
                                    <TableCell align="center">{row.assetId}</TableCell>
                                    <TableCell align="center">{row.assetName}</TableCell>
                                    <TableCell align="center">{(new Date(row.assetDate)).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={this.props.assetsearchdata.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'previous page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'next page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        </div>

      </div>
    );
  }
}

export default connect(
  state => state.manageAssetSearch,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(AssetSearch);