import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';
import { CategoryView } from '../sections/product/view/category-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Category - ${CONFIG.appName}`}</title>
      </Helmet>

      <CategoryView />
    </>
  );
}
