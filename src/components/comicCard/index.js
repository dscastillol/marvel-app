import React, { Component } from 'react';

import Image from 'react-bootstrap/Image';

import styles from './styles.module.css';
import classNames from "classnames";

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

class ComicCard extends Component {
  constructor(props){
    super(props);

    this.state = {
      
      
    }

    
  }

  deleteComic(index){
    this.props.deleteComic(index);
    
  }

  render() {
    const {comics} = this.props;

    return (
      <>
        <div className= {classNames(styles.top)}>
            <div className= {classNames(styles.title)}>
              MY FAVOURITES
            </div>
            
        
        </div>
        {comics.map((row, index) =>(
          <div key = {index} className= {classNames(styles.comic)}>
            <IconButton aria-label="delete" className= {classNames(styles.overlay)} onClick = {() => this.deleteComic(row)} >
              <CancelIcon fontSize="large"/>
            </IconButton>
            <Image src={row.thumbnail.path +"/portrait_incredible." + row.thumbnail.extension} rounded />
            <div className= {classNames(styles.name)}> {row.title} </div>
          </div>
          
        ))}


      </>
     
    
    )
  }
}

export default ComicCard;
