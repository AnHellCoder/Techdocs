import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/NavigationPanel.css";

const navItems = [
  { path: "/pages/1", label: "Введение" },
  { path: "/pages/2", label: "Описание" },
  { path: "/pages/3", label: "Статистика" },
  { path: "/pages/4", label: "API" },
];

function NavigationPanel() {
  return (
    <nav className="nav-panel">
      <div className="nav-title">Навигация по странице</div>
      <div className="nav-buttons">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="nav-link"
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default NavigationPanel;