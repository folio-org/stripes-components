import StripesOverlayContext from './StripesOverlayContext';

/** UI modules can import `StripesOverlayWrapper` to wrap component trees where
*   usage of the `usePortal` prop will be prevalent among children.
    <StripesOverlayWrapper>
      <ListOfOverlayComponentsLikeDatepickerSelectionEtc />
    </StripesOverlayWrapper>
*/
export default ({ children }) => (
  <StripesOverlayContext.Provider value={{ usePortal: true }}>
    {children}
  </StripesOverlayContext.Provider>
);
