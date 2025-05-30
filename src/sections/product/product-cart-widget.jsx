/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';

import { Iconify } from '../../components/iconify';
import { RouterLink } from '../../routes/components/router-link';

// ----------------------------------------------------------------------


export function CartIcon({ totalItems, sx, ...other }) {
  return (
    <Box
      component={RouterLink}
      href="#"
      sx={{
        right: 0,
        top: 112,
        zIndex: 999,
        display: 'flex',
        cursor: 'pointer',
        position: 'fixed',
        color: 'text.primary',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        bgcolor: 'background.paper',
        padding: (theme) => theme.spacing(1, 3, 1, 2),
        boxShadow: (theme) => theme.customShadows.dropdown,
        transition: (theme) => theme.transitions.create(['opacity']),
        '&:hover': { opacity: 0.72 },
        ...sx,
      }}
      {...other}
    >
      <Badge showZero badgeContent={totalItems} color="error" max={99}>
        <Iconify icon="solar:cart-3-bold" width={24} />
      </Badge>
    </Box>
  );
}
