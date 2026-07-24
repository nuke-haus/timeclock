
class ClockBody extends React.Component {

    state = {
        isDirty: false,
        code: "",
        name: "Stinky",
        date: ""
    };

    componentDidMount() {
        this.interval = setInterval(() => this._updateDate(), 1000);
        this.interval2 = setInterval(() => this._updateEmojis(), 2);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.interval2);
    }

    _updateEmojis() {
        for (const [i, value] of TC.effects.entries()) {
            if (TC.effects[i].ypos < window.innerHeight) {
                TC.effects[i].ypos = TC.effects[i].ypos + TC.effects[i].speed;
                TC.effects[i].xpos = TC.effects[i].xpos + (Math.sin(new Date().getMilliseconds()) * TC.effects[i].wobble);
                TC.effects[i].rotation = TC.effects[i].rotation + 1;
            }
        }
        TC.effects = TC.effects.filter(item => (item.ypos <= window.innerHeight));
    }

    _updateDate() {
        let date = new Date();
        let str = this._formatAMPM(date);

        this.setState({ date: str })
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

    _onNameChanged(ev) {
        console.log(ev.currentTarget);
        this.setState({name: ev.currentTarget});
    }

    _onClick(value) {
        this.setState({code: this.state.code + value});
    }

    _onClickBackspace() {
        let str = this.state.code;
        str = str.slice(0, -1);
        this.setState({code: str});
    }

    _onClickClear() {
        this.setState({code: ""});
    }

    _onClickEnter() {
        TC.enterCode(this.state.code);
        this.setState({code: ""});
        TC.addEffects();
    }

    _onClickAddUser() {
        TC.addNewUser(this.state.code, this.state.name);
        TC.addEffects();
    }

    _renderEmojis() {
        let result = [];

        for (const [i, value] of TC.effects.entries()) {
            if (TC.effects[i].ypos < window.innerHeight) {

                let trans = `scale(${TC.effects[i].size}) rotate(${TC.effects[i].rotation}deg) translate(${TC.effects[i].xpos}px -${TC.effects[i].ypos}px)`
                let style = {
                    transform: trans,
                    //position: "fixed",
                    //bottom: "0%"  
                };

                result.push(
                    <div key={"emojiEffect" + i} style={style}>
                        {TC.effects[i].text}    
                    </div>
                );
            }
        }

        return result;
    }

    _renderEnterButton() {
        if (TC.isCodeLength4(this.state.code)) {
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
                            <div>
                                <input className="keypadName" type="text" defaultValue="Stinky" onInput={(value) => this._onNameChanged(value)}></input>
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
                <div className="keypadDiv">
                    <div>
                        <button className="keypadButton" onClick={() => this._onClick("1")}>1</button>
                        <button className="keypadButton" onClick={() => this._onClick("2")}>2</button>
                        <button className="keypadButton" onClick={() => this._onClick("3")}>3</button>
                    </div>
                    <div>
                        <button className="keypadButton" onClick={() => this._onClick("4")}>4</button>
                        <button className="keypadButton" onClick={() => this._onClick("5")}>5</button>
                        <button className="keypadButton" onClick={() => this._onClick("6")}>6</button>
                    </div>
                    <div>
                        <button className="keypadButton" onClick={() => this._onClick("7")}>7</button>
                        <button className="keypadButton" onClick={() => this._onClick("8")}>8</button>
                        <button className="keypadButton" onClick={() => this._onClick("9")}>9</button>
                    </div>
                    <div>
                        <button className="keypadButton" onClick={() => this._onClickBackspace()}>◀️</button>
                        <button className="keypadButton" onClick={() => this._onClick("0")}>0</button>
                        <button className="keypadButton" onClick={() => this._onClickClear()}>🆑</button>
                    </div>
                    <span className="code">
                        {this.state.code}
                    </span>
                    {this._renderEnterButton()}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="tabletext">
                    
                </div>
                {this._renderClock()}
                {this._renderKeypad()}
                {this._renderEmojis()}
            </div>
        );
    }
}