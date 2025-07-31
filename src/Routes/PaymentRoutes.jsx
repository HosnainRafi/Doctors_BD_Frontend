import SuccessPayment from '../Pages/Payment/Success';
import FailPayment from '../Pages/Payment/FailPayment';
import CancelPayment from '../Pages/Payment/CancelPayment';
import IPNPaymentResult from '../Pages/Payment/IPNPaymentResult';
import PaymentLayout from './../Layout/PaymentLayout';

const PaymentRoutes = {
  path: '/',
  element: <PaymentLayout />,
  children: [
    { path: 'success', element: <SuccessPayment /> },
    { path: 'fail', element: <FailPayment /> },
    { path: 'cancel', element: <CancelPayment /> },
    { path: 'ipn', element: <IPNPaymentResult /> },
  ],
};

export default PaymentRoutes;
