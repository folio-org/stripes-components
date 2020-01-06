import React from 'react';
import Pane from '../Pane';
import Layout from '../Layout';
import Loading from './Loading';

export default (props) => {
  const spinnerStyle = { maxWidth: '15rem', height: '8rem' };
  return (
    <Pane {...props}>
      <Layout className="centered full" style={spinnerStyle}>
        &nbsp;
        <Loading size="xlarge" />
      </Layout>
    </Pane>
  );
};
