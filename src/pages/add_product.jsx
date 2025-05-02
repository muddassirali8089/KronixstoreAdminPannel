import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';
import AddProductForm from '../sections/product/view/add_product_view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Add Products - ${CONFIG.appName}`}</title>
      </Helmet>

      <AddProductForm />
    </>
  );
}
