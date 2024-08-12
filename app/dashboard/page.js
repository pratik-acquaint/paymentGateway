// Dashboard.js
'use client'
import React, { useEffect, useState, useRef } from 'react';
import { Stack } from '@mui/material';
import StripeCheckout from '@/Component/stripeCheckout';
import withAuth from '@/Component/withAuth';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';

const columns = [
    { id: '', label: 'Id', minWidth: 40 },
    { id: 'email', label: 'CustomerEmail', minWidth: 100 },
    { id: 'transactionId', label: 'TransactionId', minWidth: 150 },
    { id: 'price', label: 'Amount', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 150 },
    { id: 'createdAt', label: 'Date', minWidth: 100 },
];

const Dashboard = () => {
    let stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
    const [record, setRecord] = useState([]);
    console.log("record", record)
    // const [total, setTotal] = useState(10);
    // const [page, setPage] = useState(1);
    // const [rowsPerPage, setRowsPerPage] = useState(10);
    const status = useRef(true)

    useEffect(() => {
        if (status.current) {
            handleRecord();
        }
        status.current = false
    }, [])


    const getCustomerEmailFromCharge = async (chargeId) => {
        try {
            const response = await axios.get(`https://api.stripe.com/v1/charges/${chargeId}`, {
                headers: {
                    'Authorization': `Bearer ${stripeSecretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.billing_details.email || 'No email available';
        } catch (error) {
            console.error(`Error fetching charge details: ${error.message}`);
            return 'Error retrieving email';
        }
    };

    const handleRecord = async () => {
        try {
            const response = await axios.get('https://api.stripe.com/v1/payment_intents', {
                headers: {
                    'Authorization': `Bearer ${stripeSecretKey}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    limit: 100
                }
            });

            if (response.status !== 200) {
                throw new Error(`Error fetching payment history: ${response.statusText}`);
            }

            const paymentIntents = response?.data?.data;
            const transactionDetails = [];

            for (const intent of paymentIntents) {
                const customerEmail = intent.latest_charge ? await getCustomerEmailFromCharge(intent.latest_charge) : 'No customer associated';

                // Extract relevant details
                const transactionId = intent.id
                const date = moment.unix(intent.created ).format('DD-MM-YYYY HH:mm:ss');
                const price = (intent.amount / 100).toFixed(2);
                const status = intent.status;

                transactionDetails.push({
                    transactionId,
                    customerEmail,
                    date,
                    price,
                    status
                });
            }
            setRecord(transactionDetails);
        } catch (error) {
            console.error(error);
        }
    }

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(1);
    // };


    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Stack gap={"20px"} alignItems={"center"} >

                <StripeCheckout />
                

                <Paper sx={{ width: '90%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {record.length > 0 ? record?.map((row, ind) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {/* {ind + 1 + (page - 1) * 10} */}
                                            {ind}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left">
                                            {row.customerEmail ? row?.customerEmail : '--'}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left">
                                            {row.transactionId ? row?.transactionId : '--'}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left">
                                            {row.price ? row?.price : '--'}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left">
                                            {row.status ? row?.status : '--'}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left">
                                            {moment(row?.createdAt).format('DD-MM-YYYY')}
                                        </TableCell>
                                    </TableRow>
                                ))
                                    :
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            <CircularProgress /> 
                                        </TableCell>
                                    </TableRow>

                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={total}
                        rowsPerPage={rowsPerPage}
                        page={page - 1}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}
                </Paper>
            </Stack>
        </div>
    );
}

export default withAuth(Dashboard);
