//import DatePicker from "react-datepicker";

class CalendarBody extends React.Component {

    state = {
      
    };

    _onSelectDate(date) {
        console.log(date);
    }

    _onChangeDate(date) {
        console.log(date);
    }

    //<DatePicker selected={new Date()} 
    //                        onSelect = {(date) => this._onSelectDate(date)} 
    //                        onChange={(date) => _onChangeDate(date)} />

    render() {
        return (
            <div>
                hi
                
            </div>
        );
    }
}