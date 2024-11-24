import React, { useState, useEffect } from 'react';
import { DateTime, Interval } from 'luxon';

import TimerForm from '../../components/TimerForm/TimerForm';
import IntervalTimer from '../IntervalTimer/IntervalTimer';

const TimeControl = (props) => {
    const [timeInputs, setTimeInputs] = useState({
        startTime: "",
        endTime: "",
        startHour: null,
        startMinute: null,
        endHour: null,
        endMinute: null,
        inputInterval: null
    });
    const [invalidValue, setInvalidValue] = useState({
        invalidStartTimeVal: "",
        invalidEndTimeVal: "",
        invalidIntervalVal: ""
    });
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [intervalTime, setIntervalTime] = useState({
        intervalHours: 0,
        intervalMinutes: 0,
        intervalSeconds: 0
    });
    const [formFilled, setFormFilled] = useState(false);
    const [startFromHere, setStartFromHere] = useState(false);
    const [totalTime, setTotalTime] = useState(600); //for IntervalTimer.js
    const [intervalCount, setIntervalCount] = useState(2); //for IntervalTimer.js
    const [intervalSeconds, setIntervalSeconds] = useState(300); //for IntervalTimer.js

    const formChangeHandler = event => {
        setTimeInputs({...timeInputs, [event.target.name]: event.target.value});
        if (event.target.name === "startTime") {
            setTimeInputs({
                ...timeInputs,
                startHour: Number(event.target.value.split(":")[0]),
                startMinute: Number(event.target.value.split(":")[1])
            });
        } else if (event.target.name === "endTime") {
            setTimeInputs({
                ...timeInputs,
                endHour: Number(event.target.value.split(":")[0]),
                endMinute: Number(event.target.value.split(":")[1])
            });
        } else if (event.target.name === "inputInterval") {
            const inputAsNumber = Number(event.target.value);
            setTimeInputs({...timeInputs, [event.target.name]: inputAsNumber});
        }
        if (timeInputs.startHour !== null && timeInputs.endHour !== null && timeInputs.inputInterval > -1) {
            setFormFilled(true);
        }
    }

    const formValidation = () => {
        let invalidStartTimeVal = "";
        let invalidEndTimeVal = "";
        let invalidIntervalVal = "";

        //is start time input valid?
        if (timeInputs.startHour === null) {
            invalidStartTimeVal = "Please input a valid start time";
        }
        //is end time input valid?
        if (timeInputs.endHour === null) {
            invalidEndTimeVal = "Please input a valid end time";
        }
        //is interval input valid?
        if (timeInputs.inputInterval <= 0) {
            invalidIntervalVal = "Please input number of paragraphs";
        }

        //are any of the inputs invalid? if so, assign error message value to state
        if (invalidStartTimeVal || invalidEndTimeVal || invalidIntervalVal) {
            setInvalidValue({
                invalidStartTimeVal: invalidStartTimeVal,
                invalidEndTimeVal: invalidEndTimeVal,
                invalidIntervalVal: invalidIntervalVal
            });
            return false;
        } else {
            return true;
        }
    }

    const formSubmit = () => {
        const currentYear = DateTime.local().c.year;
        const currentMonth = DateTime.local().c.month;
        let currentDay = DateTime.local().c.day;
        let startHour = timeInputs.startHour;
        let endHour = timeInputs.endHour;
        
        const isValid = formValidation();

        if (isValid) {
            console.log('form is valid');
            //clear form
            setInvalidValue({
                invalidStartTimeVal: "",
                invalidEndTimeVal: "",
                invalidIntervalValue: ""
            });

            // ///////////////////////////TIME CASE HANDLERS/////////////////////////////
            //CROSSING THRESHOLD INTO NEXT DAY HANDLERS
            let endDay = currentDay;

            if (endHour < startHour) {
                endDay = currentDay + 1;
            } else if (startHour === endHour && timeInputs.startMinute > timeInputs.endMinute) {
                endDay = currentDay + 1;
            }

            const startDate = DateTime.local(currentYear, currentMonth, currentDay, timeInputs.startHour, timeInputs.startMinute);
            const endDate = DateTime.local(currentYear, currentMonth, endDay, timeInputs.endHour, timeInputs.endMinute);
            timeCalculator(startDate, endDate);
        }
    }

    const timeCalculator = (startDate, endDate) => {
        const timeDifference = Interval.fromDateTimes(startDate, endDate).length("seconds");
        const intervals = timeInputs.inputInterval;
        // console.log(timeDifference, intervals);

        //study length hour-minute calculations
        let hourValues = Math.floor(timeDifference / 3600);
        let minuteValues = Math.floor(timeDifference % 3600);
        const hourCalculation = hourValues * 3600;
        const minuteCalculation = timeDifference - hourCalculation;
        minuteValues = Math.floor(minuteCalculation / 60);

        //interval calculations
        let intervalHourValues = 0;
        let intervalMinuteValues = 0;
        let intervalSecondValues = 0;

        const totalIntervalSeconds = Math.floor(timeDifference / intervals);

        if (totalIntervalSeconds >= 3600) {
            //CALCULATE HOURS/MINUTES/SECONDS
            intervalHourValues = Math.floor(totalIntervalSeconds / 3600);
            const hourValue = intervalHourValues * 3600;
            const calculateMinutes = totalIntervalSeconds - hourValue;
            intervalMinuteValues = Math.floor(calculateMinutes / 60);
            intervalSecondValues = calculateMinutes % 60;
            console.log(intervalHourValues, intervalMinuteValues, intervalSecondValues);
        } else if (totalIntervalSeconds <= 3599) {
            //CALCULATE MINUTES/SECONDS
            intervalMinuteValues = Math.floor(totalIntervalSeconds / 60);
            intervalSecondValues = totalIntervalSeconds % 60;
        } else if (totalIntervalSeconds <= 59 ) {
            //CALCULATE SECONDS
            intervalSecondValues = totalIntervalSeconds;
        }
        
        setHours(hourValues);
        setMinutes(minuteValues);
        setIntervalTime({
            intervalHours: intervalHourValues,
            intervalMinutes: intervalMinuteValues,
            intervalSeconds: intervalSecondValues
        });
        setTotalTime(timeDifference); // for IntervalTimer.js
        setIntervalCount(intervals); // for IntervalTimer.js
        setIntervalSeconds(totalIntervalSeconds); // for IntervalTimer.js
    };

    const recalculationHandler = () => {
        const currentTime = DateTime.local().c;
                setTimeInputs({
                    ...timeInputs,
                    startHour: currentTime.hour,
                    startMinute:  currentTime.minute
                });
        setStartFromHere(true);
    }

    const hour = (hours).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const minute = (minutes).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const intervalHour = (intervalTime.intervalHours).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const intervalMinute = (intervalTime.intervalMinutes).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const intervalSecond = (intervalTime.intervalSeconds).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

    useEffect(() => {
            if (formFilled) {
                formSubmit();
                setFormFilled(false);
            }
            if (startFromHere) {
                formSubmit();
                setStartFromHere(false);
            }
    }, [formFilled, formSubmit, startFromHere]);
    
    return (
         <div className='TimeControl'>
            <TimerForm
                change={formChangeHandler}
                startValidity={invalidValue.invalidStartTimeVal}
                endValidity={invalidValue.invalidEndTimeVal}
                intervalValidity={invalidValue.invalidIntervalVal}
                hour={hour}
                minute={minute}
                intervalHour={intervalHour}
                intervalMinute={intervalMinute}
                intervalSecond={intervalSecond}
            />
            <IntervalTimer
                totalTime={totalTime}
                intervalCount={intervalCount}
                intervalSeconds={intervalSeconds}
                recalculate={recalculationHandler}
                formFilled={formFilled} //To be passed down to EditPage.js
                inputInterval={timeInputs.inputInterval}
            />
        </div>
    );
};

export default TimeControl;



