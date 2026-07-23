
class ClockBody extends React.Component {

    state = {
        isDirty: false,
    };

    _formatLower(value) {
        return String(value).toLowerCase();
    }

    _formatUpper(value) {
        return String(value).toUpperCase();
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
            <div>
                 <section>
                    <span class="clockspan" style={style1}></span>
                    <span class="clockspan" style={style2}></span>
                    <span class="clockspan" style={style3}></span>
                </section>
            </div>
        );
    }

    _renderKeypad() {

        return (
            <div>
                <div>
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                </div>
                <div>
                    <button>4</button>
                    <button>5</button>
                    <button>6</button>
                </div>
                <div>
                    <button>7</button>
                    <button>8</button>
                    <button>9</button>
                </div>
                <div>
                    <button>◂</button>
                    <button>0</button>
                    <button>☒</button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="tabletext">
                    TIMECLOCK
                </div>
                {this._renderKeypad()}
                {this._renderClock()}
            </div>
        );
    }
}