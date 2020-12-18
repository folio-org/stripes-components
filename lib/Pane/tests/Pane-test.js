import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { Pane as Interactor, TextField as TextFieldInteractor, Button as ButtonInteractor } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';

import Paneset from '../../Paneset';
import Pane from '../Pane';
import Button from '../../Button';

describe('Pane', () => {
  describe('General usage', () => {
    const pane = Interactor();
    const title = 'title';
    const subtitle = 'subtitle';

    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane
            defaultWidth="fill"
            paneTitle={title}
            paneSub={subtitle}
          />
        </Paneset>
      );
    });

    it('renders the pane', () => pane.is({ visible: true }));

    it('should have correct header title', () => pane.has({ title }));

    it('should have correct header sub title', () => pane.has({ subtitle }));
  });

  describe('Dismissible pane', () => {
    const firstPane = Interactor({ index: 0 });
    const dismissPane = Interactor({ id: 'dismissible' });
    let closed = false;

    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane
            defaultWidth="fill"
          />
          <Pane
            id="dismissible"
            defaultWidth="50%"
            dismissible
            onClose={() => { closed = true; }}
          />
        </Paneset>
      );
    });

    it('renders', () => dismissPane.is({ visible: true }));

    it('dismiss button is present', () => dismissPane.has({ visible: true }));

    describe('clicking the dismiss button', () => {
      beforeEach(async () => {
        await dismissPane.dismiss();
      });

      it('calls the onClose handler', () => {
        expect(closed).to.be.true;
      });

      it('first pane still exists', () => firstPane.exists());
    });
  });

  describe('Pane with transition, height props', () => {
    const firstPane = Interactor({ index: 0 });
    const heightPane = Interactor({ id: 'heightpane' });

    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane
            defaultWidth="fill"
            dismissible
          />
          <Pane
            id="heightpane"
            defaultWidth="50%"
            transition="slide"
            dismissible
            height="500px"
          />
        </Paneset>
      );
    });

    it('renders', async () => {
      await firstPane.is({ visible: true });
      await heightPane.is({ visible: true });
    });
  });

  describe('Pane with transition, height props', () => {
    const heightPane = Interactor({ id: 'heightpane' });
    let content = 'two panes open';

    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane
            defaultWidth="fill"
            paneTitle={content}
            dismissible
          >
            <p>{content}</p>
          </Pane>
          <Pane
            id="heightpane"
            defaultWidth="50%"
            transition="slide"
            dismissible
            height="500px"
            onClose={() => { content = 'one pane open'; }}
          />
        </Paneset>
      );
    });

    it('renders', () => heightPane.is({ visible: true }));

    describe('dismissing the pane with transition', () => {
      beforeEach(async () => {
        // note, this actually gets handled by the <Paneset />
        await heightPane.dismiss();
      });

      it('calls the onClose handler', async () => {
        // the `onClose` function runs after 300ms timeout within
        // the Paneset handleClose function
        return new Promise((resolve) => {
          setTimeout(resolve, 350, 'one');
        }).then(() => {
          Interactor('one pane open').exists();
        });
      });
    });
  });

  describe('Dismissible pane with internal buttons', () => {
    const firstPane = Interactor({ index: 0 });
    const secondPane = Interactor({ index: 1 });

    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane
            defaultWidth="fill"
            transition="slide"
            dismissible
          >
            <Button />
            <Button />
          </Pane>
          <Pane
            defaultWidth="50%"
            transition="slide"
            dismissible
          >
            <Button />
            <Button />
          </Pane>
        </Paneset>
      );
    });

    it('dismiss button is present', async () => {
      await firstPane.find(ButtonInteractor({ ariaLabel: 'Close ' })).has({ visible: true });
      await secondPane.find(ButtonInteractor({ ariaLabel: 'Close ' })).has({ visible: true });
    });

    describe('clicking the dismiss button', () => {
      beforeEach(async () => {
        await firstPane.dismiss();
      });

      it('second pane is now the first', async () => {
        await firstPane.exists();
        await secondPane.absent();
      });
    });
  });

  describe('content width, focus method coverage', () => {
    const fluidpane = Interactor({ id: 'fluidpane' });
    const fluidpane2 = Interactor({ id: 'fluidpane2' });
    const fluidpane3 = Interactor({ index: 2 });
    const input2 = fluidpane2.find(TextFieldInteractor());
    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Pane id="fluidpane" defaultWidth="fill" fluidContentWidth={false}>
            <p>Some Content</p>
            <input type="text" id="input" />
            <button type="button">Content button 1</button>
          </Pane>
          <Pane id="fluidpane2" defaultWidth="50%" transition="slide" fluidContentWidth={false}>
            <p>Some Content</p>
            <input type="text" id="input2" />
            <button type="button">Content button 2</button>
          </Pane>
          <Pane id="fluidpane3" defaultWidth="25%" transition="slide" fluidContentWidth>
            <p>Some Content</p>
            <input type="text" id="input3" />
            <button type="button">Content button 3</button>
          </Pane>
        </Paneset>
      );
    });

    it('renders the pane', async () => {
      await fluidpane.is({ visible: true });
      await fluidpane2.is({ visible: true });
      await fluidpane3.is({ visible: true });
    });

    describe('focusing within a pane', () => {
      beforeEach(async () => {
        await input2.focus();
      });

      it('focuses input', () => input2.is({ focused: true }));
    });
  });
});
