import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Loading } from '../Loading';
import Pane from '../Pane';
import Button from '../Button';

import AuditLogCard from './AuditLogCard';

const paneTitle = <FormattedMessage id="stripes-components.auditLog.pane.header" />;

const AuditLogPane = ({
  actionsMap,
  columnWidths,
  fieldFormatter,
  itemFormatter,
  fieldLabelsMap,
  handleLoadMore,
  isInitialLoading,
  isLoading,
  isLoadMoreVisible = true,
  showSharedLabel = false,
  onClose,
  totalVersions,
  versions,
}) => {
  const paneTitleRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const lastCardRef = useRef(null);

  useLayoutEffect(() => {
    if (paneTitleRef.current) {
      paneTitleRef.current.focus();
    }
  }, []);

  // set focus to the last card after new versions loaded
  useEffect(() => {
    if (lastCardRef?.current) {
      lastCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      lastCardRef.current.focus();
    }
  }, [versions]);

  const onLoadMoreClick = () => {
    // store the last card before loading more versions
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.querySelectorAll('[class^="card"]');

      if (cards.length > 0) {
        lastCardRef.current = cards[cards.length - 1];
      }
    }

    handleLoadMore(versions.at(-1).eventTs);
  };

  const versionCards = useMemo(() => {
    return versions.map(({
      isOriginal,
      eventId,
      eventDate,
      source,
      userName,
      fieldChanges,
      modalFieldChanges,
    }, i) => {
      return (
        <AuditLogCard
          key={eventId || i}
          date={eventDate}
          isCurrentVersion={i === 0}
          isOriginal={isOriginal}
          showSharedLabel={showSharedLabel}
          source={source}
          userName={userName}
          fieldChanges={fieldChanges}
          fieldLabelsMap={fieldLabelsMap}
          fieldFormatter={fieldFormatter}
          itemFormatter={itemFormatter}
          actionsMap={actionsMap}
          columnWidths={columnWidths}
          modalFieldChanges={modalFieldChanges}
        />
      );
    });
  }, [versions, fieldLabelsMap, fieldFormatter, itemFormatter, actionsMap, columnWidths, showSharedLabel]);

  return (
    <Pane
      defaultWidth="20%"
      paneTitle={paneTitle}
      paneTitleRef={paneTitleRef}
      paneSub={(
        <FormattedMessage
          id="stripes-components.auditLog.pane.sub"
          values={{ count: totalVersions }}
        />
      )}
      dismissible
      onClose={onClose}
    >
      {isInitialLoading ? (
        <Loading />
      ) : (
        <>
          <div
            ref={cardsContainerRef}
          >
            {versionCards}
          </div>
          {isLoadMoreVisible && (
            <Button
              onClick={onLoadMoreClick}
              fullWidth
            >
              {!isLoading && <FormattedMessage id="stripes-components.mcl.loadMore" />}
              {isLoading && (
                <>
                  <Loading size="medium" useCurrentColor />
                  <span className="sr-only">
                    <FormattedMessage id="stripes-components.auditLog.pane.loadingLabel" />
                  </span>
                </>
              )}
            </Button>
          )}
        </>
      )}
    </Pane>
  );
};

AuditLogPane.propTypes = {
  actionsMap: PropTypes.object,
  columnWidths: PropTypes.object,
  fieldFormatter: PropTypes.object,
  fieldLabelsMap: PropTypes.object,
  handleLoadMore: PropTypes.func,
  isInitialLoading: PropTypes.bool,
  isLoading: PropTypes.bool,
  isLoadMoreVisible: PropTypes.bool,
  itemFormatter: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  showSharedLabel: PropTypes.bool,
  totalVersions: PropTypes.number,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      eventDate: PropTypes.string,
      eventId: PropTypes.string,
      eventTs: PropTypes.number,
      fieldChanges: PropTypes.arrayOf(PropTypes.object),
      isOriginal: PropTypes.bool,
      modalFieldChanges: PropTypes.arrayOf(PropTypes.object),
      source: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      userName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    })
  ).isRequired,
};

export default AuditLogPane;
