import React from 'react';
import { useParams } from 'react-router-dom';

import { Box, Card, Table, Paper, Button, Divider, TableRow, Container, TableBody, TableCell, TableHead, Typography, CardContent, TableContainer } from '@mui/material';

const order = {
  id: 'ORD123456',
  date: 'March 31, 2024',
  status: 'Shipped',
  customer: {
    name: 'John Doe',
    email: 'johndoe@example.com',
    address: '123 Main St, New York, NY 10001',
  },
  products: [
    { id: 1, name: 'Nike Air Force 1', price: 120, quantity: 1 },
    { id: 2, name: 'Adidas Ultraboost', price: 180, quantity: 2 },
  ],
  total: 480,
  payment: 'Paid',
};

const OrderDetails = () => {
  const { order_id } = useParams();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order Details #{order_id}
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Order ID: {order.id}</Typography>
          <Typography>Date: {order.date}</Typography>
          <Typography>Status: {order.status}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Customer Details</Typography>
          <Typography>Name: {order.customer.name}</Typography>
          <Typography>Email: {order.customer.email}</Typography>
          <Typography>Address: {order.customer.address}</Typography>
        </CardContent>
      </Card>
      <Box mt={4}>
        <Typography variant="h6">Products</Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${product.price * product.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box mt={4} textAlign="right">
        <Typography variant="h6">Total: ${order.total}</Typography>
        <Typography>Payment: {order.payment}</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Track Order
        </Button>
      </Box>
    </Container>
  )
}



export default OrderDetails;
