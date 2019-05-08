import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { StaticRouter as Router } from 'react-router-dom';

import { mount } from '../../../tests/helpers';
import parseCSSUnit from '../../../util/parseCSSUnit';
import Paneset from '../Paneset';
import PanesetInteractor from './interactor';


describe('Paneset', () => {
  const paneset = new PanesetInteractor();

  beforeEach(async () => {
    await mount(
      <Router context={{}}>
        <Paneset />
      </Router>
    );
  });

  it('displays the close link', () => {
    expect(paneset.$root).to.exist;
  });

  it('correctly parses % CSS strings', () => {
    expect(parseCSSUnit('15%')).to.equal('percent');
  });
  it('correctly parses px CSS strings', () => {
    expect(parseCSSUnit('15px')).to.equal('px');
  });
  it('correctly parses rem CSS strings', () => {
    expect(parseCSSUnit('15rem')).to.equal('rem');
  });
  it('correctly parses em CSS strings', () => {
    expect(parseCSSUnit('15em')).to.equal('em');
  });
  it('correctly parses vw CSS strings', () => {
    expect(parseCSSUnit('15vw')).to.equal('vw');
  });
  it('parses unknown CSS strings as percent', () => {
    expect(parseCSSUnit('15monkeybagel')).to.equal('percent');
  });
});
