
import React from "react";
import TC from './Clock.js'
import DatePicker from "react-datepicker";

import "./react-datepicker.css";

class CalendarBody extends React.Component {

    state = {
      
    };

    _onChangeDate(date) {
        console.log(date);

        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        let str = `${year}-${month}-${day}`;

        if (TC.hasHoliday(str)) {
            TC.removeHoliday(str);
        } else {
            TC.addHoliday(str);
        }

        TC.saveAllData();
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
        let hds = [];
        for (let value of TC.database.holidays) {
            hds.push({
                date: value,
                holidayName: "Holiday " + value
            });
        }

        return (
            <div>
                <div>
                    Click on days in the calendar to add them as stat holidays in the table
                </div>
                <div class="datePicker">
                    <DatePicker inline
                                holidays={hds}
                                selected={date} 
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