import { combineEpics } from "redux-observable";

import { fetchUserEpic, logoutEpic, showToastEpic } from "./global";
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
} from "./metadata";
import {
  fetchContentEpic,
  addContentEpic,
  deleteContentEpic,
  editContentEpic,
  updateFiltersEpic,
  bulk_edit_epic,
} from "./content";
import {
  addCopyrightEpic,
  deleteCopyrightEpic,
  fetchCopyrightEpic,
  editCopyrightEpic,
} from "./copyright";
import {
  addOrganizationEpic,
  deleteOrganizationEpic,
  fetchOrganizationEpic,
  editOrganizationEpic,
} from "./organization";
import * as Utils from "./epicUtils";

const epics = combineEpics(
  ...[
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
    bulk_edit_epic,
    addCopyrightEpic,
    deleteCopyrightEpic,
    fetchCopyrightEpic,
    editCopyrightEpic,
    addOrganizationEpic,
    deleteOrganizationEpic,
    fetchOrganizationEpic,
    editOrganizationEpic,
  ].map(Utils.errorCatcher)
);

export default epics;
