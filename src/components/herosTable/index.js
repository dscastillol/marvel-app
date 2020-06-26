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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HeroCard from "../../components/heroCard/index.js";
import ComicCard from "../../components/comicCard/index.js";


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
      rowsPerPage : 10,
      page : 0,
      sortType : ["Name",  "Date of creation"],
      numberOfPages : 0,
      favComics : []
    }

    this.textInput = React.createRef(); 

  }

  notifyWarning = (text) => toast.warning(text, {containerId: 'notification'});
  notifySuccess = (text) => toast.success(text, {containerId: 'notification'});


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

    this.setState({ actualPage : finalArray[0],
                    totalHeros : finalArray,
                    numberOfPages : actual.length});
    
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

  updateFavList = (info) =>{
    
    const {favComics} = this.state;
    

    if (favComics.filter(e => e.id === info.id).length > 0) {
      this.notifyWarning('The comic is already in favourites.');
      return;
      
    }

    var temp = favComics;

    temp.push(info);

    this.setState({favComics : temp});

    this.notifySuccess('The comic was added succesfully.')
    
    
  }


  showRows(){

    const {allChars} = this.props;
    const {finalHeros, actualPage} = this.state;

    const tableRows = [];
    for (let i = 0; i <= actualPage.length-1; i = i+2) {
      const row = actualPage[i];
      const row2 = actualPage[i+1];

      tableRows.push(
        <TableRow  key={i}>
                                    
          <TableCell  width =  '50%' align="left">
            <HeroCard heroInfo = {row}
                      updateFavList = {this.updateFavList}/>
              
            
          </TableCell>

          <TableCell width =  '50%' align="left">
            {
              row2 ? 
                <HeroCard heroInfo = {row2}
                          updateFavList = {this.updateFavList}/>
              :
                null
            }
            
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

  };

  handleChangeRowsPerPage = event => {
    this.setState({ ['rowsPerPage']: parseInt(event.target.value, 10) });
    this.setState({ ['page']: 0 });
  };

  handleStatusClick(row){

    if(row === "Name"){
     this.sortListByName();

    }else{
     this.sortListByDate();

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
                    totalHeros : finalArray,
                    numberOfPages : list.length},this.handleChangePage(null,0)) ;

  }


  sortListByName(){

    const {finalHeros, actualPage} = this.state;

    
    var temp = finalHeros.sort(function(a,b){
  
      return  a.name.localeCompare(b.name);
    });
    
   this.upDateList(temp);

  }

  sortListByDate(){

    const {finalHeros, actualPage} = this.state;

    var temp = finalHeros.sort(function(a,b){
  
      return new Date(b.modified) - new Date(a.modified);
    });

    this.upDateList(temp);
    
  }

  search(){

    const {finalHeros, actualPage} = this.state;
    
    var name = this.textInput.current.value;

    var temp = finalHeros.filter(function(heros){
      return heros.name.toLowerCase().includes(name.toLowerCase()) ;
    });

    if(temp.length == 0){
      this.notifyWarning('Search doesnt have results');
      return;
    }

    this.upDateList(temp);
    
    
  }

  deleteComic = (i) =>{

    const {favComics} = this.state;

    var temp = favComics.filter(function(e) { return e.id !== i.id });

    console.log(temp);
    

    this.setState({favComics : temp});

  }

  render() {

    const {rowsPerPage, page, sortType, numberOfPages, favComics} = this.state;

    return (

      <div className= {classNames(styles.container)}>

      <ToastContainer enableMultiContainer containerId={'notification'} position={toast.POSITION.TOP_RIGHT} />

      <Row className= {classNames(styles.row)}>
        <Col sm={10}>
        <Paper className= {classNames(styles.herosTable)}>

          <Row>
            <Col>
              <DropdownButton variant="danger" title="Sort By" className= {classNames(styles.drop)} size = 'lg'>
                {sortType.map((row,index) => (
                  <Dropdown.Item onClick = {() => this.handleStatusClick(row)} key={row+index}>{
                    row
                  }</Dropdown.Item>
                ))}
              </DropdownButton>    
            </Col>
            
            <Col>
              <Form inline>
                <Form.Control type="text" placeholder="Search" className="mr-sm-2" ref={this.textInput}/>
                <Button variant="contained" color="secondary" onClick = {() => this.search()}>Search</Button>
              </Form>
            </Col>
          </Row>
          
          <Table aria-label="simple table">
                    
            <TableBody >
              {this.showRows()}
            </TableBody>

          </Table>
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={numberOfPages}
            rowsPerPage={rowsPerPage}
            page = {page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
      
        </Paper>
        </Col>

        <Col className= {classNames(styles.list)}>

          <ComicCard  comics = {favComics}
                      deleteComic = {this.deleteComic}/>
          
        </Col>
      </Row>

      </div>

      
      

    )
  }
}

export default HerosTable;
