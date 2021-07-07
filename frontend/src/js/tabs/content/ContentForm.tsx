//Importing from outside the project
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

//Importing from other files in the project
import { ContentModal, ContentMetadataDisplay } from 'solarspell-react-lib';
import { Metadata, MetadataType, Content } from 'js/types';

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

    return (
        <ContentModal<Content>
            initialState={content}
            items={[
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
                    label: 'title',
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
                            value: state['description'],
                        };
                    },
                    label: 'description',
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
                    propFactory: (state, reasons, setter, genericSetter) => {
                        return {
                            onChange: (
                                e: React.SyntheticEvent<HTMLInputElement>
                            ) => {
                                const target = e.target as HTMLInputElement;
                                const file = target.files?.[0];
                                if (file) {
                                    setter(file);
                                    genericSetter('fileName', file.name);
                                }
                            },
                            text: state['fileName'] ?
                                `Existing file: ${state['fileName']}`
                                :
                                'No file chosen',
                            error: reasons['file'],
                        };
                    },
                    label: 'file',
                    initialValue: undefined,
                    validator: (state) => {
                        if (!state['file'] && !state['fileURL']) {
                            return 'A file must be uploaded';
                        } else {
                            return null;
                        }
                    },
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
                            error: !!reasons['datePublished'],
                            helperText: reasons['datePublished'],
                            value: state['datePublished'],
                        };
                    },
                    label: 'datePublished',
                    initialValue: '',
                    validator: (state) => {
                        if (
                            !state['datePublished'] ||
                            isNaN(Number(state['datePublished'])
                        )) {
                            return 'Invalid year';
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
                        label: 'Copyright Notes',
                        onChange: (
                            e: React.SyntheticEvent<HTMLInputElement>
                        ) => {
                            setter(e.currentTarget.value);
                        },
                        value: state['copyright'],
                        };
                    },
                    label: 'copyright',
                    initialValue: '',
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
                            value: state['rightsStatement'],
                        };
                    },
                    label: 'rightsStatement',
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
                    label: 'metadata',
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
                            value: state['notes'],
                        };
                    },
                    label: 'notes',
                    initialValue: '',
                },
            ]}
            dialogStyle={dialogStyle}
            onSubmit={onSubmit}
            open={open}
        />
    );
}

export default React.memo(ContentForm);
