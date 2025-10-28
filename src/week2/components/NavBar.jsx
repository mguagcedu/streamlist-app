import { Link, useLocation } from "react-router-dom";
import { FaHome, FaList, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

export default function NavBar() {
  const { pathname } = useLocation();

  const link = (to, label, Icon) => (
    <Link className={`nav-link ${pathname === to ? "active" : ""}`} to={to}>
      <Icon aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="nav">
      {link("/", "Home", FaHome)}
      {link("/completed", "Completed", FaCheckCircle)}
      {link("/all", "All Items", FaList)}
      {link("/about", "About", FaInfoCircle)}
    </nav>
  );
}
