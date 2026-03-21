import { Navigate } from "react-router-dom";

type Props = {
    children: JSX.Element;
    allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    const parsedUser = JSON.parse(user);

    if (!allowedRoles.includes(parsedUser.role)) {
        return <Navigate to="/login" />;
    }

    return children;
}