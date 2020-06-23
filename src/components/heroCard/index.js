import React, { Component } from 'react';


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


import styles from './styles.module.css';
import classNames from "classnames";

import axios from 'axios';
import md5 from 'md5';

const privateKey = "b7d2bef1b3feb2720bc188c77d16f7f2c624b126";
const publicKey = "e1b384507a43560a8dd97f899ba78e7e";
const t = 1;

const hash = md5(1+privateKey+publicKey);


class HeroCard extends Component {

  constructor(props){
      super(props);

      this.state = {
        
        heroInfo : []
      }

  }

  async componentDidMount(){

    this.getComics();

  }

  getComics = async () => {

    const {heroInfo} = this.props;
    
    await axios.get("https://gateway.marvel.com:443/v1/public/characters/" + heroInfo.id + "/comics?limit=4&ts=1&apikey=" + publicKey + "&hash=" + hash)
                  .then((response) => {

                    console.log(response);
                  
                  })
    
  };

  getInfo(){
    console.log(this.props.heroInfo);
    
  }

  render() {

    const {heroInfo} = this.props;

    return(
      
      <Container>

      <Row>
        <Col xs={6} md={4}>
          <Image src={heroInfo.thumbnail.path +"/portrait_incredible." + heroInfo.thumbnail.extension} rounded />
        </Col>
        <Col xs={12} md={8}>
          <Card style={{ height: '100%' }}>
            
              <Card.Body>
                <Card.Title className= {classNames(styles.title)}>{heroInfo.name}</Card.Title>
                <div >
                  {heroInfo.description ? heroInfo.description : "No description avaible."}
                </div>

                <Button className= {classNames(styles.buttonInfo)} variant="primary" onClick = {() => this.getInfo()}>Go somewhere</Button>
                
              </Card.Body>
          </Card>
        </Col>
      </Row>

        
      
      </Container>

      

    
    )
  }
}

export default HeroCard;
