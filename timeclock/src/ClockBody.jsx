import React from 'react';
import TC from './Clock.js';

class ClockBody extends React.Component {

    state = {
        isDirty: false,
        key: "123",
        code: "",
        name: "",
        date: "",
        effects: []
    };

    componentDidMount() {
        this.interval = setInterval(() => this._updateDate(), 1000);
        this.interval2 = setInterval(() => this._updateEmojis(), 5);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.interval2);
    }

    _updateEmojis() {
        for (const [i, value] of TC.effects.entries()) {
            if (TC.effects[i].ypos < window.innerHeight) {
                TC.effects[i].ypos = TC.effects[i].ypos + TC.effects[i].speed;
                TC.effects[i].xwobb = (Math.sin(TC.effects[i].wobbleOff + new Date().getTime() * TC.effects[i].wobbleSpd) * TC.effects[i].wobble);
                TC.effects[i].rotation = TC.effects[i].rotation + TC.effects[i].rotate;
            }
        }
        TC.effects = TC.effects.filter(item => (item.ypos <= window.innerHeight));
        this.setState({effects: TC.effects});
    }

    _updateDate() {
        let date = new Date();
        let str = this._formatAMPM(date);

        this.setState({date: str});
    }

    _formatAMPM(date) {
        var hours = date.getHours();
        var days = date.getDay();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        // gets AM/PM
        var ampm = hours >= 12 ? 'PM' : 'AM';

        // converts hours to 12 hour instead of 24 hour
        hours = hours % 12;

        // converts 0 (midnight) to 12
        hours = hours ? hours : 12; // the hour '0' should be '12'

        // converts minutes to have leading 0
        minutes = minutes < 10 ? '0' + minutes : minutes;

        // leading 0 for seconds
        seconds = seconds < 10 ? '0' + seconds : seconds;
    
        // the time string
        var time = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    
        // gets the match for the date string we want
        var match = date.toString().match(/\w{3} \w{3} \d{1,2} \d{4}/);
        return match[0] + ' ' + time;
    }

    _formatLower(value) {
        return String(value).toLowerCase();
    }

    _formatUpper(value) {
        return String(value).toUpperCase();
    }

    _hasValidCode() {
        return TC.isCodeValid(this.state.code);
    }

    _onCodeChanged(ev) {
        this.setState({code: ev.currentTarget.value});
    }

    _onNameChanged(ev) {
        this.setState({name: ev.currentTarget.value});
    }

    _onClickEnter() {
        TC.enterCode(this.state.code);
        TC.addEffects();
        TC.saveAllData();

        this.setState({code: "", key: TC.guid()});
    }

    _onClickAddUser() {
        TC.addNewUser(this.state.code, this.state.name);
        TC.addEffects();
        TC.saveAllData();

        this.setState({code: "", name: "", key: TC.guid()});
    }

    _renderEmojis() {
        let result = [];

        for (const [i, value] of this.state.effects.entries()) {
            if (value.ypos < window.innerHeight) {

                let style = {
                    transform: `translate(-50%, -50%) rotate(${value.rotation}deg) scale(${value.size})`,
                    position: "absolute",
                    transition: "0.1s ease-out",
                    left: value.xpos + value.xwobb + 'px',
                    bottom: value.ypos + 'px'
                };

                result.push(
                    <div key={"emoji" + value.name} style={style}>
                        {value.text}    
                    </div>
                );
            }
        }

        return result;
    }

    _renderEnterButton() {
        if (TC.isCodeLength3(this.state.code)) {
            let data = TC.getUserData(this.state.code);
            if (data != null) {
                let string = "Hello, " + data.name;
                let buttonString = "Clock In";

                if (TC.isUserClockedIn(this.state.code)) {
                    buttonString = "Clock Out";
                }

                return (
                    <div>
                        <div>
                            <span>{string}</span>
                        </div>
                        <button onClick={() => this._onClickEnter()}>{buttonString}</button>
                    </div>
                );
            }
            else {
                if (TC.canAddNewUser(this.state.code)) {
                    let string = "Hello, please enter a name to create a new user...";
                    let buttonString = "Create User";

                    return (
                        <div>
                            <div>
                                <span>{string}</span>
                            </div>
                            <div key={this.state.key + "name"}>
                                <input className="keypadName" type="text" defaultValue={this.state.name} onInput={(value) => this._onNameChanged(value)}></input>
                            </div>
                            <button onClick={() => this._onClickAddUser()}>{buttonString}</button>
                        </div>
                    );
                }
            }
        }
        return null;
    }

    _renderClock() {
        return (
            <div className="clockdiv">
                 <span>
                    {this.state.date}
                 </span>
            </div>
        );
    }

    _renderKeypad() {
        return (
            <div className="keypadContainerDiv">
                <div className="keypadDiv" key={this.state.key}>
                    <div>
                        <input className="keypadCode" 
                            type="text" 
                            maxlength="3" 
                            pattern="[0-9][0-9][0-9]" 
                            defaultValue="" 
                            onInput={(value) => this._onCodeChanged(value)}/>
                    </div>
                    {this._renderEnterButton()}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this._renderClock()}
                {this._renderKeypad()}
                {this._renderEmojis()}
            </div>
        );
    }
}

export default ClockBody