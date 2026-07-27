
import React from "react";
import TC from './Clock.js'
import DatePicker from "react-datepicker";

import "./react-datepicker.css";

class CalendarBody extends React.Component {

    state = {
      
    };

    _onSelectDate(date) {
        console.log(date);
    }

    _onChangeDate(date) {
        console.log(date);
    }

    _renderDays() {

    }

    _renderTable() {
        return (
            <div>
                <div className="tabletext">
                    STAT HOLIDAYS
                </div>
                <table className="formulatablesmall">
                    <tbody>
                        <tr>
                            <th>DATE (DAY/MONTH/YEAR)</th>
                        </tr>
                        {this._renderDays()}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        const date = new Date();
        return (
            <div>
                <div class="datePicker">
                    <DatePicker inline
                                selected = {new Date()} 
                                onChange = {(date) => this._onChangeDate(date)}/>
                </div>
                <div>
                    {this._renderTable()}
                </div>
            </div>
            
        );
    }
}

export default CalendarBody