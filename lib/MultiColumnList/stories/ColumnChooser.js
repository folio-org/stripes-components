import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import MultiColumnList from '../MultiColumnList';
import Dropdown from '../../Dropdown';
import DropdownButton from '../../DropdownButton';
import Checkbox from '../../Checkbox';
import DropdownMenu from '../../DropdownMenu';
import { Row, Col } from '../../LayoutGrid';
import { asyncGenerate, syncGenerate } from './service';

export default class ColumnChooser extends React.Component {
  constructor() {
    super();
    this.state = {
      data: syncGenerate(100, 0),
      columns: ['title', 'email'],
      menuOpen: false,
    };

    this.possibleColumns = [
      'title',
      'active',
      'index',
      'date',
      'email',
    ];
  }

  requestMore = async (amount, index) => {
    const newData = await asyncGenerate(amount, index, 1000);
    this.setState(curState => ({
      data: [...curState.data, ...newData]
    }));
  }

  onToggleColumnMenu = () => {
    this.setState(curState => {
      return {
        menuOpen: !curState.menuOpen
      };
    });
  }

  updateColumns = (e) => {
    const column = e.target.value;
    if (e.target.checked) {
      this.setState(curState => {
        return {
          columns: [...curState.columns, column]
        };
      });
    } else {
      const columnIndex = this.state.columns.findIndex((col) => col === column);
      if (columnIndex !== -1) {
        this.setState(curState => {
          const newColumns = cloneDeep(curState.columns);
          newColumns.splice(columnIndex, 1);
          return {
            columns: newColumns
          };
        });
      }
    }
  }

  render() {
    const { data, columns, menuOpen } = this.state;
    const visibleColumns = this.possibleColumns.filter((col) => {
      return columns.includes(col);
    });

    return (
      <>
        <Row>
          <Col>
            <Dropdown
              id="chooseColumnDropdown"
              open={menuOpen}
              onToggle={this.onToggleColumnMenu}
            >
              <DropdownButton
                data-role="toggle"
                open={menuOpen}
              >
                {'Choose columns'}
              </DropdownButton>
              <DropdownMenu
                data-role="menu"
                aria-label="column menu"
                onToggle={this.onToggleColumnMenu}
              >
                <ul>
                  { this.possibleColumns.map((col) => {
                    return (
                      <li key={col}>
                        <Checkbox
                          value={col}
                          label={col}
                          onChange={this.updateColumns}
                          checked={this.state.columns.includes(col)}
                        />
                      </li>
                    );
                  })}
                </ul>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
        <div style={{ height: '400px', width: '600px' }}>
          <MultiColumnList
            contentData={data}
            visibleColumns={visibleColumns}
            autosize
            virtualize
          />
        </div>
      </>
    );
  }
}
