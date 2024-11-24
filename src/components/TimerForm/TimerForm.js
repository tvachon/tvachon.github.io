import React from 'react';
import '../../components/TimerForm/TimerForm.css';

const TimerForm = (props) => {
    return (
        <div className="TimerForm">
            <form className="form" onSubmit={(e) => {e.preventDefault()}}>
                <div className="startTime">
                    <p>Start Time:</p>
                    <input 
                        name="startTime" 
                        type="time" 
                        required
                        onChange={props.change} 
                    />
                    <br />
                    <span className="startTimeValidity validity">{props.startValidity}</span> 
                </div>
                <div className="endTime">
                    <p>End Time:</p>
                    <input 
                        name="endTime" 
                        type="time" 
                        required
                        onChange={props.change} 
                    />
                    <br />
                    <span className="endTimeValidity validity">{props.endValidity}</span>
                </div>
                <div className="inputIntervals">
                    <p>Intervals:</p>
                    <input
                        name='inputInterval'
                        type="number"
                        placeholder="0"
                        required
                        onChange={props.change}
                    />
                    <br />
                    <span className="intervalTimeValidity validity">{props.intervalValidity}</span>
                </div>
            </form>
            <section className="CalculationDisplay">
                <div className="StudyLengthDisplay">
                    <h2>Length of Part:</h2>
                    <h3>{props.hour}:{props.minute}:00 </h3>
                </div>
                <div className="IntervalLengthDisplay">
                    <h2>Interval Length:</h2>
                    <h3>{props.intervalHour}:{props.intervalMinute}:{props.intervalSecond}</h3>
                </div>
            </section>
        </div>
    );
};

export default TimerForm;

