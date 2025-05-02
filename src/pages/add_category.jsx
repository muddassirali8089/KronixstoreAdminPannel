import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';
import Addcategory from '../sections/product/view/add_category_view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Add Products - ${CONFIG.appName}`}</title>
      </Helmet>

      <Addcategory />
    </>
  );
}
