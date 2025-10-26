"use client";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const accountLinks = [
  { href: "/account-page", label: "Dashboard" },
  { href: "/account-orders", label: "My Orders" },
  { href: "/wish-list", label: "My Wishlist" },
  { href: "/account-addresses", label: "Addresses" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <>
      {accountLinks.map(({ href, label }) => (
        <li key={href}>
          <Link
            to={href}
            className={`text-sm link fw-medium my-account-nav-item ${
              pathname == href ? "active" : ""
            }`}
          >
            {label}
          </Link>
        </li>
      ))}
      <li>
        <Link to={`/`} className="text-sm link fw-medium my-account-nav-item">
          Log Out
        </Link>
      </li>
    </>
  );
}

