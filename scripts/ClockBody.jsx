
class ClockBody extends React.Component {

    state = {
        isDirty: false,
        code: ""
    };

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

        const now = new Date();
        const seconds = now.getSeconds();
        const secondsDegrees = (seconds / 60) * 360 + 90;
        const minutes = now.getMinutes();
        const minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6 + 90;
        const hours = now.getHours();
        const hoursDegrees = (hours / 12) * 360 + (minutes / 60) * 30 + 90;

        const style1 = {
            transform: `rotate(${secondsDegrees}deg)`
        };
        const style2 = {
            transform: `rotate(${minutesDegrees}deg)`
        };
        const style3 = {
            transform: `rotate(${hoursDegrees}deg)`
        };

        return (
            <div className="clockdiv">
                 <section>
                    <span className="clockspan" style={style1}></span>
                    <span className="clockspan" style={style2}></span>
                    <span className="clockspan" style={style3}></span>
                </section>
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
                {this._renderKeypad()}
                {this._renderClock()}
            </div>
        );
    }
}