import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

function LinkButton({
  children,
  to,
}: {
  children: ReactNode;
  to: string | number;
}) {
  const navigate = useNavigate();
  const className = "text-sm text-blue-500 hover:text-blue-600 hover:underline";

  if (to === -1)
    return (
      <button className={className} onClick={() => navigate(-1)}>
        &larr; Go back
      </button>
    );
  if (typeof to === "string")
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
}

export default LinkButton;
