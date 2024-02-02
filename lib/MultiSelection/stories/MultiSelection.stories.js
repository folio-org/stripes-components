import React from 'react';
import { action } from '@storybook/addon-actions';
import MultiSelection from '../MultiSelection';
import { OptionSegment } from '../../Selection';
import BasicUsage from './BasicUsage';
import Required from './Required';
import CustomAriaLabelledBy from './CustomAriaLabelledBy';
import AriaLabel from './HiddenLabel';
import AugmentObjects from './AugmentObjects';

const optionList = [
  { value: 'test0', label: 'Option 0', extra: 'nulla' },
  { value: 'test1', label: 'Option 1', extra: 'I' },
  { value: 'test2', label: 'Option 2', extra: 'II' },
];

const renderAddTag = ({ filterValue, exactMatch }) => {
  if (exactMatch) {
    return null;
  } else {
    return (
      <div>
        Add tag for
        <strong>
          &quot;
          {`${filterValue}`}
          &quot;
        </strong>
      </div>
    );
  }
};

const actionsList = [
  {
    onSelect: () => {
      action('new tag action!');
    },
    render: renderAddTag,
  },
];

export default {
  title: 'MultiSelect',
};

export const _BasicUsage = () => <BasicUsage />;

export const Placeholder = () => (
  <div>
    <MultiSelection
      label="my multiselect"
      id="my-placeholder-multiselect"
      dataOptions={optionList}
      placeholder="Please select an item"
    />
  </div>
);

export const CustomFormatter = () => (
  <div>
    <MultiSelection
      label="my multiselect"
      id="my-formatted-multiselect"
      dataOptions={optionList}
      formatter={({ option, searchTerm }) => (
        <OptionSegment searchTerm={searchTerm}>
          {option.value} {option.extra}
        </OptionSegment>
      )}
    />
  </div>
);

export const ValidationMessages = () => (
  <div>
    <MultiSelection
      label="My Erroneous Multiselect"
      id="my-error-multiselect"
      dataOptions={optionList}
      error="Selection Error!"
    />
    <MultiSelection
      label="My Warning Multiselect"
      id="my-warning-multiselect"
      dataOptions={optionList}
      warning="Selection Warning!"
    />
  </div>
);

export const Actions = () => (
  <div>
    <MultiSelection
      label="My Actions MultiSelect"
      id="my-actions-multiselect"
      dataOptions={optionList}
      actions={actionsList}
    />
  </div>
);

export const AsOverlay = () => (
  <div>
    <div id="OverlayContainer" />
    <div
      style={{
        border: '1px solid #999;',
        padding: '4px',
        height: '100px',
        backgroundColor: '#dedede',
        overflow: 'auto',
      }}
    >
      <MultiSelection
        label="My Actions MultiSelect 0"
        id="my-actions-multiselect"
        dataOptions={optionList}
        renderToOverlay
      />
      <MultiSelection
        label="My Actions MultiSelect 1"
        id="my-actions-multiselect-2"
        dataOptions={optionList}
        renderToOverlay
      />
      <MultiSelection
        label="My Actions MultiSelect 2"
        id="my-actions-multiselect-3"
        dataOptions={optionList}
        renderToOverlay
      />
    </div>
  </div>
);

export const DisabledState = () => (
  <div>
    <MultiSelection
      value={optionList}
      label="My Disabled MultiSelect"
      id="my-disabled-multiselect"
      dataOptions={optionList}
      disabled
    />
  </div>
);

DisabledState.storyName = 'Disabled state';

export const _Required = () => <Required />;
export const CustomAriaLabel = () => <CustomAriaLabelledBy />;
export const HiddenLabel = () => <AriaLabel />;
export const _AugmentObjects = () => <AugmentObjects />;
