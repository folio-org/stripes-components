import React from 'react';
import MultiColumnList from '../MultiColumnList';
import TextField from '../../TextField';
import { Row, Col } from '../../LayoutGrid';
import { asyncGenerate, syncGenerate } from './service';

export default class Autosize extends React.Component {
  constructor() {
    super();
    this.state = {
      data: syncGenerate(100, 0),
      height: 300,
      width: 600,
    };
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  updateWidth = (e) => {
    this.setState({
      width: e.target.value
    });
  }

  updateHeight = (e) => {
    this.setState({
      height: e.target.value
    });
  }

  render() {
    const { data, width, height } = this.state;
    return (
      <>
        <Row>
          <Col>
            <TextField
              label="height"
              endControl={<div>px</div>}
              onChange={this.updateHeight}
              value={height}
              type="number"
            />
          </Col>
          <Col>
            <TextField
              label="width"
              endControl={<div>px</div>}
              onChange={this.updateWidth}
              value={width}
              type="number"
            />
          </Col>
        </Row>
        <div style={{ height: `${height}px`, width: `${width}px`, border: '1px solid #666', padding: '2px' }}>
          <MultiColumnList contentData={data} autosize virtualize />
        </div>
      </>
    );
  }
}
