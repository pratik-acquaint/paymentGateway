'use client'
import React, { useEffect, useState, useRef } from 'react';
import { Box, Card, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import StripeCheckout from '@/Component/stripeCheckout';
import withAuth from '@/Component/withAuth';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
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

const Dashboard = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    let stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [record, setRecord] = useState([]);
    const [filteredRecord, setFilteredRecord] = useState([]);
    const [statusValue, setStatusValue] = useState('');
    const [loading, setLoading] = useState(true);
    const status = useRef(true);

    useEffect(() => {
        // if (status.current) {
        //     handleRecord();
        // }
        // status.current = false;

        if (session_id) {
            handleRecord();
        }
    }, [session_id]);

    const handleRecord = async () => {
        axios.post(`${API_URL}/stripe-webhook?session_id=${session_id}`)
            .then(response => {
                console.log('Session details:', response.data);
            })
            .catch(error => console.error('Error fetching session:', error));
    }


    // const getCustomerEmailFromCharge = async (chargeId) => {
    //     try {
    //         const response = await axios.get(`https://api.stripe.com/v1/charges/${chargeId}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${stripeSecretKey}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         return response.data.billing_details.email || 'No email available';
    //     } catch (error) {
    //         console.error(`Error fetching charge details: ${error.message}`);
    //         return 'Error retrieving email';
    //     }
    // };

    // const handleRecord = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.get('https://api.stripe.com/v1/payment_intents', {
    //             headers: {
    //                 'Authorization': `Bearer ${stripeSecretKey}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             params: {
    //                 limit: 100,
    //             },
    //         });

    //         if (response.status !== 200) {
    //             throw new Error(`Error fetching payment history: ${response.statusText}`);
    //         }

    //         const paymentIntents = response?.data?.data;
    //         const transactionDetails = [];

    //         for (const intent of paymentIntents) {
    //             const customerEmail = intent.latest_charge ? await getCustomerEmailFromCharge(intent.latest_charge) : 'No customer associated';
    //             const transactionId = intent.id;
    //             const date = moment.unix(intent.created).format('DD-MM-YYYY HH:mm:ss');
    //             const price = (intent.amount / 100).toFixed(2);
    //             const status = intent.status;

    //             transactionDetails.push({
    //                 transactionId,
    //                 customerEmail,
    //                 date,
    //                 price,
    //                 status,
    //             });
    //         }

    //         setRecord(transactionDetails);
    //         setFilteredRecord(transactionDetails);
    //         setLoading(false);

    //     } catch (error) {
    //         console.error(error);
    //         setLoading(false);
    //     }
    // };

    // const handleStatus = (event) => {
    //     let value = event.target.value;
    //     setStatusValue(value);

    //     if (value) {
    //         const filtered = record.filter(intent => intent.status === value);
    //         setFilteredRecord(filtered);
    //     } else {
    //         setFilteredRecord(record);
    //     }
    // };

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Stack gap={"20px"} alignItems={"center"} >
                <Box marginRight={'10%'} display="flex" alignSelf={'end'} gap={4}>

                    <StripeCheckout />

                    {/* <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={statusValue}
                            label="Status"
                            onChange={handleStatus}
                        >
                            <MenuItem value=''>All</MenuItem>
                            <MenuItem value={'succeeded'}>Succeeded</MenuItem>
                            <MenuItem value={'canceled'}>Canceled</MenuItem>
                            <MenuItem value={'failed'}>Failed</MenuItem>
                        </Select>
                    </FormControl> */}
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

}
export default withAuth(Dashboard);
