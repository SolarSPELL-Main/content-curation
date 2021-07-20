//Importing from outside the project
import React from 'react';

//Importing from other files in the project
import Modal from './Modal';
import * as GlobalActions from '../../state/global';
import * as MetadataActions from '../../state/metadata';
import * as ContentActions from '../../state/content';
import { useCCDispatch, useCCSelector } from '../../hooks';
import { Tabs } from '../../enums';
import { Content, Query } from 'js/types';

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

    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(5);

    React.useEffect(() => {
        dispatch(GlobalActions.update_current_tab(Tabs.CONTENT));
        dispatch(MetadataActions.fetch_metadatatype());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(ContentActions.fetch_content({
            pageSize,
            page: page + 1, // Django starts from 1
        }));
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
            dispatch(ContentActions.delete_content(content.id));
        },
        [dispatch],
    );

    const onSelectedDelete_ = React.useCallback(
        (content: Content[]) => {
            dispatch(ContentActions.delete_content(content.map(c => c.id)));
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
            dispatch(ContentActions.update_filters(query));
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
                    onSelectedDelete: onSelectedDelete_,
                    onPageSizeChange: params => {
                        setPageSize(params.pageSize);
                        setPage(params.page);
                    },
                    onPageChange: params => {
                        setPage(params.page);
                    },
                },
                Toolbar: {
                    onAdd: onAdd_,
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
        />
    );
}

export default Page;
