//Importing from outside the project
import React from 'react';

//Importing from other files in the project
import Modal from './Modal';
import * as GlobalActions from '../../state/global';
import * as MetadataActions from '../../state/metadata';
import * as ContentActions from '../../state/content';
import { useCCDispatch, useCCSelector } from '../../hooks';
import { Tabs } from '../../enums';
import { Content, Query, Metadata, MetadataType } from 'js/types';

type PageProps = {

}

/**
 * The full page body for the content tab.
 * @param _ Unused for now
 * @returns The full page.
 */
function Page(_: PageProps): React.ReactElement {
    const dispatch = useCCDispatch();
    const metadata = useCCSelector(state => state.metadata.metadata);
    const metadataTypes = useCCSelector(state => state.metadata.metadata_types);
    const content = useCCSelector(state => state.content.content);
    const total = useCCSelector(state => state.content.total);
    const loading = useCCSelector(state => state.content.loading);
    const page = useCCSelector(state => state.content.page);
    const pageSize = useCCSelector(state => state.content.pageSize);
    const selected = useCCSelector(state => state.content.selected);
    const selectionModel = useCCSelector(state => state.content.selectionModel);

    React.useEffect(() => {
        dispatch(GlobalActions.update_current_tab(Tabs.CONTENT));
        dispatch(MetadataActions.fetch_metadatatype());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(ContentActions.fetch_content());
    }, [dispatch, page, pageSize]);

    const onEdit_ = React.useCallback(
        (content: Content, vals: Partial<Content>) => {
            vals.id = content.id;
            dispatch(ContentActions.edit_content(vals as Content));
        },
        [dispatch],
    );

    const onDelete_ = React.useCallback(
        (content: Content) => {
            // To avoid dealing with pages that no longer exist
            dispatch(ContentActions.update_pagination({
                page: 0,
            }));
            dispatch(ContentActions.delete_content(content.id));
        },
        [dispatch],
    );

    const onSelectedDelete_ = React.useCallback(
        (ids: number[]) => {
            // To avoid dealing with pages that no longer exist
            dispatch(ContentActions.update_pagination({
                page: 0,
            }));
            dispatch(ContentActions.delete_content(ids));
        },
        [dispatch],
    );

    const onAdd_ = React.useCallback(
        (content?: Content) => {
            if (content) {
                dispatch(ContentActions.add_content(content));
            }
        },
        [dispatch],
    );

    const onQueryChange = React.useCallback(
        (query: Query) => {
            dispatch(ContentActions.update_pagination({
                page: 0,
            }));
            dispatch(ContentActions.update_filters(query));
        },
        [dispatch],
    );

    const onCreate = React.useCallback(
        (metadataType: MetadataType, newTags: Metadata[]) => {
            newTags.forEach(tag =>
                dispatch(MetadataActions.add_metadata({
                    name: tag.name,
                    type_id: metadataType.id,
                }))
            );

            // Ideally, async action would return newly selected metadata
            // Rxjs complicates this, though
            return (async () => [])();
        },
        [dispatch],
    );

    return (
        <Modal
            metadata={metadata}
            metadataTypes={metadataTypes}
            content={content}
            actions={{
                Display: {
                    onEdit: onEdit_,
                    onDelete: onDelete_,
                    onPageSizeChange: params => {
                        dispatch(ContentActions.update_pagination({
                            pageSize: params.pageSize,
                            page: params.page,
                        }));
                    },
                    onPageChange: params => {
                        dispatch(ContentActions.update_pagination({
                            page: params.page,
                        }));
                    },
                    onCreate: onCreate,
                    onSelectChange: params => {
                        const ids = params.selectionModel as number[];

                        // This callback seems to fire infinitely without an
                        // equality check of some kind.
                        const isNew = ids.some(id => !selectionModel.includes(id))
                            || ids.length !== selectionModel.length;

                        if (isNew) {
                            dispatch(ContentActions.update_selected(
                                params.selectionModel as number[],
                            ));
                        }
                    },
                },
                SelectedToolbar: {
                    onDelete: ids => {
                        // To avoid dealing with pages that no longer exist
                        dispatch(ContentActions.update_pagination({
                            page: 0,
                        }));
                        dispatch(ContentActions.delete_content(ids));
                    },
                    onClear: _ => {
                        dispatch(ContentActions.clear_selected());
                    },
                },
                Toolbar: {
                    onAdd: onAdd_,
                    onCreate: onCreate,
                },
                Search: {
                    onQueryChange: onQueryChange,
                }
            }}
            pageProps={{
                rowCount: total,
                page: page,
                pageSize: pageSize,
                loading: loading,
            }}
            selected={selected}
        />
    );
}

export default Page;
