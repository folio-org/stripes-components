/**
 * Pane: Basic Usage
 */

import React, { useState } from 'react';
import Paneset from '../../Paneset';
import Pane from '../Pane';
import PaneHeader from '../../PaneHeader';
import MultiColumnList from '../../MultiColumnList';
import Headline from '../../Headline';
import { syncGenerate } from '../../MultiColumnList/stories/service';
import css from './MCLPartial.css';

const MCLPartial = () => {
  const [data, setData ] = useState(syncGenerate(200))


  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          defaultWidth="fill"
          renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Search Results" />}
        >
          <>
            <div className={css.container}>
              {/* content goes here */}
              <Headline>Test MCL partial</Headline>
              <p>
                Paragraph with some flavor text. MCL should stay comfortably within the bounds of the pane below this...
              </p>
              <div className={css.mclFlexDescendent}>
                {/* the next div is non-flex, gives autosizer something to expand against */}
                <div className={css.mclParent}>
                  <MultiColumnList
                    contentData={data}
                    autosize
                    virtualize
                  />
                </div>
              </div>
            </div>
          </>
        </Pane>
      </Paneset>
    </div>
  );
}
export default MCLPartial;
