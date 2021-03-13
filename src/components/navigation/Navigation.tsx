import React, { useState } from 'react';
import Header from './Header';
import SideBar from './SideBar';

/**
 * Responsible for rendering the Toolbar and SideMenu for navigation.
 */
const Navigation = (): JSX.Element => {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    <div>
      <Header setSideBarOpen={setSideBarOpen} />
      <SideBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
    </div>
  );
};

export default Navigation;
