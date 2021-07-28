//Importing from outside the project
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { format, parseISO } from 'date-fns';

//Importing from other files in the project
import {
    ContentModal,
    ContentMetadataDisplay,
    FormFieldDescriptor,
} from 'solarspell-react-lib';
import { useCCSelector } from '../../hooks';
import { Status } from '../../enums';
import { Metadata, MetadataType, Content } from 'js/types';
import APP_URLS from "../../urls"
import { api, hasPermission } from "../../utils"

type TypeProps = {
    type: 'add'
    content?: never
} | {
    type: 'edit'
    content: Content
}

type ContentFormProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    onSubmit: (content?: Partial<Content>) => void
    onCreate: (
        metadataType: MetadataType,
        newTags: Metadata[],
    ) => Promise<Metadata[]>
    open: boolean
} & TypeProps

/**
 * Form for editing/adding content.
 * @params props The context / callbacks of the component.
 * @returns A form for adding/editing content.
 */
function ContentForm({
    metadata,
    metadataTypes,
    onSubmit,
    onCreate,
    open,
    content,
    type,
}: ContentFormProps): React.ReactElement {
    // Maps newly_added array to Record of type ids -> metadata arrays
    const newMetadata = useCCSelector(
        state => state.metadata.newly_added
    ).reduce<Record<number, Metadata[]>>(
        (accum, val) => ({
            ...accum,
            [val.metadataType.id]: accum[val.metadataType.id] ?
                accum[val.metadataType.id].concat(val) : [val]
        }), {} as Record<number, Metadata[]>,
    );
    const permissions = useCCSelector(state => state.global.user.permissions);
    const canReview = hasPermission(permissions, 'special', 'review');

    let dialogStyle: any = { title: '' };

    switch (type) {
        case 'add':
            dialogStyle = {
                title: 'Add New Item',
                cancelColor: 'secondary',
                confirmColor: 'primary',
                confirmText: 'Add',
            };
            break;
        case 'edit':
            dialogStyle = {
                title: `Edit Content ${content?.title}`,
                cancelColor: 'secondary',
                confirmColor: 'primary',
                confirmText: 'Save',
            };
            break;
    };

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
            component: (props) => (
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
                        e: React.SyntheticEvent<HTMLInputElement>
                    ) => {
                        const target = e.target as HTMLInputElement;
                        const file = target.files?.[0];
                        if (file) {
                            (async () => {
                                setReason("file", "Checking if duplicate...")

                                const arrayBuffer = await file.arrayBuffer()
                                const result = await crypto.subtle
                                    .digest("SHA-256", arrayBuffer)
                                const sha256 = Array.from(new Uint8Array(result))
                                    .map(c => c.toString(16).padStart(2, "0")).join("")
                                api.get(APP_URLS.CHECK_DUPLICATE(sha256))
                                    .then(({ data: data }) => {
                                        setReason("file", data.data ?
                                            "File is already in the system." :
                                            ""
                                        )
                                    })
                            })()
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

                    const arrayBuffer = await file.arrayBuffer()
                    const result = await crypto.subtle
                        .digest("SHA-256", arrayBuffer)
                    const sha256 = Array.from(new Uint8Array(result))
                        .map(c => c.toString(16).padStart(2, "0")).join("")
                    const res = await api.get(APP_URLS.CHECK_DUPLICATE(sha256));
                    return res.data.data ?
                        "File is already in the system." :
                        "";
                } else {
                    return null
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
            propFactory: (state, _r, setter) => {
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
                };
            },
            field: 'datePublished',
            initialValue: '',
        },
        {
            component: TextField,
            propFactory: (state, _r, setter) => {
                return {
                    fullWidth: true,
                    label: 'Copyright Site',
                    onChange: (
                        e: React.SyntheticEvent<HTMLInputElement>
                    ) => {
                        setter(e.currentTarget.value);
                    },
                    value: state['copyrightSite'] ?? '',
                };
            },
            field: 'copyrightSite',
            initialValue: '',
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
        (canReview ? {
            component: (props) => (
                <>
                    <Typography>Copyright Approved</Typography>
                    <Checkbox {...props} />
                </>
            ),
            propFactory: (state, _r, setter) => {
                return {
                    checked: state['copyrightApproved'] ?? false,
                    onChange: (
                        _e: React.SyntheticEvent,
                        checked: boolean,
                    ) => {
                        setter(checked);
                    },
                };
            },
            field: 'copyrightApproved',
            initialValue: false,
            mb: 0,
        } : {
            field: 'copyrightApproved',
            initialValue: false,
        }),
        {
            component: TextField,
            propFactory: (state, _r, setter) => {
                return {
                    fullWidth: true,
                    label: 'Rights Statement',
                    onChange: (
                        e: React.SyntheticEvent<HTMLInputElement>
                    ) => {
                        setter(e.currentTarget.value);
                    },
                    value: state['rightsStatement'] ?? '',
                };
            },
            field: 'rightsStatement',
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
                            newTags: Metadata[],
                        ) => {
                            return onCreate(
                                metadataType,
                                // Gets rid of 'Add ""' formatting
                                newTags.map(tag => ({
                                    ...tag,
                                    name: tag.name.substring(5, tag.name.length - 1),
                                }))
                            );
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
            component: (props) => (
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
                const genericSetter = genericSetter_ as (
                    field: string,
                    val: any,
                ) => void;

                return {
                    reviewed: state['status'] !== Status.REVIEW,
                    datePicker: {
                        disableToolbar: true,
                        variant: 'inline',
                        format: 'MM/dd/yyyy',
                        label: 'Reviewed On',
                        onChange: (date: Date, val?: string) => {
                            setter(
                                (oldState: Date) => {
                                    return val ?
                                        date && !isNaN(date.getTime()) ?
                                            format(date, 'yyyy-MM-dd')
                                            :
                                            oldState
                                        :
                                        null;
                                }
                            );

                            genericSetter('rawReviewedDate', val);
                        },
                        value: state['reviewedDate'] ?
                            parseISO(state['reviewedDate'])
                            :
                            Date.now(),
                        inputValue: state['rawReviewedDate'] ?? '',
                        minDate: null,
                        maxDate: null,
                    },
                };
            },
            field: 'reviewedDate',
            initialValue: null,
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
