import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';
//What else should I import?

import SegmentedControl from "../SegmentedControl"; // eslint-disable-line no-unused-vars
import SegmentedControlInteractor from './interactor';

describe('SegmentedControl', () => {
    const segmentedControl = new SegmentedControlInteractor();

    describe('with an id', () => {
        beforeEach(async () => {
            await mount(<SegmentedControl id="segmentedControl-test" />)
        });
                //What's this? Do I need it?^

        it('has an id', () => {
            expect(SegmentedControl.id).to.equal('segmentedControl-test');
            //Does this need to happen?^
        });
    });

    describe('first button in nav', () => {
        beforeEach(async () => {
            await mount(
                child.type == Button
                i == 0
            );
        });

        it('applies last border and no right radius', () => {
            expect(childRadius).to.equal('noRightRadius lastBorderOnly');
        });
    });

    describe('only button in nav', () => {
        beforeEach(async () => {
            await mount(
                child.type == Button
                i == 0 && lastIndex
            );
        });

        it('applies standard radius', () => {
            expect(childRadius).to.equal('');
        });
    });

    describe('last button in nav', () => {
        beforeEach(async () => {
            await mount(
                child.type == Button
                i == lastIndex
            );
        });

        it('applies no left radius', () => {
            expect(childRadius).to.equal('noLeftRadius');
        });
    });
    
    describe('any button in nav', () => {
        beforeEach(async () => {
            await mount(
                child.type == Button
                i == lastIndex
                // is this right?
            );
        });

        it('applies last border and no radius', () => {
            expect(childRadius).to.equal('noRadius lastBorderOnly');
        });
    });

});
