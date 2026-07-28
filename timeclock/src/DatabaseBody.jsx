import React from 'react';
import TC from './Clock.js';
import DatePicker from "react-datepicker";

import "./react-datepicker.css";

class DatabaseBody extends React.Component {

    state = {
       user: null,
       key: "db",
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

    _onClickUser(user) {
        this.setState({user: user, key: TC.guid()});
    }

    _onLoseFocus() {
        this.setState({key: TC.guid()});
    }

    _setStartDate(date) {
        console.log(date)
        this.setState({key: TC.guid(), startDate: date});
    }

    _setEndDate(date) {
        this.setState({key: TC.guid(), endDate: date});
    }

    _onTimeChanged(i, e) {
        let idx = TC.getUserIndex(this.state.user.code);
        TC.database.people[idx].timeSpans[i].time = e.target.value;
    }

    _onDelete(i) {
        let idx = TC.getUserIndex(this.state.user.code);
        TC.database.people[idx].timeSpans[i] = null;
        TC.database.people[idx].timeSpans = TC.database.people[idx].timeSpans.filter((x) => x != null);

        this.setState({user: TC.database.people[idx], key: TC.guid()});
    }

    _renderSingleUser() {
        if (this.state.user == null) {
            return null;
        }

        let str = this.state.user.name;
        return (
            <div key={this.state.key}>
                <div className="tabletext">
                    {str}
                </div>
                <div>
                    <span>
                        Select date range
                    </span>
                     <DatePicker
                        selected={this.state.startDate}
                        onChange={(date) => this._setStartDate(date)}
                        selectsStart
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                    />
                    <DatePicker
                        selected={this.state.endDate}
                        onChange={(date) => this._setEndDate(date)}
                        selectsEnd
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        minDate={this.state.startDate}
                    />
                </div>
                <table className="formulatablesmall">
                    <tbody>
                        <tr>
                            <th>DATE (DAY/MONTH/YEAR)</th>
                            <th>HOURS LOGGED</th>
                        </tr>
                        {this._renderUserData()}
                    </tbody>
                </table>
            </div>
        );
    }

    _renderUserData() {
        let result = [];
        for (const [i, value] of this.state.user.timeSpans.entries()) {
            if (Math.floor(Number(value.time)) < 9) {
                result.push(
                    <tr key={'userdata' + i + this.state.key}>
                        <td>{value.date.toString()} <span className="topbutton" onClick={() => this._onDelete(i)}>❌</span></td>
                        <td><input className="" 
                                    type="text" 
                                    defaultValue={value.time} 
                                    onblur={() => this._onLoseFocus()} 
                                    onInput={(value) => this._onTimeChanged(i, value)}>
                            </input>
                        </td>
                    </tr>
                );
            }
            else {
                result.push(
                    <tr key={'userdataot' + i + this.state.key}>
                        <td>{value.date.toString()} <span className="topbutton" onClick={() => this._onDelete(i)}>❌</span></td>
                        <td><input className="overtime" 
                                    type="text" 
                                    defaultValue={value.time} 
                                    onblur={() => this._onLoseFocus()} 
                                    onInput={(value) => this._onTimeChanged(i, value)}>
                            </input>
                        </td>
                    </tr>
                );
            }
        }
        return result;
    }

    _renderUsers() {
        let result = [];
        for (const [i, value] of TC.database.people.entries()) {
            result.push(
                <tr key={'user' + i}>
                    <td><button onClick={() => this._onClickUser(value)} className="databaseButton">{value.name}</button></td>
                    <td>{value.code}</td>
                    <td>{value.activeTimeSpan != null ? "✅ CLOCKED IN" : "❎ NOT IN"}</td>
                </tr>
            );
        }
        return result;
    }

    _renderUserList() {
        if (TC.database.people.length === 0) {
            return null;
        }
        return (
            <div>
                <div className="tabletext">
                    USERS TABLE
                </div>
                <table className="formulatablesmall">
                    <tbody>
                        <tr>
                            <th>NAME</th>
                            <th>CODE</th>
                            <th>STATUS</th>
                        </tr>
                        {this._renderUsers()}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div className="centerContent">
                {this._renderUserList()}
                <br/>
                {this._renderSingleUser()}
            </div>
        );
    }
}

export default DatabaseBody