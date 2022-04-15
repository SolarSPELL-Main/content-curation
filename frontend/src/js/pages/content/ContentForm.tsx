/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { format, parseISO } from 'date-fns';

import {
  ContentModal,
  ContentMetadataDisplay,
  FormFieldDescriptor,
} from 'solarspell-react-lib';
import * as MetadataActions from '../../state/metadata';
import { useCCDispatch, useCCSelector } from '../../hooks';
import { Status } from '../../enums';
import { Metadata, MetadataType, Content } from 'js/types';
import APP_URLS from '../../urls';
import { hasPermission } from '../../utils/permissions';
import { api } from '../../utils/misc';
import {Autocomplete, AutocompleteProps, createFilterOptions} from '@material-ui/lab';
import {isString} from 'lodash';

type UploadFileProps = {
  onChange: (e: React.SyntheticEvent<HTMLLabelElement>) => void
  text: string
  error: string
}

type DatePickerProps = {
  reviewed: boolean
  datePicker: React.ComponentProps<typeof KeyboardDatePicker>
}

/** Describes purpose of this form */
type TypeProps = {
    /** Form is used for adding a new piece of content */
    type: 'add'
    /** No prior content, hence this prop should not exist */
    content?: never
} | {
    /** Form is used for editing an existing piece of content */
    type: 'edit'
    /** Content being edited */
    content: Content
}

/** Main props type */
type ContentFormProps = {
    /** 
     * Callback on dialog close
     * Content is undefined when form is not submitted
     */
    onSubmit: (content?: Partial<Content>) => void
    /** Whether the dialog is open */
    open: boolean
} & TypeProps

/**
 * Dialog form for editing/adding content.
 * Also allows creation of metadata tags using its taggers.
 * @params props The context / callbacks of the component.
 * @returns A form for adding/editing content.
 */
function ContentForm({
  onSubmit,
  open,
  content,
  type,
}: ContentFormProps): React.ReactElement {
  const dispatch = useCCDispatch();
  // Maps newly_added array to Record of type ids -> metadata arrays
  const newMetadata = useCCSelector(
    state => state.metadata.newly_added
  ).reduce<Record<number, Metadata[]>>(
    (accum, val) => ({
      ...accum,
      [val.metadataType.id]: accum[val.metadataType.id] ?
        accum[val.metadataType.id].concat(val) : [val],
    }), {} as Record<number, Metadata[]>,
  );
  const metadata = useCCSelector(state => state.metadata.metadata);
  const metadataTypes = useCCSelector(state => state.metadata.metadata_types);
  const permissions = useCCSelector(state => state.global.user.permissions);
  const copyright_permissions = useCCSelector(state => state.copyright.copyright)
  const canReview = hasPermission(permissions, 'special', 'review');

  let dialogStyle: any = { title: '' };

  if (type === 'add') {
    dialogStyle = {
      title: 'Add New Item',
      cancelColor: 'secondary',
      confirmColor: 'primary',
      confirmText: 'Add',
    };
  } else if (type === 'edit') {
    dialogStyle = {
      title: `Edit Content ${content?.title}`,
      cancelColor: 'secondary',
      confirmColor: 'primary',
      confirmText: 'Save',
    };
  }

    const initial_permission: {
        description: string,
        id: number,
    } = {
        description: "",
        id: 0,
    }
    const filter = createFilterOptions<typeof initial_permission>()

    const getToday = () => {
      return format(new Date(), "yyyy-MM-dd")
    }

  const fields: FormFieldDescriptor<Content>[] = [
    {
      component: TextField,
      propFactory: (state, reasons, setter) => {
        return {
          fullWidth: true,
          label: 'Title',
          onChange: (
            e: React.SyntheticEvent<HTMLInputElement>
          ) => {
            setter(e.currentTarget.value);
          },
          error: !!reasons['title'],
          helperText: reasons['title'],
          value: state['title'],
        };
      },
      field: 'title',
      initialValue: '',
      validator: (state) => {
        if (!state['title']) {
          return 'Title is required';
        } else {
          return null;
        }
      },
    },
    {
      component: TextField,
        propFactory: (state, reason, setter) => ({
            fullWidth: true,
            label: "Display Title",
            onChange: (e: React.SyntheticEvent<HTMLInputElement>) => {
                setter(e.currentTarget.value)
            },
            error: !!reason['display_title'],
            helperText: reason['display_title'],
            value: state['display_title']
        }),
      field: "display_title",
      initialValue: "",
    },
    {
      component: TextField,
      propFactory: (state, _r, setter) => {
        return {
          fullWidth: true,
          label: 'Description',
          onChange: (
            e: React.SyntheticEvent<HTMLInputElement>
          ) => {
            setter(e.currentTarget.value);
          },
          value: state['description'] ?? '',
        };
      },
      field: 'description',
      initialValue: '',
      mb: '20px',
    },
    {
      component: (props: UploadFileProps) => (
        <>
          <Button
            variant={'contained'}
            component={'label'}
            onChange={props.onChange}
          >
            Upload File
            <input
              type={'file'}
              accept={'*'}
              hidden
            />
          </Button>
          <Typography>{props.text}</Typography>
          <Typography color={'secondary'}>
            {props.error}
          </Typography>
        </>
      ),
      propFactory: (state, reasons, setter, genericSetter, setReason) => {
        return {
          onChange: (
            e: React.SyntheticEvent<HTMLLabelElement>
          ) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
              (async () => {
                setReason('file', 'Checking if duplicate...');

                const arrayBuffer = await file.arrayBuffer();
                const result = await crypto.subtle
                  .digest('SHA-256', arrayBuffer);
                const sha256 = Array.from(new Uint8Array(result))
                  .map(c => c.toString(16).padStart(2, '0')).join('');
                api.get(APP_URLS.CHECK_DUPLICATE(sha256))
                  .then(({ data: data }) => {
                    setReason('file', data.data ?
                      'File is already in the system.' :
                      ''
                    );
                  });
              })();
              setter(file);
              genericSetter('fileName', file.name);
            }
          },
          text: state['fileName'] ?
            `Existing file: ${state['fileName']}` :
            'No file chosen',
          error: reasons['file'],
        };
      },
      field: 'file',
      initialValue: undefined,
      validator: async (state) => {
        if (!state['file'] && !state['fileURL']) {
          return 'A file must be uploaded';
        } else if (state['file']) {
          const file = state['file'];

          const arrayBuffer = await file.arrayBuffer();
          const result = await crypto.subtle
            .digest('SHA-256', arrayBuffer);
          const sha256 = Array.from(new Uint8Array(result))
            .map(c => c.toString(16).padStart(2, '0')).join('');
          const res = await api.get(APP_URLS.CHECK_DUPLICATE(sha256));
          return res.data.data ?
            'File is already in the system.' :
            '';
        } else {
          return null;
        }
      },
      mb: 0,
    },
    {
      component: TextField,
      propFactory: (state, _r, setter) => {
        return {
          fullWidth: true,
          label: 'Original Source',
          onChange: (
            e: React.SyntheticEvent<HTMLInputElement>
          ) => {
            setter(e.currentTarget.value);
          },
          value: state['originalSource'] ?? '',
        };
      },
      field: 'originalSource',
      initialValue: '',
    },
    {
      component: TextField,
      propFactory: (state, reasons, setter) => {
        return {
          fullWidth: true,
          label: 'Year of Publication',
          onChange: (
            e: React.SyntheticEvent<HTMLInputElement>
          ) => {
            setter(e.currentTarget.value);
          },
          value: state['datePublished'] ?? '',
          type: 'number',
          error: !!reasons['datePublished'],
          helperText: reasons['datePublished'],
          onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
            // MUI TextField allows 'e' even in number fields,
            // so just explicitly disable it when detected.
            if (e.key === 'e') {
              e.stopPropagation();
              e.preventDefault();
            }
          },
        };
      },
      field: 'datePublished',
      initialValue: '',
      validator: (state) => {
        const val = state['datePublished'];

        // If null or empty string, don't run rest of validation
        if (val == null || val === '') {
          return;
        } else {
          const num = parseInt(val);

          // Impose range limit
          if (isNaN(num) || num < 1000 || num > 9999) {
            return 'Invalid year';
          } else {
            return;
          }

        }

      },
    },
    {
        component: Autocomplete,
        propFactory: (state, _reasons, setter): AutocompleteProps<
            typeof initial_permission, false, false, true
        > => ({
            freeSolo: true,
            renderInput: params => <TextField
                {...params}
                placeholder="Copyright Permission"
            />,
            value: state.copyright_permissions ?? initial_permission,
            options: copyright_permissions,
            filterOptions: (options, params) => {
                return filter(options, params)
            },
            getOptionSelected: (option, value) => option.id == value.id,
            getOptionLabel: option => option.description ?? "",
            onChange: (_evt, value) => {
                if (!isString(value)) {
                    console.log("set", value)
                    setter(value)
                }
            },
        }),
        field: "copyright_permissions",
        initialValue: initial_permission,
    },
    {
      component: TextField,
      propFactory: (state, _r, setter) => {
        return {
          fullWidth: true,
          label: 'Copyright Notes',
          onChange: (
            e: React.SyntheticEvent<HTMLInputElement>
          ) => {
            setter(e.currentTarget.value);
          },
          value: state['copyright'] ?? '',
        };
      },
      field: 'copyright',
      initialValue: '',
    },
    {
      component: ContentMetadataDisplay,
      propFactory: (state, _r, setter) => {
        return {
          metadataTypes: metadataTypes,
          metadata: state['metadata'],
          toAdd: newMetadata,
          options: metadata,
          actions: {
            onSelect: (
              metadataType: MetadataType,
              selected: Metadata[],
            ) => {
              setter((oldState: typeof metadata) => ({
                ...oldState,
                [metadataType.id]: selected,
              }));
            },
            creatable: true,
            onCreate: (
              metadataType: MetadataType,
              newTags_: Metadata[],
            ) => {
              // Gets rid of 'Add ""' formatting
              const newTags = newTags_.map(tag => ({
                ...tag,
                name: tag.name.substring(5, tag.name.length - 1),
              }));

              newTags.forEach(tag => dispatch(
                MetadataActions.add_metadata({
                  name: tag.name,
                  type_id: metadataType.id,
                })
              ));
                
              return (async () => [])();
            },
          },
        };
      },
      field: 'metadata',
      initialValue: {},
      mb: 0,
    },
    (canReview ? {
      component: (props) => (
        <>
          <Typography>Status</Typography>
          <Select
            label={'Status'}
            {...props}
          >
            {Object.values(Status).map(v => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </>
      ),
      propFactory: (state, _r, setter) => {
        return {
          value: state['status'] ?? Status.REVIEW,
          onChange: (
            e: React.ChangeEvent<HTMLInputElement>
          ) => setter(e.target.value),
        };
      },
      field: 'status',
      initialValue: Status.REVIEW,
      mb: '20px',
    } : {
      field: 'status',
      initialValue: Status.REVIEW,
    }),
    (canReview ? {
      component: (props: DatePickerProps) => (
        <>
          {props.reviewed && <KeyboardDatePicker
            {...props.datePicker}
          />}
        </>
      ),
      propFactory: (state_, _r, setter, genericSetter_) => {
        // Because of how KeyboardDatePicker works,
        // we need another temp variable in the state
        // to store the raw string value (not the formatted value).
        // This enables the user to edit however they like.
        const state = state_ as Partial<Content> & {
                    rawReviewedDate?: string
                };
        state.reviewedDate = state.reviewedDate ?? getToday();
        const genericSetter = genericSetter_ as (
                    field: string,
                    val: any,
                ) => void;
        return {
          reviewed: state['status'] !== Status.REVIEW,
          datePicker: {
            disableToolbar: true,
            variant: 'inline',
            format: 'yyyy-MM-dd',
            label: 'Reviewed On',
            onChange: (date: Date, val?: string) => {
              setter(
                (oldState: Date) => {
                  // If no user input, no date should be
                  // recorded, hence return null
                  if (!val) {
                    return null;
                  }

                  // Checks if date parsed from user input
                  // is valid
                  const isValidDate = date
                                        && !isNaN(date.getTime());
                                    
                  if (isValidDate) {
                    return format(date, 'yyyy-MM-dd');
                  } else {
                    return oldState;
                  }
                }
              );

              genericSetter('rawReviewedDate', val);
            },
            value: state['reviewedDate'] ? parseISO(state['reviewedDate']): parseISO(getToday()),
            inputValue: state['rawReviewedDate'] ?? '',
          },
        };
      },
      field: 'reviewedDate',
      initialValue: getToday(),
      mb: 0,
    } : {
      field: 'reviewedDate',
      initialValue: null,
    }),
    {
      component: TextField,
      propFactory: (state, _r, setter) => {
        return {
          fullWidth: true,
          label: 'Additional Notes',
          onChange: (
            e: React.SyntheticEvent<HTMLInputElement>
          ) => {
            setter(e.currentTarget.value);
          },
          value: state['notes'] ?? '',
        };
      },
      field: 'notes',
      initialValue: '',
    },
  ];

  return (
    <ContentModal<Content>
      initialState={content}
      fields={fields}
      dialogStyle={dialogStyle}
      onSubmit={onSubmit}
      open={open}
    />
  );
}

export default React.memo(ContentForm);
