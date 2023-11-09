// import _ from 'lodash';

export const getBlockedList = (blocked, blockedBy) => {
  return [...Object.keys(blocked || []), ...Object.keys(blockedBy || [])];
};
