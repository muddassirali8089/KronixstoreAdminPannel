import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { Card, Table, Button, TableBody, TableContainer, TablePagination } from '@mui/material';

// import { CartIcon } from '../product-cart-widget';
import { useTable } from '../../user/view/user-view';
import { Iconify } from '../../../components/iconify';
import { TableNoData } from '../../user/table-no-data';
import { UserTableRow } from '../../user/user-table-row';
import { Scrollbar } from '../../../components/scrollbar';
import { UserTableHead } from '../../user/user-table-head';
import { TableEmptyRows } from '../../user/table-empty-rows';
import { DashboardContent } from '../../../layouts/dashboard';
import { UserTableToolbar } from '../../user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../user/utils';

// ----------------------------------------------------------------------

const GENDER_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'shose', label: 'Shose' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
];

const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];

const COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

const defaultFilters = {
  price: '',
  gender: [GENDER_OPTIONS[0].value],
  colors: [COLOR_OPTIONS[4]],
  rating: RATING_OPTIONS[0],
  category: CATEGORY_OPTIONS[0].value,
};

export function ProductsView() {
  const [sortBy, setSortBy] = useState('featured');
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://api.kronixstore.com/api/items');
        setItems(response.data); // assuming response is an array of categories
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);
  const deleteItems = async (id) => {
    try {
      await axios.delete(`https://api.kronixstore.com/api/items/${id}`);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }
  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState(defaultFilters);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);
  const RedirectTopage = () => {
    window.location.href = '/new-product'
  }
  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((updateState) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, [setFilters]);

  const canReset = Object.keys(filters).some(
    (key) => filters[key] !== defaultFilters[key]
  );
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered = applyFilter({
    inputData: items,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Products
        </Typography>
        <Button
          onClick={RedirectTopage}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Products
        </Button>
      </Box>

      {/* <CartIcon totalItems={8} /> */}

      {
        //   // <Box
        //   display="flex"
        //   alignItems="center"
        //   flexWrap="wrap-reverse"
        //   justifyContent="flex-end"
        //   sx={{ mb: 5 }}
        // >
        //   <Box gap={1} display="flex" flexShrink={0} sx={{ my: 1 }}>
        //     <ProductFilters
        //       canReset={canReset}
        //       filters={filters}
        //       onSetFilters={handleSetFilters}
        //       openFilter={openFilter}
        //       onOpenFilter={handleOpenFilter}
        //       onCloseFilter={handleCloseFilter}
        //       onResetFilter={() => setFilters(defaultFilters)}
        //       options={{
        //         genders: GENDER_OPTIONS,
        //         categories: CATEGORY_OPTIONS,
        //         ratings: RATING_OPTIONS,
        //         price: PRICE_OPTIONS,
        //         colors: COLOR_OPTIONS,
        //       }}
        //     />

        //     <ProductSort
        //       sortBy={sortBy}
        //       onSort={handleSort}
        //       options={[
        //         { value: 'featured', label: 'Featured' },
        //         { value: 'newest', label: 'Newest' },
        //         { value: 'priceDesc', label: 'Price: High-Low' },
        //         { value: 'priceAsc', label: 'Price: Low-High' },
        //       ]}
        //     />
        //   </Box>
        // </Box>
      }

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={items.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    items.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'image', label: 'Image' },
                  { id: 'name', label: 'Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'price', label: 'Price' },
                  { id: 'mrp', label: 'Mrp' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Action' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      onEdit={() => navigate(`/products/edit/${row.id}`)}
                      onDelete={() => deleteItems(row.id)}
                      columns={[
                        { id: 'image', label: 'Image' },
                        { id: 'name', label: 'Name' },
                        { id: 'description', label: 'Description' },
                        { id: 'price', label: 'Price' },
                        { id: 'mrp', label: 'Mrp' },
                        { id: 'status', label: 'Status' },
                      ]}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, items.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={items.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
    </DashboardContent>
  );
}
