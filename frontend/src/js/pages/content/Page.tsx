//Importing from outside the project
import React from 'react';

//Importing from other files in the project
import Modal from './Modal';
import * as GlobalActions from '../../state/global';
import * as MetadataActions from '../../state/metadata';
import * as ContentActions from '../../state/content';
import { useCCDispatch, useCCSelector } from '../../hooks';
import { Tabs } from '../../enums';
import { Content } from 'js/types';

type PageProps = {

}

/**
 * The full page body for the content tab.
 * @param _ Unused for now
 * @returns The full page.
 */
function Page(_: PageProps): React.ReactElement {
    const dispatch = useCCDispatch();
    const content = useCCSelector(state => state.content.content);
    const total = useCCSelector(state => state.content.total);
    const page = useCCSelector(state => state.content.page);
    const pageSize = useCCSelector(state => state.content.pageSize);
    const selected = useCCSelector(state => state.content.selected);
    const selectionModel = useCCSelector(state => state.content.selectionModel);
    const sortModel = useCCSelector(state => state.content.sortModel);
    const user_id = useCCSelector(state => state.global.user.user_id)

    React.useEffect(() => {
        // Avoids accidentally adding metadata added from metadata tab
        dispatch(MetadataActions.update_newly_added([]));
        dispatch(GlobalActions.update_current_tab(Tabs.CONTENT));
        dispatch(MetadataActions.fetch_metadatatype());
    }, [dispatch]);

    React.useEffect(() => {
        if (user_id !== 0) {
            dispatch(ContentActions.fetch_content());
        }
    }, [dispatch, page, pageSize, sortModel, user_id]);

    const onEdit_ = React.useCallback(
        (content: Content, vals?: Partial<Content>) => {
            if (vals) {
                vals.id = content.id;
                dispatch(ContentActions.edit_content(vals as Content));
            }

            // Clear newly added
            dispatch(MetadataActions.update_newly_added([]));
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

    return (
        <Modal
            content={content}
            actions={{
                Table: {
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
            }}
            pageProps={{
                rowCount: total,
                page: page,
                pageSize: pageSize,
            }}
            sortProps={{
                sortModel: sortModel,
                onSortModelChange: params => 
                    dispatch(ContentActions.update_sortmodel(params.sortModel)),
            }}
            selected={selected}
        />
    );
}

export default Page;
