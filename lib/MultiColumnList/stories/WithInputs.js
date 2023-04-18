import React from 'react';
import { action } from '@storybook/addon-actions';
import MultiColumnList from '../MultiColumnList';
import Button from '../../Button';
import Selection from '../../Selection';
import Dropdown from '../../Dropdown';
import DropdownMenu from '../../DropdownMenu';
import MultiSelection from '../../MultiSelection';
import data from './dummyData';
import css from './MCLCustom.css';

const options = [
  {
    value: 'always',
    label: 'always',
  },
  {
    value: 'sometimes',
    label: 'sometimes',
  },
  {
    value: 'never',
    label: 'never',
  }
];


export default class Formatter extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: data[3],
      mclKey: 0,
    };

    this.portalEl = document.getElementById('OverlayContainer');


    this.cellStyles = (defaultClass, row, col) => {
      return col === 'patronGroup' ?
        `${ defaultClass} ${ css.overflowCell }` :
        defaultClass
    };

    this.listFormatter = {
      action: ({ active, rowIndex }) => (
        <Dropdown
          renderTrigger={({ getTriggerProps }) => <Button {...getTriggerProps()}>Open dropdown</Button>}
          renderMenu={() => (
            <DropdownMenu data-role="menu" aria-label="available options" onToggle={action('onToggle')}>
              <ul>
                <li>Example 1</li>
                <li>Example 2</li>
                <li>Example 1</li>
                <li>Example 2</li>
                <li>Example 1</li>
                <li>Example 2</li>
                <li>Example 1</li>
                <li>Example 2</li>
                <li>Example 1</li>
                <li>Example 2</li>
              </ul>
            </DropdownMenu>
              )}
            />
      ),
      phone: () => (
        <Selection
          ariaLabel="phone"
          dataOptions={options}
          id="phoneSelect"
          placeholder="Select phone setting"
        />
      ),
      patronGroup: () => (
        <MultiSelection
          ariaLabel="phone"
          dataOptions={options}
          id="patronSelect"
          placeholder="Select patron group(s)"
        />
      )
    };
  }

  onRowClick = (e, row) => {
    action('button-click');
    this.setState({ selected: row });
  }

  resetMCL = () => {
    this.setState(curState => ({
      mclKey: curState.mclKey + 1
    }));
  }

  render() {
    return (
      <>
        <Button onClick={this.resetMCL}>Reinitialize</Button>
        <MultiColumnList
          striped
          key={this.state.mclKey}
          contentData={data}
          formatter={this.listFormatter}
          selectedRow={this.state.selected}
          onRowClick={this.onRowClick}
          visibleColumns={['name', 'patronGroup', 'phone', 'action']}
          columnMapping={{
            name: 'Name',
            patronGroup: 'Patron group',
            phone: 'Phone',
            action: 'Action'
          }}
          getCellClass={this.cellStyles}
        />
      </>
    );
  }
}
