/**
 * SearchField Usage
 */

import React, { Component } from 'react';
import SearchField from '../SearchField';

export default class SearchFieldUsage extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
    };
    this.clearValue = this.clearValue.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  clearValue() {
    this.setState({
      value: '',
    });
  }

  changeValue(e) {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    return (
      <div style={{ padding: '15px' }}>
        <SearchField
          onClear={this.clearValue}
          value={this.state.value}
          onChange={this.changeValue}
          placeholder="Search for something.."
          ariaLabel="Search for stuff."
          clearSearchId="clear-search-button"
          id="clear-sesrch-field"
        />
        <div style={{ marginTop: '15px', color: '#888' }}>
          { this.state.value ? `You typed: ${this.state.value}` : 'Try entering a value in the search field.'}
        </div>
      </div>
    );
  }
}
