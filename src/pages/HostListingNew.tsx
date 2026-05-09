import { Navigate } from "react-router-dom";

// Alias route → Host dashboard. The dashboard exposes the "Publish new listing" wizard.
const HostListingNew = () => <Navigate to="/host?new=1" replace />;

export default HostListingNew;
