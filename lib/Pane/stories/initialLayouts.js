/**
 * Pane: initial Layouts
 */

import React from 'react';
import Paneset from '../../Paneset';
import Pane from '../Pane';
import PaneHeader from '../../PaneHeader';
import Button from '../../Button';
import { LoadingPane } from '../../Loading';

const InitialLayouts = () => {
  const [showDetail, setShowDetail] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [showFilter, setShowFilter] = React.useState(true);
  const initlayout = React.useRef([
    {
      'results-pane': '20%',
      'detail-pane': '80%',
    },
    {
      'filter-pane': '20%',
      'results-pane': '30%',
      'detail-pane': '50%',
    }
  ]);

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
            defaultWidth="fill"
            renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Detail" />}
          />
        );
      }
      return (
        <Pane
          id="detail-pane"
          defaultWidth="fill"
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
      <Paneset initialLayouts={initlayout.current}>
        { showFilter && (
          <Pane
            id="filter-pane"
            defaultWidth="fill"
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

export default InitialLayouts;
