import React from 'react';
// import { Pane, Layout } from '@folio/stripes/components';
import Pane from '../Pane';
import Layout from '../Layout';
import Loading from './Loading';

const PaneLoading = (props) => {
  const spinnerStyle = { maxWidth: '15rem', height: '8rem' };
  return (
    <Pane {...props}>
      <Layout className="centered full" style={spinnerStyle}>
        &nbsp;
        <Loading />
      </Layout>
    </Pane>
  );
};

export default PaneLoading;
