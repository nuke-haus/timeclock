import { useEffect, useRef } from "react";

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
        const secondsRef = useRef(null);
        const minutesRef = useRef(null);
        const hoursRef = useRef(null);
        const now = new Date();

        const seconds = now.getSeconds();
        const secondsDegrees = (seconds / 60) * 360 + 90;
        secondsRef.current.style.transform = `rotate(${secondsDegrees}deg)`;

        const minutes = now.getMinutes();
        const minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6 + 90;
        minutesRef.current.style.transform = `rotate(${minutesDegrees}deg)`;

        const hours = now.getHours();
        const hoursDegrees = (hours / 12) * 360 + (minutes / 60) * 30 + 90;
        hoursRef.current.style.transform = `rotate(${hoursDegrees}deg)`;

        return (
            <section>
                <span ref={secondsRef}></span>
                <span ref={minutesRef}></span>
                <span ref={hoursRef}></span>
            </section>
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
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="tabletext">
                    TIMECLOCK
                </div>
                {this._renderClock()}
                {this._renderKeypad()}
            </div>
        );
    }
}