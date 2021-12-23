import React, { useEffect, useState } from 'react'
import { Row, Col, Container , Button} from 'react-bootstrap';

import Select from 'react-select'
import axios from "axios";
// import MidiPlayerView from "./MidiControler/midiPlayer"
import MidiPlayerControler from './MidiPlayerControler';
import MusicSheet from "./musicSheet"
import MidiPlayer from "midi-player-js";
import {
  getInstrument,
  loadInstruments
} from "./MidiControler/load-instrument"
import MidiFileInfo from './MidiFileInfo'
import {REMOST_URL} from './constants' 
import Metronome from './Metronome';
export const Main = () => {

  const [midiPlayer, setMidiPlayer] = useState(undefined)
  const [instruments, setInstruments] = useState([])
  const [midFiles, setMidiFiles] = useState([])
  const [midiFileName, setMidiFileName] = useState(undefined)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    
    if (midiFileName !== undefined){
    axios.get(REMOST_URL+midiFileName, {
      responseType: "arraybuffer"}).then((response) => {
      const { data:midiBinary } = response
      const midiPlayer_= new MidiPlayer.Player()
      midiPlayer_.loadArrayBuffer(midiBinary)
      setInstruments( loadInstruments(midiPlayer_)) 
      setMidiPlayer(midiPlayer_)
      setIsPlaying(false)
    })
  }
    
       
  }, [midiFileName])

  useEffect(() => {
    fetch(REMOST_URL)
      .then(res => res.json())
      .then(
        ({midi}) => {
          setMidiFiles(
            midi.map(midiName => { return { "value": midiName, "label": midiName } })
          )
        },

        (error) => {
          console.error(error)
        }
      )
  }, [])
  return (midFiles && <Container Container>
    <Row>
      <Col>
      <Row>
        <Select options={midFiles} onChange={({value})=>setMidiFileName(value)} />
        </Row>
        <Row>
        {midiPlayer && <Metronome bpm={midiPlayer.tempo} isPlaying={isPlaying }/>}
        </Row>
        <Row>
        {midiPlayer && 
        <Button onClick={()=>setIsPlaying(!isPlaying)} >{isPlaying?"Stop":"Play"}</Button>
        }
        </Row>
      </Col>
      {midiPlayer && <Col>
       <MidiFileInfo midiPlayer={midiPlayer}  />
      </Col>}
    </Row>
    <Row>
      {/* <MusicSheet /> */}
    </Row>
    <Row>
      <Col>
        {midiPlayer && <MidiPlayerControler midiPlayer={midiPlayer} isPlaying={isPlaying}/>        }
      </Col>
      
    </Row>
  </Container>)
}

export default Main
