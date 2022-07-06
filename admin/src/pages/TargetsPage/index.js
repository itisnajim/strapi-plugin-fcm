import React, { memo, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { Checkbox } from '@strapi/design-system/Checkbox';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Dots, NextLink, PageLink, Pagination, PreviousLink } from '@strapi/design-system/Pagination';
import { Button } from '@strapi/design-system/Button';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import PaperPlane from '@strapi/icons/PaperPlane';
import { Alert } from '@strapi/design-system/Alert';

import api from '../../service/api';


const TargetsPage = (props) => {
    const history = useHistory();

    let entry = props?.location?.state;
    if (!entry) {
        entry = JSON.parse(localStorage.getItem('fcmLastNotification'));
    }
    if (!entry) {
        history.goBack();
    }

    const defaultPageSize = 20;
    const [page, setPage] = useState(1);
    const [allTargets, setAllTargets] = useState(null);
    const [targets, setTargets] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [selectedTargets, setSelectedTargets] = useState(null);
    const [targetsCheckedState, setTargetsCheckedState] = useState({ unchecked: true });
    const [paginationInfo, setPaginationInfo] = useState(null);
    const [alertToShow, setAlertToShow] = useState(null);


    const fetchTargets = async (page, pageSize = defaultPageSize) => {
        setFetching(true);
        let items = paginate(page, pageSize);
        if (items && items.length > 0) {
            console.log('targets', items);
            setTargets(items);
            setFetching(false);
        } else {
            const res = await api.getTargets(page, pageSize);
            items = res.data;
            console.log('items', items);
            if (!paginationInfo && res.pagination && res.pagination.pageCount > 0) {
                console.log('res.pagination', res.pagination);
                setPaginationInfo(res.pagination);
            }
            if (items && items.length > 0) {
                insertTargetsAtOffset(items, (page - 1) * pageSize);
                setTargets(items);
                setFetching(false);
                setPage(page + 1);
            }
        }
    };
    useEffect(() => {
        fetchTargets(1);
    }, []);

    const toggleCheckTarget = (target) => {
        let selected = selectedTargets || [];
        const index = selected.indexOf(target);
        index >= 0 ? selected.splice(index, 1) : selected.push(target);
        //console.log('selected', selected.length, 'allTargets', allTargets.length, 'index', index);
        if (selected.length >= allTargets.length && selected.length !== 0) {
            setTargetsCheckedState({ checked: true });
        } else if (selected.length === 0) {
            setTargetsCheckedState({ unchecked: true });
        } else {// Indeterminate state is used to show partially checked states.
            setTargetsCheckedState({ indeterminate: true });
        }
        setSelectedTargets(selected);
    };

    const toggleCheckAllTargets = () => {
        //console.log('allTargets', allTargets, 'selectedTargets', selectedTargets);
        let selected = selectedTargets || [];
        if (selected.length > 0) { // unselect all
            setSelectedTargets([]);
            setTargetsCheckedState({ unchecked: true });
        } else {
            setSelectedTargets(allTargets ? [...allTargets] : []);
            setTargetsCheckedState({ checked: true });
        }
    };

    const isTargetChecked = (target) => {
        return (selectedTargets || []).indexOf(target) > -1;
    }

    const paginate = (page, pageSize = defaultPageSize) => {
        const all = allTargets || []
        return all.slice((page - 1) * pageSize, page * pageSize);
    };

    const insertTargetsAtOffset = (items, offset) => {
        const all = allTargets ? [...allTargets] : [];
        all.splice(offset, items.length, ...items);
        setAllTargets(all);
    };

    const range = (size, startAt = 0) => {
        return [...Array(size).keys()].map(i => i + startAt);
    };

    const startPartPagination = () => {
        const size = paginationInfo?.pageCount || 1;
        if (size < 7) {
            return range(size);
        } else if (page <= 2) {
            return range(4);
        } else {
            return [0];
        }
        /**
         1 ... 3 4 5 ... 7 >> page > 2 && size > 5
         1 2 3 4 ... 7
         1 2 3 4 5 6
         */
    };

    const middlePartPagination = () => {
        const size = paginationInfo?.pageCount || 1;
        if (size >= 7) {
            if (page >= 3 && page < size - 3) {
                return range(3, page - 1);
            }
        }
        return undefined;

        /**
         1 ... 3 4 5 ... 7 >> page >= 3 && page < size - 3
         1 ... 18 19 20 21
         1 2 3 4 ... 21
         */
    };

    const endPartPagination = () => {
        const size = paginationInfo?.pageCount || 1;
        if (size > 5) {
            if (page > 3 && page >= size - 3) {
                return range(4, size - 4);
            } else {
                return [size - 1];
            }
        }
        return undefined;
        /**
         1 ... 3 4 5 ... [7] >> size > 5 && 
         1 ... 4 5 6 7 >> page > 3 && page >= size - 3
         1 2 3 4 ... 7 >> page < 5 && page < size - 3
         */

    };

    const sendToSelected = async () => {
        const selected = selectedTargets || [];
        if (selected.length < 1) {
            setAlertToShow({
                title: 'Error',
                message: 'One or more targets should be selected to send the fcm message.',
                variant: 'danger'
            });
            return;
        }

        console.log('selected', selected);
        const typesValues = selected.reduce((p, n) => {
            console.log('p', p, 'n', n, n.type === 'token', n.type === 'topic');
            if (n.type === 'token') {
                p.tokens = p.tokens || [];
                p.tokens.push(n.value);
            }else if (n.type === 'topic') {
                p.topics = p.topics || [];
                p.topics.push(n.value);
            }
            return p;
        }, {});
        console.log('typesValues', typesValues);
        const payload = {
            title: entry.title,
            body: entry.body,
            image: entry.image,
            payload: entry.payload
        }
        const entries = [];
        if(typesValues.tokens?.length > 0){
            entries.push({...payload, ...{targetType: 'tokens', target: typesValues.tokens.join(',')}});
        }
        if(typesValues.topics?.length > 0){
            entries.push({...payload, ...{targetType: 'topics', target: typesValues.topics.join(',')}});
        }
        console.log('entries', entries);
        try {
            const response = await api.sendFCMs(entries);
            console.log('response', response);
            setAlertToShow({
                title: 'Sent',
                message: 'FCM sent successfully.',
                variant: 'success'
            });
        } catch (err) {
            setAlertToShow({
                title: 'Error',
                message: 'Failed to send to FCM. '+JSON.stringify(err || {}),
                variant: 'danger'
            });
        }
    };

    return (
        <>
            {fetching && <div>
                <Typography variant="sigma">Loading...</Typography>
            </div>}
            {targets && targets.length > 0 ? (
                <>
                    <Table colCount={5} rowCount={20}>
                        <Thead>
                            <Tr>
                                <Th>
                                    <Checkbox onClick={() => toggleCheckAllTargets()} {...targetsCheckedState}></Checkbox>
                                </Th>
                                <Th>
                                    <Typography variant="sigma">#</Typography>
                                </Th>
                                <Th>
                                    <Typography variant="sigma">Label</Typography>
                                </Th>
                                <Th>
                                    <Typography variant="sigma">Type</Typography>
                                </Th>
                                <Th>
                                    <Typography variant="sigma">Target</Typography>
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {targets.map((target, idx) => {
                                return (<Tr key={target.value}>
                                    <Td>
                                        <Checkbox onClick={() => toggleCheckTarget(target)} checked={isTargetChecked(target)}></Checkbox>
                                    </Td>
                                    <Td>
                                        <Typography textColor="neutral800">{idx + 1}</Typography>
                                    </Td>
                                    <Td>
                                        <Typography textColor="neutral800">{target.label}</Typography>
                                    </Td>
                                    <Td>
                                        <Typography textColor="neutral800">{target.type}</Typography>
                                    </Td>
                                    <Td style={{position: "relative"}}>
                                        <Typography style={{position: "absolute", top: "50%", transform: "translateY(-50%)", maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} textColor="neutral800">{target.value}</Typography>
                                    </Td>
                                </Tr>)
                            })}
                        </Tbody>
                    </Table>
                    <Box marginTop={2}>

                        <Pagination activePage={(page > 0) ? page - 1 : 1} pageCount={paginationInfo?.pageCount || 1}>
                            <PreviousLink to="#">Go to previous page</PreviousLink>
                            {startPartPagination().map(el => <PageLink key={el} number={el + 1} to="#">
                                Go to page {el + 1}
                            </PageLink>
                            )}

                            {middlePartPagination() && <Dots>Other pages</Dots>}
                            {middlePartPagination() && middlePartPagination().map(el => <PageLink key={el} number={el + 1} to="#">
                                Go to page {el + 1}
                            </PageLink>
                            )}

                            {endPartPagination() && <Dots>Other pages</Dots>}
                            {endPartPagination() && endPartPagination().map(el => <PageLink key={el} number={el + 1} to="#">
                                Go to page {el + 1}
                            </PageLink>
                            )}
                            <NextLink to="#">Go to next page</NextLink>
                        </Pagination>
                    </Box>
                </>
            ) :
                (<div>
                    <Typography variant="sigma" paddingBottom={1}>No targets found.</Typography>
                    <p><Typography variant="omega" fontWeight="semiBold">Add topics to 'FCM Topic' Collection, and optionally configure which collection contains the devices tokens.</Typography></p>
                </div>)}

            <Grid>
                <GridItem col={12} padding={1} marginTop={4}>
                    <Typography variant="sigma">Targets Selected: {(selectedTargets || []).length}</Typography>
                </GridItem>
                {alertToShow && <GridItem col={12}>
                    <Alert
                        onClose={() => setAlertToShow(null)}
                        closeLabel="Close alert" title={alertToShow.title} variant={alertToShow.variant}>{alertToShow.message}</Alert>
                </GridItem>}
                <GridItem col={12} padding={1} marginTop={2}>
                    <Button
                        onClick={() => sendToSelected()}
                        variant='default' endIcon={<PaperPlane />}>
                        Send
                    </Button>
                </GridItem>
            </Grid>

        </>
    );
};

export default memo(TargetsPage);
