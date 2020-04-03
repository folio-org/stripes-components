import React, { useState, useRef, useEffect} from 'react';
import PaneResizeHandle from './PaneResizeHandle';
import PaneResizeCursor from './PaneResizeCursor';
import { ResizeProvider } from './ResizeContext';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import css from './PaneResize.css';

const PaneResizeContainer = ({ isRoot, children, onElementResize }) => {
  const [dragging, setDragging] = useState(false);
  const [cursorX, setCursorX] = useState(0);
  const [handles, setHandles] = useState([]);
  const [activeHandle, setActiveHandle] = useState(null);
  const [update, setUpdate] = useState(0);
  const container = useRef();
  const handleData = useRef([]);
  const containerRect = useRef();
  const activeRef = useRef();
  const debouncedUpdate = useRef(debounce(
    () => {
      containerRect.current = container.current?.getBoundingClientRect();
      setUpdate(u => u + 1);
    },
    300,
    { trailing: true}
  )).current;

  useEffect(() => {
    if (isRoot) {
      if (!dragging && activeHandle !== null) {
        const { current: handleList } = handleData;
        const resizedIndex = handleList.findIndex(h => h.id === activeHandle.id);
        if (resizedIndex !== -1) {
          handleList[resizedIndex].x = cursorX;
          onElementResize({ positions: handleList, activeHandle, cursorX, containerRect: containerRect.current });
        }
        // console.log(`dropped ${activeHandle} at ${cursorX}`);
        setActiveHandle(null);
      }
    }
  }, [dragging, activeHandle, onElementResize, cursorX, isRoot]);

  useEffect(() => {
    if (isRoot) {
      window.addEventListener('resize', debouncedUpdate);
      return () => { 
        debouncedUpdate.cancel();
        window.removeEventListener('resize', debouncedUpdate);
        document.removeEventListener('mousemove', updateCursor);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, []);

  const updateCursor = (e) => {
    if (containerRect.current) {
      let nextX = e.clientX - containerRect.current.left;
      const hdata = handleData.current;
      const handleOffset = 20; // some margin on the bounds of a resize handle
      const prevHandle = hdata[activeRef.current - 1] || { x: 0 };
      const nextHandle = hdata[activeRef.current + 1] || { x: containerRect.current.width }
      if (
        nextX < prevHandle.x + handleOffset
      ) {
        nextX = prevHandle.x + handleOffset;
      }
      if (
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
        return insertHandle(curHandles, { id, elementId, getRef });
      }
      return curHandles;
    });
  };

  // insert handle in order of clientRects..
  const insertHandle = (state, newHandle) => {
    const newClientRect = newHandle.getRef().current.getBoundingClientRect();
    const nextIndex = state.findIndex((h) => {
      return (h.getRef().current.getBoundingClientRect().left > newClientRect.left);
    });
    let newHandles;
    if (nextIndex === -1) {
      newHandles = [...state, newHandle];
    } else if (nextIndex === 0) {
      newHandles = [newHandle, ...state];
    } else {
      const tempHandles = cloneDeep(state);
      tempHandles.splice(nextIndex, 0, newHandle);
      newHandles = tempHandles;
    }
    return newHandles;
  }

  const removeHandle = (id) => {
    setHandles(curHandles => {
      const indexToRemove = curHandles.findIndex(h => h.id === id);
      if (indexToRemove !== -1) {
        let temp = cloneDeep(curHandles);
        temp.splice(indexToRemove, 1);
        return temp;
      }
      return curHandles;
    });
  }

  const renderHandles = () => {
    handleData.current = [];
    const handleElements = handles.map((h, i) => {
      const rect = h.getRef()?.current?.getBoundingClientRect();
      if (rect?.left === 0) {
        handleData.current.push({ id: h.id, elementId: h.elementId, x: 0 });
        return false;
      }

      if (!containerRect.current) {
        containerRect.current = container.current?.getBoundingClientRect();
      }
      const newLeft = rect?.left - containerRect.current?.left;
    
      handleData.current.push({ id: h.id, elementId: h.elementId, x: newLeft });
      return (
        <PaneResizeHandle
          key={h.id}
          id={h.id}
          xpos={newLeft - 3}
          active={(activeHandle && h.id === activeHandle.id)}
          onMouseDown={handleHandleMouseDown}
        />
      );
    });

    return handleElements;
  };

  const updateHandle = () => {
    if (containerRect.current) {
      setUpdate(u => u + 1);
    }
  };

  if (isRoot) {
    return (
      <>
        <ResizeProvider value={{ registerHandle, updateHandle, removeHandle }}>
          {children}
        </ResizeProvider>
        <div
          ref={container}
          className={css.container}
        >
          {renderHandles()}
          <PaneResizeCursor visible={dragging} activeId={activeHandle} xpos={cursorX} />
        </div>
      </>
    );
  }

  return children;
};

export default PaneResizeContainer;
