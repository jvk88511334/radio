import React, { useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import { useAudio } from '../AudioContext.jsx';

const GenreSelector = ({ genres, selectedGenre, onGenreChange }) => {
    return (
        <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            style={{
                background: '#242424',
                color: '#e3d5ca',
                border: '1px solid #333333',
                padding: '0.5em',
                borderRadius: '4px',
                width: '100%',
                height: '4em'
            }}
        >
            <option value="">Radios: toutes</option>
            {genres.map(genre => (
                <option key={genre} value={genre}>
                    {genre}
                </option>
            ))}
        </select>
    );
};

const RadioList = ({ radios, onRadioSelect }) => {
    const [selectedGenre, setSelectedGenre] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const genres = [...new Set(radios.map(radio => radio.genre))];

    const filteredRadios = radios
        .filter(radio => !selectedGenre || radio.genre === selectedGenre)
        .filter(radio => radio.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!Array.isArray(radios) || radios.length === 0) {
        return <p>Aucune radio disponible</p>;
    }

    return (
        <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{position: 'sticky', top: 0, zIndex: 1, background: '#242424', padding: '1em 0'}}>
                <input
                    type="text"
                    placeholder="Rechercher une radio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        background: '#242424',
                        color: '#e3d5ca',
                        border: '1px solid #333333',
                        padding: '0.5em',
                        borderRadius: '4px',
                        width: '100%',
                        height: '2.7em',
                        fontSize: '16px',
                        marginBottom: '1em'
                    }}
                />
                <GenreSelector
                    genres={genres}
                    selectedGenre={selectedGenre}
                    onGenreChange={setSelectedGenre}
                />
            </div>
            <div style={{overflowY: 'auto', flex: 1, paddingBottom: '3em'}}>
                {filteredRadios.map(radio => (
                    <div key={radio.id}>
                        <button
                            onClick={() => onRadioSelect(radio)}
                            style={{
                                color: '#e3d5ca',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                padding: '0.5em 0',
                                fontSize: '1.1em',
                                textAlign: 'left',
                                width: '100%'
                            }}
                        >
                            {radio.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z" fill="white" />
    </svg>
);

const PauseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white" />
    </svg>
);

const TimerOffIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="white" />
    </svg>
);

const Timer30Icon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="white" />
        <text x="7" y="17" fontFamily="Arial" fontSize="6" fill="white">30</text>
    </svg>
);

const Timer60Icon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="white" />
        <text x="7" y="17" fontFamily="Arial" fontSize="6" fill="white">60</text>
    </svg>
);

const DARK_BACKGROUND = '#242424';
const DARK_BORDER = '#333333';

const RadioPlayer = ({ radios = [] }) => {
    const { currentRadio, isPlaying, playRadio, togglePlay } = useAudio();
    const [timerState, setTimerState] = useState(0);
    const [countdownDate, setCountdownDate] = useState(null);

    useEffect(() => {
        if (currentRadio && isPlaying) {
            document.title = `▶ ${currentRadio.name}`;
        } else {
            document.title = 'Radio Player';
        }

        return () => {
            document.title = 'Radio Player';
        };
    }, [currentRadio, isPlaying]);

    const stopTimer = () => {
        setCountdownDate(null);
        setTimerState(0);
        if (isPlaying) {
            togglePlay();
        }
    };

    const handleTimerClick = () => {
        const nextState = (timerState + 1) % 3;
        setTimerState(nextState);

        let duration = 0;
        switch (nextState) {
            case 1:
                duration = 30 * 60 * 1000; // 30 minutes en millisecondes
                break;
            case 2:
                duration = 60 * 60 * 1000;
                break;
            case 0:
                setCountdownDate(null);
                return;
        }

        setCountdownDate(Date.now() + duration);
    };

    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            stopTimer();
            return "";
        }

        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const playerStyle = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: DARK_BACKGROUND,
        color: 'white',
        borderTop: `1px solid ${DARK_BORDER}`,
        padding: '0.75rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        zIndex: 1000,
    };

    const buttonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        marginRight: '8px',
        opacity: 0.9,
        transition: 'opacity 0.2s',
        ':hover': {
            opacity: 1
        }
    };

    const getTimerIcon = () => {
        switch (timerState) {
            case 1: return <Timer30Icon />;
            case 2: return <Timer60Icon />;
            default: return <TimerOffIcon />;
        }
    };

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: '48px',
                width: '250px',
                background: DARK_BACKGROUND,
                borderLeft: `1px solid ${DARK_BORDER}`,
                overflowY: 'auto'
            }}>
                <RadioList radios={radios} onRadioSelect={playRadio} />
            </div>
            <div style={playerStyle}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '48px',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            marginBottom: '0.25rem'
                        }}>
                            {currentRadio?.name || 'Aucune radio sélectionnée'}
                        </div>
                        <div style={{
                            fontSize: '0.875rem',
                            opacity: 0.7
                        }}>
                            {countdownDate ? (
                                <Countdown
                                    date={countdownDate}
                                    renderer={renderer}
                                    onComplete={stopTimer}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            onClick={handleTimerClick}
                            style={buttonStyle}
                            aria-label="Minuterie"
                        >
                            {getTimerIcon()}
                        </button>
                        <button
                            onClick={togglePlay}
                            style={buttonStyle}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RadioPlayer;