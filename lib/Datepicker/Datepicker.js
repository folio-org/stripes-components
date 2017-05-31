import React from 'react';
import PropTypes from 'prop-types';
import TextField from '../TextField';
import Calendar from './Calendar';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper'
import Icon from '../Icon';
import moment from 'moment';
import Button from '../Button';

import contains from 'dom-helpers/query/contains';
import _ from 'lodash';

import css from './Calendar.css';

const propTypes = {
  disabledDates: PropTypes.array,
  onSetDate: PropTypes.func,
  screenReaderMessage: PropTypes.string,
  value: PropTypes.string,
  dateFormat: PropTypes.string,
  label: PropTypes.string,
  inputStyle: PropTypes.string,
  labelStyle: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  input: PropTypes.object,
  meta: PropTypes.object,
  id: PropTypes.string,
  onChange: PropTypes.func,
  useFocus: PropTypes.bool,
  hideOnChoose: PropTypes.bool,
  locale: PropTypes.string,
  readOnly: PropTypes.bool,
  backendDateStandard: PropTypes.string,
  excludeDates: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  
};

const defaultProps = {
  dateFormat: "MM/DD/YYYY",
  screenReaderMessage: "",
  hideOnChoose: true,
  useFocus: true,
  locale: "en",
  backendDateStandard: "ISO8601",
}

class Datepicker extends React.Component {
  constructor(props){
    super(props);
    
    this.textfield = null;
    this.picker = null;
    this.container = null;
    this.srSpace = null;
    this.calendarButton = null;
    
    this.handleSetDate = this.handleSetDate.bind(this);
    this.handleFieldFocus = this.handleFieldFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.clearDate = this.clearDate.bind(this);
    this.showCalendar = this.showCalendar.bind(this);
    this.handleFieldClick = this.handleFieldClick.bind(this);
    this.hideCalendar = this.hideCalendar.bind(this);
    this.dbhideCalendar = _.debounce(this.hideCalendar, 10);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.handleRootClose = this.handleRootClose.bind(this);
    this.hideOnBlur = this.hideOnBlur.bind(this);
    this.standardizeDate = this.standardizeDate.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);

    moment().locale(this.props.locale);
    
    let initString, initDate;
    if(!this.props.input){
      if(this.props.value === 'today' && this.props.date === 'undefined'){
        initString = moment().format(this.props.format);
        initDate = moment();
      }else{
        initString = this.props.value ? this.props.value: "";
        initDate = this.props.date;
      }
    }else{
      initString = this.props.input.value;
      if(this.props.input.value === ""){
        initDate = "";
      }else{
        initDate = moment(this.props.input.value, this.props.format);
        initString = moment(this.props.input.value).format(this.props.dateFormat);
      }
    }
    this.state = {
      date: initDate,
      dateString: initString,
      cursorDate: moment(initDate).isValid()? moment(initDate) : moment(),
      showCalendar: this.props.showCalendar || false,
    };
  }

  handleFieldFocus(e){
    if(this.props.useFocus){
      this.showCalendar();
    }
  }
  
  handleFieldClick(e){
    if(this.props.useFocus){
      if(!this.state.showCalendar){
        this.showCalendar();
      }
    }
  }
  
  handleRootClose(e){
    //be sure that nothing in the datepicker is in focus before closing the calendar.
    if(!contains(this.container, document.activeElement)){
      this.hideCalendar();
    }
  }
  
  showCalendar(){
    this.setState(
      {
        showCalendar: true
      }
    );
  };
  
  hideCalendar(){
    this.setState(
      {
        showCalendar: false
      }
    );
  };
  
  toggleCalendar(){
    const current = this.state.showCalendar;
    this.setState({
      showCalendar: !current,
    });
  }
  
  handleKeyDown(e) {
    let curDate = moment(this.state.cursorDate);

    let dateChosen = false;
    switch (e.keyCode) {
      case 40: //down
        e.preventDefault();
        curDate.add(7, 'days');
        this.updateCursor(curDate);
        break;
      case 38: //up
        e.preventDefault();
        curDate.subtract(7, 'days');
        this.updateCursor(curDate);
        break;
      case 37: //left
        e.preventDefault();
        curDate.subtract(1, 'days');
        this.updateCursor(curDate);
        break;
      case 39: //right
        e.preventDefault();
        curDate.add(1, 'days');
        this.updateCursor(curDate);
        break;
      case 27: //escape
        e.preventDefault();
        this.hideCalendar();
        break;
      case 34: //pgDn
        e.preventDefault();
        if(!this.state.showCalendar){return}
        if(!e.altKey){
          this.picker.nextMonth();
          curDate.add(1, 'months');
        }else{
          this.picker.nextYear();
          curDate.add(1, 'years');
        }
        this.updateCursor(curDate);
        break;
      case 33: //pgUp
        e.preventDefault();
        if(!this.state.showCalendar){return}
        if(!e.altKey){
          this.picker.previousMonth();
          curDate.subtract(1, 'months');
        }else{
          this.picker.previousYear();
          curDate.subtract(1, 'years');
        }
        this.updateCursor(curDate);
        break
      case 13: //enter
        e.preventDefault();
        if(this.state.showCalendar){
          this.handleSetDate(e, curDate, curDate.format(this.props.dateFormat));
        } else {
           this.showCalendar();
        }
        
        this.informScreenReader(moment(curDate).format(this.props.dateFormat) + 'selected');
        break;
      case 9: // tab
        this.hideCalendar();
      default:
    }
  }
  
  updateCursor(date){
    this.setState({
        cursorDate: date,
      });
      moment.locale(this.props.locale);
      
      this.informScreenReader(moment(date).format('LL') );
  }
  
  handleSetDate(e, date, stringDate){
    if(e.type === 'click' || e.type === 'keydown'){
      e.preventDefault();
      
      this.props.onChange ? this.props.onChange(e) : null;
      this.textfield.getInput().focus();
      
      if(this.props.input){
        // convert date to ISO 8601 format for backend
        const standardizedDate = this.standardizeDate(stringDate)

        // redux-form handlers take the value rather than the event...
        this.props.input.onChange(standardizedDate);
        this.props.input.onBlur(standardizedDate);
      }
      if(this.props.hideOnChoose){

        // hiding calendar is debounced to wait for focus to properly catch up.
        this.dbhideCalendar();
      }
      
      this.setState({ dateString: stringDate, cursorDate: date, date: date });
    }
    if(e.type === 'change') {
      const tempString = e.target.value;
      // be sure that value is parseable as a date in the required format...
      // the boolean parameter suppresses moment's deprecation warning,
      // preventing it from attempting a parse using independable js Date object.
      if(moment(tempString, this.props.dateFormat, true).isValid()){
        const tempDate = moment(tempString, this.props.dateFormat);
        this.setState({
          date: tempDate,
          cursorDate: tempDate,
          dateString: e.target.value,
        });
      }else{
        // if it's not a valid date, update field value only so that we can still see what we typed in the field...
        this.setState({
          dateString: e.target.value,
        });
      }
      this.props.onChange ? this.props.onChange(e) : null;
      if(this.props.input){
        this.props.input.onChange(e.target.value);
      }
    }
    
  }
  
  handleFieldChange(e){
    this.handleSetDate(e, e.target.value, e.target.value);
  }

  clearDate(e){
    this.setState({
      dateString: ""
    });
    this.props.onChange ? this.props.onChange(e) : null;
    if(this.props.input){
      this.props.input.onChange("");
    }
  }
  
  cleanForScreenReader(str){
    return str.replace("Y", "Y ");
  }
  
  informScreenReader(str){
    let d = document.createElement('div');
    d.innerHTML = str;
    this.srSpace.appendChild(d);
  }
  
  hideOnBlur(e){
    if(!contains(this.container, document.activeElement) && document.activeElement !== document.body){
      if(this.props.input){
        this.props.input.onBlur(e);
      }
      this.hideCalendar();
    }
  }

  standardizeDate(date){
    switch(this.props.backendDateStandard){
      case "ISO 8601":
      case "ISO8601":
      case "ISO-8601":
        return moment(date).toISOString();
      case "RFC 2822":
      case "RFC2822":
      case "RFC-2822":
        var DATE_RFC2822 = "ddd, MM MMM YYYY HH:mm:ss ZZ";
        return moment(date).format(DATE_RFC2822);
      default:
        return moment(date).format(this.props.backendDateStandard);
    }
  }


  render(){
    const { input, dateFormat, onSetDate, screenReaderMessage, defaultDate, value, label, id, readOnly, ...textFieldProps } = this.props;
    
    const screenReaderFormat = this.cleanForScreenReader(dateFormat);
    let ariaLabel;
    if(readOnly){
      ariaLabel = `${label}`;
    } else {
      ariaLabel = `${label} format is ${screenReaderFormat} use arrow keys to navigate dates. Enter key to confirm. ${screenReaderMessage}`;
    }
    
    let endElement;
    if(this.state.dateString != ""){
      endElement = (
         <div style={{display:"flex"}}> 
            <Button 
              key="clearButton" 
              buttonStyle="fieldControl" 
              onClick={this.clearDate} 
              title="Clear field value" tabIndex="-1"
            >
              <Icon icon="closeX" />
            </Button>
            <Button 
              key="calendarButton" 
              buttonStyle="fieldControl" 
              onClick={this.toggleCalendar} 
              onKeyDown={this.handleKeyDown} 
              title="Show/hide datepicker" 
              ref={(ref) => {this.calendarButton = ref}}
              tabIndex="-1"
            >
              <Icon icon="calendar" />
            </Button> 
         </div>
        
      );
    }
    else
    {
      endElement =
        <Button 
          key="calendarButton" 
          buttonStyle="fieldControl" 
          onClick={this.toggleCalendar} 
          onKeyDown={this.handleKeyDown} 
          title="Show/hide datepicker" 
          ref={(ref) => {this.calendarButton = ref}} 
          tabIndex="-1"
        >
          <Icon icon="calendar" />
        </Button>;
    }
    
    let textfield;
    if(this.props.input && this.props.meta){
      textfield = (
        <TextField 
          ref={ (ref) => this.textfield = ref } 
          {...this.props.input}
          value = {this.state.dateString}
          label={label}
          aria-label={ariaLabel}
          endControl={!readOnly ? endElement : null}
          placeholder={dateFormat} 
          onKeyDown={!readOnly ? this.handleKeyDown : null}
          onClick={!readOnly ? this.handleFieldClick : null}
          onFocus={!readOnly ? this.handleFieldFocus : null}
          onBlur={this.hideOnBlur}
          onChange={this.handleFieldChange}
          input={this.props.input}
          meta={this.props.meta}
          readOnly={readOnly}
        />
      );
    } else {
      textfield = (
        <TextField 
          ref={ (ref) => this.textfield = ref } 
          label={label}
          value={this.state.dateString} 
          onChange={this.handleSetDate} 
          aria-label={ariaLabel}
          endControl={!readOnly ? endElement : null}
          placeholder={dateFormat} 
          onKeyDown={!readOnly ? this.handleKeyDown : null}
          onBlur={this.hideCalendar}
          onClick={!readOnly ? this.handleFieldClick : null}
          onFocus={!readOnly ? this.handleFieldFocus : null}
          readOnly={readOnly}
        />
      );
    }


    return (
      <div style={{position: 'relative', width:'100%'}} ref={ (ref) => this.container = ref }>
      
      <div aria-live="assertive" aria-relevant="additions" className={css.srOnly} ref={(ref) => {this.srSpace = ref}}></div> 
        
        {textfield}
        
        { this.state.showCalendar &&
          <RootCloseWrapper onRootClose={this.handleRootClose} >
            <Calendar 
              onSetDate={this.handleSetDate}
              date={this.state.dateString}
              cursorDate={this.state.cursorDate}
              dateFormat={dateFormat} 
              ref={(ref) => { this.picker = ref }}
              onKeyDown ={this.handleKeyDown}  
              onBlur={this.hideCalendar}
              locale={this.props.locale}
              excludeDates={this.props.excludeDates}
              buttonFocus = {this.focusTextfield}
            />
          </RootCloseWrapper>
        }
               
      </div>      
      
    )
  }
}

Datepicker.propTypes = propTypes;
Datepicker.defaultProps = defaultProps;

export default Datepicker;


