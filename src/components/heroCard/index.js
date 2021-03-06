import React, { Component } from 'react';


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

import styles from './styles.module.css';
import classNames from "classnames";

import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';


const privateKey = "b7d2bef1b3feb2720bc188c77d16f7f2c624b126";
const publicKey = "e1b384507a43560a8dd97f899ba78e7e";
const t = 1;

const hash = md5(1+privateKey+publicKey);


class HeroCard extends Component {

  constructor(props){
      super(props);

      this.state = {
        
        heroInfo : [],
        show : false,
        comicTitle : "",
        comicImage : "",
        comicDescription : "",
        activeComic : [],
        showInfo : false,
        heroName : "",
        heroImage : "",
        heroDescription : "",
        heroUrls : "",
        heroModified : ""

      }

  }

  comicInfo(info){

    axios.get(info.resourceURI + "?ts=1&apikey=" + publicKey + "&hash=" + hash)
          .then((response) => {

            this.showModal(response);
              
      })

  }

  showModal(info){

    this.setState({ show : true,
                    comicTitle : info.data.data.results[0].title,
                    comicImage : info.data.data.results[0].thumbnail.path +"/portrait_incredible." + info.data.data.results[0].thumbnail.extension,
                    comicDescription : info.data.data.results[0].description,
                    activeComic : info.data.data.results[0]});
             

  }

  addToFavs(){
    const {activeComic} = this.state;
    this.props.updateFavList(activeComic);
  }

  handleClose(){
    this.setState({show : false});
  }

  handleInfoClose(){
    this.setState({showInfo : false});
  }


  showMoreInfo(info){

    console.log(info.urls);
    

    this.setState({ showInfo : true,
                    heroName : info.name,
                    heroImage : info.thumbnail.path +"/portrait_incredible." + info.thumbnail.extension,
                    heroDescription : info.description,
                    heroUrls : info.urls,
                    heroModified : moment(info.modified).format('MMMM Do YYYY, h:mm:ss a')});

  }

  render() {

    const {heroInfo} = this.props;
    const {show, comicTitle, comicImage, comicDescription, showInfo, heroName, heroDescription, heroUrls, heroImage, heroModified} = this.state;

    return(
      
      <Container>

      <Modal show={show} onHide={() => this.handleClose()} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{comicTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
          <Col xs={6} md={4}>
            <Image src={comicImage} rounded />
          </Col>
          <Col xs={12} md={8}>
          <Card style={{ height: '100%' }}>
            
              <Card.Body>
                
                <div  className= {classNames(styles.description)}>
                  {comicDescription ? comicDescription : "No description avaible."}
                </div>

                <Row className = {classNames(styles.rowButton)}>
                    <Col>
                    
                      <Button variant="secondary" onClick={() => this.addToFavs()} className= {classNames(styles.buttonComic)}>
                        ADD TO FAVOURITES
                      </Button>

                    </Col>

                    <Col>
                    
                      <Button variant="secondary" onClick={() => this.handleClose()} className= {classNames(styles.buttonComic)}>
                        Close
                      </Button>

                    </Col>

                </Row>

               
                
              </Card.Body>
          </Card>
        </Col>
          
        </Row>

        </Modal.Body>
       
      </Modal>

      <Modal show={showInfo} onHide={() => this.handleInfoClose()} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{heroName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
          <Col xs={6} md={4}>
            <Image src={heroImage} rounded />
          </Col>
          <Col xs={12} md={8}>
          <Card style={{ height: '100%' }}>
            
              <Card.Body>
                
                <div  className= {classNames(styles.description)}>
                  {heroDescription ? heroDescription : "No description avaible."}
                </div>

                <div  className= {classNames(styles.description)}>
                  { "LAST MODIFIED DATE: " + heroModified}
                </div>

                <div className= {classNames(styles.subTitle)}>INTEREST SITES:</div>

                  {heroUrls ?
                    heroUrls
                    .map((row, index) =>
                      <div key = {index}>
                        <a target="_blank" key = {index} className= {classNames(styles.comicLink)} href={row.url}>
                          { row.type == "detail" ? "DETAIL"
                            : row.type == "wiki" ? "WIKI"
                            : row.type == "comiclink" ? "COMIC LINK"
                            : null
                          }
                        </a>
                      </div>
                      
                    )

                    : 
                    null
                  }

                <Row className = {classNames(styles.rowButton)}>
                    
                    <Col>
                    
                      <Button variant="secondary" onClick={() => this.handleInfoClose()} className= {classNames(styles.buttonComic)}>
                        Close
                      </Button>

                    </Col>

                </Row>

               
                
              </Card.Body>
          </Card>
        </Col>
          
        </Row>

        </Modal.Body>
       
      </Modal>

      <Row>
        <Col xs={6} md={4}>
          <Image src={heroInfo.thumbnail.path +"/portrait_incredible." + heroInfo.thumbnail.extension} rounded />
        </Col>
        <Col xs={12} md={8}>
          <Card style={{ height: '100%' }}>
            
              <Card.Body>
                <Card.Title className= {classNames(styles.title)}>{heroInfo.name}</Card.Title>
                <div  className= {classNames(styles.description)}>
                  {heroInfo.description ? heroInfo.description : "No description avaible."}
                </div>

                <div className= {classNames(styles.subTitle)}>AVAIBLE COMICS:</div>

                  {
                    heroInfo.comics.items
                    .slice(0, 4)
                    .map((row, index) =>
                      <div key = {index}>
                        <a key = {index} className= {classNames(styles.comicLink) } onClick = {() => this.comicInfo(row)}>
                          {row.name}
                        </a>
                      </div>
                      
                    )
                  }

                 
                <Row className = {classNames(styles.rowButton)}>
                    <Col>
                    
                      <Button variant="secondary" onClick={() => this.showMoreInfo(heroInfo)} className= {classNames(styles.buttonComic)}>
                        More Info
                      </Button>

                    </Col>

                    

                </Row>
                
              </Card.Body>
          </Card>
        </Col>
      </Row>

        
      
      </Container>

      

    
    )
  }
}

export default HeroCard;
