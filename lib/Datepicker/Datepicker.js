import React from 'react';

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
  disabledDates: React.PropTypes.array,
  onSetDate: React.PropTypes.func,
  screenReaderMessage: React.PropTypes.string,
  value: React.PropTypes.string,
  format: React.PropTypes.string,
  label: React.PropTypes.string,
  inputStyle: React.PropTypes.string,
  labelStyle: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  required: React.PropTypes.bool,
  input: React.PropTypes.object,
  meta: React.PropTypes.object,
  id: React.PropTypes.string,
  onChange: React.PropTypes.func,
  useFocus: React.PropTypes.bool,
  hideOnChoose: React.PropTypes.bool,
  locale: React.PropTypes.string,
  excludeDates: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
    React.PropTypes.string
  ]),
  
};

const defaultProps = {
  format: "MM/DD/YYYY",
  screenReaderMessage: "",
  hideOnChoose: true,
  useFocus: true,
  locale: "en",
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
      }
    }
    this.state = {
      date: initDate,
      dateString: initString,
      cursorDate: moment(initDate).isValid()? moment(initDate) : moment(),
      showCalendar: this.props.showCalendar || false,
    };
  }
 
  handleFieldFocus(){
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
          this.picker.setDate(curDate, e);
        } else {
           //this.handleSetDate(e, curDate, curDate.format(this.props.format));
           this.showCalendar();
        }
        
        this.informScreenReader(moment(curDate).format(this.props.format) + 'selected');
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
      this.setState({ dateString: stringDate, cursorDate: date, date: date });
      this.props.onChange ? this.props.onChange(e) : null;
      this.textfield.getInput().focus();
      if(this.props.input){
        this.props.input.onChange(e);
      }
      if(this.props.hideOnChoose){
        this.dbhideCalendar();
      }
      
    }
    if(e.type === 'change') {
      const tempString = e.target.value;
      if(moment(tempString, this.props.format).isValid()){
        const tempDate = moment(tempString, this.props.format);
        this.setState({
          date: tempDate,
          cursorDate: tempDate,
          dateString: e.target.value,
        });
      }else{
        this.setState({
          dateString: e.target.value,
        });
      }
      this.props.onChange ? this.props.onChange(e) : null;
      if(this.props.input){
        this.props.input.onChange(e);
      }
    }
    
  }
  
  clearDate(e){
    this.setState({
      dateString: ""
    });
    this.props.onChange ? this.props.onChange(e) : null;
    if(this.props.input){
      this.props.input.onChange(e);
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
  
  render(){
    const { input, format, onSetDate, screenReaderMessage, defaultDate, value, label, id, ...textFieldProps } = this.props;
    
    const screenReaderFormat = this.cleanForScreenReader(format);
    const ariaLabel = `${label} format is ${screenReaderFormat} use arrow keys to navigate dates. Enter key to confirm. ${screenReaderMessage}`;
    
    let endElement;
    if(this.state.dateString != ""){
      endElement = (
        <div style={{display:"flex"}}>
          <Button key="clearButton" buttonStyle="fieldControl" onClick={this.clearDate} title="Clear field value"><Icon icon="closeX" /></Button>
          <Button key="calendarButton" buttonStyle="fieldControl" onClick={this.toggleCalendar} onKeyDown={this.handleKeyDown} title="Show/hide datepicker" ref={(ref) => {this.calendarButton = ref}}><Icon icon="calendar" /></Button> 
        </div>);
    }
    else
    {
      endElement =
        <Button key="calendarButton" buttonStyle="fieldControl" onClick={this.toggleCalendar} onKeyDown={this.handleKeyDown} title="Show/hide datepicker" ref={(ref) => {this.calendarButton = ref}}><Icon icon="calendar" /></Button>;
    }
    
    return (
      <div style={{position: 'relative', width:'100%'}} ref={ (ref) => this.container = ref }>
      
      <div aria-live="assertive" aria-relevant="additions" className={css.srOnly} ref={(ref) => {this.srSpace = ref}}></div> 
        
        <TextField 
          ref={ (ref) => this.textfield = ref } 
          label={label}
          value={this.state.dateString} 
          onChange={this.handleSetDate} 
          aria-label={ariaLabel}
          endControl={endElement}
          placeholder={format} 
          onKeyDown={this.handleKeyDown}
          onBlur={this.hideOnBlur}
          onClick={this.handleFieldClick}
          onFocus={this.handleFieldFocus}
        />
        
        { this.state.showCalendar &&
          <RootCloseWrapper onRootClose={this.handleRootClose} >
            <Calendar 
              onSetDate={this.handleSetDate}
              date={this.state.dateString}
              cursorDate={this.state.cursorDate}
              format={format} 
              ref={(ref) => { this.picker = ref }}
              onKeyDown ={this.handleKeyDown}  
              onBlur={this.hideOnBlur}
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


