import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { ContentModal, ContentMetadataDisplay } from 'solarspell-react-lib';

import { Metadata, MetadataType, Content } from '../../types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    onSubmit: (content?: Content) => void
}

/**
 * 
 */
function Modal({
    metadata,
    metadataTypes,
    onSubmit,
}: ModalProps): React.ReactElement {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button
                variant={'contained'}
                color={'primary'}
                onClick={() => setOpen(true)}
            >
                Add Content
            </Button>
            <ContentModal<Content>
                items={[
                    {
                        component: TextField,
                        propFactory: (state, reasons, setter) => {
                            return {
                                fullWidth: true,
                                label: 'Title',
                                onChange: (event: React.SyntheticEvent<HTMLInputElement>) => {
                                    setter(event.currentTarget.value);
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
                                return 'Title is required.';
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
                                onChange: (event: React.SyntheticEvent<HTMLInputElement>) => {
                                    setter(event.currentTarget.value);
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
                            </>
                        ),
                        propFactory: (state, _r, setter) => {
                            return {
                                onChange: (event: React.SyntheticEvent<HTMLInputElement>) => {
                                    const target = event.target as HTMLInputElement;
                                    const file = target.files?.[0];
                                    if (file) {
                                        setter(file.name);
                                    }
                                },
                                text: state['fileName'] ?
                                    `Existing file: ${state['fileName']}`
                                    :
                                    'No file chosen',
                            };
                        },
                        label: 'fileName',
                        initialValue: '',
                    },
                    {
                        component: TextField,
                        propFactory: (state, reasons, setter) => {
                            return {
                                fullWidth: true,
                                label: 'Year of Publication',
                                onChange: (event: React.SyntheticEvent<HTMLInputElement>) => {
                                    setter(event.currentTarget.value);
                                },
                                error: !!reasons['datePublished'],
                                helperText: reasons['datePublished'],
                                value: state['datePublished'],
                            };
                        },
                        label: 'datePublished',
                        initialValue: '',
                        validator: (state) => {
                            if (!state['datePublished'] || isNaN(Number(state['datePublished']))) {
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
                            onChange: (event: React.SyntheticEvent<HTMLInputElement>) => {
                                setter(event.currentTarget.value);
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
                                onChange: (event: React.SyntheticEvent<HTMLInputElement>) => {
                                    setter(event.currentTarget.value);
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
                                onChange: (event: React.SyntheticEvent<HTMLInputElement>) => {
                                    setter(event.currentTarget.value);
                                },
                                value: state['notes'],
                            };
                        },
                        label: 'notes',
                        initialValue: '',
                    },
                ]}
                dialogStyle={{
                    title: 'Add New Item',
                    cancelColor: 'secondary',
                    confirmColor: 'primary',
                    confirmText: 'Add',
                }}
                onSubmit={onSubmit}
                open={open}
            />
        </>
    );
}

export default Modal;
