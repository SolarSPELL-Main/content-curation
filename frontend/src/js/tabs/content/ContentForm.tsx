//Importing from outside the project
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { format, parseISO } from 'date-fns';

//Importing from other files in the project
import {
    ContentModal,
    ContentMetadataDisplay,
    FormFieldDescriptor,
} from 'solarspell-react-lib';
import { useCCSelector } from '../../hooks';
import { Metadata, MetadataType, Content } from 'js/types';
import APP_URLS from "../../urls"
import { api } from "../../utils"

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
    open,
    content,
    type,
}: ContentFormProps): React.ReactElement {
    const groups = useCCSelector(state => state.global.user.groups);

    // Admin / Library Specialist should be able to modify
    // reviewed fields
    const showReviewed = groups.includes('Library Specialist')
        || groups.includes('Admin');

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
                } else {
                    return null
                }
            },
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
        },
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
                    },
                };
            },
            field: 'metadata',
            initialValue: {},
        },
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

    if (showReviewed) {
        // This will NEVER be null, considering fields is defined above
        const notesField = fields.pop()!;
        const reviewedField: FormFieldDescriptor<Content> = {
            component: (props) => (
                <>
                    <Typography>Reviewed</Typography>
                    <Checkbox
                        {...props.checkbox}
                    />
                    {props.checkbox.checked && <KeyboardDatePicker
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
                    checkbox: {
                        checked: state['reviewed'] ?? false,
                        onChange: (
                            _e: React.SyntheticEvent,
                            checked: boolean,
                        ) => {
                            setter(checked);
                        },
                    },
                    datePicker: {
                        disableToolbar: true,
                        variant: 'inline',
                        format: 'MM/dd/yyyy',
                        label: 'Reviewed On',
                        onChange: (date: Date, val?: string) => {
                            genericSetter('reviewedDate',
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
                            null,
                        inputValue: state['rawReviewedDate'] ?? '',
                    },
                };
            },
            field: 'reviewed',
            initialValue: false,
        };

        // Push them out-of-order for aesthetic purposes
        fields.push(reviewedField, notesField);
    }

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
