
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

        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let day = new Date().getDate();
        let str = `${year}-${month}-${day}`;

        if (TC.hasHoliday(str)) {
            TC.removeHoliday(str);
        } else {
            TC.addHoliday(str);
        }
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
        let holidays = TC.database.holidays.map(date => {date: date; holidayName: "Holiday"})
        return (
            <div>
                <div>
                    Click on days in the calendar to add them as stat holidays in the table
                </div>
                <div class="datePicker">
                    <DatePicker inline
                                holidays={holidays}
                                selected={new Date()} 
                                onChange={(date) => this._onChangeDate(date)}/>
                </div>
                <div>
                    {this._renderTable()}
                </div>
            </div>
            
        );
    }
}

export default CalendarBody