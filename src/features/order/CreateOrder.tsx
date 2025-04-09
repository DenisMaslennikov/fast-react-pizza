import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant.ts";
import Button from "../../ui/Button.tsx";
import { useSelector } from "react-redux";
import store, { RootState } from "../../store.ts";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice.ts";
import EmptyCart from "../cart/EmptyCart.tsx";
import { formatCurrency } from "../../utils/helpers.ts";
import { fetchAddress } from "../user/userSlice.ts";
import { useAppDispatch } from "../../hooks/useAppDispatch.ts";
import { CartItemType } from "../../types/CartItem.ts";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);

  const dispatch = useAppDispatch();

  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((store: RootState) => store.user);

  const isLoadingAddress = addressStatus === "loading";

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData();
  const cart = useSelector(getCart);

  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/*<Form method={"POST"} action={"/order/new"}>*/}
      <Form method={"POST"}>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            name="customer"
            required
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {!!formErrors &&
              typeof formErrors === "object" &&
              "phone" in formErrors &&
              typeof formErrors.phone === "string" && (
                <p className="mt-2 rounded-md bg-red-100 text-xs text-red-700">
                  {formErrors.phone}
                </p>
              )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[3px] z-50 md:right-[5px] md:top-[5px]">
              <Button
                disabled={isLoadingAddress}
                type="small"
                onClick={(e) => {
                  e?.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            checked={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? "Placing order..."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  if (typeof data.cart !== "string") {
    throw new Error("Invalid cart data");
  }

  if (!data.phone) throw new Error("Phone number is required");
  if (!data.address) throw new Error("Address is required");
  if (!data.customer) throw new Error("FirstName is required");

  const order: {
    phone: string;
    address: string;
    cart: CartItemType[];
    priority: boolean;
    customer: string;
    position: string;
  } = {
    phone: data.phone as string,
    address: data.address as string,
    customer: data.customer as string,
    position: data.position as string,
    cart: JSON.parse(data.cart) as CartItemType[],
    priority: data.priority === "on",
  };

  const errors: { phone?: string } = {};
  if (!errors.phone && !isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  // Плохой вариант не стоит злоупотреблять
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
  // return null;
}

export default CreateOrder;
