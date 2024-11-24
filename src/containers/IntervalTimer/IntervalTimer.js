import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import EditPage from '../EditPage/EditPage';
import './IntervalTimer.css';

import Kofi from '../../assets/Ko-fi_Icon_RGBforDarkBg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const downArrow = <FontAwesomeIcon className="downArrow" icon={faAngleDown} />;


const IntervalTimer = (props) => {
    const [totalCountdown, setTotalCountdown] = useState(Number(props.totalTime));
    const [timeRemaining, setTimeRemaining] = useState(Number(props.intervalSeconds));
    const [intervals, setIntervals] = useState(Number(props.intervalCount));
    const [intervalTimerKey, setIntervalTimerKey] = useState(Number(props.totalTime));
    const [totalTimerKey, setTotalTimerKey] = useState(Number(props.totalTime));
    const [currentInterval, setCurrentInterval] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [shouldRepeat, setShouldRepeat] = useState(true);
    const [currentTime, setCurrentTime] = useState(DateTime.local().toLocaleString(DateTime.TIME_WITH_SECONDS));
    const [displayNameArray, setDisplayNameArray] = useState([]); ///copied array for save and cancel features
    const [displayNumberArray, setDisplayNumberArray] = useState([]); //copied array for save and cancel features
    const [displayName, setDisplayName] = useState("Interval");
    const [displayNumber, setDisplayNumber] = useState("1");

    const pausePlayHandler = () => {
        // setIsPlaying((prevState) => {
        //     return !prevState;
        // });
        setIsPlaying(true);
    }

    const resetHandler = () => {
        setIntervalTimerKey((prevState) => {
            return prevState + 1;
        });
        setTotalTimerKey((prevState) => {
            return prevState + 1;
        });
        setCurrentInterval(1);
        setIsPlaying(false);
        setShouldRepeat(true);
    }

    const recalculateHandler = () => {
        setIntervalTimerKey((prevState) => {
            return prevState + 1;
        });
        setTotalTimerKey((prevState) => {
            return prevState + 1;
        });
        setCurrentInterval(1);
        setShouldRepeat(true);
    }

    //should pass up interval array and change it here so it's in sync with the timer
    const intervalHandler = () => {
        let shouldTimerRepeat = shouldRepeat;
        if (currentInterval < intervals) {
            const currentIntervals = currentInterval + 1;
            setDisplayName(displayNameArray[currentInterval]);
            setDisplayNumber(displayNumberArray[currentInterval]);
            setCurrentInterval(currentIntervals);
        } else {
            shouldTimerRepeat = returnShouldRepeat();
            return shouldTimerRepeat;
        }
        return [shouldTimerRepeat, 500];
    }

    const returnShouldRepeat = () => {
        setShouldRepeat(false);
    }

    const saveFormDataHandler = (formValueData) => {
        const formData = {
            ...formValueData,
            id: Math.random().toString()
        }
        setDisplayNameArray(formData.nameArray);
        setDisplayNumberArray(formData.numberArray);
        setDisplayName(formData.nameArray[0]);
        setDisplayNumber(formData.numberArray[0]);
    }   

    // let pausePlay = null;
    // if (isPlaying === true) {
    //     pausePlay = <button onClick={pausePlayHandler}>Stop</button>;
    // }
    // if (isPlaying === false) {
    //     pausePlay = <button onClick={pausePlayHandler}>Start</button>;
    // }

    useEffect(() => {
        setTotalCountdown(props.totalTime);
        setTimeRemaining(props.intervalSeconds);
        setIntervals(props.intervalCount);
        setIntervalTimerKey(props.intervalSeconds);
        setTotalTimerKey(props.totalTime);
        const interval = setInterval(() => {
            setCurrentTime(DateTime.local().toLocaleString(DateTime.TIME_WITH_SECONDS));
        }, 1000);
        return () => clearInterval(interval);
    }, [props.totalTime, props.intervalSeconds, props.intervalCount, totalCountdown, timeRemaining, intervals]);

    return (
        <div className="IntervalTimer">
            {/* INTERVAL TIMER COUNTDOWN */}
            <div className="CountdownTimer">
                <EditPage
                    onSaveFormData={saveFormDataHandler}
                    currentInterval={currentInterval}
                    intervals={intervals}
                    formFilled={props.formFilled}
                    inputInterval={props.inputInterval}
                    displayName={displayName}
                    displayNumber={displayNumber}
                />
                <CountdownCircleTimer
                    className={CountdownCircleTimer}
                    key={intervalTimerKey} //CHANGE
                    isPlaying={isPlaying}
                    duration={timeRemaining}
                    size={300}
                    colors={[["#4192DC", 0.85], ["#F7B801", 0.10], ["#A30000", 0.05]]}
                    strokeWidth="20"
                    onComplete={intervalHandler}
                >
                    {({ remainingTime }) => {
                        const totalSeconds = remainingTime;
                        let hours = 0;
                        let minutes = 0;
                        let seconds = totalSeconds;

                        if (totalSeconds >= 3600) {
                            //CALCULATE HOURS/MINUTES/SECONDS
                            hours = Math.floor(totalSeconds / 3600);
                            const hourValue = hours * 3600;
                            const calculateMinutes = totalSeconds - hourValue;
                            minutes = Math.floor(calculateMinutes / 60);
                            seconds = calculateMinutes % 60;
                        } else if (totalSeconds <= 3599) {
                            //CALCULATE MINUTES/SECONDS
                            minutes = Math.floor(totalSeconds / 60);
                            seconds = totalSeconds % 60;
                        } else if (totalSeconds <= 59 ) {
                            //CALCULATE SECONDS
                            seconds = totalSeconds;
                        }

                        //Converting the numbers to display a 0 before signal digit numbers
                        hours = (hours).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
                        minutes = (minutes).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
                        seconds = (seconds).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})

                        if (remainingTime === 0) {
                            return <div className="countdownMessage redZone">Time's up!</div>
                        } else if (remainingTime < 20) {
                            return (
                                <div className="countMessage cautionZone">
                                    <div>Start wrapping up!</div>
                                    <div className="countdown number">{hours}:{minutes}:{seconds}</div>
                                </div>
                            );
                        }
                        return (
                            <div className="countMessage goodZone">
                                <div>Time Remaining</div>
                                <div className="countdown number">{hours}:{minutes}:{seconds}</div>
                            </div>
                        );
                    }}
                </CountdownCircleTimer>
            </div>
            <div className="TimerControls">
                {/* {pausePlay} */}
                <div className="buttonDropdown">
                    <button className="btn" onClick={pausePlayHandler}>Start</button>
                    <div className="dropdown">
                        <button className="btn2">
                            {downArrow}
                        </button>
                        <div className="dropdown-content">
                            <button onClick={() => { props.recalculate(); recalculateHandler();}}>Recalculate start time from current time</button> 
                        </div>
                    </div>
                </div>
                <button className="controlButton" onClick={resetHandler}>Reset</button>
            </div>
            {/* TOTAL TIME COUNTDOWN */}
            <div className="TimeInformation">
                <div className="TotalTimeCountdownTimer">
                    <CountdownCircleTimer
                        className={CountdownCircleTimer}
                        key={totalTimerKey}
                        isPlaying={isPlaying}
                        duration={totalCountdown}
                        size={0}
                        colors={[["#fff", 0.75], ["#fff", 0.15], ["#fff", 0.05]]}
                        strokeWidth="20"
                    >
                        {({ remainingTime }) => {
                                const totalSeconds = remainingTime;
                                let hours = 0;
                                let minutes = 0;
                                let seconds = totalSeconds;

                                if (totalSeconds >= 3600) {
                                    //CALCULATE HOURS/MINUTES/SECONDS
                                    hours = Math.floor(totalSeconds / 3600);
                                    const hourValue = hours * 3600;
                                    const calculateMinutes = totalSeconds - hourValue;
                                    minutes = Math.floor(calculateMinutes / 60);
                                    seconds = calculateMinutes % 60;
                                } else if (totalSeconds <= 3599) {
                                    //CALCULATE MINUTES/SECONDS
                                    minutes = Math.floor(totalSeconds / 60);
                                    seconds = totalSeconds % 60;
                                } else if (totalSeconds <= 59 ) {
                                    //CALCULATE SECONDS
                                    seconds = totalSeconds;
                                }

                                //Converting the numbers to display a 0 before signal digit numbers
                                hours = (hours).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
                                minutes = (minutes).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
                                seconds = (seconds).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})

                            return (
                                <div className="totalTimeDisplay">
                                    <p className="timeInfoTitle">Total&nbsp;Time&nbsp;Remaining</p>
                                    <h1 className="clock number">{hours}:{minutes}:{seconds}</h1>
                                </div>
                            );
                        }}
                    </CountdownCircleTimer>
                </div>
                <div className="currentTimeDisplay">
                    <p className="message">Current Time</p>
                    <h1 className="clock number">{currentTime}</h1>
                </div>
            </div>
            <div className="CoffeeSection">
                <a href="https://ko-fi.com/maevachon" target="_blank" rel="noopener noreferrer"><img src={Kofi} width="40px" alt="Kofi link" /></a>
            </div>
        </div>
    );
}

export default IntervalTimer;
