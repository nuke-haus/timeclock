
class ClockBody extends React.Component {

    state = {
        isDirty: false,
        code: "",
        name: "",
        date: ""
    };

    componentDidMount() {
        this.interval = setInterval(() => this._updateDate(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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
    }

    _onClickAddUser() {
        TC.addNewUser(this.state.code, this.state.name);
    }

    _renderEnterButton() {
        console.log(TC.isCodeLength4(this.state.code));
        if (TC.isCodeLength4(this.state.code)) {
            let data = TC.getUserData(this.state.code);
            if (data != null) {
                let string = "Hello, " + name;
                let buttonString = "Clock In";

                return (
                    <div>
                        <span>{string}</span>
                        <button onClick={() => this._onClickEnter()}>{buttonString}</button>
                    </div>
                );
            }
            else {
                if (TC.canAddNewUser(this.state.code)) {
                    let string = "Hello!";
                    let buttonString = "Create User";

                    return (
                        <div>
                            <span>{string}</span>
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
                        <button onClick={() => this._onClick("1")}>1</button>
                        <button onClick={() => this._onClick("2")}>2</button>
                        <button onClick={() => this._onClick("3")}>3</button>
                    </div>
                    <div>
                        <button onClick={() => this._onClick("4")}>4</button>
                        <button onClick={() => this._onClick("5")}>5</button>
                        <button onClick={() => this._onClick("6")}>6</button>
                    </div>
                    <div>
                        <button onClick={() => this._onClick("7")}>7</button>
                        <button onClick={() => this._onClick("8")}>8</button>
                        <button onClick={() => this._onClick("9")}>9</button>
                    </div>
                    <div>
                        <button onClick={() => this._onClickBackspace()}>🢀</button>
                        <button onClick={() => this._onClick("0")}>0</button>
                        <button onClick={() => this._onClickClear()}>☒</button>
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
            </div>
        );
    }
}