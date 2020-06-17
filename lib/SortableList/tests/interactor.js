import {
  collection,
  focusable,
  triggerable,
  interactor,
  isPresent,
  scoped,
  text,
} from '@bigtest/interactor';

@interactor class DraggableRow {
  focus = focusable();
  cols = collection('[role="gridcell"]');

  pressSpace = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 32,
    which: 32,
  });

  pressArrowUp = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 38,
    key: 'ArrowUp',
  });

  pressArrowDown = triggerable('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 40,
    key: 'ArrowDown',
  });
}

@interactor class SortableListInteractor {
  log = text('[role="log"]');
  logPresent = isPresent('[role="log"]');
  rows = collection('[data-test-draggable-row]', DraggableRow);

  row = scoped('#row-1', DraggableRow);

  liftRow() {
    return this
      .row.focus()
      .row.pressSpace()
      .whenRowLifted();
  }

  moveRowUp() {
    return this
      .row
      .pressArrowUp()
      .whenRowMoved();
  }

  moveRowDown() {
    return this
      .row
      .pressArrowDown()
      .whenRowMoved();
  }

  dropRow() {
    return this
      .row
      .pressSpace()
      .whenRowDropped();
  }

  whenRowLifted() {
    return this.when(() => !!this.log.match(/You have lifted an item/i));
  }

  whenRowMoved() {
    return this.when(() => !!this.log.match(/You have moved the item/i));
  }

  whenRowDropped() {
    return this.when(() => !!this.log.match(/You have dropped the item/i));
  }

  whenLogIsPresent() {
    return this.when(() => this.logPresent);
  }
}

export default SortableListInteractor;
