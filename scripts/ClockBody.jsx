
class ClockBody extends React.Component {

    state = {
        isDirty: false,
        code: "",
        date: ""
    };

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ date: _formatAMPM(new Date()) }), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    _formatAMPM(date) {
        var hours = date.getHours();
        var days = date.getDay();
        var minutes = date.getMinutes();

        // gets AM/PM
        var ampm = hours >= 12 ? 'pm' : 'am';

        // converts hours to 12 hour instead of 24 hour
        hours = hours % 12;

        // converts 0 (midnight) to 12
        hours = hours ? hours : 12; // the hour '0' should be '12'

        // converts minutes to have leading 0
        minutes = minutes < 10 ? '0'+ minutes : minutes;
    
        // the time string
        var time = hours + ':' + minutes + ' ' + ampm;
    
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
            <div className="keypadDiv">
                <span>
                    {this.state.code}
                </span>
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