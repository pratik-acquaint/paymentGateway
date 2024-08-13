
'use client'
import React, { useEffect, useState, useRef,Suspense } from 'react';
import { Box, Card, Stack } from '@mui/material';
import StripeCheckout from '@/Component/stripeCheckout';
import withAuth from '@/Component/withAuth';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import { useSearchParams } from 'next/navigation';

const columns = [
    { id: '', label: 'Id', minWidth: 40 },
    { id: 'email', label: 'Customer Email', minWidth: 150 },
    { id: 'transactionId', label: 'Transaction-Id', minWidth: 150 },
    { id: 'price', label: 'Amount', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'createdAt', label: 'Date', minWidth: 150 },
];

const DashboardContent = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');
    const [record, setRecord] = useState([]);
    const [filteredRecord, setFilteredRecord] = useState([]);
    const [statusValue, setStatusValue] = useState('');
    const [loading, setLoading] = useState(true);
    const status = useRef(true);

    useEffect(() => {
        if (session_id) {
            handleRecord();
        }
    }, [session_id]);

    const handleRecord = async () => {
        try {
            const response = await axios.post(`${API_URL}/stripe-webhook?session_id=${session_id}`);
            console.log('Session details:', response.data);
            // Handle response and update state
        } catch (error) {
            console.error('Error fetching session:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Stack gap={"20px"} alignItems={"center"}>
                <Box marginRight={'10%'} display="flex" alignSelf={'end'} gap={4}>
                    <StripeCheckout />
                </Box>
                <Card sx={{ width: '80%' }}>
                    <TableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            style={{ minWidth: column.minWidth, backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredRecord.length > 0 ? (
                                    filteredRecord.map((row, ind) => (
                                        <TableRow key={row.transactionId}>
                                            <TableCell component="th" scope="row">
                                                {ind + 1}
                                            </TableCell>
                                            <TableCell align="left">{row.customerEmail || '--'}</TableCell>
                                            <TableCell align="left">{row.transactionId || '--'}</TableCell>
                                            <TableCell align="left">{row.price || '--'}</TableCell>
                                            <TableCell align="left">{row.status || '--'}</TableCell>
                                            <TableCell align="left">{row.date}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            No Record available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Stack>
        </div>
    );
};

const Dashboard = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent />
    </Suspense>
);


export default withAuth(Dashboard);

