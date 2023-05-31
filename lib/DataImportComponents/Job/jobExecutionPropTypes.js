import PropTypes from 'prop-types';

export const jobExecutionPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  hrId: PropTypes.number.isRequired,
  jobProfileInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    dataType: PropTypes.string,
  }).isRequired,
  parentJobId: PropTypes.string,
  subordinationType: PropTypes.string.isRequired,
  sourcePath: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  runBy: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  progress: PropTypes.shape({
    jobExecutionId: PropTypes.string,
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  startedDate: PropTypes.string.isRequired,
  completedDate: PropTypes.string,
  status: PropTypes.string.isRequired,
  uiStatus: PropTypes.string.isRequired,
  userId: PropTypes.string,
});
