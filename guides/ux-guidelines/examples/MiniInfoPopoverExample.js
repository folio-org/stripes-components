import React from 'react';
import InfoPopover from '../../../lib/InfoPopover';

export default function MiniInfoPopoverExample() {
  return (
    <InfoPopover
      iconSize="small"
      content="This field is generated from linked authority data."
      buttonLabel="Read more"
      buttonHref="https://wiki.folio.org/"
      buttonTarget="_blank"
    />
  );
}
