/**
 * Pane: Basic Usage
 */

import React from 'react';
import Paneset from '../../Paneset';
import Pane from '../Pane';
import PaneHeader from '../../PaneHeader';
import Button from '../../Button';
import Layer from '../../Layer';
import { LoadingPane } from '../../Loading';

const AddRemovePane = () => {
  const [detail, setDetail] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [showModal, updateShowModal] = React.useState(false);
  const [showLayer, updateShowLayer] = React.useState(false);

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

  const toggleOverlappingModal = () => {
    updateShowModal(cur => !cur);
  };

  const toggleLayer = () => {
    updateShowLayer(cur => !cur);
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
        <>
          <Pane
            id="detail-pane"
            defaultWidth="30%"
            renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Detail" />}
          >
            <Button onClick={toggleOverlappingModal}>Render Overlap</Button>
            <Button onClick={toggleLayer}>Render Layer</Button>
            <Layer id="exampleLayer" contentLabel="Example Layer" isOpen={showLayer}>
              <Paneset isRoot id="layer-paneset">
                <Pane defaultWidth="50%" paneTitle="Example A" id="exLayerA">
                  <Button onClick={toggleLayer}>Close Layer</Button>
                </Pane>
                <Pane defaultWidth="50%" paneTitle="Example B" id="exLayerB">Example Content</Pane>
              </Paneset>
            </Layer>
          </Pane>
          { showModal && (
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              padding: '20px'
            }}
            >
              <Button onClick={toggleOverlappingModal}>Hide Overlapping Modal</Button>
            </div>
          )}
        </>
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
