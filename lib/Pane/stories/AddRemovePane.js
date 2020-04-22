/**
 * Pane: Basic Usage
 */

import React from 'react';
import Paneset from '../../Paneset';
import Pane from '../Pane';
import PaneHeader from '../../PaneHeader';
import Button from '../../Button';
import { LoadingPane } from '../../Loading';

const AddRemovePane = () => {
  const [detail, setDetail] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [loading]);

  const toggleThird = () => {
    setDetail(curDetail => !curDetail);
    if (detail) {
      setLoading(true);
    }
  };

  const renderDetailPane = () => {
    if (detail) {
      if (loading) {
        return (
          <LoadingPane
            id="detail-pane"
            defaultWidth="30%"
            renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Detail" />}
          />
        );
      }
      return (
        <Pane
          id="detail-pane"
          defaultWidth="30%"
          renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Detail" />}
        >
          Pane Content
        </Pane>
      );
    }
    return null;
  };

  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          defaultWidth="20%"
          renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Filters" />}
        >
          Pane Content
          <Button onClick={toggleThird}>Toggle Third Pane</Button>
        </Pane>
        <Pane
          defaultWidth="fill"
          renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Search Results" />}
        >
          Pane Content
        </Pane>
        {renderDetailPane()}
      </Paneset>
    </div>
  );
};

export default AddRemovePane;
