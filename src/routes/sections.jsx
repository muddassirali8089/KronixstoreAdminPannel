import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from '../theme/styles/index';
import { AuthLayout } from '../layouts/auth/index';
import { DashboardLayout } from '../layouts/dashboard/index';
import AddUser from '../sections/product/view/add_user_view';
import OrderDetails from '../sections/user/view/order-details';
import Addcategory from '../sections/product/view/add_category_view';
import AddProductForm from '../sections/product/view/add_product_view';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('../pages/home'));
export const CategoryPage = lazy(() => import('../pages/category'));
export const OrderPage = lazy(() => import('../pages/orders'));
export const UserPage = lazy(() => import('../pages/user'));
export const SignInPage = lazy(() => import('../pages/sign-in'));
export const ProductsPage = lazy(() => import('../pages/products'));
export const Page404 = lazy(() => import('../pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'order-details/:order_id', element: <OrderDetails /> },
        { path: 'category', element: <CategoryPage /> },
        { path: 'orders', element: <OrderPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'new-product', element: <AddProductForm /> },
        { path: '/products/edit/:id', element: <AddProductForm /> },
        { path: '/category/edit/:id', element: <Addcategory /> },
        { path: 'edit-category/:id', element: <Addcategory /> },
        { path: 'new-user', element: <AddUser /> },
        {path:'new-category' , element: <Addcategory/>}
        
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
