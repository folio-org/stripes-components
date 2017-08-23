# Dropdown

* [Overview](#overview)
* [Props](#props)
* [Basic Usage](#basic-usage)
* [Advanced Usage](#advanced-usage)

## Overview

Hey ,I was told we have a new component what is it about?

**-Yeah ,we have our own DropDown component now (a toggleable, contextual overlays for displaying lists of links and more).**

Cool.I'm using the react bootstrap .Is this a replacement for that?

**-Yes,Exactly.But u may need to update some props along with pulling in the new stripes components version**

Oh,Props change.How big are the changes?

**-Here is the [basic usage](#basic-usage) example and [props](#props) that are availble.We have two ways of usign the the dropdown now.**

Umm two ways what for?

**-Yes , so that styling on the parent div doesn't crop the drowpdown menu and u go like what just happened .As an example overflow:hidden on panes are causing that issue.**

Ohhk WOW!! what is the solution you came up with?

**-Tether!!**

Tether wha-now ?

**-[Tether](http://tether.io/) is a pretty cool library .Its A client-side library to make absolutely positioned elements attach to elements in the page efficiently.And we have react supported modules called [React-tether](https://github.com/souporserious/react-tether) which is what we used. [Here is an example for that](#advanced-usage).**

Ahh cool thank you I will try those implementation out.Thanks for the breif discussion.

**-You are welcome .Let us know if you find any bugs.**

## Props

| **Name**        | **Type**           | **Default**  | **Description**
| ------------- |:-------------:| -----:|------------:|
| open      | bool | false |  current state for items like dropdown, popover, tooltip   |
| id      | one of: "string" ,"number"      |   |   An html id attribute, necessary for assistive technologies, such as screen readers. |
| onToggle | function      |   |   callback for toggling open in the controlling component    |
| group      | bool | false |          |
| tag      | string      |  div |   customize component output by passing in an element name or Component                   |
| tether | object      |   |     for absolute postioning see the advanced example                                   |
| disabled | bool      |   |                                        |
| pullRight | bool      |   |                                        |

## Basic Usage
```js 
  render() {
     const permissionsDD = (
      <ul>
        <li><a onClick={this.onToggleAddPermDD} href='#'>XXXX</a></li>
        <li><a href='#'>YYYY</a></li>
        <li><a href='#'>ZZZZ</a></li>
      </ul>
    );
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle='Hosting'>
          <div style={{height:'200px'}}>
           <Col id ="test" className="example">
            <button>another button</button>
            <Dropdown group style={{ float: 'right' }}  pullRight id="AddPermissionDropdown" open={this.state.open} onToggle={this.onToggleAddPermDD}>
              <Button  align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Add Permission</Button>
                <DropdownMenu
                  data-role="menu"
                  aria-label="available permissions"
                  onToggle={this.onToggleAddPermDD}
                >{permissionsDD}</DropdownMenu>
              </Dropdown>
            </Col>
          </div>
         </Pane>
    );
  }
```

## Advanced Usage

```js 
render() {
      const tether = {
       renderElementTo: `#test>button[data-role="toggle"]`,
       classPrefix:"permissions",
     }//For more options go to(http://tether.io/#options)
     const permissionsDD = (
      <ul>
        <li><a onClick={this.onToggleAddPermDD} href='#'>XXXXX</a></li>
        <li><a href='#'>YYYY</a></li>
        <li><a href='#'>ZZZZ</a></li>
      </ul>
    );
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle='whatever'>
        <div style={{height:'200px'}}>
           <Col id ="test" className="example">
            <Dropdown tether={tether} id="AddPermissionDropdown" open={this.state.open} onToggle={this.onToggleAddPermDD}>
              <Button style={{ float: 'right' }} align="end" bottomMargin0 data-role="toggle" aria-haspopup="true">&#43; Add Permission</Button>
                <DropdownMenu
                  data-role="menu"
                  aria-label="available permissions"
                  onToggle={this.onToggleAddPermDD}
                >{permissionsDD}</DropdownMenu>
              </Dropdown>
            </Col>
          </div>
        </Pane>
    );
  }
```

## Improtant Notes
**--Need to make sure we add data-role attribute for the child components like the toggle button and DropDownMenu.
For reference see the examples**
