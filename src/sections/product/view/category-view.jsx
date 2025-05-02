import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { Card, Table, Button, TableBody, TableContainer, TablePagination } from '@mui/material';

import { _category } from '../../../_mock';
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

export function CategoryView() {
  const [sortBy, setSortBy] = useState('featured');
  console.log(_category);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.kronixstore.com/api/categories');
        setCategories(response.data); // assuming response is an array of categories
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const [openFilter, setOpenFilter] = useState(false);

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`https://api.kronixstore.com/api/categories/${id}`);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }
  const [filters, setFilters] = useState(defaultFilters);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

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
  const RedirectTo = () => {
    window.location.href = '/new-category';
  }
  const [filterName, setFilterName] = useState('');

  const dataFiltered = applyFilter({
    inputData: categories,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Category
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={RedirectTo}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Category
        </Button>
      </Box>


      {/* <Box
      display="flex"
      alignItems="center"
      flexWrap="wrap-reverse"
      justifyContent="flex-end"
      sx={{ mb: 5 }}
    >
      <Box gap={1} display="flex" flexShrink={0} sx={{ my: 1 }}>
        <ProductFilters
          canReset={canReset}
          filters={filters}
          onSetFilters={handleSetFilters}
          openFilter={openFilter}
          onOpenFilter={handleOpenFilter}
          onCloseFilter={handleCloseFilter}
          onResetFilter={() => setFilters(defaultFilters)}
          options={{
            genders: GENDER_OPTIONS,
            categories: CATEGORY_OPTIONS,
            ratings: RATING_OPTIONS,
            price: PRICE_OPTIONS,
            colors: COLOR_OPTIONS,
          }}
        />

        <ProductSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: 'featured', label: 'Featured' },
            { value: 'newest', label: 'Newest' },
            { value: 'priceDesc', label: 'Price: High-Low' },
            { value: 'priceAsc', label: 'Price: Low-High' },
          ]}
        />
      </Box>
    </Box> */}

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
                rowCount={categories.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    categories.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Action', align: 'right' },
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
                      onEdit={() => navigate(`/category/edit/${row.id}`)}
                      onDelete={() => handleDeleteCategory(row.id)}
                      columns={[
                        { id: 'name', label: 'Name' },
                        { id: 'status', label: 'Status' },
                      ]}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, categories.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={categories.length}
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
