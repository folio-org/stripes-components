import React from 'react';
import TextField from '../TextField';

class TextFieldHarness extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldVal: 'test text',
    };
  }

  render() {
    return (
      <TextField
        value={this.state.fieldVal}
        onChange={(e) => { this.setState({ fieldVal: e.target.value }); }}
      />
    );
  }
}

export default TextFieldHarness;
