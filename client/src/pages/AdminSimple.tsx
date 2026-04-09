import { useLocation } from "wouter";
import AdminDashboard from "./AdminDashboard";
import AdminLoans from "./AdminLoans";
import AdminUsers from "./AdminUsers";
import AdminContact from "./AdminContact";
import AdminSecurity from "./AdminSecurity";
import AdminKycPage from "./admin/AdminKycPage";

export default function AdminSimple() {
  const [location] = useLocation();

  if (location === "/admin" || location === "/admin/") {
    return <AdminDashboard />;
  }

  if (location.startsWith("/admin/loans")) {
    return <AdminLoans />;
  }

  if (location.startsWith("/admin/users")) {
    return <AdminUsers />;
  }

  if (location.startsWith("/admin/kyc")) {
    return <AdminKycPage />;
  }

  if (location.startsWith("/admin/contact")) {
    return <AdminContact />;
  }

  if (location.startsWith("/admin/security")) {
    return <AdminSecurity />;
  }

  // Default fallback to dashboard
  return <AdminDashboard />;
}
