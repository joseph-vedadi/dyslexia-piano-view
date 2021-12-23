import React, { Component , useState, useEffect} from "react";
import { Row, Col, Button, Container } from 'react-bootstrap';
import Switch from "react-switch";
import {REMOST_URL} from "./constants"
import emptyBox from './imgs/empty.png'
import fullBox from './imgs/full.png'
import  Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
const click1 = new Audio(`${REMOST_URL}audio/low.mp3`);
const  click2 = new Audio(`${REMOST_URL}audio/high.mp3`);
const shortid = require('shortid');
const beatsPerMeasure= 4
export const Metronome = ({bpm , isPlaying}) => {
  const [volume, setVolume] = useState(50)
  const [playMetronome, setPlayMetronome] = useState(false)
  const [counter2, setCounter2] = useState(0)
  const [timer, setTimer] = useState(undefined)
  let counter = 0

  useEffect(() => {
      console.log(`${isPlaying}  isPlaying`);
      startStop()
  },[isPlaying, playMetronome]

  )
  useEffect(() => {
    click1.volume = volume/100
    click2.volume = volume/100

},[volume]

)

  const playClick = () => {
    if (counter+1 === beatsPerMeasure) {
      click2.play();
    } else {
      click1.play();
    }
    counter=(counter+1)%beatsPerMeasure
    setCounter2(counter)
  };

    const startStop = () => {
    if (!isPlaying | !playMetronome) {
      console.log("stop the timer")
      clearInterval(timer);
    } else {
      console.log(`start a timer with current ${bpm}`)
      setTimer(setInterval(playClick, (60 / bpm) * 1000))
    }
  };



  return (
    <Container>
  <Row className="justify-content-md-center"> 
    <Col>
    {Array.from({length: beatsPerMeasure}, (_, i) => <img key={shortid.generate()} src={(counter2==i)?fullBox:emptyBox}   width="30" 
     height="30"/>)}
    </Col>
    <Col>
    <Switch  onChange={() =>setPlayMetronome(!playMetronome)} checked={playMetronome}></Switch>
    </Col>
    
    
  </Row>
  <Row className="justify-content-md-center"> 
  <Col>
  <Slider min={1} max={100} onChange={setVolume} value={volume}/>
  </Col>
    
  </Row>
  </Container>)



}

export default Metronome;
