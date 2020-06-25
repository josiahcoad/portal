import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

import * as UI from "./style";
import { NavItemProps } from "./interfaces";

/**
 * NavPills Component
 */
export const NavPills: React.FC = ({ children }) => {
  return (
    <UI.Nav variant="pills" defaultActiveKey="/events">
      {children}
    </UI.Nav>
  );
};

NavPills.propTypes = {
  children: PropTypes.any,
};

// NavItem Component
// <NavItem href="/day-1">Everything</NavItem>
export const NavItem: React.FC<NavItemProps> = (props) => {
  const { href: hrefEntry, children } = props;
  return (
    <UI.NavItem>
      <Link href={hrefEntry} passHref>
        <UI.NavAnchor>{children}</UI.NavAnchor>
      </Link>
    </UI.NavItem>
  );
};

// children not required b/c link can be made w/o text
// i mean it shouldn't but welp
NavItem.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.any,
};
