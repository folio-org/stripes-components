import {
  Dropdown,
  DropdownMenu,
} from '../../..';

export const HeadingSelect = () => {
  return (
    <Dropdown
      label="Heading"
      buttonProps={{ buttonStyle: 'primary' }}
    >
      <DropdownMenu
        aria-label="heading options"
      >
        <ul>
          <li></li>
          <li><a href="#">Example Link 2</a></li>
        </ul>
      </DropdownMenu>
    </Dropdown>
  );
};

