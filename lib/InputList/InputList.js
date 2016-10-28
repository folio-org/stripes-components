import React from 'react';

class InputList extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        <label>{this.props.label}</label>
        <ul>
          {
            this.props.children.map(
              function (child, i) {
                return <li key={child.id}>{child}</li>;
              });
          }
        </ul>   
      </div>
    );
  }
}

export default InputList;
