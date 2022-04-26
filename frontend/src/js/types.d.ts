import type {
  BaseMetadata,
  BaseMetadataType,
  BaseContent,
} from "solarspell-react-lib";

import type { AuthGroup, Status } from "./enums";

/**
 * Type for metadata types used across this application
 * Definitions and fields are subject to change
 */
type MetadataType = {} & BaseMetadataType;

/**
 * Type for metadata used across this application
 * Definitions and fields are subject to change
 */
type Metadata = {} & BaseMetadata<MetadataType>;

/**
 * Type for content used across this application
 * Definitions and fields are subject to change
 */
type Content = {
  /**
   * Who created this content
   */
  creator: string;
  /**
   * Date this content was created
   */
  createdDate: string;
  /**
   * Who reviewed this content (changed status to not Review)
   */
  reviewer?: string;
  /**
   * Date this content was reviewed
   */
  reviewedDate?: string;
  /**
   * Current status of this content
   */
  status: Status;
  /**
   * File to be uploaded alongside this content
   * Only defined when uploading content to backend
   */
  file?: File;
  /**
   * URL of the file associated with this content
   * Only defined when content already exists on backend
   */
  fileURL?: string;
  /**
   * Size of the file associated with this content
   * Only defined when content already exists on backend
   */
  filesize?: number;
  /**
   * Original source of the file
   */
  originalSource?: string;
  /**
   * Additional misc. notes about this content
   */
  notes?: string;
  /**
   * Notes about copyright
   */
  copyright_notes?: string;
  /**
   * Information about specific copyright associated with this content
   */
  copyright_permissions?: ContentPermissions;
  /*
   * Title that is actually displayed on the Library UI
   */
  display_title?: string
} & BaseContent<Metadata>;

/**
 * The filter parameters used for filtering content
 */
type Query = Partial<{
  /**
   * Title of content
   */
  title: string;
  /**
   * Name of file of content
   */
  file_name: string;
  /**
   * Data content was published
   */
  published_date: Range<string>;
  /**
   * Filesize of content file
   */
  filesize: Range<number>;
  /**
   * Who reviewed the content
   */
  reviewed_on: Range<string>;
  /**
   * Current status of the content
   */
  status: Status;
  /**
   * Who created the content
   */
  created_by: string;
  /**
   * Set of metadata the content includes
   * Backend checks for full, not partial inclusion
   */
  metadata: Record<number, Metadata[]>;
  /**
   * Information about specific copyright associated with this content
   */
  copyright: ContentPermissions;
}>;

/**
 * Represents a small range from one value to another
 */
type Range<T> = {
  from?: T;
  to?: T;
};

/**
 * Represents a single toast to query for display
 */
type Toast = {
  /**
   * Unique identifier
   */
  key: number;
  /**
   * Nature of the toast
   */
  severity: "success" | "warning" | "error";
  /**
   * Message displayed along with the toast
   */
  message: string;
};

/**
 * Represents the current logged in user
 */
type User = {
  /**
   * Username used for display
   */
  username: string;
  /**
   * Email associated with user
   */
  email: string;
  /**
   * Unused
   */
  token: string;
  /**
   * Unique ID of user
   */
  user_id: number;
  /**
   * Authorization groups associated with the user
   */
  groups: AuthGroup[];
  /**
   * Non-auth related information about the user
   */
  profile?: Profile;
  /**
   * Actual permissions associated with the user
   * Only affects UI, CRUD permissions must be enforced by backend
   */
  permissions: Permissions;
};

/**
 * Non-auth related information about the user
 */
type Profile = {
  /**
   * Number of content items the user has uploaded that currently exist in the
   * database
   */
  num_content: number;
};

/**
 * Represents Create/Read/Update/Delete permissions
 */
type CRUD = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

/**
 * Any misc. permissions not associated with CRUD
 */
type SpecialPermissions = {
  /**
   * Whether the user has Staff status in Django
   */
  admin: boolean;
  /**
   * Whether the user can export content/metadata
   */
  export: boolean;
  /**
   * Whether the user can review content
   */
  review: boolean;
};

/**
 * Full permissions associated with a user
 */
type Permissions = {
  /**
   * CRUD permissions associated with content
   */
  content: CRUD;
  /**
   * CRUD permissions associated with metadata
   */
  metadata: CRUD;
  /**
   * Misc. permissions
   */
  special: SpecialPermissions;
};

type Organization = {
    id: number,
    name: string,
    website: string, 
    email: string | null,
}

type ContentPermissions = {
  id: number,
  description: string;
  organization: number;
  date_contacted: string;
  date_of_response: string;
  granted: boolean;
  user: number;
};
