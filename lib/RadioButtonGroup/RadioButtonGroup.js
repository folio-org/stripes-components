import React from 'react';
import css from './RadioButtonGroup.css';

function RadioButtonGroup(props){
  const {input, meta:{touched, error, warning}, ...rest} = props;
  const {...inputAttr} = input;

  const {label, children, ...inputCustom} = {...rest};      
  const displayedChildren = React.Children.map(props.children, 
    function(child){
      let newProps = { ...inputAttr, ...inputCustom };
      newProps.marginBottom0 = true;
      let elemProps = Object.assign({}, newProps, child.props,);
      return React.cloneElement(child, elemProps, []);
    });
    
  const warningElement = touched && warning? <div className={css.groupWarning}>{warning}</div> : null;
  const errorElement = touched && error? <div className={css.groupError}>{error}</div> : null;
    
  return(<div className={css.groupRoot}>
      <label className={css.groupLabel}>{label}</label>
      {displayedChildren}
      {warningElement}
      {errorElement}
    </div>
  );
}

export default RadioButtonGroup;