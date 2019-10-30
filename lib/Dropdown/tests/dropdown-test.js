import React from 'react';
import { beforeEach, it, describe } from '@bigtest/mocha';
import { expect } from 'chai';
import { Interactor } from '@bigtest/interactor';
import DropdownInteractor from './interactor';
import { mount } from '../../../tests/helpers';
import Dropdown from '../Dropdown';
import Button from '../../Button';
import ButtonInteractor from '../../Button/tests/interactor';
import DropdownMenu from '../../DropdownMenu';

describe('Dropdown', () => {
  const dropdown = new DropdownInteractor();
  const menuItem = new ButtonInteractor('#ddItem');
  const page = new Interactor();

  describe('basic functionality', () => {
    beforeEach(async () => {
      const trigger = (triggerRef, toggleMenu, ariaProps) => (
        <Button ref={triggerRef} onClick={toggleMenu} {...ariaProps}>
          Trigger
        </Button>
      );
      await mount(
        <Dropdown
          renderTrigger={trigger}
        >
          <DropdownMenu>
            <Button buttonStyle="menuitem" id="ddItem">Select All</Button>
          </DropdownMenu>
        </Dropdown>
      );
    });

    it('displays the trigger', () => {
      expect(dropdown.triggerDisplayed).to.be.true;
    });

    it('aria-expanded is false', () => {
      expect(dropdown.isOpen).to.equal('false');
    });

    it('menu is hidden', () => {
      expect(menuItem.isVisible).to.be.false;
    });

    describe('clicking the trigger', () => {
      beforeEach(async () => {
        await dropdown.clickTrigger();
      });

      it('displays the dropdown menu', () => {
        expect(dropdown.isOpen).to.equal('true');
        expect(menuItem.isVisible).to.be.true;
      });

      describe('clicking outside of the menu', () => {
        beforeEach(async () => {
          await page.click();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal('false');
          expect(menuItem.isVisible).to.be.false;
        });
      });
    });
  });

  describe('controlled functionality', () => {
    beforeEach(async () => {
      const DropdownHarness = ({ children, ...rest }) => {
        const [open, setOpen] = React.useState(false);

        const toggleMenu = () => {
          setOpen(prevOpen => !prevOpen);
        };

        return (
          <Dropdown open={open} onToggle={toggleMenu} {...rest}>
            {children}
          </Dropdown>
        );
      };

      await mount(
        <DropdownHarness label="controlled">
          <DropdownMenu>
            <Button buttonStyle="menuitem" id="ddItem">Select All</Button>
          </DropdownMenu>
        </DropdownHarness>
      );
    });

    it('displays the trigger', () => {
      expect(dropdown.triggerDisplayed).to.be.true;
    });

    describe('clicking the trigger', () => {
      beforeEach(async () => {
        await dropdown.clickTrigger();
      });

      it('displays the dropdown menu', () => {
        expect(dropdown.isOpen).to.equal('true');
        expect(menuItem.isVisible).to.be.true;
      });

      describe('clicking outside of the menu', () => {
        beforeEach(async () => {
          await page.click();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal('false');
          expect(menuItem.isVisible).to.be.false;
        });
      });

      describe('clicking outside of the menu', () => {
        beforeEach(async () => {
          await page.click();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal('false');
          expect(menuItem.isVisible).to.be.false;
        });
      });
    });
  });

  describe('legacy functionality', () => {
    beforeEach(async () => {
      await mount(
        <Dropdown>
          <Button data-role="toggle">
            Trigger
          </Button>
          <DropdownMenu data-role="menu">
            <Button buttonStyle="menuitem" id="ddItem">Select All</Button>
          </DropdownMenu>
        </Dropdown>
      );
    });

    it('displays the trigger', () => {
      expect(dropdown.triggerDisplayed).to.be.true;
    });

    it('aria-expanded is false', () => {
      expect(dropdown.isOpen).to.equal('false');
    });

    it('menu is hidden', () => {
      expect(menuItem.isVisible).to.be.false;
    });

    describe('clicking the trigger', () => {
      beforeEach(async () => {
        await dropdown.clickTrigger();
      });

      it('displays the dropdown menu', () => {
        expect(dropdown.isOpen).to.equal('true');
        expect(menuItem.isVisible).to.be.true;
      });

      describe('clicking outside of the menu', () => {
        beforeEach(async () => {
          await page.click();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal('false');
          expect(menuItem.isVisible).to.be.false;
        });
      });
    });
  });
});
