import React, {useState} from 'react'
import {AudioProvider} from "./AudioContext.jsx";
import radioLists from "./data/radios.json";
import RadioPlayer from "./components/RadioPlayer.jsx";

function App() {
    const [mode] = useState('dark');

    return (
        <AudioProvider>
            <RadioPlayer radios={radioLists.listeA} />
        </AudioProvider>
    )
}

export default App