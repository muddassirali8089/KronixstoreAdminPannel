import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';
import AddUser from '../sections/product/view/add_user_view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Add Products - ${CONFIG.appName}`}</title>
      </Helmet>

      <AddUser />
    </>
  );
}
