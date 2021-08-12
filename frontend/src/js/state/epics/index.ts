import { combineEpics } from 'redux-observable';

import {
  fetchUserEpic,
  logoutEpic,
  showToastEpic,
} from './global';
import {
  preloadMetadataEpic,
  addMetadataEpic,
  editMetadataEpic,
  deleteMetadataEpic,
  fetchMetadataEpic,
  addMetadataTypeEpic,
  editMetadataTypeEpic,
  deleteMetadataTypeEpic,
  fetchMetadataTypesEpic,
  updateMetadataTypeEpic,
} from './metadata';
import {
  fetchContentEpic,
  addContentEpic,
  deleteContentEpic,
  editContentEpic,
  updateFiltersEpic,
} from './content';
import * as Utils from './epicUtils';

const epics = combineEpics(...[
  fetchUserEpic,
  logoutEpic,
  showToastEpic,
  preloadMetadataEpic,
  addMetadataEpic,
  editMetadataEpic,
  deleteMetadataEpic,
  fetchMetadataEpic,
  addMetadataTypeEpic,
  editMetadataTypeEpic,
  deleteMetadataTypeEpic,
  fetchMetadataTypesEpic,
  updateMetadataTypeEpic,
  fetchContentEpic,
  addContentEpic,
  deleteContentEpic,
  editContentEpic,
  updateFiltersEpic,
].map(Utils.errorCatcher));

export default epics;
