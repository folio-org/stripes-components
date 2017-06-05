import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import addFocusListener from './addFocusListener';
import addFocusOutListener from './addFocusOutListener';

class FocusTrap extends React.Component {
  constructor(props){
    super(props);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.onFocusListener = null;
    this.onFocusOutListener = null;

  }

  static propTypes = {
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    component: PropTypes.any,
    children: PropTypes.node
  };

  componentDidMount(){
    const comp = ReactDOM.findDOMNode(this);
    comp.setAttribute('tabindex', '-1');
    this.onFocusListener = addFocusListener(comp, this.handleFocus);
    this.onFocusOutListener = addFocusOutListener(comp, this.handleBlur);
  }

  handleFocus(e, childFocusHandler){
    console.log('entering');
    this.props.onFocus(e);
    if(childFocusHandler){
      childFocusHandler(e);
    }
  }

  handleBlur(e, childBlurHandler){
    console.log('leaving');
    this.props.onFocus(e);
    if(childBlurHandler){
      childBlurHandler(e);
    }
  }

  componentWillUnmount(){
    this.onFocusListener.remove();
    this.onFocusOutListener.remove();
  }

  render() {
    const {
      component: Component,
      children,
      ...props
    } = this.props;

    if (Component){
      return (
        <Component tabIndex="-1" {...props}>
          {children}
        </Component>
      );
    }

    return children;

    //  const transformedContainers = React.Children.map(child.props.children, (elem) => {
    //     return React.cloneElement(
    //       elem,
    //       Object.assign({},
    //       elem.props, 
    //         {
    //           onFocus: (e) => {this.handleFocus(e, elem.props.onFocus)},
    //           onBlur: (e) => {this.handleBlur(e, elem.props.onBlur)}
    //         }, 
    //         { tabIndex: -1 }
    //       ),
    //       elem.props.children );
    //   });

    //   return React.cloneElement(
    //     child, 
    //     child.props, 
    //     transformedContainers
    // )});

    // const transformedChild = React.Children.map(children, (child) =>{
    //   return React.cloneElement(
    //     child,
    //     Object.assign({},
    //     child.props, 
    //       {
    //         onFocus: (e) => {this.handleFocus(e, child.props.onFocus)},
    //         onBlur: (e) => {this.handleBlur(e, child.props.onBlur)}
    //       }, 
    //       { tabIndex: -1 }
    //     ),
    //     child.props.children );
    // });

    // return transformedChild[0];
    
  }
}

export default FocusTrap;
