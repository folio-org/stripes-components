import React, { useState, useRef, useEffect} from 'react';
import PaneResizeHandle from './PaneResizeHandle';
import PaneResizeCursor from './PaneResizeCursor';
import { ResizeProvider } from './ResizeContext';
import cloneDeep from 'lodash/cloneDeep';

const PaneResizeContainer = ({ isRoot, children, onElementResize }) => {
  const [dragging, setDragging] = useState(false);
  const [cursorX, setCursorX] = useState(0);
  const [handles, setHandles] = useState([]);
  const [activeHandle, setActiveHandle] = useState(null);
  const [update, setUpdate] = useState(0);
  const container = useRef();
  const handleData = useRef([]);
  const containerRect = useRef();

  useEffect(() => {
    console.log(`${dragging} ${activeHandle}`);
    if (!dragging && activeHandle !== null) {
      const { current: handleList } = handleData;
      const resizedIndex = handleList.findIndex(h => h.id === activeHandle);
      const registeredIndex = handles.findIndex(h => h.id === activeHandle);
      if (resizedIndex !== -1) {
        handleList[resizedIndex].x = cursorX;
        onElementResize({ positions: handleList, activeHandle: handles[registeredIndex], cursorX, containerRect: containerRect.current });
      }
      // console.log(`dropped ${activeHandle} at ${cursorX}`);
      setActiveHandle(null);
    }
  }, [dragging, activeHandle, onElementResize, cursorX]);

  const updateCursor = (e) => {
    setCursorX(e.clientX);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', updateCursor);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'auto';
    setDragging(false);
  };

  const handleHandleMouseDown = (e, id) => {
    setCursorX(e.clientX);
    setDragging(true);
    setActiveHandle(id.toString());
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
  };

  const registerHandle = ({ id, elementId, getRef }) => {
    if (handles.findIndex(h => h.id === id) === -1) {
      setHandles(currentHandles => {
        return [
          ...currentHandles,
          { id, elementId, getRef }
        ];
      });
    }
  };

  const removeHandle = (id) => {
    const indexToRemove = handles.findIndex(h => h.id === id);
    if (indexToRemove !== -1) {
      setHandles(curHandles => {
        let temp = cloneDeep(curHandles);
        temp.splice(indexToRemove, 1);
        return temp;
      });
    }
  }

  const renderHandles = () => {
    handleData.current = [];
    const handleElements = handles.map(h => {
      const rect = h.getRef()?.current?.getBoundingClientRect();
      if (rect.left === 0) {
        handleData.current.push({ id: h.id, elementId: h.elementId, x: 0 });
        return false;
      }
      if (!containerRect.current) {
        containerRect.current = container.current?.getBoundingClientRect();
      }
      const newLeft = rect?.left - containerRect.current?.left;
      handleData.current.push({ id: h.id, elementId: h.elementId, x: newLeft });
      return <PaneResizeHandle key={h.id} id={h.id} xpos={newLeft - 3} onMouseDown={handleHandleMouseDown} />;
    });

    return handleElements;
  };

  const updateHandle = () => {
    setUpdate(u => u + 1);
  };

  if (!isRoot) {
    return (
      <>
        <ResizeProvider value={{ registerHandle, updateHandle, removeHandle }}>
          {children}
        </ResizeProvider>
        <div
          ref={container}
          style={{
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
            position: 'absolute'
          }}
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
