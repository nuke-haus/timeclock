import React from 'react';
import TC from './Clock.js';
import DatePicker from "react-datepicker";

import "./react-datepicker.css";

class DatabaseBody extends React.Component {

    state = {
       name: "",
       code: "",
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

    _onClickDeleteUser(code) {
        TC.removeUser(code);

        this.setState({key: TC.guid()});
    }

    _onClickNewUser() {
        if (this.state.name == "" || this.state.code.length != 3) {
            return;
        }

        TC.addNewUser(this.state.code, this.state.name, "");

        this.setState({key: TC.guid(), name: "", code: ""});
    }

    _onClickUser(user) {
        let date = new Date();
        let yesterday = new Date();
        yesterday.setDate(date.getDate() - 1);

        this.setState({user: user, key: TC.guid(), startDate: yesterday, endDate: date});
    }

    _onLoseFocus() {
        this.setState({key: TC.guid()});
    }

    _setStartDate(date) {
        this.setState({key: TC.guid(), startDate: date});
    }

    _setEndDate(date) {
        this.setState({key: TC.guid(), endDate: date});
    }

    _onStartTimeChanged(date, i, idx) {
        let timestamp = date.getTime();
        TC.database.people[idx].timeSpans[i].start = timestamp;
        TC.saveAllData();

        console.log(TC.database.people[idx].timeSpans[i]);

        this.setState({key: TC.guid()});
    }

    _onEndTimeChanged(date, i, idx) {
        let timestamp = date.getTime();
        TC.database.people[idx].timeSpans[i].end = timestamp;
        TC.saveAllData();

        console.log(TC.database.people[idx].timeSpans[i]);

        this.setState({key: TC.guid()});
    }

    _onTimeChanged(i, e) {
        let idx = TC.getUserIndex(this.state.user.code);
        TC.database.people[idx].timeSpans[i].time = e.target.value;
    }

    _onCodeChanged(ev) {
        this.setState({code: ev.currentTarget.value, greet: Math.round(Math.random() * 6)});
    }

    _onNameChanged(ev) {
        this.setState({name: ev.currentTarget.value});
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

        let str = `Viewing entries for ${this.state.user.name} in date range`;
        return (
            <div key={this.state.key}>
                <div className="tabletext">
                    {""}
                </div>
                <table className="formulatablesmall">
                    <thead>
                        <tr>
                            <td colspan="4">{str}</td>
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
                    </thead>
                    <tbody>
                        <tr>
                            <th>START TIME</th>
                            <th>END TIME</th>
                            <th>TOTAL</th>
                        </tr>
                        {this._renderUserTimeData()}
                    </tbody>
                </table>
            </div>
        );
    }

    _renderUserTimeData() {
        let validSpans = this.state.user.timeSpans.filter((x) => TC.isDateInRange(x.start, this.state.startDate, this.state.endDate))
        let result = [];
        for (let [i, value] of validSpans.entries()) {
            let startDate = new Date();
            let endDate = new Date();
            startDate.setTime(value.start);
            endDate.setTime(value.end);

            let total = TC.differenceInTime(startDate, endDate);
            let idx = TC.getUserIndex(this.state.user.code);

            result.push(
                <tr key={"userdata" + i + this.state.key}>
                    <td>
                        <span className="topbutton" onClick={() => this._onDelete(i)}>❌</span>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => this._onStartTimeChanged(date, i, idx)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={10}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                    </td>
                    <td>
                         <DatePicker
                            selected={endDate}
                            onChange={(date) => this._onEndTimeChanged(date, i, idx)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={10}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                    </td>
                    <td>{total}</td>
                </tr>
            );
            /*if (Math.floor(Number(value.time)) < 9) {
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
            }*/
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
                    <td><button onClick={() => this._onClickDeleteUser(value.code)} className="databaseButton">☢️ Delete User</button></td>
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
                </div>
                <table className="formulatablesmall">
                    <tbody key={this.state.key + "tbl"}>
                        <tr key={'useradd'}>
                            <td><input className="keypadName" type="text" placeholder="Name" onInput={(value) => this._onNameChanged(value)}></input></td>
                            <td><input className="keypadName" type="text" placeholder="Code" maxlength="3" pattern="[0-9][0-9][0-9]" onInput={(value) => this._onCodeChanged(value)}></input></td>
                            <td colspan="2"><button onClick={() => this._onClickNewUser()} className="databaseButton">🪪 Add New User</button></td>
                        </tr>
                        <tr>
                            <th>NAME</th>
                            <th>CODE</th>
                            <th>STATUS</th>
                            <th>DANGER ZONE</th>
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