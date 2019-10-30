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
import UncontrolledDropdown from '../UncontrolledDropdown';


const DropdownHarness = ({ children, ...rest }) => {
  const [open, setOpen] = React.useState(false);

  const toggleMenu = () => {
    setOpen(prevOpen => !prevOpen);
  };

  return (
    <Dropdown open={open} onToggle={toggleMenu} {...rest}>
      {typeof children === 'function' ? children(toggleMenu) : children}
    </Dropdown>
  );
};

describe('Dropdown', () => {
  const dropdown = new DropdownInteractor();
  const menuItem = new ButtonInteractor('#ddItem');
  const page = new Interactor();

  describe('basic functionality', () => {
    beforeEach(async () => {
      const trigger = (triggerRef, toggleMenu, ariaProps, keyHandler) => (
        <Button autoFocus ref={triggerRef} onClick={toggleMenu} onKeyDown={keyHandler} {...ariaProps}>
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

        describe('pressing the down arrow', () => {
          beforeEach(async () => {
            await dropdown.pressDownKey();
          });

          it('opens the menu', () => {
            expect(dropdown.isOpen).to.equal('true');
            expect(menuItem.isVisible).to.be.true;
          });

          describe('pressing the escape key', () => {
            beforeEach(async () => {
              await dropdown.pressEscape();
            });

            it('closes the menu', () => {
              expect(dropdown.isOpen).to.equal('false');
              expect(menuItem.isVisible).to.be.false;
            });
          });
        });
      });
    });
  });

  describe('controlled functionality', () => {
    beforeEach(async () => {
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
        <DropdownHarness tether={{}}>
          { onToggle => [
            <Button data-role="toggle" autoFocus>
              Trigger
            </Button>,
            <DropdownMenu data-role="menu" onToggle={onToggle}>
              <Button buttonStyle="menuitem" id="ddItem" autoFocus>Select All</Button>
            </DropdownMenu>
          ]
          }
        </DropdownHarness>
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

      describe('closing the menu via keyboard', () => {
        beforeEach(async () => {
          await dropdown.pressEscape();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal('false');
          expect(dropdown.triggerFocused).to.be.true;
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

    describe('uncontrolled dropdown', () => {
      beforeEach(async () => {
        mount(
          <UncontrolledDropdown>
            <Button data-role="toggle" autoFocus>
              Trigger
            </Button>
            <DropdownMenu data-role="menu">
              <Button buttonStyle="menuitem" id="ddItem" autoFocus>Select All</Button>
            </DropdownMenu>
          </UncontrolledDropdown>
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
      });
    });
  });
});
