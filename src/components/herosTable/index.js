import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import HeroCard from "../../components/heroCard/index.js";

import styles from './styles.module.css';
import classNames from "classnames";

const NO_URL_IMAGE = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";

class HerosTable extends Component {

  constructor(props){
    super(props);

    this.state = {
      
      finalHeros : [],
      totalHeros : [],
      actualPage : [],
      rowsPerPage : 5,
      page : 0,
      sortType : ["Name",  "Date of creation"]
    }

  }

  componentWillMount(){
    const {allChars} = this.props;
    const {finalHeros, actualPage, totalHeros} = this.state;

    var actual = this.eliminateNullImages(allChars);

    var finalArray = [];

    var i,j,temparray,chunk = 10;
    for (i=0,j=actual.length; i<j; i+=chunk) {
      temparray = actual.slice(i,i+chunk);
      finalArray.push(temparray);
      
    }

    console.log(finalArray[0]);

    this.setState({ actualPage : finalArray[0],
                    totalHeros : finalArray});
    
  }

  eliminateNullImages(list){
    var tempArray = [];

    list.forEach(element => {
      if(element.thumbnail.path != NO_URL_IMAGE ){
        tempArray.push(element);
      }
    });

    console.log(tempArray);
    
    this.setState({finalHeros : tempArray});

    return tempArray;

  }


  showRows(){

    const {allChars} = this.props;
    const {finalHeros, actualPage} = this.state;

    const tableRows = [];
    for (let i = 0; i < actualPage.length-1; i = i+2) {
      const row = actualPage[i];
      const row2 = actualPage[i+1];

      tableRows.push(
        <TableRow  key={i}>
                                    
          <TableCell  width =  '50%' align="left">
            <HeroCard heroInfo={row}/>
              
            
          </TableCell>
          <TableCell width =  '50%' align="left">
            <HeroCard heroInfo={row2}/>
          </TableCell>
                                    
        </TableRow>
        

      )
      
    }

    return tableRows;
  }

  printState(i){
    console.log(this.state.actualPage[i]);
    console.log(this.state.actualPage);
  }

  handleChangePage = (event, newPage) => {

    this.setState({ ['page']: newPage });
    
    this.setState({actualPage : this.state.totalHeros[newPage]});

    console.log(newPage);
    
  };

  handleChangeRowsPerPage = event => {
    this.setState({ ['rowsPerPage']: parseInt(event.target.value, 10) });
    this.setState({ ['page']: 0 });
  };

  handleStatusClick(row){

    if(row === "Name"){
      this.sortListByName()

      
    }else{
      this.sortListByDate()
    }  
    
  }


  upDateList(list){
    
    const {finalHeros, actualPage} = this.state;
    
    var finalArray = [];

    var i,j,temparray,chunk = 10;
    for (i=0,j=list.length; i<j; i+=chunk) {
      temparray = list.slice(i,i+chunk);
      finalArray.push(temparray);
    }

    this.setState({ actualPage : finalArray[0],
                    totalHeros : finalArray},this.handleChangePage(null,0)) ;

    

  }


  sortListByName(){

    const {finalHeros, actualPage} = this.state;

    var temp = finalHeros.sort(function(a,b){
  
      return  b.name - a.name;
    }).reverse();
    console.log("entre");
    
    this.upDateList(temp);

  }

  sortListByDate(){

    const {finalHeros, actualPage} = this.state;

    var temp = finalHeros.sort(function(a,b){
  
      return new Date(b.modified) - new Date(a.modified);
    });

    this.upDateList(temp);
    
  }

  render() {

    const {rowsPerPage, page, sortType} = this.state;

    return (
      <Paper className= {classNames(styles.herosTable)}>
        <DropdownButton variant="danger" title="Sort By">
          {sortType.map((row,index) => (
            <Dropdown.Item onClick = {() => this.handleStatusClick(row)} key={row+index}>{
              row
            }</Dropdown.Item>
          ))}
        </DropdownButton>
      
        <Table aria-label="simple table">
                  
          <TableBody >
            {this.showRows()}
          </TableBody>

        </Table>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={this.state.finalHeros.length}
          rowsPerPage={rowsPerPage}
          page = {page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      
      </Paper>
      

    )
  }
}

export default HerosTable;
