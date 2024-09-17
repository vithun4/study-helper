import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Button, Card, CardContent, CardActions, Typography, TextField, Collapse, CircularProgress, Box } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function PomoTimer() {
    // Timer durations in seconds (default times)
    const defaultFocusTime = 25 * 60;  // 25 minutes
    const defaultShortBreakTime = 5 * 60;  // 5 minutes
    const defaultLongBreakTime = 15 * 60;  // 15 minutes

    // State to track current phase times
    const [focusTime, setFocusTime] = useState(defaultFocusTime);
    const [shortBreakTime, setShortBreakTime] = useState(defaultShortBreakTime);
    const [longBreakTime, setLongBreakTime] = useState(defaultLongBreakTime);

    // Timer state
    const [time, setTime] = useState(focusTime); // The current countdown
    const [isActive, setIsActive] = useState(false); // Is timer running?
    const [isPaused, setIsPaused] = useState(false); // Is timer paused?
    const [phase, setPhase] = useState('Focus'); // Can be 'Focus', 'Short Break', or 'Long Break'

    // Collapse state
    const [showSettings, setShowSettings] = useState(false); // Toggle settings visibility

    const intervalRef = useRef<null | NodeJS.Timeout>(null); // To store the interval ID

    // Function to format the time in MM:SS format
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Calculate inverted progress for CircularProgress
    const calculateProgress = () => {
        let totalTime = phase === 'Focus' ? focusTime : (phase === 'Short Break' ? shortBreakTime : longBreakTime);
        return (time / totalTime) * 100; // Start at 100% and decrease to 0%
    };

    // Start or resume the timer
    const startTimer = () => {
        // Clear any existing interval before starting a new one
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setIsActive(true);
        setIsPaused(false);

        intervalRef.current = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(intervalRef.current as NodeJS.Timeout);
                    handleNextPhase();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000); // Update the timer every second
    };

    // Pause the timer
    const pauseTimer = () => {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setIsPaused(true);
    };

    // Reset the timer
    const resetTimer = () => {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setPhase('Focus');
        setTime(focusTime);
        setIsActive(false);
        setIsPaused(false);
        // setShowSettings(true); // Show settings again after reset
    };

    // Skip to next phase
    const handleNextPhase = () => {
        if (phase === 'Focus') {
            setPhase('Short Break');
            setTime(shortBreakTime);
        } else if (phase === 'Short Break') {
            setPhase('Long Break');
            setTime(longBreakTime);
        } else {
            setPhase('Focus');
            setTime(focusTime);
        }
        setIsActive(false);
        setIsPaused(false);
    };

    // Customizing focus, short break, and long break times
    const handleTimeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {
        const newTime = Number(event.target.value) * 60;
        if (type === 'Focus') {
            setFocusTime(newTime);
            if (phase === 'Focus') setTime(newTime);
        } else if (type === 'Short Break') {
            setShortBreakTime(newTime);
            if (phase === 'Short Break') setTime(newTime);
        } else if (type === 'Long Break') {
            setLongBreakTime(newTime);
            if (phase === 'Long Break') setTime(newTime);
        }
    };

    // Clean up the interval on component unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    }, []);

    return (
        <Card 
            elevation={5} 
            sx={{ 
                width: '350px', 
                margin: 'auto', 
                padding: '20px', 
                borderRadius: '16px', 
                backgroundColor: '#ffffff',
                textAlign: 'center'
            }}
        >
            <CardContent>
                <Box position="relative" display="inline-flex">
                    <CircularProgress 
                        variant="determinate" 
                        value={calculateProgress()} 
                        size={140} 
                        thickness={4}
                        sx={{ color: '#1976d2' }} // Soft, consistent color
                    />
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="h3" component="div" color="textPrimary" sx={{ fontWeight: 'bold' }}>
                            {formatTime(time)}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="subtitle1" color="textSecondary" sx={{ marginTop: '10px' }}>
                    {phase} Session
                </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'center', marginTop: '20px' }}>
                {!isActive ? (
                    <Button variant="contained" onClick={startTimer} sx={{ fontWeight: 'bold' }}>
                        Start
                    </Button>
                ) : (
                    <>
                        <Button variant="contained" onClick={pauseTimer} sx={{ fontWeight: 'bold' }}>
                            Pause
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={handleNextPhase} 
                            sx={{ marginLeft: '10px', fontWeight: 'bold' }}
                        >
                            Skip
                        </Button>
                    </>
                )}
                <Button 
                    variant="outlined" 
                    onClick={resetTimer} 
                    sx={{ marginLeft: '10px', fontWeight: 'bold', color: '#d32f2f', borderColor: '#d32f2f' }}
                >
                    Reset
                </Button>
                <Button onClick={() => setShowSettings(!showSettings)} sx={{ marginLeft: '10px' }}>
                    <SettingsOutlinedIcon />
                </Button>
            </CardActions>
            <Collapse in={showSettings}>
                <CardContent>
                    <Typography variant="subtitle1" color="textSecondary" sx={{ marginBottom: '10px' }}>
                        Customize Timer (minutes)
                    </Typography>
                    <TextField
                        label="Focus Time"
                        type="number"
                        variant="outlined"
                        size="small"
                        defaultValue={25}
                        onChange={(e) => handleTimeChange(e, 'Focus')}
                        sx={{ marginRight: '10px', width: '80px' }}
                    />
                    <TextField
                        label="Short Break"
                        type="number"
                        variant="outlined"
                        size="small"
                        defaultValue={5}
                        onChange={(e) => handleTimeChange(e, 'Short Break')}
                        sx={{ marginRight: '10px', width: '80px' }}
                    />
                    <TextField
                        label="Long Break"
                        type="number"
                        variant="outlined"
                        size="small"
                        defaultValue={15}
                        onChange={(e) => handleTimeChange(e, 'Long Break')}
                        sx={{ width: '80px' }}
                    />
                </CardContent>
            </Collapse>
        </Card>
    );
}
