
import React from "react";
import TC from './Clock.js'
import DatePicker from "react-datepicker";

import "./react-datepicker.css";

class CalendarBody extends React.Component {

    state = {
      key:"datepicker",
      curdate: new Date()
    };

    _onChangeDate(date) {
        //console.log(date);

        let str = TC.getCalendarFormatDate(date);

        if (TC.hasHoliday(str)) {
            TC.removeHoliday(str);
        } else {
            TC.addHoliday(str);
        }

        TC.saveAllData();

        this.setState({key: TC.guid(), curdate: date});
    }

    _renderDays() {
        let hds = [];
        for (let value of TC.database.holidays) {
            hds.push(
                <tr>
                    <td>{value}</td>
                </tr>
            );
        }
        return hds;
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
                            <th>DATE (YEAR/MONTH/DAY)</th>
                        </tr>
                        {this._renderDays()}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        const date = this.state.curdate;
        let hds = [];
        for (let value of TC.database.holidays) {
            hds.push({
                date: value,
                holidayName: "Holiday " + value
            });
        }

        return (
            <div>
                <div className="infoText">
                    Click on days in the calendar to add or remove them from the stat holidays table
                </div>
                <div class="centerContent" key={this.state.key}>
                    <DatePicker inline
                                holidays={hds}
                                selected={date} 
                                onChange={(date) => this._onChangeDate(date)}/>
                </div>
                <div class="centerContent">
                    {this._renderTable()}
                </div>
            </div>
            
        );
    }
}

export default CalendarBody