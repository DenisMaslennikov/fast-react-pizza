import CreateUser from "../features/user/CreateUser.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../store.ts";
import Button from "./Button.tsx";

function Home() {
  const username = useSelector((store: RootState) => store.user.username);
  return (
    <div className="my-10 px-4 text-center sm:my-16">
      <h1 className="mb-8 text-center text-xl font-semibold md:text-3xl">
        The best pizza.
        <br />
        <span className="text-yellow-500">
          Straight out of the oven, straight to you.
        </span>
      </h1>

      {username === "" ? (
        <CreateUser />
      ) : (
        <Button type="primary" to="/menu">
          Continue ordering, {username}
        </Button>
      )}
    </div>
  );
}

export default Home;
