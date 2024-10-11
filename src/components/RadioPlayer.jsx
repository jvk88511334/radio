// RadioPlayer.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Slider } from '@mui/material';
import { useAudio } from '../AudioContext.jsx';

const RadioList = ({ radios, onRadioSelect }) => {
    if (!Array.isArray(radios) || radios.length === 0) {
        return <p>Aucune radio disponible</p>;
    }

    return (
        <div style={{ position: 'absolute', right: '1em', top: '0' }}>
                    {radios.map(radio => (
                        <div key={radio.id}>
                            <button
                                onClick={() => onRadioSelect(radio)}
                                style={{
                                    color: '#e3d5ca',
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    fontSize: '1.1em',
                                    textAlign: 'left',
                                    width: '100%'
                                }}
                            >
                                {radio.name}
                                <div style={{fontSize: '1em', paddingLeft: '1px', color: 'grey'}}>{radio.genre}</div>
                            </button>
                        </div>
                    ))}
            <div style={{ marginTop: '5em'}}></div>
        </div>
    );
};

const PlayIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z" fill={color} />
    </svg>
);

const PauseIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill={color} />
    </svg>
);

const TimerOffIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill={color} />
    </svg>
);

const Timer30Icon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill={color} />
        <text x="7" y="17" fontFamily="Arial" fontSize="6" fill={color}>30</text>
    </svg>
);

const Timer60Icon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill={color} />
        <text x="7" y="17" fontFamily="Arial" fontSize="6" fill={color}>60</text>
    </svg>
);

const DownloadIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill={color} />
    </svg>
);

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const RadioPlayer = ({ radios = [], enableDownload = false }) => {
    const { currentRadio, isPlaying, currentTrack, duration, currentTime, playRadio, togglePlay, seek } = useAudio();
    const [timerState, setTimerState] = useState(0); // 0: off, 1: 30min, 2: 60min
    const [remainingTime, setRemainingTime] = useState(0);
    const theme = useTheme();

    const handleSliderChange = (event, newValue) => {
        seek(newValue);
    };

    const handleTimerClick = () => {
        setTimerState((prevState) => (prevState + 1) % 3);
        switch ((timerState + 1) % 3) {
            case 1:
                setRemainingTime(30 * 60); // 30 minutes
                break;
            case 2:
                setRemainingTime(60 * 60); // 60 minutes
                break;
            case 0:
                setRemainingTime(0); // Timer off
                break;
            default:
                console.warn("État de minuterie inattendu");
                setRemainingTime(0);
                break;
        }
    };

    useEffect(() => {
        let interval;
        if (remainingTime > 0 && isPlaying) {
            interval = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        togglePlay(); // Stop playback
                        setTimerState(0); // Reset timer state
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [remainingTime, isPlaying, togglePlay]);

    const playerStyle = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#000000',
        color: theme.palette.text.primary,
        borderTop: `1px solid ${theme.palette.mode === 'light' ? 'black' : 'white'}`,
        padding: '0.75rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        zIndex: 1000,
    };

    const isMP3WithDuration = false;
    const isDownloadable = enableDownload && isMP3WithDuration;

    const handleDownload = () => {
        if (currentRadio && isDownloadable) {
            const link = document.createElement('a');
            link.href = currentRadio.streamUrl;
            link.download = `${currentRadio.name || 'audio'}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const getTimerIcon = () => {
        switch (timerState) {
            case 1: return <Timer30Icon color={theme.palette.text.primary} />;
            case 2: return <Timer60Icon color={theme.palette.text.primary} />;
            default: return <TimerOffIcon color={theme.palette.text.primary} />;
        }
    };

    return (
        <>
            <RadioList radios={radios} onRadioSelect={playRadio} />
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
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {isDownloadable && (
                            <button
                                onClick={handleDownload}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    marginRight: '8px',
                                }}
                                aria-label="Télécharger"
                            >
                                <DownloadIcon color={theme.palette.text.primary} />
                            </button>
                        )}
                        <button
                            onClick={handleTimerClick}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                marginRight: '8px',
                            }}
                            aria-label="Minuterie"
                        >
                            {getTimerIcon()}
                        </button>
                        <button
                            onClick={togglePlay}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <PauseIcon color={theme.palette.text.primary} /> : <PlayIcon color={theme.palette.text.primary} />}
                        </button>
                    </div>
                </div>
                {isMP3WithDuration && (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ marginRight: '0.5rem', minWidth: '45px', textAlign: 'right' }}>{formatTime(currentTime)}</span>
                        <Slider
                            value={currentTime}
                            onChange={handleSliderChange}
                            max={duration || 100}
                            aria-labelledby="continuous-slider"
                            sx={{
                                color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
                                '& .MuiSlider-thumb': {
                                    width: 12,
                                    height: 12,
                                    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                    '&:before': {
                                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                                    },
                                    '&:hover, &.Mui-focusVisible': {
                                        boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark' ? 'rgb(255 255 255 / 16%)' : 'rgb(0 0 0 / 16%)'}`,
                                    },
                                    '&.Mui-active': {
                                        width: 20,
                                        height: 20,
                                    },
                                },
                                '& .MuiSlider-rail': {
                                    opacity: 0.28,
                                },
                            }}
                        />
                        <span style={{ marginLeft: '0.5rem', minWidth: '45px' }}>{formatTime(duration)}</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default RadioPlayer;