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
        let filename = this.state.startDate.getYear() + "-" + this.state.startDate.getMonth() + "-" + this.state.startDate.getDate();
        let content = TC.outputAllTimeInRange(startDate, endDate);
        let encodedUri = encodeURI(content);

        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename + "_report.csv");
        document.body.appendChild(link); 

        link.click(); 
    }

    _setStartDate(date) {
        this.setState({key: TC.guid(), startDate: date});
    }
    
    _setEndDate(date) {
        this.setState({key: TC.guid(), endDate: date});
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
                                <button onClick={() => this._onGenerate()} className="databaseButton">📄 Generate Report</button>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        );
    }

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