import React, { Component } from 'react';
import ExpandAllButton from '../ExpandAllButton';
import Accordion from '../Accordion';
import AccordionSet from '../AccordionSet';
import translations from '../../../translations/stripes-components/en';

class ExpandAllExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accordions: {
        accordion01: true,
        accordion02: true,
        accordion03: true,
      },
    };
  }

  handleOnChange = () => {
    const {
      accordion01,
      accordion02,
      accordion03
    } = this.state.accordions;

    this.setState({
      accordions: {
        accordion01: !accordion01,
        accordion02: !accordion02,
        accordion03: !accordion03
      }
    });
  };

  render() {
    const {
      accordions: {
        accordion01,
        accordion02,
        accordion03,
      },
      accordions
    } = this.state;

    return (
      <AccordionSet closedByDefault>
        <ExpandAllButton
          accordionStatus={accordions}
          onToggle={this.handleOnChange}
          collapseLabel={translations.collapseAll}
          expandLabel={translations.expandAll}
          id="expand-button"
        />
        <Accordion
          label="test"
          id="accordion01"
          open={accordion01}
        >
          <input />
        </Accordion>
        <Accordion
          label="test"
          id="accordion02"
          open={accordion02}
        >
          <input />
        </Accordion>
        <Accordion
          label="test"
          id="accordion03"
          open={accordion03}
        >
          <input />
        </Accordion>
      </AccordionSet>
    );
  }
}

export default ExpandAllExample;
