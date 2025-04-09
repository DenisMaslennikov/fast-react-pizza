import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./ui/Home.tsx";
import Menu, { loader as menuLoader } from "./features/menu/Menu.tsx";
import Cart from "./features/cart/Cart.tsx";
import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder.tsx";
import Order, { loader as orderLoader } from "./features/order/Order.tsx";
import { action as updateOrderAction } from "./features/order/UpdateOrder.tsx";
import AppLayout from "./ui/AppLayout.tsx";
import Error from "./ui/Error.tsx";

const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/menu",
          element: <Menu />,
          loader: menuLoader,
          errorElement: <Error />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/order/new",
          element: <CreateOrder />,
          action: createOrderAction,
        },
        {
          path: "/order/:orderId",
          element: <Order />,
          loader: orderLoader,
          errorElement: <Error />,
          action: updateOrderAction,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}

export default App;
