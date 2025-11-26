import React from "react";
import { useTranslation } from "react-i18next";
import { IoChevronDown, IoChevronForward, IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import { LuClipboardCheck, LuLayoutDashboard, LuUsers } from "react-icons/lu";
import { RiBarChartBoxLine, RiCalendarLine } from "react-icons/ri";

import * as constant from "../utlis/constant";

export const SIDEBAR_ROUTES = {
  DASHBOARD: { path: "/dashboard", featureName: "Dashboard" },
  ANALYTICS: { path: "/analytics", featureName: "Analytics" },
  EVENTS: { path: "/eventList", featureName: "Events" },
  BOOKINGS: { path: "/booking", featureName: "Bookings" },
  CUSTOMERS: { path: "/customer", featureName: "Customers" },
  TRANSACTIONS: { path: "/transaction", featureName: "Transactions" },
  SETTINGS: { path: "/settings", featureName: "Settings" },
};

const getSidebarData = (isEventsActive = false) => {
  const { t } = useTranslation();
  return [
    {
      title: t ? t("DASHBOARD") : "Dashboard",
      path: SIDEBAR_ROUTES.DASHBOARD.path,
      icon: <LuLayoutDashboard className="icon-color" size={22} />,
      featureName: constant.DASHBOARD
    },
    {
      title: t ? t("ANALYTICS") : "Analytics",
      path: SIDEBAR_ROUTES.ANALYTICS.path,
      icon: <RiBarChartBoxLine size={22} className="icon-color" />,
      featureName: constant.ANALYTICS
    },
    {
      title: t ? t("EVENTS") : "Events",
      path: SIDEBAR_ROUTES.EVENTS.path,
      icon: <RiCalendarLine size={22} className="icon-color" />,
      featureName: constant.EVENT,
      rightIcon: isEventsActive ?
        <IoChevronDown size={20} className="icon-color" style={{ marginLeft: 'auto' }} /> :
        <IoChevronForward size={20} className="icon-color" style={{ marginLeft: 'auto' }} />
    },
    {
      title: t ? t("BOOKINGS") : "Bookings",
      path: SIDEBAR_ROUTES.BOOKINGS.path,
      icon: <LuClipboardCheck size={22} className="icon-color" />,
      featureName: constant.BOOKINGS
    },
    {
      title: t ? t("CUSTOMERS") : "Customers",
      path: SIDEBAR_ROUTES.CUSTOMERS.path,
      icon: <LuUsers size={22} className="icon-color" />,
      featureName: constant.CUSTOMER
    },
    {
      title: t ? t("TRANSACTIONS") : "Transactions",
      path: SIDEBAR_ROUTES.TRANSACTIONS.path,
      icon: <IoWalletOutline size={22} className="icon-color" />,
      featureName: constant.TRANSACTION_ROLE
    },
    {
      title: t ? t("SETTINGS") : "Settings",
      path: SIDEBAR_ROUTES.SETTINGS.path,
      icon: <IoSettingsOutline size={22} className="icon-color" />,
      featureName: constant.SETTINGS
    },
  ];
};

export const hasViewPermission = (rolePermissions, featureName) => {
  if (!rolePermissions) return false;

  let permissionsToCheck = [];

  if (Array.isArray(rolePermissions)) {
    if (rolePermissions.length > 0 && rolePermissions[0]?.rolePermissions) {
      permissionsToCheck = rolePermissions[0].rolePermissions;
    } else {
      permissionsToCheck = rolePermissions;
    }
  } else if (rolePermissions.rolePermissions) {
    permissionsToCheck = rolePermissions.rolePermissions;
  }

  const featurePermissions = Array.isArray(permissionsToCheck)
    ? permissionsToCheck.find(role => role.featureName === featureName)
    : null;

  return featurePermissions?.permissions?.some(
    (perm) => perm.permissionName === "View"
  );
};

export const findFirstAccessibleRoute = (rolePermissions) => {
  if (!rolePermissions) return '/unauthorized';
  
  const routes = Object.values(SIDEBAR_ROUTES);

  const accessibleRoute = routes.find(route =>
    hasViewPermission(rolePermissions, route.featureName)
  );

  return accessibleRoute?.path || '/unauthorized';
};

export default getSidebarData;