/**
 * Pane: Basic Usage
 */

import React from 'react';
import Paneset from '../../Paneset';
import Pane from '../Pane';
import PaneHeader from '../../PaneHeader';
import Button from '../../Button';
import { LoadingPane } from '../../Loading';

const OnLayout = () => {
  const [showDetail, setShowDetail] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [showFilter, setShowFilter] = React.useState(true);

  React.useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [loading]);

  const toggleDetailPane = () => {
    setShowDetail(curDetail => !curDetail);
    if (showDetail) {
      setLoading(true);
    }
  };

  const toggleFilterPane = () => {
    setShowFilter(curShowFilter => !curShowFilter);
  };

  const renderDetailPane = () => {
    if (showDetail) {
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

  const onLayoutPanes = ({ changeType }) => {
    if (
      changeType === 'removed' &&
      !showFilter &&
      showDetail
    ) {
      return {
        'results-pane': '20%',
        'detail-pane': '80%',
      };
    }
    return null;
  };

  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset onLayout={onLayoutPanes}>
        { showFilter && (
          <Pane
            id="filter-pane"
            defaultWidth="20%"
            renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Filters" />}
          >
            Pane Content
          </Pane>
        )
        }
        <Pane
          id="results-pane"
          defaultWidth="fill"
          renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Search Results" />}
        >
          Pane Content
          <Button onClick={toggleFilterPane}>Toggle First Pane</Button>
          <Button onClick={toggleDetailPane}>Toggle Third Pane</Button>
        </Pane>
        {renderDetailPane()}
      </Paneset>
    </div>
  );
};

export default OnLayout;
