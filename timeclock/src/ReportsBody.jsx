import React from 'react';
import TC from './Clock.js';
import DatePicker from "react-datepicker";

import "./react-datepicker.css";

class ReportsBody extends React.Component {

    state = {
       key: "report",
       startDate: new Date(),
       endDate: new Date()
    };

    _formatName(value) {
        const str = String(value);
        return (str.charAt(0).toUpperCase() + str.slice(1));
    }

    _formatLower(value) {
        return String(value).toLowerCase();
    }

    _formatUpper(value) {
        return String(value).toUpperCase();
    }

    _onGenerate() {
        let filename = this.state.startDate.getFullYear() + "-" + this.state.startDate.getMonth() + "-" + this.state.startDate.getDate();
        let content = TC.getTimeReport(this.state.startDate, this.state.endDate);
        let encodedUri = encodeURI(content);

        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename + "-report.csv");
        document.body.appendChild(link); 

        link.click(); 
    }

    _onGenerateDet() {
        let filename = this.state.startDate.getFullYear() + "-" + this.state.startDate.getMonth() + "-" + this.state.startDate.getDate();
        let content = TC.getDetailedTimeReport(this.state.startDate, this.state.endDate);
        let encodedUri = encodeURI(content);

        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename + "-detailedreport.csv");
        document.body.appendChild(link); 

        link.click(); 
    }

    _setStartDate(date) {
        date.setHours(1);
        this.setState({key: TC.guid(), startDate: date});
    }
    
    _setEndDate(date) {
        date.setHours(23);
        this.setState({key: TC.guid(), endDate: date});
    }

    _setStartTime(person, oldTime, newTime) {
        let idx = TC.getUserIndex(person.code);
        let timeIdx = -1;
        for (let [i, value] of person.timeSpans.entries()) {
            if (value.start === oldTime) {
                timeIdx = i;
            }
        }
        if (timeIdx > -1) {
            TC.database.people[idx].timeSpans[timeIdx].start = newTime;
            TC.saveAllData();
            this.setState({key: TC.guid()});
        }
    }

    _setEndTime(person, oldTime, newTime) {
        let idx = TC.getUserIndex(person.code);
        let timeIdx = -1;
        for (let [i, value] of person.timeSpans.entries()) {
            if (value.end === oldTime) {
                timeIdx = i;
            }
        }
        if (timeIdx > -1) {
            TC.database.people[idx].timeSpans[timeIdx].end = newTime;
            TC.saveAllData();
            this.setState({key: TC.guid()});
        }
    }

    _renderTimeEntries() {
        let rows = [];
        let entries = TC.getTimeEntries(this.state.startDate, this.state.endDate);

        if (entries.length == 0) {
            return null;
        }

        for (let [i, value] of entries.entries()) {
            let startDate = new Date();
            startDate.setTime(value.start);
            let endDate = new Date();
            endDate.setTime(value.end);
            let warn = value.forced ? "⚠️" : "🆗";
            let total = TC.differenceInTime(startDate, endDate).toString();
            let clippedTotal = total.substring(0, 5);

            rows.push(
                <tr key={this.state.key + "row" + i}>
                    <td>
                        {value.person.name}
                    </td>
                    <td>
                        {value.mult}
                    </td>
                    <td>
                        {warn}
                    </td>
                    <td>
                        {clippedTotal}
                    </td>
                    <td>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => this._setStartTime(value.person, value.start, date.getTime())}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={10}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"/>
                    </td>
                    <td>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => this._setEndTime(value.person, value.end, date.getTime())}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={10}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"/>
                    </td>
                </tr>
            );
        }

        return (
            <table className="formulatablesmall">
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>MULTIPLIER</th>
                        <th>STATUS</th>
                        <th>TIME TOTAL</th>
                        <th>START TIME</th>
                        <th>END TIME</th>
                    </tr>
                </thead>
                <tbody key={this.state.key + "entries"}>
                    {rows}
                </tbody>
            </table>
        )
    }

    _renderReportBody() {
        return (
            <div key={this.state.key}>
                <table className="formulatablesmall">
                    <thead>
                        <tr>
                            <td colspan="2">Generate report for date range</td>
                        </tr>
                        <tr>
                            <td colspan="1">
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={(date) => this._setStartDate(date)}
                                    selectsStart
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                />
                            </td>
                            <td colspan="1">
                                <DatePicker
                                    selected={this.state.endDate}
                                    onChange={(date) => this._setEndDate(date)}
                                    selectsEnd
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                    minDate={this.state.startDate}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <button onClick={() => this._onGenerate()} className="databaseButton">📄 Generate CSV File</button>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                {this._renderTimeEntries()}
            </div>
        );
    }
    // <button onClick={() => this._onGenerateDet()} className="databaseButton">📜 Generate Detailed Report</button>

    render() {
        return (
            <div className="centerContent">
                {this._renderReportBody()}
                <br/>
            </div>
        );
    }
}

export default ReportsBody