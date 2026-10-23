import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import insertByClientRect from './insertByClientRect';
import PaneResizeHandle from './PaneResizeHandle';
import PaneResizeCursor, { CURSOR_HOVER_HALF } from './PaneResizeCursor';
import { ResizeProvider } from './ResizeContext';
import css from './PaneResize.css';

const PaneResizeContainer = ({ isRoot, children, onElementResize, parentElement, resizeContainerRef }) => {
  const [dragging, setDragging] = useState(false);
  const [cursorX, setCursorX] = useState(0);
  const [handles, setHandles] = useState([]);
  const [activeHandle, setActiveHandle] = useState(null);
  const [update, setUpdate] = useState(0);
  const [blocking, setBlocking] = useState(null);
  let container = useRef();
  if (resizeContainerRef) {
    container = resizeContainerRef;
  }
  const handleData = useRef([]);
  const containerRect = useRef();
  const activeRef = useRef();
  const observer = useRef();
  // While dragging, the cursor line is positioned directly on its DOM node (throttled to animation frames)
  // rather than through state, so mousemove doesn't trigger React renders. The final position is
  // committed to state on mouseup.
  const cursorEl = useRef();
  const cursorXRef = useRef(0);
  const cursorRAF = useRef(null);

  const observerCallback = useRef(
    (mutationList) => {
      setBlocking(curBlocker => {
        let blocker = curBlocker;
        mutationList.forEach((m) => {
          if (m.type === 'childList') {
            // check added elements against full container bounds.
            // a fully blocking element will have its attributes added as the blocker on the state.
            const blockingNode = Array.from(m.addedNodes).find((n) => {
              const newBox = n?.getBoundingClientRect();
              return (
                newBox && containerRect.current &&
                newBox.left <= containerRect.current.left &&
                newBox.width >= containerRect.current.width
              );
            });
            if (blockingNode) {
              blocker = {
                id: blockingNode.id,
                class: blockingNode.className,
                style: blockingNode.getAttribute('style')
              };
            }

            // if we have a blocking node, check if it's been removed in this mutation batch so that
            // the resizer can be unblocked by setting blocker to null.
            if (typeof curBlocker === 'object') {
              if (Array.from(m.removedNodes).some((n) => {
                const candidate = {
                  id: n.id,
                  class: n.className,
                  style: n.getAttribute('style')
                };
                return isEqual(blocker, candidate);
              })) {
                blocker = null;
              }
            }
          }
        });
        return blocker;
      });
    }
  ).current;

  const onWindowResize = useCallback(() => {
    containerRect.current = container.current?.getBoundingClientRect();
    setUpdate(u => u + 1);
  }, []);

  // set up the mutation observer for overlapping element once we get a usable parentElement prop.
  useEffect(() => {
    if (isRoot) {
      const observerOptions = {
        childList: true,
      };

      if (parentElement) {
        observer.current = new MutationObserver(observerCallback);
        observer.current.observe(parentElement, observerOptions);
      }
    }
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [parentElement, isRoot, observerCallback]);

  useEffect(() => {
    if (isRoot) {
      if (!dragging && activeHandle !== null) {
        const { current: handleList } = handleData;
        const resizedIndex = handleList.findIndex(h => h.id === activeHandle.id);
        if (resizedIndex !== -1) {
          handleList[resizedIndex].x = cursorX;
          onElementResize({ positions: handleList, activeHandle, cursorX, containerRect: containerRect.current });
        }
        setActiveHandle(null);
      }
    }
  }, [dragging, activeHandle, onElementResize, cursorX, isRoot]);

  useEffect(() => { // eslint-disable-line consistent-return
    if (isRoot) {
      window.addEventListener('resize', onWindowResize);

      return function cleanup() {
        if (observer.current) observer.current.disconnect();
        window.removeEventListener('resize', onWindowResize);
        document.removeEventListener('mousemove', updateCursor); // eslint-disable-line no-use-before-define
        document.removeEventListener('mouseup', handleMouseUp); // eslint-disable-line no-use-before-define
        if (cursorRAF.current !== null) {
          cancelAnimationFrame(cursorRAF.current);
          cursorRAF.current = null;
        }
      };
    }
  }, []); // eslint-disable-line

  const flushCursor = useCallback(() => {
    cursorRAF.current = null;
    if (cursorEl.current) {
      cursorEl.current.style.left = `${cursorXRef.current - CURSOR_HOVER_HALF}px`;
    }
  }, []);

  const updateCursor = useCallback((e) => {
    if (containerRect.current) {
      let nextX = e.clientX - containerRect.current.left;
      const hdata = handleData.current;
      const handleOffset = 20; // some margin on the bounds of a resize handle
      const prevHandle = hdata[activeRef.current - 1] || { x: 0 };
      const nextHandle = hdata[activeRef.current + 1] || { x: containerRect.current.width };
      if (
        nextX < prevHandle.x + handleOffset
      ) {
        nextX = prevHandle.x + handleOffset;
      } else if (
        nextX > nextHandle.x - handleOffset
      ) {
        nextX = nextHandle.x - handleOffset;
      }
      cursorXRef.current = nextX;
      if (cursorRAF.current === null) {
        cursorRAF.current = requestAnimationFrame(flushCursor);
      }
    }
  }, [flushCursor]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', updateCursor);
    document.removeEventListener('mouseup', handleMouseUp);
    if (cursorRAF.current !== null) {
      cancelAnimationFrame(cursorRAF.current);
    }
    // write the final position to the DOM now so it can't be left stale if React sees no change.
    flushCursor();
    // commit the final position first so that the resize effect sees it once dragging is false.
    setCursorX(cursorXRef.current);
    setDragging(false);
  }, [updateCursor, flushCursor]);

  const handleHandleMouseDown = useCallback((e, id) => {
    // Keeps the browser from starting a text selection or native drag from the handle. This replaces
    // toggling `user-select` on the body, which (being inherited) restyles the whole page twice per drag.
    e.preventDefault();
    const startX = e.clientX - (containerRect.current?.left ?? 0);
    cursorXRef.current = startX;
    setCursorX(startX);
    setDragging(true);
    const handleIndex = handles.findIndex((h) => h.id === id);
    const handleDataIndex = handleData.current.findIndex((h) => h.id === id);
    setActiveHandle(handles[handleIndex]);
    activeRef.current = handleDataIndex;
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseup', handleMouseUp);
  },[handleMouseUp, handles, updateCursor]);

  // The functions provided via ResizeProvider are stable (state setters and refs only) so that consumers
  // (Pane, Layer) don't rerender every time this container does.
  const registerHandle = useCallback(({ id, elementId, getRef }) => {
    setHandles(curHandles => {
      if (curHandles.findIndex(h => h.id === id) === -1) {
        return insertByClientRect(curHandles, { id, elementId, getRef });
      }
      return curHandles;
    });
  }, []);

  const removeHandle = useCallback((id) => {
    setHandles(curHandles => {
      const indexToRemove = curHandles.findIndex(h => h.id === id);
      if (indexToRemove !== -1) {
        const temp = cloneDeep(curHandles);
        temp.splice(indexToRemove, 1);
        return temp;
      }
      return curHandles;
    });
  }, []);

  // Reads the DOM (forces layout) to locate each handle. Must only rerun when the handle set,
  // container/window size, or blocking state changes - never merely because cursorX/dragging/
  // activeHandle changed during a drag, since handles don't move until the drag ends.
  const computeHandlePositions = useCallback(() => {
    handleData.current = [];
    return handles.map((h) => {
      const rect = h.getRef()?.current?.getBoundingClientRect();
      if (!rect) return null;

      if (rect.left === 0) {
        handleData.current.push({ id: h.id, elementId: h.elementId, x: 0, y: 50 });
        return { id: h.id, render: false };
      }

      if (!containerRect.current) {
        containerRect.current = container.current?.getBoundingClientRect();
      }
      const newLeft = rect.left - (containerRect.current ? containerRect.current.left : 0);
      const top = rect.top - (containerRect.current ? containerRect.current.top : 0);
      handleData.current.push({ id: h.id, elementId: h.elementId, x: newLeft, y: top });
      return { id: h.id, x: newLeft, render: true };
    });
  }, [handles]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePositions = useMemo(
    () => (blocking ? [] : computeHandlePositions()),
    [computeHandlePositions, update, blocking]
  );

  // No DOM reads here, so this is cheap to rerun on every render (mousedown/mousemove/mouseup).
  const renderHandles = () => handlePositions.map((pos) => {
    if (pos?.render) {
      return (
        <PaneResizeHandle
          key={pos.id}
          id={pos.id}
          xpos={pos.x - 3}
          active={(activeHandle && pos.id === activeHandle.id)}
          onMouseDown={handleHandleMouseDown}
        />
      );
    }
    return null;
  });

  // this is the equivalent of `forceUpdate` for functional components.
  const updateHandle = useCallback(() => {
    if (containerRect.current) {
      setUpdate(u => u + 1);
    }
  }, []);

  const suspend = useCallback(() => {
    setBlocking({ setByLayer: true });
  }, []);

  const resume = useCallback(() => {
    setBlocking(null);
  }, []);

  const resizeContext = useMemo(
    () => ({ registerHandle, updateHandle, removeHandle, suspend, resume }),
    [registerHandle, updateHandle, removeHandle, suspend, resume]
  );

  if (isRoot) {
    return (
      <>
        <ResizeProvider value={resizeContext}>
          {children}
        </ResizeProvider>
        <div
          ref={container}
          className={css.container}
        >
          {!blocking && renderHandles()}
          <PaneResizeCursor ref={cursorEl} visible={dragging} activeId={activeHandle} xpos={cursorX} />
        </div>
        {/* blocks hover/interaction with the rest of the page while dragging. */}
        {dragging && createPortal(<div className={css.dragShield} />, document.body)}
      </>
    );
  }

  return children;
};

PaneResizeContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  isRoot: PropTypes.bool,
  onElementResize: PropTypes.func,
  parentElement: PropTypes.instanceOf(Element),
  resizeContainerRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ])
}

export default PaneResizeContainer;
