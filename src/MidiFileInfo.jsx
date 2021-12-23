
import React from 'react'
import { Row, Col, Container } from 'react-bootstrap';
const shortid = require('shortid');
function MidiFileInfo({midiPlayer}) {
    const items = ["sampleRate",
    "startTick",
    "startTime",
    "tempo",
    "tick",
    "totalEvents",
    "totalTicks"]
  return <Container>
      {items.map(item=><Row key ={shortid.generate()}><Col>{`${item}:`}</Col><Col>{midiPlayer[item]}</Col></Row>)}
  </Container>


}

export default MidiFileInfo;








