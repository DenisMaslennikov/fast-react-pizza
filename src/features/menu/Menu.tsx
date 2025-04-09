import { getMenu } from "../../services/apiRestaurant.ts";
import { useLoaderData } from "react-router-dom";
import { Pizza } from "../../types/Pizza.ts";
import MenuItem from "./MenuItem.tsx";

function Menu() {
  const menu: Pizza[] = useLoaderData() as Pizza[];
  return (
    <ul className="divide-y divide-stone-200 px-2">
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

export async function loader() {
  return await getMenu();
}

export default Menu;
