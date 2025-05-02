/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from '../../components/label';
import { Iconify } from '../../components/iconify';
import { ColorPreview } from '../../components/color-utils/color-preview';

// ----------------------------------------------------------------------

export function UserTableRow({ row, selected, onSelectRow, columns, onEdit, onDelete }) {
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEditClick = () => {
    handleClosePopover();
    onEdit?.(row);
  };

  const handleDeleteClick = () => {
    handleClosePopover();
    onDelete?.(row);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        {columns.map((col) => (
          <TableCell key={col.id} align={col.align || 'left'}>
            {col.id === 'id' ? (
              row[col.id]
            ) : col.id === 'image' ? (
              <Avatar alt={row.name} src={row.avatarUrl} />
            ) : col.id === 'colors' ? (
              <ColorPreview colors={row.colors || []} />
            ) : col.id === 'status' ? (
              <Label color={row.status === 'banned' ? 'error' : 'success'}>
                {row.status}
              </Label>
            ) : (
              row[col.id] || '-'
            )}
          </TableCell>
        ))}

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEditClick}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>


    </>
  );
}
