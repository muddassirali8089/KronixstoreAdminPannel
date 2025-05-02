import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';
import { OrderView } from '../sections/user/view/order-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Orders - ${CONFIG.appName}`}</title>
      </Helmet>

      <OrderView />
    </>
  );
}
