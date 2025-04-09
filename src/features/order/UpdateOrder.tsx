import Button from "../../ui/Button.tsx";
import { useFetcher } from "react-router-dom";
import { Params } from "@remix-run/router/utils.ts";
import { updateOrder } from "../../services/apiRestaurant.ts";

function UpdateOrder({ order }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({
  request,
  params,
}: {
  request: Request;
  params: Params;
}) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);

  return null;
}
