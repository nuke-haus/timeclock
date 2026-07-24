class Page extends React.Component {

    NAV_CLOCK = "🕒";
    NAV_DATABASE = "🗂️";

    state = {
        currentNav: "🕒"
    };

    constructor(props) {
        super(props);

        const locallyStoredData = localStorage.getItem('timeclock_data');
        if (locallyStoredData == null) {
            //fetch('data/materials.json')
            //    .then(response => response.json())
            //    .then(data => this._onLoadMaterials(data));
        } else {
            // Locally stored persistent data exists, so parse that and validate it instead
            const parsedData = JSON.parse(locallyStoredData);
            //TC.loadData(parsedData)
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

    render() {

        const header = (
            <div>
                <div className="navbar">
                    <div className="topbutton" onClick={() => this._onNavClick(this.NAV_CLOCK)}>
                        <span className={this._getClassName(this.NAV_CLOCK)}>{this.NAV_CLOCK}</span>
                    </div>
                    <div className="topbutton" onClick={() => this._onNavClick(this.NAV_DATABASE)}>
                        <span className={this._getClassName(this.NAV_DATABASE)}>{this.NAV_DATABASE}</span>
                    </div>
                </div>
            </div>
        );

        if (this.state.currentNav == this.NAV_CLOCK) { 
            return (<div>
                {header}
                <ClockBody/>
            </div>);
        } else if (this.state.currentNav == this.NAV_DATABASE) { 
            return (<div>
                {header}
                <DatabaseBody/>
            </div>);
        } 

        return null;
    }
}