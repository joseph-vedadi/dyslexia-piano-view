import React, { useEffect, useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap';
import Select from 'react-select'
import axios from "axios";
import MidiPlayerView from "./MidiControler/midiPlayer"
import MusicSheet from "./musicSheet"
const LIST_MIDI_URL = "https://dyslexia-piano.herokuapp.com/"
const GET_MIDI_URL = `${LIST_MIDI_URL}midi/`
export const Main = () => {

  const [midFiles, setMidiFiles] = useState([])
  const [midiInfo, setMidiInfo] = useState(undefined)
  const loadMidiBinary = async url => {
    const { data } = await axios.get(url, {
      responseType: "arraybuffer",
      crossdomain: true
    });
    return data;
  };
  const loadMidiFile = ({ value }) => {
    const fileUrl = GET_MIDI_URL + value
    setMidiInfo({ fileName: value, url: fileUrl, data: loadMidiBinary(fileUrl) })
  }
  useEffect(() => {
    fetch(LIST_MIDI_URL)
      .then(res => res.json())
      .then(
        (result) => {
          setMidiFiles(
            result.map(midiName => { return { "value": midiName, "label": midiName } })
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
        <Select options={midFiles} onChange={loadMidiFile} />
      </Col>
    </Row>
    <Row>
      <MusicSheet />
    </Row>
    <Row>
      <Col>
        {midiInfo && <MidiPlayerView {...midiInfo} />}
      </Col>
    </Row>
  </Container>)
}

export default Main
