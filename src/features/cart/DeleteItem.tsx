import Button from "../../ui/Button.tsx";
import { useDispatch } from "react-redux";
import { deleteItem } from "./cartSlice.ts";

function DeleteItem({ pizzaId }: { pizzaId: number }) {
  const dispatch = useDispatch();
  return (
    <Button type="small" onClick={() => dispatch(deleteItem(pizzaId))}>
      Delete
    </Button>
  );
}

export default DeleteItem;
