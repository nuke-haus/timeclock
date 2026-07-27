
import React from "react";
import TC from './Clock.js'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class CalendarBody extends React.Component {

    state = {
      
    };

    _onSelectDate(date) {
        console.log(date);
    }

    _onChangeDate(date) {
        console.log(date);
    }

    render() {
        const date = new Date();
        return (
            <div>
                hi
                <DatePicker selected = {date}
                            onSelect = {(date) => _onSelectDate(date)}
                            onChange = {(date) => _onChangeDate(date)} />
            </div>
        );
    }
}

export default CalendarBody