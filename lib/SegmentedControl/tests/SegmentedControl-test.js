import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import Button from '../../Button';

import { mountWithContext } from '../../../tests/helpers';

import SegmentedControl from '../SegmentedControl';
import SegmentedControlInteractor from './interactor';


describe('SegmentedControl', () => {
  const segmentedControl = new SegmentedControlInteractor();

  describe('returnChild', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SegmentedControl>
          <div id="dragonfruit"> dragonfruit </div>
        </SegmentedControl>
      );
    });

    it('returns non-button child', () => {
      expect(segmentedControl.isDragonfruitPresent).to.be.true;
    });
  });

  describe('activeId', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SegmentedControl activeId="it">
          <Button id="test"> test </Button>
          <Button id="it"> it </Button>
          <Button id="out"> out </Button>
        </SegmentedControl>
      );
    });

    it('applies correct margin to primary', () => {
      expect(segmentedControl.buttons(1).class).to.include('primary');
    });

    it('applies correct margin to default', () => {
      expect(segmentedControl.buttons(0).class).to.include('default');
      expect(segmentedControl.buttons(2).class).to.include('default');
    });
  });

  describe('onActivate', () => {
    let clicked;
    beforeEach(async () => {
      clicked = null;

      await mountWithContext(
        <SegmentedControl onActivate={item => { clicked = item; }}>
          <Button id="test"> test </Button>
          <Button id="it"> it </Button>
          <Button id="out"> out </Button>
        </SegmentedControl>
      );

      await segmentedControl.buttons(1).click();
    });

    it('calls onActivate', () => {
      expect(clicked).to.deep.equal({ id: 'it' });
    });
  });


  describe('tag', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SegmentedControl tag="div">
          <Button id="test"> test </Button>
        </SegmentedControl>
      );
    });

    it('sets HTML tag for button set', () => {
      expect(segmentedControl.getTagName).to.equal('div');
    });
  });


  describe('class name', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SegmentedControl className="guava" />
      );
    });

    it('adds custom class name', () => {
      expect(segmentedControl.appliedClass).to.include('guava');
    });
  });
});
