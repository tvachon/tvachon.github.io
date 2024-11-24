import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import './EditPage.css';

const downArrowIcon = <FontAwesomeIcon className="downArrow" icon={faAngleDown} />;
const upArrowIcon = <FontAwesomeIcon className="downArrow" icon={faAngleUp} />;

const EditPage = (props) => {
    const [intervalNameArray, setIntervalNameArray] = useState([]);
    const [intervalNumberArray, setIntervalNumberArray] = useState([]);
    const [intervalNameInputs, setIntervalNameInputs] = useState([]);
    const [intervalNumberInputs, setIntervalNumberInputs] = useState([]);
    const [intervals, setIntervals] = useState(null);
    const [applyAll, setApplyAll] = useState("Interval");
    const [trueIntervals, setTrueIntervals] = useState(2);
    const [isActive, setIsActive] = useState(false); //handles dropdown feature of form
    const [initialRender, setInitialRender] = useState(true); //handles the preset form values when page renders
    const [initialFormFilled, setInitialFormFilled] = useState(true); //handles wiping preset form so form reflects correct number of intervals

//Renders preset form values and resets form on "cancel"
    const renderEdits = React.useCallback(() => {
        let nameArray = [];
        let numberArray = [];
        let nameInputs = [];
        let numberInputs = [];
        if (props.intervals !== 2) {
            for (let i = 1; i <= props.inputInterval; i++) {
                nameArray = [...nameArray, "Interval"];
                numberArray = [...numberArray, i];
                nameInputs = [
                    ...nameInputs,
                    <input onChange={changeNameInput} name={i - 1} key={i - 1} placeholder="Interval"/>
                ];
                numberInputs = [
                    ...numberInputs,
                    <input onChange={changeNumberInput} name={i - 1} key={i - 1} placeholder={i} />
                ];
            }
        } else {
            nameArray = ["Interval", "Interval"];
            numberArray = [1, 2];
            nameInputs = [
                <input onChange={changeNameInput} name={0} key={0} placeholder="Interval"/>,
                <input onChange={changeNameInput} name={1} key={1} placeholder="Interval"/>
            ];
            numberInputs = [
                <input onChange={changeNumberInput} name={0} key={0} placeholder={1}/>,
                <input onChange={changeNumberInput} name={1} key={1} placeholder={2} />
            ];
        }

        setIntervalNameArray(nameArray);
        setIntervalNumberArray(numberArray);
        setIntervalNameInputs(nameInputs);
        setIntervalNumberInputs(numberInputs);
        setIntervals(props.inputInterval);
    }, [props.inputInterval, props.intervals]);

//Applies one value to all interval name inputs
    const applyAllHandler = (event) => {
        console.log(event.target.value);
        let editedNameArray = [];
        let editedInputArray = [];
        for (let i = 1; i <= props.intervals; i++) {
            editedNameArray = [...editedNameArray, event.target.value];
            editedInputArray = [
                ...editedInputArray, 
                <input 
                    onChange={changeNameInput}
                    name={i - 1}
                    key={i - 1}
                    placeholder={event.target.value}
                />
            ];
        }
        setIntervalNameArray(editedNameArray);
        setIntervalNameInputs(editedInputArray);
        setApplyAll(event.target.value);
    }

//Handles changes to interval name inputs
    const changeNameInput = (event) => {
        setIntervalNameArray((prevState) => {
            return {...prevState, [event.target.name]: event.target.value};
        });
    }

//Handles changes to interval number inputs
    const changeNumberInput = (event) => {
        setIntervalNumberArray((prevState) => {
            return {...prevState, [event.target.name]: event.target.value};
        });
    }

//Handles changes in interval value and renders list when TimeControl form is filled
    const editIntervals = React.useCallback(() => {
        let nameArray = Object.values(intervalNameArray);
        let numberArray = Object.values(intervalNumberArray);
        let nameInputs = Object.values(intervalNameInputs);
        let numberInputs = Object.values(intervalNumberInputs);

        if (initialFormFilled) {
            nameArray = [];
            numberArray = [];
            nameInputs = [];
            numberInputs = [];
            setInitialFormFilled(false);
        }
        if (props.inputInterval > intervals) {
            if (intervalNameArray !== null && intervalNumberArray !== null) {
            //get the difference between the new interval value and the previous one
            const difference = props.inputInterval - intervals;
            for (let i = 1; i <= difference; i++) {
                nameArray = [...nameArray, applyAll];
                numberArray = [...numberArray, nameArray.length];
                nameInputs = [...nameInputs, <input onChange={changeNameInput} name={nameArray.length - 1} key={nameArray.length - 1} placeholder={applyAll}/>];
                numberInputs = [...numberInputs, <input onChange={changeNumberInput} name={nameArray.length - 1} key={nameArray.length - 1} placeholder={nameArray.length}/>];
            }
        }
            setIntervals(props.inputInterval);
        }
        if (props.inputInterval < intervals) {
            //get the difference between the previous interval value and the new one
            const difference = intervals - props.inputInterval;
            for (let i = 1; i <= difference; i++) {
                nameArray.pop();
                numberArray.pop();
                nameInputs.pop();
                numberInputs.pop();
            }
            setIntervals(props.inputInterval);
        }

        setIntervalNameArray(nameArray);
        setIntervalNumberArray(numberArray);
        setIntervalNameInputs(nameInputs);
        setIntervalNumberInputs(numberInputs);
        setIntervals(props.inputInterval);
        setTrueIntervals(props.inputInterval);
    }, [props.inputInterval, intervals, intervalNameArray, intervalNumberArray, intervalNameInputs, intervalNumberInputs, applyAll, initialFormFilled]);

//Passes form data up to IntervalTimer so they can be made visible to the user and changes the placeholders in form
    const saveFormHandler = () => {
        let numberArray = Object.values(intervalNumberArray);
        let trueIntervalTotal = numberArray[numberArray.length -1]; //array index length -1
        let nameInputs = [];
        let numberInputs = [];

        const formData = {
            nameArray: Object.values(intervalNameArray),
            numberArray: Object.values(intervalNumberArray)
        }
        for (let i = 1; i <= props.intervals; i++) {
            nameInputs = [
                ...nameInputs,
                <input onChange={changeNameInput} name={nameInputs.length} key={Math.random()} placeholder={intervalNameArray[i - 1]}/>
            ];
            numberInputs = [
                ...numberInputs,
                <input onChange={changeNumberInput} name={numberInputs.length} key={Math.random()} placeholder={intervalNumberArray[i - 1]}/>
            ];
        }
        setIntervalNameInputs(nameInputs);
        setIntervalNumberInputs(numberInputs);
        props.onSaveFormData(formData);
        setTrueIntervals(trueIntervalTotal);
        setIsActive(!isActive); //closes form
    }

//resets form values and closes the dropdown
    const cancelFormHandler = () => {
        // renderEdits();
        setIsActive(!isActive); //closes form
    }

//changes dropdown icon onClick
    let icon = downArrowIcon;
    if (isActive) {
        icon = upArrowIcon;
    } else {
        icon = downArrowIcon;
    }

    useEffect(() => {
        if (initialRender) {
            renderEdits();
            setInitialRender(false);
        }
        if (props.formFilled) {
            editIntervals();
        }
        // console.log(intervalNameArray);
        // console.log(intervalNumberArray);
        // console.log(intervalNameInputs);
        // console.log(intervalNumberInputs);
    }, [props.formFilled, renderEdits, editIntervals, intervals, intervalNameArray, intervalNumberArray, intervalNameInputs, intervalNumberInputs, initialRender]); 

    return (
        <div className="EditPage">
            <div className="IntervalCount">
                <p><button onClick={() => {setIsActive(!isActive);}}>{props.displayName} {props.displayNumber} of {trueIntervals} {icon}</button></p>
            </div>
            {isActive && <div className="Dropdown">
                <select onChange={applyAllHandler} className="select" name="apply all">
                    <option>Interval</option>
                    <option>Paragraph</option>
                    <option>Section</option>
                </select>
                <div className="Inputs">
                    <div className="NameInputs">
                        {intervalNameInputs}
                    </div>
                    <div className="NumberInputs">
                        {intervalNumberInputs}
                    </div>
                </div>
                <button className="inputChangeButton save" onClick={saveFormHandler}>Save</button>
                <button className="inputChangeButton cancel" onClick={cancelFormHandler}>Cancel</button>
            </div>}
        </div>
    );
}

export default EditPage;


//? -tmv
//lol