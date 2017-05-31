import React from 'react';
import Moment from 'moment';

import { extendMoment } from 'moment-range';

import Icon from '../Icon';

const moment = extendMoment(Moment);

import css from './Calendar.css';



const propTypes = {
  date: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string]),
  onSetDate: React.PropTypes.func,
  cursorDate: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string]),
  dateFormat: React.PropTypes.string,
  selected: React.PropTypes.object,
  locale: React.PropTypes.string,
  excludeDates: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
    React.PropTypes.string
  ]), 
} 

const defaultProps = {
  date: moment(),
  dateFormat: "MM DD YYYY",
  onSetDate: () => null,
  locale: 'en',
}

class Calendar extends React.Component {
	constructor(props){
    super(props);
    
    moment.locale(this.props.locale);
    
    let initDate,   //date to initialize calendar
        inputDate;  //initial date for state
    if(this.props.date === '' || this.props.date === 'undefined'){
      initDate = moment();
      inputDate = null;
    }else{
      if(moment(this.props.date, this.props.dateFormat).isValid()){
        initDate = moment(this.props.date, this.props.dateFormat);
        inputDate = moment(this.props.date, this.props.dateFormat);
      }else {
        initDate = moment();
        inputDate = moment();
      }
    }
    
    const base = moment(initDate);
    const month = base.month();
    const year = base.year();
    
    this.state={
      date: inputDate,
      month: month,
      year: year,
      calendar: this.getCalendar(year, month),
    };
    
    this.handleDayClick = this.handleDayClick.bind(this);
    this.setDate = this.setDate.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
    this.nextYear = this.nextYear.bind(this);
    this.previousYear = this.previousYear.bind(this);
    this.checkExcluded = this.checkExcluded.bind(this);
  }
  
  componentWillReceiveProps(nextProps){
    if(moment(nextProps.date) !== this.state.date){
      const moDate = moment(nextProps.date);
      const month = moDate.month();
      const year = moDate.year();
      this.setState({
        date: moDate,
        month: month,
        year: year,
        calendar: this.getCalendar(year, month),
      });
    }
    
    if(nextProps.cursorDate !== this.props.cursorDate){
      const month = nextProps.cursorDate.month();
      const year = nextProps.cursorDate.year();
      this.setState({
        month: month,
        year: year,
        calendar: this.getCalendar(year, month),
      });
    }
  }
  
  getCalendar(year, month){
    const startDate = moment([year, month]);
    const firstDay = moment(startDate).startOf('month');
    const endDay = moment(startDate).endOf('month');
    const monthRange = moment.range(firstDay, endDay);
    
    let weeks = [];
    let calendar = [];
    let firstWeekDay, lastWeekDay, week;
    
    const weekdays = Array.from(monthRange.by('days'));
    weekdays.map(function(mo) {
      var ref = mo.week();
      if (weeks.indexOf(ref) < 0) {
        weeks.push(mo.week());
      }
    });
        
    for (let i = 0, len = weeks.length; i < len; i++) {
      week = weeks[i];
      if (i > 0 && week < weeks[i-1]){
      	// We have switched to the next year
        
      	firstWeekDay = moment([year, month]).add(1, "year").week(week).day(moment.localeData()._week.dow);
      	lastWeekDay = moment([year, month]).add(1, "year").week(week).day(moment.localeData()._week.dow + 6);
      }
      else{
      	firstWeekDay = moment([year, month]).week(week).day(moment.localeData()._week.dow);
      	lastWeekDay = moment([year, month]).week(week).day(moment.localeData()._week.dow + 6);
      }
      const weekRange = moment.range(firstWeekDay, lastWeekDay);
      calendar.push(weekRange);
    }
	
    return calendar;
  }
  
  handleDayClick(day, e){
    e ? e.preventDefault() : null;
    this.setDate(day);
    this.props.onSetDate(e, day, day.format(this.props.dateFormat));
  }

  setDate(day){
    //e ? e.preventDefault() : null;
    this.setState({
      date: day
    });
    //this.props.onSetDate(e, day, day.format(this.props.dateFormat));
  }
  
  nextMonth(e){
    e ? e.preventDefault() : null;
    let month, year;
    if (this.state.month === 11){
      month = 0;
      year = this.state.year + 1;
    }
    else{
      month = this.state.month + 1;
      year = this.state.year;
    }

    this.setState({
      month: month,
      year: year,
      calendar: this.getCalendar(year, month)
    });
  }
  
  previousMonth(e){
    e ? e.preventDefault() : null;
    let month, year;
    if (this.state.month === 0){
      month = 11;
      year = this.state.year - 1;
    }
    else {
      month = this.state.month - 1;
      year = this.state.year;
    }

    this.setState({
      month: month,
      year: year,
      calendar: this.getCalendar(year, month)
    });
  }
  
  nextYear(e){
    e ? e.preventDefault() : null;
    const year = this.state.year + 1;
    const month = this.state.month;
    this.setState({
      month: month,
      year: year,
      calendar: this.getCalendar(year, month)
    });
  }
  
  previousYear(e){
    e ? e.preventDefault() : null;
    const year = this.state.year - 1;
    const month = this.state.month;
    this.setState({
      month: month,
      year: year,
      calendar: this.getCalendar(year, month)
    });
  }
  
  getMonth(){
    return this.state.month;
  }
  
  checkExcluded(date){
    if(!this.props.excludeDates){
      return false;
    }
    
    const ex = this.props.excludeDates;
    switch(typeof(ex)){
      case 'string':
        if(date.isSame(moment(ex), 'day')){
          return true;
        }
        break;
      case 'object':
        if(moment.isMoment(ex)){
          if (date.isSame(ex, 'day')){
            return true;
          }
        }
        else
        { //excluded is an array...
          let excluded = false;
          ex.forEach((exd)=>{
            if(moment.isMoment(exd)){
              if (date.isSame(exd, 'day')){
                excluded = true;
                return;
              }
            }else{
              if(date.isSame(moment(exd), 'day')){
                excluded = true;
                return true;
              }
            }
          })
          return excluded;
        }
        break;
      default:
        return false;
    }
  }
  
  render() {
    let weekCount = 0;
    let weeks = this.state.calendar.map(
      function(week) {
        weekCount++;
        let dayList = [];
        const weekDays = Array.from(week.by('days')); 
        weekDays.map((day) => { dayList.push(day); });

        const days = dayList.map(
          function(day){
              const isCurrentMonth = day.month() === this.state.month;
              const isToday = day.isSame(moment(), 'day');
              const isSelected = this.state.date ? day.format('DD-MM-YYYY') == this.state.date.format('DD-MM-YYYY') : false;
              const isCursored = day.isSame(this.props.cursorDate, 'day');
              const isExcluded = this.checkExcluded(day); 
              let dayClasses = css.day;
              if (!isCurrentMonth){
                dayClasses += ` ${css.muted}`;
              }
              if (isToday){
                dayClasses += ` ${css.today}`;
              }
              if (isCursored){
                dayClasses += ` ${css.cursor}`;
              }
              if (isSelected){
                dayClasses += ` ${css.selected}`;
              }
              if(isExcluded) {
                dayClasses += ` ${css.excluded}`;
              }
              return <td key={day.format('D-MM')} >
              <div 
                onFocus={this.props.buttonFocus} 
                className={ dayClasses } 
                title={'Select ' + day.format('dddd') + ", " + day.format(this.props.dateFormat)} 
                onClick={ (e) => {this.handleDayClick(day, e) }} 
                onKeyDown={this.props.onKeyDown}  
                onBlur={this.props.onBlur} 
                tabIndex="-1"
              >
                { day.format('D') }
              </div>
              </td>
            }, this
        );

        return <tr key={ weekCount }>{ days }</tr>
        
      }, this);
      
      let k = moment.localeData()._week.dow, daysOfWeek = [];
      while(daysOfWeek.length < 7){
        daysOfWeek.push(<th key={k+k} className={css.weekday}>{moment().day(k).format('dd')}</th>);
        k < 6 ? k++ : k=0;
      }
      
      const arrowStyle = {padding: '4px'};
      
        return (
          <div className={css.root}>
            <div className={css.calendar}>
              <table role="presentation">
                <thead>
                  
                  <tr>
                    <td>
                    <a href="#" className={css.nav} onClick={ this.previousYear } tabIndex="-1" style={arrowStyle} title="Go to previous year"><Icon icon="left-double-chevron" /></a>
                    </td>
                    <td>
                        <a href="#" className={css.nav} onClick={ this.previousMonth } tabIndex="-1" style={arrowStyle} title="Go to previous month"><Icon icon="left-arrow" /></a>
                    </td>
                    <td colSpan="3"><span className={css.selectedMonth}>{ moment().month(this.state.month).format("MMMM") } { this.state.year }</span></td>
                    <td>
                        <a href="#" className={css.nav} onClick={ this.nextMonth } tabIndex="-1" style={arrowStyle} title="Go to next month" ><Icon icon="right-arrow" /></a>
                    </td>
                    <td>
                        <a href="#" className={css.nav} onClick={ this.nextYear } tabIndex="-1" style={arrowStyle} title="Go to next year"><Icon icon="right-double-chevron" /></a>
                    </td>
                  </tr>
                  <tr>
                    {daysOfWeek}
                  </tr>
                </thead>
                <tbody>
                  {weeks}
                </tbody>
              </table>
            </div>
            <div>
            	{/*Selection: { this.state.date ? this.state.date.format("D MMMM YYYY") : '' }*/}
            </div>
          </div>
        );
      }
      
    }

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;

export default Calendar;