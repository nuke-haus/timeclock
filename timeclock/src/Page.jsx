import React from 'react';
import ClockBody from './ClockBody.jsx'
import DatabaseBody from './DatabaseBody.jsx'
import CalendarBody from './CalendarBody.jsx'
import ReportsBody from './ReportsBody.jsx'
import PassBody from './PassBody.jsx'
import TC from './Clock.js'

class Page extends React.Component {

    NAV_CLOCK = "⏱️";
    NAV_DATABASE = "📇";
    NAV_CALENDAR = "🗓️";
    NAV_REPORTS = "📃";
    NAV_LOCK = "🔒";

    state = {
        currentNav: "⏱️",
        locked: false
    };

    componentDidMount() {
        this.interval = setInterval(() => this._employeeCheck(), 10000);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    _employeeCheck() {
        TC.employeeTimeCheck();
    }

    constructor(props) {
        super(props);

        const locallyStoredData = localStorage.getItem('timeclock_data');
        if (locallyStoredData == null) {
            console.log("No local data found");
        } else {
            // Locally stored persistent data exists, so parse that and validate it instead
            const parsedData = JSON.parse(locallyStoredData);
            TC.loadData(parsedData);
            console.log("Loaded locally stored data")
        }
    }

    _getClassName(tabName) {
        return (this.state.currentNav === tabName) 
            ? "selectednav"
            : "";
    }

    _onNavClick(id) {
        this.setState({currentNav: id});
    }

    _onNavLock() {
        this.setState({locked: !this.state.locked, currentNav: this.NAV_CLOCK});
    }

    render() {

        let header = (
            <div>
                <div className="navbar">
                    <div className="topbutton" onClick={() => this._onNavClick(this.NAV_CLOCK)}>
                        <span className={this._getClassName(this.NAV_CLOCK)}>{this.NAV_CLOCK}</span>
                    </div>
                    <div className="topbutton" onClick={() => this._onNavClick(this.NAV_DATABASE)}>
                        <span className={this._getClassName(this.NAV_DATABASE)}>{this.NAV_DATABASE}</span>
                    </div>
                    <div className="topbutton" onClick={() => this._onNavClick(this.NAV_CALENDAR)}>
                        <span className={this._getClassName(this.NAV_CALENDAR)}>{this.NAV_CALENDAR}</span>
                    </div>
                    <div className="topbutton" onClick={() => this._onNavClick(this.NAV_REPORTS)}>
                        <span className={this._getClassName(this.NAV_REPORTS)}>{this.NAV_REPORTS}</span>
                    </div>
                    <div className="topbutton" onClick={() => this._onNavLock(this.NAV_LOCK)}>
                        <span className={this._getClassName(this.NAV_LOCK)}>{this.NAV_LOCK}</span>
                    </div>
                </div>
            </div>
        );

        if (this.state.locked) {
            header = undefined;
        }

        if (this.state.currentNav == this.NAV_CLOCK) { 
            return (
            <div>
                {header}
                <ClockBody/>
            </div>
            );
        } else if (this.state.currentNav == this.NAV_DATABASE) { 
            return (
            <div>
                {header}
                <PassBody innerHtml={<DatabaseBody/>}/>
            </div>
            );
        } else if (this.state.currentNav == this.NAV_CALENDAR) { 
            return (
            <div>
                {header}
                <PassBody innerHtml={<CalendarBody/>}/>
            </div>
            );
        } else if (this.state.currentNav == this.NAV_REPORTS) {
            return (
            <div>
                {header}
                <PassBody innerHtml={<ReportsBody/>}/>
            </div>
            );
        }

        return null;
    }
}

export default Page