import React, { Component } from 'react';

import styles from './styles.module.css';
import classNames from "classnames";

import Image from 'react-bootstrap/Image';


class TopBar extends Component {

  
  render() {
    
    return (
      <div className= {classNames(styles.top)}>
        
        <Image src="/marvel.png" className= {classNames(styles.logo)}/>
        
      </div>
    );
  }
}

export default TopBar;
