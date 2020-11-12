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
import { getNextFocusable, getPreviousFocusable, getLastFocusable } from '../../../util/getFocusableElements';

const DropdownHarness = ({ children, usePortal, controlled, ...rest }) => {
  const [open, setOpen] = React.useState(false);
  const [forced, forceUpdate] = React.useState(0);

  const toggleMenu = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const portalEl = document.getElementById('OverlayContainer');

  if (usePortal && portalEl === null) {
    // if we don't find the portal element, try up to 5 times.
    // This resolves an issue of not finding the portal where the portalElement and the overlay are mounted simultaneously.
    if (forced < 5) {
      setTimeout(() => forceUpdate(update => update + 1));
      return null;
    }
  }

  const dropdownProps = {};
  if (controlled) {
    dropdownProps.open = open;
    dropdownProps.onToggle = toggleMenu;
  }

  return (
    <>
      <div id="OverlayContainer" />
      <button id="otherButton" type="button">button</button>
      <Dropdown {...dropdownProps} usePortal={usePortal} {...rest}>
        {typeof children === 'function' ? children({ toggleMenu, open }) : children}
      </Dropdown>
    </>
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
        <>
          <Dropdown
            renderTrigger={trigger}
            renderMenu={renderMenu}
          />
          <button type="button" id="testButton">test</button>
        </>
      );
    });

    it('displays the trigger', () => {
      expect(dropdown.triggerDisplayed).to.be.true;
    });

    it('menu is hidden', () => {
      expect(dropdown.menu.isVisible).to.be.false;
    });

    describe('clicking the trigger', () => {
      beforeEach(async () => {
        await dropdown.clickTrigger();
      });

      it('displays the dropdown menu', () => {
        expect(dropdown.isOpen).to.be.true;
      });

      describe('clicking/focusing outside of the menu', () => {
        beforeEach(async () => {
          // focus body/reset activeElement.
          await menuItem.$root.focus();
          await document.getElementById('testButton').focus();
        });

        it('closes the menu', () => {
          // expect(dropdown.isOpen).to.equal(false);
          expect(dropdown.isOpen).to.equal(false);
        });

        describe('pressing the down arrow', () => {
          beforeEach(async () => {
            await dropdown.pressDownKey();
          });

          it('opens the menu', () => {
            expect(dropdown.isOpen).to.equal(true);
          });

          describe('pressing the escape key', () => {
            beforeEach(async () => {
              await menu.items(0).pressEscape();
            });

            it('closes the menu', () => {
              expect(dropdown.isOpen).to.equal(false);
            });
          });
        });
      });

      describe('clicking the toggle button again', () => {
        beforeEach(async () => {
          await dropdown.clickTrigger();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal(false);
        });
      });
    });
  });

  describe('usePortal prop', () => {
    const testFocusButton = new Interactor('#testFocusButton');
    const portalMenu = new DropdownMenuInteractor('#OverlayContainer');

    beforeEach(async () => {
      const trigger = ({ getTriggerProps }) => (
        <Button autoFocus {...getTriggerProps()}>
          Trigger
        </Button>
      );

      await mount(
        <>
          <div id="OverlayContainer" />
          <Dropdown
            renderTrigger={trigger}
            usePortal
          >
            <DropdownMenu id="menu">
              <Button buttonStyle="dropdownItem" id="ddItem">Select All</Button>
            </DropdownMenu>
          </Dropdown>
          <Button id="testFocusButton">testFocus</Button>
        </>
      );
    });

    describe('clicking the trigger', () => {
      beforeEach(async () => {
        await dropdown.clickTrigger();
      });

      it('displays the dropdown menu', () => {
        expect(dropdown.isOpen).to.equal(true);
        expect(portalMenu.items(0).isVisible).to.be.true;
      });

      it('focuses the first menu item', () => {
        expect(portalMenu.items(0).isFocused).to.be.true;
      });

      describe('focusing the reverse proxy', () => {
        beforeEach(async () => {
          await portalMenu.focusStartProxy();
        });

        it('focuses the trigger', () => {
          expect(dropdown.triggerFocused).to.be.true;
        });

        describe('focusing the forward proxy', () => {
          beforeEach(async () => {
            await portalMenu.focusEndProxy();
          });

          it('focuses the next tabbable item', () => {
            expect(testFocusButton.$root.id).to.equal(document.activeElement.id);
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
        <>
          <button id="testButton" type="button">test</button>
          <Dropdown
            renderTrigger={trigger}
          >
            <DropdownMenu id="menu">
              <Button buttonStyle="dropdownItem" id="ddItem">Select All</Button>
            </DropdownMenu>
          </Dropdown>
        </>
      );
    });

    it('displays the trigger', () => {
      expect(dropdown.triggerDisplayed).to.be.true;
    });

    it('aria-expanded is false', () => {
      expect(dropdown.isOpen).to.equal(false);
    });

    it('menu is hidden', () => {
      expect(menuItem.isVisible).to.be.false;
    });

    describe('clicking the trigger', () => {
      beforeEach(async () => {
        await dropdown.clickTrigger();
      });

      it('displays the dropdown menu', () => {
        expect(dropdown.isOpen).to.equal(true);
      });

      describe('clicking outside of the menu', () => {
        beforeEach(async () => {
          await document.getElementById('testButton').click();
          await document.getElementById('testButton').focus();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal(false);
        });
      });
    });
  });

  describe('child function => object API', () => {
    const spareButton = new Interactor('#testButton');
    beforeEach(async () => {
      const trigger = ({ getTriggerProps }) => (
        <Button autoFocus {...getTriggerProps()}>
          Trigger
        </Button>
      );

      await mount(
        <>
          <button id="testButton" type="button">button</button>
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
        </>
      );
    });

    it('displays the trigger', () => {
      expect(dropdown.triggerDisplayed).to.be.true;
    });

    it('aria-expanded is false', () => {
      expect(dropdown.ariaExpandedAttribute).to.equal('false');
    });

    it('menu is hidden', () => {
      expect(menuItem.isVisible).to.be.false;
    });

    describe('clicking the trigger', () => {
      beforeEach(async () => {
        await dropdown.clickTrigger();
      });

      it('displays the dropdown menu', () => {
        expect(dropdown.isOpen).to.equal(true);
        expect(menuItem.isVisible).to.be.true;
      });

      describe('clicking/focusing outside of the menu', () => {
        beforeEach(async () => {
          await menu.when(() => menuItem.isFocused);
          await spareButton.$root.focus();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal(false);
        });
      });
    });
  });

  describe('menu-only render props API', () => {
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
      expect(dropdown.isOpen).to.equal(false);
    });

    it('menu is hidden', () => {
      expect(menuItem.isVisible).to.be.false;
    });

    describe('clicking the trigger', () => {
      beforeEach(async () => {
        await dropdown.clickTrigger();
      });

      it('displays the dropdown menu', () => {
        expect(dropdown.isOpen).to.equal(true);
        expect(menuItem.isVisible).to.be.true;
      });

      describe('clicking outside of the menu', () => {
        beforeEach(async () => {
          await document.activeElement.blur();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal(false);
          expect(menuItem.isVisible).to.be.false;
        });
      });

      describe('clicking the item with the onToggleHandler', () => {
        beforeEach(async () => {
          await menuItem.click();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal(false);
          expect(menuItem.isVisible).to.be.false;
        });
      });
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(async () => {
      const renderMenu = () => (
        <DropdownMenu id="menu">
          <Button buttonStyle="dropdownItem" id="ddItem0">Select All</Button>
          <Button buttonStyle="dropdownItem" id="ddItem1">Select None</Button>
          <Button buttonStyle="dropdownItem" id="ddItem2">Select Any</Button>
        </DropdownMenu>
      );

      await mount(
        <Dropdown
          label="testDropdown"
          renderMenu={renderMenu}
          buttonProps={{ autoFocus: true }}
        />
      );
    });

    it('renders the trigger', () => {
      expect(dropdown.triggerDisplayed).to.be.true;
    });

    describe('pressing down key from the trigger', () => {
      let focusTarget;
      beforeEach(async () => {
        await dropdown.when(() => dropdown.triggerFocused === true);
        await dropdown.pressDownKey();
      });

      it('opens the menu', () => {
        expect(dropdown.isOpen).to.equal(true);
      });

      it('focuses the first item', () => {
        expect(menu.items(0).isFocused).to.be.true;
      });

      describe('pressing the down arrow', () => {
        beforeEach(async () => {
          await menu.when(() => menu.items(0).isFocused);
          await menu.items(0).pressDownKey();
        });

        it('focuses the next item', () => {
          expect(menu.items(1).isFocused).to.be.true;
        });

        describe('pressing the up arrow', () => {
          beforeEach(async () => {
            await menu.when(() => menu.items(1).isFocused);
            await menu.items(1).pressUpKey();
          });

          it('focuses the previous item', () => {
            expect(menu.items(0).isFocused).to.be.true;
          });

          describe('pressing the home key', () => {
            beforeEach(async () => {
              await menu.items(2).pressHomeKey();
            });

            it('focuses the first item', () => {
              expect(menu.items(0).isFocused).to.be.true;
            });

            describe('pressing the end key', () => {
              beforeEach(async () => {
                await menu.items(0).pressEndKey();
              });

              it('focuses the first item', () => {
                expect(menu.items(2).isFocused).to.be.true;
              });
            });
          });
        });
      });
    });
  });

  describe('open prop', () => {
    beforeEach(async () => {
      const renderMenu = () => (
        <DropdownMenu id="menu">
          <Button buttonStyle="dropdownItem" id="ddItem0">Select All</Button>
          <Button buttonStyle="dropdownItem" id="ddItem1">Select None</Button>
          <Button buttonStyle="dropdownItem" id="ddItem2">Select Any</Button>
        </DropdownMenu>
      );

      await mount(
        <>
          <div id="OverlayContainer" />
          <DropdownHarness
            label="testOpenDropdown"
            renderMenu={renderMenu}
            open
          />
          <Button>Next Button</Button>
        </>
      );
      await dropdown.focusTrigger();
    });

    describe('pressing the down arrow on the trigger of opened menu', () => {
      beforeEach(async () => {
        await dropdown.focusTrigger();
        await dropdown.pressDownKey();
      });

      it('focuses the first item in the menu', () => {
        expect(menu.items(0).isFocused).to.be.true;
      });
    });
  });

  describe('disabled prop', () => {
    beforeEach(async () => {
      const renderMenu = () => (
        <DropdownMenu id="menu">
          <Button buttonStyle="dropdownItem" id="ddItem0">Select All</Button>
          <Button buttonStyle="dropdownItem" id="ddItem1">Select None</Button>
          <Button buttonStyle="dropdownItem" id="ddItem2">Select Any</Button>
        </DropdownMenu>
      );

      await mount(
        <Dropdown
          label="testDropdown"
          buttonProps={{ autoFocus: true }}
          renderMenu={renderMenu}
          disabled
        />
      );
    });

    describe('clicking the disabled trigger', () => {
      beforeEach(async () => {
        await dropdown.clickTrigger();
      });

      it('does not open the menu', () => {
        expect(dropdown.isOpen).to.equal(false);
      });
    });

    describe('pressing down key from the trigger', () => {
      beforeEach(async () => {
        await dropdown.pressDownKey();
      });

      it('does not open the menu', () => {
        expect(dropdown.isOpen).to.equal(false);
      });
    });
  });

  describe('controlled functionality', () => {
    beforeEach(async () => {
      await mount(
        <DropdownHarness label="controlled" controlled buttonProps={{ autoFocus: true }}>
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
        await dropdown.focusTrigger();
        await dropdown.clickTrigger();
      });

      it('displays the dropdown menu', () => {
        expect(dropdown.isOpen).to.equal(true);
      });

      describe('clicking/focus outside of the menu', () => {
        beforeEach(async () => {
          await document.getElementById('otherButton').click();
          await document.getElementById('otherButton').focus();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal(false);
        });
      });
    });
  });

  describe('legacy functionality', () => {
    beforeEach(async () => {
      await mount(
        <>
        <button id="testButton" type="button">test</button>
        <DropdownHarness tether={{}} controlled>
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
        </>
      );
    });

    it('displays the trigger', () => {
      expect(dropdown.triggerDisplayed).to.be.true;
    });

    it('aria-expanded is false', () => {
      expect(dropdown.ariaExpandedAttribute).to.equal('false');
    });

    it('menu is hidden', () => {
      expect(dropdown.menu.isVisible).to.be.false;
    });

    describe('clicking the trigger', () => {
      beforeEach(async () => {
        await dropdown.clickTrigger();
      });

      it('displays the dropdown menu', () => {
        expect(dropdown.isOpen).to.equal(true);
        expect(menuItem.isVisible).to.be.true;
      });

      describe('closing the menu via keyboard', () => {
        beforeEach(async () => {
          await menu.items(0).pressEscape();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal(false);
          expect(dropdown.triggerFocused).to.be.true;
        });
      });

      describe('clicking outside of the menu', () => {
        beforeEach(async () => {
          await document.getElementById('testButton').click();
        });

        it('closes the menu', () => {
          expect(dropdown.isOpen).to.equal(false);
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
        expect(dropdown.isOpen).to.equal(false);
      });

      it('menu is hidden', () => {
        expect(menuItem.isVisible).to.be.false;
      });

      describe('clicking the trigger', () => {
        beforeEach(async () => {
          await dropdown.clickTrigger();
        });

        it('displays the dropdown menu', () => {
          expect(dropdown.isOpen).to.equal(true);
          expect(menuItem.isVisible).to.be.true;
        });
      });
    });
  });
});
