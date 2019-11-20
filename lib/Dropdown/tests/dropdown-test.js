import React from 'react';
import { beforeEach, it, describe } from '@bigtest/mocha';
import { expect } from 'chai';
import { Interactor } from '@bigtest/interactor';
import DropdownInteractor, { DropdownMenuInteractor } from './interactor';
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
      {typeof children === 'function' ? children({ toggleMenu, open }) : children}
    </Dropdown>
  );
};

describe('Dropdown', () => {
  const dropdown = new DropdownInteractor();
  const menuItem = new ButtonInteractor('#ddItem');
  const menu = new DropdownMenuInteractor('#menu');
  const page = new Interactor();

  describe('basic functionality', () => {
    beforeEach(async () => {
      const trigger = ({ getTriggerProps }) => (
        <Button autoFocus {...getTriggerProps()}>
          Trigger
        </Button>
      );

      const renderMenu = () => (
        <DropdownMenu id="menu">
          <Button buttonStyle="dropdownItem" id="ddItem">Select All</Button>
        </DropdownMenu>
      );
      await mount(
        <Dropdown
          renderTrigger={trigger}
          renderMenu={renderMenu}
        />
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
              await menu.items(0).pressEscape();
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

  describe('menu child API', () => {
    beforeEach(async () => {
      const trigger = ({ getTriggerProps }) => (
        <Button autoFocus {...getTriggerProps()}>
          Trigger
        </Button>
      );

      await mount(
        <Dropdown
          renderTrigger={trigger}
        >
          <DropdownMenu id="menu">
            <Button buttonStyle="dropdownItem" id="ddItem">Select All</Button>
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

  describe('menu render props API', () => {
    beforeEach(async () => {
      const trigger = ({ getTriggerProps }) => (
        <Button autoFocus {...getTriggerProps()}>
          Trigger
        </Button>
      );

      await mount(
        <Dropdown
          renderTrigger={trigger}
        >
          {
            () => ({
              menu: () => (
                <DropdownMenu id="menu">
                  <Button buttonStyle="dropdownItem" id="ddItem">Test Item</Button>
                </DropdownMenu>
              )
            })
          }
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

  describe('menu render props API', () => {
    beforeEach(async () => {
      const trigger = ({ getTriggerProps }) => (
        <Button autoFocus {...getTriggerProps()}>
          Trigger
        </Button>
      );

      await mount(
        <Dropdown
          renderTrigger={trigger}
        >
          {
            ({ open, onToggle }) => (
              <DropdownMenu id="menu">
                <Button buttonStyle="dropdownItem" onClick={onToggle} id="ddItem">{ open && 'open' }</Button>
              </DropdownMenu>
            )
          }
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

      describe('clicking the item with the onToggleHandler', () => {
        beforeEach(async () => {
          await menuItem.click();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal('false');
          expect(menuItem.isVisible).to.be.false;
        });
      });
    });
  });

  describe('keyboard operation', () => {
    beforeEach(async () => {
      const renderMenu = () => (
        <DropdownMenu id="menu">
          <Button buttonStyle="dropdownItem" id="ddItem0">Select All</Button>
          <Button buttonStyle="dropdownItem" id="ddItem1">Select None</Button>
        </DropdownMenu>
      );

      mount(
        <Dropdown
          label="testDropdown"
          buttonProps={{ autoFocus: true }}
          renderMenu={renderMenu}
        />
      );
    });

    it('renders the trigger', () => {
      expect(dropdown.triggerDisplayed).to.be.true;
    });

    describe('opening the menu from the trigger', () => {
      beforeEach(async () => {
        await dropdown.pressDownKey();
      });

      it('opens the menu', () => {
        expect(dropdown.isOpen).to.equal('true');
      });

      it('focuses the first item', () => {
        expect(menu.items(0).isFocused).to.be.true;
      });

      describe('pressing the down arrow', () => {
        beforeEach(async () => {
          await menu.items(0).pressDownKey();
        });

        it('focuses the next item', () => {
          expect(menu.items(1).isFocused).to.be.true;
        });

        describe('pressing the up arrow', () => {
          beforeEach(async () => {
            await menu.items(1).pressUpKey();
          });

          it('focuses the previous item', () => {
            expect(menu.items(0).isFocused).to.be.true;
          });

          describe('pressing the up arrow with first item focused', () => {
            beforeEach(async () => {
              await menu.items(0).pressUpKey();
            });

            it('closes the menu', () => {
              expect(dropdown.isOpen).to.equal('false');
            });

            it('focuses the trigger', () => {
              expect(dropdown.triggerFocused).to.be.true;
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
            <Button buttonStyle="dropdownItem" id="ddItem">Select All</Button>
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
    });
  });

  describe('legacy functionality', () => {
    beforeEach(async () => {
      await mount(
        <DropdownHarness tether={{}}>
          { ({ onToggle, open }) => [
            <Button data-role="toggle" autoFocus>
              Trigger
            </Button>,
            <DropdownMenu data-role="menu" id="menu" open={open} onToggle={onToggle}>
              <Button buttonStyle="dropdownItem" id="ddItem">Select All</Button>
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
          await menu.items(0).pressEscape();
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
              <Button buttonStyle="dropdownItem" id="ddItem" autoFocus>Select All</Button>
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
