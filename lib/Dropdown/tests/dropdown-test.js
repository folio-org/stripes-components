import React from 'react';
import { beforeEach, it, describe } from 'mocha';
import {
  Button as ButtonInteractor,
  Dropdown as Interactor,
  HTML as HtmlInteractor,
  Keyboard as keyboard,
} from '@folio/stripes-testing';

import { expect } from 'chai';
import { mount } from '../../../tests/helpers';
import Dropdown from '../Dropdown';
import Button from '../../Button';
import DropdownMenu from '../../DropdownMenu';
import UncontrolledDropdown from '../UncontrolledDropdown';

const DropdownHarness = ({ children, controlled, ...rest }) => {
  const [open, setOpen] = React.useState(false);
  const toggleMenu = () => setOpen(prevOpen => !prevOpen);

  return (
    <>
      <div id="OverlayContainer" />
      <Dropdown {...(controlled && { open, onToggle: toggleMenu })} {...rest}>
        {typeof children === 'function' ? children({ toggleMenu, open }) : children}
      </Dropdown>
    </>
  );
};

const dropdownOverlay = HtmlInteractor.extend('dropdown menu')
  .selector('div[class^=DropdownMenu]');

describe.only('Dropdown', () => {
  const dropdown = Interactor();
  const overlay = HtmlInteractor({ id: 'OverlayContainer' });
  const ddmenu = dropdownOverlay();

  // describe('basic functionality', () => {
  //   const item = ButtonInteractor('Select All');
  //   let clicked = false;

  //   beforeEach(async () => {
  //     await mount(
  //       <Dropdown
  //         renderTrigger={({ getTriggerProps }) => (
  //           <Button autoFocus {...getTriggerProps()}>
  //             Trigger
  //           </Button>
  //         )}
  //         renderMenu={() => (
  //           <DropdownMenu>
  //             <Button onClick={() => { clicked = true; }}>Select All</Button>
  //           </DropdownMenu>
  //         )}
  //       />
  //     );
  //   });

  //   it('displays the dropdown', async () => {
  //     await dropdown.is({ visible: true });
  //   });

  //   it('is closed', async () => {
  //     await dropdown.is({ open: false });
  //     await !ddmenu.is({ visible: true });
  //   });

  //   describe('using the "choose" action', () => {
  //     describe('on a closed dropdown', () => {
  //       beforeEach(async () => {
  //         await dropdown.choose('Select All');
  //       });

  //       it('fires an "onClick" event', () => {
  //         expect(clicked).to.be.true;
  //       });

  //       it('closes the dropdown', async () => {
  //         await dropdown.is({ open: false });
  //       });
  //     });
  //   });

  //   describe('clicking the trigger', () => {
  //     beforeEach(() => dropdown.toggle());

  //     it('opens the dropdown', async () => {
  //       await dropdown.is({ open: true });
  //       await item.is({ visible: true });
  //     });

  //     describe('clicking/focusing outside of the menu', () => {
  //       beforeEach(async () => {
  //         await document.activeElement.blur();
  //       });

  //       it('closes the dropdown', async () => {
  //         await dropdown.is({ open: false });
  //         await !ddmenu.is({ visible: true });
  //       });

  //       describe('pressing the down arrow', () => {
  //         beforeEach(async () => {
  //           await dropdown.focus();
  //           await keyboard.arrowDown();
  //         });

  //         it('opens the menu', async () => {
  //           await dropdown.is({ open: true });
  //           await item.is({ visible: true });
  //         });

  //         describe('pressing the escape key', () => {
  //           beforeEach(() => keyboard.escape());

  //           it('closes the menu', async () => {
  //             await dropdown.is({ open: false });
  //             await !ddmenu.is({ visible: true });
  //           });
  //         });
  //       });
  //     });

  //     describe('clicking the trigger button again', () => {
  //       beforeEach(() => dropdown.toggle());

  //       it('closes the menu', async () => {
  //         await dropdown.is({ open: false });
  //         await !ddmenu.is({ visible: true });
  //       });
  //     });
  //   });
  // });

  // describe('usePortal prop', () => {
  //   const item = ButtonInteractor('Select All');
  //   const trigger = ButtonInteractor('Trigger');
  //   const testFocusButton = ButtonInteractor('testFocus');

  //   beforeEach(async () => {
  //     await mount(
  //       <>
  //         <div id="OverlayContainer" />
  //         <Dropdown
  //           renderTrigger={({ getTriggerProps }) => (
  //             <Button autoFocus {...getTriggerProps()}>
  //               Trigger
  //             </Button>
  //           )}
  //           usePortal
  //         >
  //           <DropdownMenu>
  //             <Button>Select All</Button>
  //           </DropdownMenu>
  //         </Dropdown>
  //         <Button>testFocus</Button>
  //       </>
  //     );
  //   });

  //   describe('clicking the trigger', () => {
  //     beforeEach(() => dropdown.open());

  //     it('displays the dropdown menu', async () => {
  //       await dropdown.is({ open: true });
  //       await item.is({ visible: true });
  //     });

  //     it('focuses the first menu item', () => item.is({ focused: true }));

  //     describe('focusing the reverse proxy', () => {
  //       beforeEach(async () => {
  //         await overlay.perform(el => el.querySelector('[data-reverse-proxy]').focus());
  //       });

  //       it('focuses the trigger', () => trigger.is({ focused: true }));
  //     });

  //     describe('focusing the forward proxy', () => {
  //       beforeEach(async () => {
  //         await overlay.perform(el => el.querySelector('[data-forward-proxy]').focus());
  //       });

  //       it('focuses the next tabbable item', () => testFocusButton.is({ focused: true }));
  //     });
  //   });
  // });

  describe('menu child API', () => {
    beforeEach(async () => {
      await mount(
        <Dropdown
          renderTrigger={({ getTriggerProps }) => (
            <Button autoFocus {...getTriggerProps()}>
              Trigger
            </Button>
          )}
        >
          <DropdownMenu>
            <Button>Select All</Button>
          </DropdownMenu>
        </Dropdown>
      );
    });

    it('displays the dropdown', async () => {
      await dropdown.is({ visible: true });
    });

    it('initializes a closed dropdown', async () => {
      await dropdown.is({ open: false });
    });

    it.only('initializes a hidden menu', async () => {
      await ddmenu.is({ visible: false });
    });

  //   describe('clicking the trigger', () => {
  //     beforeEach(() => dropdown.toggle());

  //     it('displays the dropdown menu', async () => {
  //       await dropdown.is({ open: true });
  //       await ddmenu.is({ visible: true });
  //     });

  //     describe('clicking outside of the menu', () => {
  //       beforeEach(() => document.activeElement.blur());

  //       it('closes the menu', async () => {
  //         await dropdown.is({ open: false });
  //         await ddmenu.is({ visible: false });
  //       });
  //     });
  //   });
  // });

  // describe('child function => object API', () => {
  //   const item = ButtonInteractor('Test Item');

  //   beforeEach(async () => {
  //     await mount(
  //       <Dropdown
  //         renderTrigger={({ getTriggerProps }) => (
  //           <Button autoFocus {...getTriggerProps()}>
  //             Trigger
  //           </Button>
  //         )}
  //       >
  //         {
  //           () => ({
  //             menu: () => (
  //               <DropdownMenu>
  //                 <Button>Test Item</Button>
  //               </DropdownMenu>
  //             )
  //           })
  //         }
  //       </Dropdown>
  //     );
  //   });

  //   it('displays the dropdown', () => dropdown.is({ visible: true }));

  //   it('initializes a closed dropdown', () => dropdown.is({ open: false }));

  //   it('initializes a hidden menu', () => ddmenu.is({ visible: true }));

  //   describe('clicking the trigger', () => {
  //     beforeEach(() => dropdown.toggle());

  //     it('displays the dropdown menu', async () => {
  //       await dropdown.is({ open: true });
  //       await item.is({ visible: true });
  //     });

  //     describe('clicking outside of the menu', () => {
  //       beforeEach(() => document.activeElement.blur());

  //       it('closes the menu', async () => {
  //         await dropdown.is({ open: false });
  //         await !ddmenu.is({ visible: true });
  //       });
  //     });
  //   });
  // });

  // describe('menu-only render props API', () => {
  //   beforeEach(async () => {
  //     await mount(
  //       <Dropdown
  //         renderTrigger={({ getTriggerProps }) => (
  //           <Button autoFocus {...getTriggerProps()}>
  //             Trigger
  //           </Button>
  //         )}
  //       >
  //         {
  //           ({ open, onToggle }) => (
  //             <DropdownMenu>
  //               <Button onClick={onToggle}>{ open ? 'open' : 'closed'}</Button>
  //             </DropdownMenu>
  //           )
  //         }
  //       </Dropdown>
  //     );
  //   });

  //   it('displays the dropdown', () => dropdown.is({ visible: true }));

  //   it('initializes a closed dropdown', () => dropdown.is({ open: false }));

  //   it('initializes a hidden menu', () => ButtonInteractor('closed').is({ visible: false }));

  //   describe('clicking the trigger', () => {
  //     beforeEach(() => dropdown.toggle());

  //     it('displays the dropdown menu', async () => {
  //       await dropdown.is({ open: true });
  //       await ButtonInteractor('open').is({ visible: true });
  //     });

  //     describe('clicking outside of the menu', () => {
  //       beforeEach(() => document.activeElement.blur());

  //       it('closes the menu', async () => {
  //         await dropdown.is({ open: false });
  //         await !ddmenu.is({ visible: true });
  //       });
  //     });

  //     describe('clicking the item with the onToggleHandler', () => {
  //       beforeEach(() => ButtonInteractor('open').click());

  //       it('closes the menu', async () => {
  //         await dropdown.is({ open: false });
  //         await ButtonInteractor('closed').is({ visible: false });
  //       });
  //     });
  //   });
  // });

  // describe('keyboard navigation', () => {
  //   const item1 = dropdown.find(ButtonInteractor('Select All'));
  //   const item2 = dropdown.find(ButtonInteractor('Select None'));
  //   const item3 = dropdown.find(ButtonInteractor('Select Any'));

  //   beforeEach(async () => {
  //     await mount(
  //       <Dropdown
  //         label="testDropdown"
  //         buttonProps={{ autoFocus: true }}
  //         renderMenu={() => (
  //           <DropdownMenu>
  //             <Button>Select All</Button>
  //             <Button>Select None</Button>
  //             <Button>Select Any</Button>
  //           </DropdownMenu>
  //         )}
  //       />
  //     );
  //   });

  //   it('renders the dropdown', () => dropdown.is({ visible: true }));

  //   describe('pressing down key from the trigger', () => {
  //     beforeEach(() => keyboard.arrowDown());

  //     it('opens the menu', () => dropdown.is({ open: true }));

  //     it('focuses the first item', () => item1.is({ focused: true }));

  //     describe('pressing the down arrow', () => {
  //       beforeEach(() => keyboard.arrowDown());

  //       it('focuses the next item', () => item2.is({ focused: true }));

  //       describe('pressing the up arrow', () => {
  //         beforeEach(() => keyboard.arrowUp());

  //         it('focuses the previous item', () => item1.is({ focused: true }));

  //         describe('pressing the up arrow with first item focused', () => {
  //           beforeEach(() => keyboard.arrowUp());

  //           it('focuses the last item', () => item3.is({ focused: true }));

  //           describe('pressing the home key', () => {
  //             beforeEach(() => keyboard.home());

  //             it('focuses the first item', () => item1.is({ focused: true }));

  //             describe('pressing the end key', () => {
  //               beforeEach(() => keyboard.end());

  //               it('focuses the last item', () => item3.is({ focused: true }));
  //             });
  //           });
  //         });
  //       });
  //     });
  //   });

  //   describe('pressing the up arrow on the trigger', () => {
  //     beforeEach(() => keyboard.arrowUp());

  //     it('focuses the last item in the menu', () => item3.is({ focused: true }));
  //   });
  // });

  // describe('open prop', () => {
  //   const item1 = dropdown.find(ButtonInteractor('Select All'));

  //   beforeEach(async () => {
  //     await mount(
  //       <>
  //         <DropdownHarness
  //           label="testOpenDropdown"
  //           buttonProps={{ autoFocus: true }}
  //           renderMenu={() => (
  //             <DropdownMenu>
  //               <Button>Select All</Button>
  //               <Button>Select None</Button>
  //               <Button>Select Any</Button>
  //             </DropdownMenu>
  //           )}
  //           open
  //         />
  //         <Button>Next Button</Button>
  //       </>
  //     );
  //   });

  //   describe('pressing the down arrow on the trigger of opened menu', () => {
  //     beforeEach(() => keyboard.arrowDown());

  //     it('focuses the first item in the menu', () => item1.is({ focused: true }));
  //   });
  // });

  // describe('disabled prop', () => {
  //   beforeEach(async () => {
  //     const renderMenu = () => (
  //       <DropdownMenu>
  //         <Button>Select All</Button>
  //         <Button>Select None</Button>
  //         <Button>Select Any</Button>
  //       </DropdownMenu>
  //     );

  //     await mount(
  //       <Dropdown
  //         label="testDropdown"
  //         buttonProps={{ autoFocus: true }}
  //         renderMenu={renderMenu}
  //         disabled
  //       />
  //     );
  //   });

  //   describe('clicking the disabled trigger', () => {
  //     beforeEach(() => dropdown.toggle());

  //     it('does not open the menu', () => dropdown.is({ open: false }));
  //   });
  // });

  // describe('controlled functionality', () => {
  //   beforeEach(async () => {
  //     await mount(
  //       <DropdownHarness label="controlled" controlled buttonProps={{ autoFocus: true }}>
  //         <DropdownMenu>
  //           <Button>Select All</Button>
  //         </DropdownMenu>
  //       </DropdownHarness>
  //     );
  //   });

  //   it('displays the dropdown', () => dropdown.is({ visible: true }));

  //   describe('clicking the trigger', () => {
  //     beforeEach(() => dropdown.toggle());

  //     it('opens the dropdown', () => dropdown.is({ open: true }));

  //     describe('clicking outside of the menu', () => {
  //       beforeEach(() => document.activeElement.blur());

  //       it('closes the dropdown', () => dropdown.is({ open: false }));
  //     });
  //   });
  // });

  // describe('legacy functionality', () => {
  //   const item = ButtonInteractor('Select All');
  //   const trigger = ButtonInteractor('Trigger');

  //   beforeEach(async () => {
  //     await mount(
  //       <DropdownHarness tether={{}} controlled>
  //         { ({ onToggle, open }) => [
  //           <Button data-role="toggle" autoFocus>
  //             Trigger
  //           </Button>,
  //           <DropdownMenu data-role="menu" open={open} onToggle={onToggle}>
  //             <Button>Select All</Button>
  //           </DropdownMenu>
  //         ]
  //         }
  //       </DropdownHarness>
  //     );
  //   });

  //   it('displays the dropdown', () => dropdown.is({ visible: true }));

  //   it('initializes a closed dropdown', () => dropdown.is({ open: false }));

  //   it('initializes a hidden menu', () => item.is({ visible: false }));

  //   describe('clicking the trigger', () => {
  //     beforeEach(() => dropdown.toggle());

  //     it('displays the dropdown menu', async () => {
  //       await dropdown.is({ open: true });
  //       await item.is({ visible: true });
  //     });

  //     describe('closing the menu via keyboard', () => {
  //       beforeEach(() => keyboard.escape());

  //       it('closes the menu', async () => {
  //         await dropdown.is({ open: false });
  //         await trigger.is({ focused: true });
  //       });
  //     });

  //     describe('clicking outside of the menu', () => {
  //       beforeEach(() => dropdown.perform(el => el.parentElement.click()));

  //       it('closes the menu', async () => {
  //         await dropdown.is({ open: false });
  //         await item.is({ visible: false });
  //       });
  //     });
  //   });

  //   describe('uncontrolled dropdown', () => {
  //     beforeEach(async () => {
  //       await mount(
  //         <UncontrolledDropdown>
  //           <Button data-role="toggle" autoFocus>
  //             Trigger
  //           </Button>
  //           <DropdownMenu data-role="menu">
  //             <Button autoFocus>Select All</Button>
  //           </DropdownMenu>
  //         </UncontrolledDropdown>
  //       );
  //     });

  //     it('displays the dropdown', () => dropdown.is({ visible: true }));

  //     it('initializes a closed dropdown', () => dropdown.is({ open: false }));

  //     it('initializes a hidden menu', () => item.is({ visible: false }));

  //     describe('clicking the trigger', () => {
  //       beforeEach(() => dropdown.toggle());

  //       it('displays the dropdown menu', async () => {
  //         await dropdown.is({ open: true });
  //         await item.is({ visible: true });
  //       });
  //     });
    // });
  });
});
