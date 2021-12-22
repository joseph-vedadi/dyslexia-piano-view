// import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import axios from "axios";
import soundfontPlayer from "soundfont-player";
import { getInstrumentName } from "./get-instrument-name";
import {
  getInstrument,
  loadInstruments
} from "./load-instrument";

import MidiPlayer from "midi-player-js";
const getInstrumentByName = (instruments, instrumentName) => {
  return Object.values(instruments).filter(inst => inst.name === instrumentName)[0]
}



const getNoteKey = ({ noteName, track, channel }) => {
  return `${noteName}_${track}_${channel}`;
};

const smooshObjs = (obj1, obj2) => {
  return Object.assign({}, obj1, obj2);
};

const midiEventsToNoteActions = midiEvent => {
  const {
    channel,
    noteName,
    track,
    name: midiEventType
  } = midiEvent;
  const noteKey = getNoteKey({ noteName, track, channel });
  const instrumentName = getInstrumentName(channel);
  if (midiEventType === "Note on") {
    return {
      type: "NOTE_ON",
      payload: {
        key: noteKey,
        instrumentName,
        channel,
        noteName
      }
    };
  } else if (midiEventType === "Note off") {
    return {
      type: "NOTE_OFF",
      payload: {
        key: noteKey,
        instrumentName,
        channel,
        noteName
      }
    };
  } else {
    return null;
  }
};

const possibleMidiPlayerStates = {
  paused: "paused",
  playing: "playing",
  stopped: "stopped"
};

const possibleLoadingStates = {
  loading: "loading",
  loaded: "loaded",
  errored: "errored"
};

let playingNotes = {};

const playNote = ({ instrument, noteName, noteKey }) => {
  if (!(noteKey in playingNotes)) {
    playingNotes[noteKey] = [];
  }
  debugger
  playingNotes[noteKey].push(instrument.play(noteName));
};
const stopNote = ({ instrument, noteName, noteKey }) => {
  if (noteKey in playingNotes) {
    playingNotes[noteKey] = [];
  }
  playingNotes[noteKey].push(instrument.stop(noteName));
};
class ReactMidiPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areInstrumentsLoaded: false
    };
    this.midiPlayer = new MidiPlayer.Player();
  }
  async componentDidMount() {
    const { url, filePath } = this.props;
    const midi = await loadMidi(url);
    this.midiPlayer.loadArrayBuffer(midi);
    const instruments = await loadInstruments(
      this.midiPlayer
    );
    this.setState({
      areInstrumentsLoaded: true,
      playableInstruments: instruments
    });
    this.midiPlayer.on("midiEvent", midiEvent => {
      const action = midiEventsToNoteActions(midiEvent);
      if (action === null) return;
      const { payload, type } = action;
      const {
        instrumentName,
        noteName,
        key,
        channel
      } = payload;
      console.log(`key:${key}  noteName ${noteName}`)
      switch (type) {
        case "NOTE_ON": {
          playNote({
            instrument: getInstrumentByName(instruments, instrumentName),
            noteName,
            noteKey: key
          });
        }
        case "NOTE_OFF": {
          console.log("Left as an exercise to the reader");
        }
        default: {
          return;
        }
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.areInstrumentsLoaded === true ? (
          <div>
            Loaded
            <button
              onClick={() => {
                this.midiPlayer.play();
              }}
            >
              Play
            </button>
            <button
              onClick={() => {
                this.midiPlayer.pause();
              }}
            >
              Pause
            </button>
            <button
              onClick={() => {
                this.midiPlayer.stop();
              }}
            >
              Stop
            </button>
          </div>
        ) : (
          "Loading Instruments"
        )}
      </div>
    );
  }
}
ReactMidiPlayer.defaultProps = {
  midiPlayer: null,
  midiPlayerState: ""
};
class MidiPlayerView extends React.Component {
  render() {
    const { url, } = this.props;
    return (
      <div>
        ReactMidiPlayerDemo Playing url : {url}
        <ReactMidiPlayer url={url} filePath={"/Users/josephvedadi/Desktop/Dyslexia-Piano/dyslexia-piano-view/src/MidiControler/midis/silent_night_easy.mid"} />
      </div>
    );
  }
}

export default React.memo(MidiPlayerView)