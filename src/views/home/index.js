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

import Typography from '@material-ui/core/Typography';

import TopBar from "../../components/topBar/index.js";
import HerosTable from "../../components/herosTable/index.js";

import axios from 'axios';
import md5 from 'md5';

const privateKey = "b7d2bef1b3feb2720bc188c77d16f7f2c624b126";
const publicKey = "e1b384507a43560a8dd97f899ba78e7e";
const t = 1;

const hash = md5(1+privateKey+publicKey);

class Home extends Component {

  constructor(props){
    super(props);

    this.state = {
      
      auth : "",
      allChars : [],
      spinner : false
    }

  }

  async componentDidMount(){

    let ids = Array.from({length: 15}, (v, k) => k)
    await Promise.all(ids.map(id => this.getCharacter(id))).then(() =>this.arrangeData())
  }

  getCharacter = async (i) => {
    let { allChars } = this.state;
    await axios.get("https://gateway.marvel.com:443/v1/public/characters?limit=100&offset="+ i*100 + "&ts=1&apikey=" + publicKey + "&hash=" + hash)
                  .then((response) => {

                    var tempChar = allChars;

                    tempChar[i] = response.data.data.results;

                    
                    this.setState({ allChars : tempChar });

                  })
    
  };

  printState(i){
    console.log(this.state.allChars[i]);
    
  }

  arrangeData(){
    this.setState({ spinner : true,
                    allChars : this.state.allChars.flat()});
  }

  showRows(){

    const {allChars} = this.state;
    const tableRows = [];
    for (let i = 0; i < allChars.length-1; i = i+2) {
      const row = allChars[i];
      const row2 = allChars[i+1];

      tableRows.push(
        <TableRow key={i}>
                                    
          <TableCell align="center">
            <Button onClick={()=> this.printState(i)}>
              <img src={row.thumbnail.path +"/portrait_incredible." + row.thumbnail.extension} width="200" height="200"/>
            </Button>

          </TableCell>
          <TableCell align="center">
            <Button onClick={()=> this.printState(i+1)}>
              <img src={row2.thumbnail.path +"/portrait_incredible." + row2.thumbnail.extension} width="200" height="200"/>
            </Button>
            
          </TableCell>
                                    
        </TableRow>


      )
      
    }

    console.log(tableRows);
    

    return tableRows;
  }

  render() {

    const {allChars} = this.state;
    return(
      <>
        <TopBar/>

        { this.state.spinner ? 
          <>

            <HerosTable 
              allChars = {allChars}
            />

          </>

          :

          <LinearProgress />

        }

        
        
      </>

    );
  }
}

export default Home;
