import FailPayment from "../Pages/Payment/FailPayment";
import CancelPayment from "../Pages/Payment/CancelPayment";
import IPNPaymentResult from "../Pages/Payment/IPNPaymentResult";
import PaymentLayout from "./../Layout/PaymentLayout";
import Success from "../Pages/Payment/Success";

const PaymentRoutes = {
  path: "/",
  element: <PaymentLayout />,
  children: [
    { path: "success", element: <Success /> },
    { path: "fail", element: <FailPayment /> },
    { path: "cancel", element: <CancelPayment /> },
    { path: "ipn", element: <IPNPaymentResult /> },
  ],
};

export default PaymentRoutes;
