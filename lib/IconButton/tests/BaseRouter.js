import React from 'react';
import {
  HashRouter,
} from 'react-router-dom';

const BaseRouter = ({children}) => (
  <HashRouter>
    {children}
  </HashRouter>
);

export default BaseRouter;
