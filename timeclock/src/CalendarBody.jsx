
import React from "react";
import TC from './Clock.js'

import Calendar from 'react-calendar'

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
                <Calendar onChange = {(date) => _onChangeDate(date)}/>
            </div>
        );
    }
}

export default CalendarBody