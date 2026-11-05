import { Navigate, Outlet } from "react-router-dom";
import { keycloak } from "../keyCloak";

const ProtectRoute = () => {

    if (!keycloak.authenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectRoute;