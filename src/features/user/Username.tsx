import { useSelector } from "react-redux";
import { RootState } from "../../store.ts";

function Username() {
  const username = useSelector((store: RootState) => store.user.username);

  if (!username) return null;

  return (
    <div className="hidden text-sm font-semibold md:block">{username}</div>
  );
}

export default Username;
