import React from 'react';
import css from './Icon.css';
import dotSpinner from './DotSpinner.css';

const propTypes = {
  icon: React.PropTypes.string,
  width: React.PropTypes.string,
  height: React.PropTypes.string,
  iconClassName: React.PropTypes.string,
  iconRootClass: React.PropTypes.string,
  title: React.PropTypes.string,
};

const defaultProps = {
  width: "18px",
  height: "18px",
  iconClassName: 'stripes__icon',
};

class Icon extends React.Component{
  constructor(props){
    super(props);
  }
  
  getRootClass(){
    const base = css.root;
    const additionalRoot = this.props.iconRootClass || '';
    return `${base} ${additionalRoot}`;
  }
  
  render(){
    //let style = this.props.iconClassName == css.icon ? null : {fill:this.props.color || '#999'};
    let style = this.props.color ? {fill:this.props.color}:{};
    let className = this.props.iconClassName;
    let iconSVG;
    switch(this.props.icon){
      case 'bookmark':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><path style={style} className={className} d="M3.8 24.9V2.9H23.7v21.9l-9.9-6.8L3.8 24.9zM13.8 15.6l7.9 5.5V4.9H5.8v16.1L13.8 15.6z"></path></svg>;
        break;
      case 'search':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><path style={style} className={className} d="M24.7 23.1l-5.3-6c1.5-1.8 2.4-4.1 2.4-6.6 0-5.6-4.6-10.2-10.2-10.2C5.9 0.2 1.3 4.8 1.3 10.5s4.6 10.2 10.2 10.2c2.1 0 4-0.6 5.6-1.7l5.3 6c0.3 0.3 0.7 0.5 1.1 0.5 0.3 0 0.7-0.1 1-0.4C25.1 24.7 25.2 23.8 24.7 23.1zM4.3 10.5c0-4 3.2-7.2 7.2-7.2 4 0 7.2 3.2 7.2 7.2 0 4-3.2 7.2-7.2 7.2C7.6 17.7 4.3 14.5 4.3 10.5z"></path></svg>;
        break;
      case 'clearX':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><circle style={style} className={className} cx="13" cy="13" r="13" ></circle><polygon points="18.2 5.5 13 10.7 7.8 5.5 5.5 7.8 10.7 13 5.5 18.2 7.8 20.5 13 15.3 18.2 20.5 20.5 18.2 15.3 13 20.5 7.8 " fill="#FFF"></polygon></svg>;
        break;
      case 'comment':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path style={style} className={className} d="M10.3 19.8l0.1-5.8H3c-1.5 0-2.7-1.2-2.7-2.7v-8c0-1.5 1.2-2.7 2.8-2.7h14c1.5 0 2.8 1.2 2.8 2.8v8c0 1.5-1.2 2.8-2.7 2.8h-0.9L10.3 19.8zM3 2c-0.7 0-1.2 0.6-1.2 1.3v8c0 0.7 0.6 1.3 1.3 1.3h8.9l-0.1 3.6 3.6-3.6H17c0.7 0 1.3-0.6 1.3-1.2v-8c0-0.7-0.6-1.2-1.2-1.2H3z"></path></svg>;
        break;
      case 'icon':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><path style={style} className={className} d="M1.4 15.7c0 0 2.3-7.1 11.3-7.1 9 0 13.3 6.7 13.3 6.7l-1.5 0.7c0 0-3.6-5.5-11.8-5.5 -8.2 0.1-9.9 5.5-9.9 5.5L1.4 15.7z"/><circle style={style} className={className} cx="13.3" cy="14.2" r="4.9"/><path style={style} className={className} d="M3 16.3l-0.4 0.8c0 0 4.7 3.3 11.1 3.1s10.7-3.3 10.7-3.3l-0.8-0.6c0 0-5.9 2.6-9.9 2.8C8.9 19.4 3 16.3 3 16.3z"/></svg>;
        break;
      case 'edit':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><polygon style={style} className={className} points="4.8 17.8 4 23.6 9.7 21.9 " /><rect style={style} className={className} x="5.3" y="9" transform="matrix(0.6467 -0.7628 0.7628 0.6467 -4.5727 14.8672)" width="16.9" height="6.7" /><path style={style} className={className} d="M22.8 6.9l0.8-0.9c0 0 0.7-1.1-1.7-3.2C19.4 0.8 18.4 1.7 18.4 1.7l-0.8 0.9L22.8 6.9z" /></svg>;
        break;
      case 'hollowX':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><path style={style} className={className} d="M13 24.8C6.5 24.8 1.2 19.5 1.2 13S6.5 1.2 13 1.2 24.8 6.5 24.8 13 19.5 24.8 13 24.8zM13 4.2c-4.9 0-8.8 4-8.8 8.8S8.1 21.8 13 21.8s8.8-4 8.8-8.8S17.9 4.2 13 4.2z" /><polygon style={style} className={className} points="18.6 16.4 15.1 13 18.6 9.5 16.4 7.4 13 10.9 9.5 7.4 7.4 9.6 10.9 13 7.4 16.5 9.6 18.6 13 15.1 16.5 18.6 " /></svg>;
        break;
      case 'eye':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><path style={style} className={className} d="M12.9 18.5c-7.8 0-10.9-4.4-11.1-4.6l-0.3-0.4 0.1-0.5C1.8 12.8 3.9 6.4 13 6.4c9.1 0 11.6 5.6 11.7 5.9l0.2 0.5 -0.3 0.4c-0.1 0.2-3.4 5.2-11.4 5.3L12.9 18.5zM3.8 13.2c0.9 1 3.7 3.3 9.1 3.3l0.3 0c5.6-0.1 8.5-2.8 9.4-4 -0.8-1.2-3.3-4.2-9.6-4.2C6.7 8.4 4.4 11.9 3.8 13.2z" /><circle style={style} className={className} cx="12.8" cy="12.2" r="3.5" /></svg>;
        break;
      case 'plus-sign':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><polygon style={style} className={className} points="22.8 10.6 15.3 10.6 15.3 3.1 10.7 3.1 10.7 10.6 3.3 10.6 3.3 15.2 10.7 15.2 10.7 22.6 15.3 22.6 15.3 15.2 22.8 15.2 " /></svg>;
        break;
      case 'up-arrow':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><polygon style={style} className={className} points="24.2 12.8 13 1.6 1.8 12.8 3.9 15 11.5 7.4 11.5 22.3 14.5 22.3 14.5 7.4 22.1 15 " /></svg>;
        break;
      case 'down-arrow':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><polygon style={style} className={className} points="1.8 12.1 13 23.3 24.2 12.1 22.1 10 14.5 17.6 14.5 2.7 11.5 2.7 11.5 17.6 3.9 10 " /></svg>;
        break;
      case 'right-arrow':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><polygon style={style} className={className} points="8.5 18.7 12 18.7 19.7 11 12 3.3 8.5 3.3 14.9 9.7 2.3 9.7 2.3 12.3 14.9 12.3 "/></svg>;
        break;
      case 'left-arrow':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><polygon style={style} className={className} points="7.1 9.7 13.5 3.3 10 3.3 2.3 11 9.9 18.6 13.5 18.6 7.1 12.3 19.7 12.3 19.7 9.7 "/></svg>;
        break;
      case 'left-double-chevron':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><polygon style={style} className={className} points="12.7 18.6 12.7 18.6 4.7 11 12.4 3.7 8.7 3.7 1.1 11 9 18.6 "/><polygon style={style} className={className} points="20.9 18.6 20.9 18.6 12.9 11 20.6 3.7 16.9 3.7 9.3 11 17.2 18.6 "/></svg>;
        break;
      case 'right-double-chevron':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><polygon style={style} className={className} points="9 18.9 12.6 18.9 20.6 11.3 12.7 3.6 9 3.6 9 3.6 16.9 11.3 "/><polygon style={style} className={className} points="1 18.9 4.7 18.9 12.6 11.3 4.7 3.6 1 3.6 1 3.6 9 11.3 "/></svg>;
        break;
      case 'calendar':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><path style={style} className={className} d="M20 3V1h-4v2h-6V1H6v2H2v22h22V3H20zM22 23H4V5h2v2h4V5h6v2h4V5h2V23z"/><rect style={style} className={className} x="6.5" y="8.5" width="13" height="3"/><rect style={style} className={className} x="7.5" y="13.5" width="3" height="3"/><rect style={style} className={className} x="11.5" y="13.5" width="3" height="3"/><rect style={style} className={className} x="15.5" y="13.5" width="3" height="3"/><rect style={style} className={className} x="7.5" y="18" width="3" height="3"/><rect style={style} className={className} x="11.5" y="18" width="3" height="3"/><rect style={style} className={className} x="15.5" y="18" width="3" height="3"/></svg>;
        break;
      case 'closeX':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><polygon style={style} className={className} points="24.5 4.5 22.5 2.4 13 11.4 4 2 1.9 4 10.9 13.5 1.5 22.5 3.5 24.6 13 15.6 22 25 24.1 23 15.1 13.5 "/></svg>;
        break;
      case 'spinner-ellipsis':
        iconSVG = (<div className={dotSpinner.spinner}>
                    <div className={dotSpinner.bounce1}></div>
                    <div className={dotSpinner.bounce2}></div>
                    <div className={dotSpinner.bounce3}></div>
                  </div>);
        break;
      case 'validation-check':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><circle fill="#0A751E" cx="13" cy="13" r="12.832"/><polygon fill="#FFF" points="11.969,22.697 4.145,15.883 6.772,12.867 11.198,16.721 18.889,5.417 22.195,7.667 "/></svg>;
        break;
      case 'validation-error':
        iconSVG = <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 26 26"><circle cx="13" cy="13" r="12.8" fill="#900"/><path fill="#FFF" d="M10.6 19.4c0-1.3 0.9-2.2 2.1-2.2 1.3 0 2.1 0.9 2.1 2.3 0 1.3-0.8 2.3-2.1 2.3C11.5 21.6 10.6 20.7 10.6 19.4z" /><polygon fill="#FFF" points="11.1 14.6 10.4 3.5 15.1 3.5 14.4 14.6 " /></svg>;
        break;
      default:
          iconSVG = "ICON";
    };

    return(
      <div className={this.getRootClass()} tabIndex="-1" title={this.props.title} style={{width: this.props.width, height: this.props.height || this.props.width, minWidth: this.props.width}}>
        {iconSVG}
      </div>
    );
  }
}

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;


