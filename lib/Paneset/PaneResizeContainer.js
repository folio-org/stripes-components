import React, { useState, useRef, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import insertByClientRect from './insertByClientRect';
import PaneResizeHandle from './PaneResizeHandle';
import PaneResizeCursor from './PaneResizeCursor';
import { ResizeProvider } from './ResizeContext';
import css from './PaneResize.css';

const PaneResizeContainer = ({ isRoot, children, onElementResize, parentElement }) => {
  const [dragging, setDragging] = useState(false);
  const [cursorX, setCursorX] = useState(0);
  const [handles, setHandles] = useState([]);
  const [activeHandle, setActiveHandle] = useState(null);
  const [update, setUpdate] = useState(0); // eslint-disable-line no-unused-vars
  const [blocking, setBlocking] = useState(null);
  const container = useRef();
  const handleData = useRef([]);
  const containerRect = useRef();
  const activeRef = useRef();
  const observer = useRef();

  const observerCallback = useRef(
    (mutationList) => {
      setBlocking(curBlocker => {
        let blocker = curBlocker;
        mutationList.forEach((m) => {
          if (m.type === 'childList') {
            // check against full container bounds
            const blockingNode = Array.from(m.addedNodes).find((n) => {
              const newBox = n?.getBoundingClientRect();
              return (
                newBox &&
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

            if (typeof curBlocker === 'object') {
              if (Array.from(m.removedNodes).find((n) => { // eslint-disable-line consistent-return
                // we look for the removal of a node matching the blocker...
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

  const debouncedUpdate = useRef(
    debounce(
      () => {
        containerRect.current = container.current?.getBoundingClientRect();
        setUpdate(u => u + 1);
      },
      300,
      { trailing: true }
    )
  ).current;

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
      window.addEventListener('resize', debouncedUpdate);

      return function cleanup() {
        if (observer.current) observer.current.disconnect();
        debouncedUpdate.cancel();
        window.removeEventListener('resize', debouncedUpdate);
        document.removeEventListener('mousemove', updateCursor); // eslint-disable-line no-use-before-define
        document.removeEventListener('mouseup', handleMouseUp); // eslint-disable-line no-use-before-define
      };
    }
  }, []); // eslint-disable-line

  const updateCursor = (e) => {
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
      setCursorX(nextX);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', updateCursor);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'auto';
    document.body.style.webkitUserSelect = 'auto';
    document.body.style.msUserSelect = 'auto';
    document.body.style.msUserSelect = 'auto';
    setDragging(false);
  };

  const handleHandleMouseDown = (e, id) => {
    setCursorX(e.clientX);
    setDragging(true);
    const handleIndex = handles.findIndex((h) => h.id === id);
    const handleDataIndex = handleData.current.findIndex((h) => h.id === id);
    setActiveHandle(handles[handleIndex]);
    activeRef.current = handleDataIndex;
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
  };

  const registerHandle = ({ id, elementId, getRef }) => {
    setHandles(curHandles => {
      if (curHandles.findIndex(h => h.id === id) === -1) {
        return insertByClientRect(curHandles, { id, elementId, getRef });
      }
      return curHandles;
    });
  };

  const removeHandle = (id) => {
    setHandles(curHandles => {
      const indexToRemove = curHandles.findIndex(h => h.id === id);
      if (indexToRemove !== -1) {
        const temp = cloneDeep(curHandles);
        temp.splice(indexToRemove, 1);
        return temp;
      }
      return curHandles;
    });
  };

  const renderHandles = () => {
    handleData.current = [];
    const handleElements = handles.map((h) => {
      const rect = h.getRef()?.current?.getBoundingClientRect();
      if (rect) {
        if (rect.left === 0) {
          handleData.current.push({ id: h.id, elementId: h.elementId, x: 0, y: 50 });
          return false;
        }

        if (!containerRect.current) {
          containerRect.current = container.current?.getBoundingClientRect();
        }
        const newLeft = rect.left - (containerRect.current ? containerRect.current.left : 0);
        const top = rect.top - (containerRect.current ? containerRect.current.top : 0);
        handleData.current.push({ id: h.id, elementId: h.elementId, x: newLeft, y: top });
        return (
          <PaneResizeHandle
            key={h.id}
            id={h.id}
            xpos={newLeft - 3}
            active={(activeHandle && h.id === activeHandle.id)}
            onMouseDown={handleHandleMouseDown}
          />
        );
      }
      return null;
    });

    return handleElements;
  };

  // this is the equivalent of `forceUpdate` for functional components.
  const updateHandle = () => {
    if (containerRect.current) {
      setUpdate(u => u + 1);
    }
  };

  const suspend = () => {
    setBlocking({ setByLayer: true });
  };

  const resume = () => {
    setBlocking(null);
  };

  if (isRoot) {
    return (
      <>
        <ResizeProvider value={{ registerHandle, updateHandle, removeHandle, suspend, resume }}>
          {children}
        </ResizeProvider>
        <div
          ref={container}
          className={css.container}
        >
          {!blocking && renderHandles()}
          <PaneResizeCursor visible={dragging} activeId={activeHandle} xpos={cursorX} />
        </div>
      </>
    );
  }

  return children;
};

export default PaneResizeContainer;
