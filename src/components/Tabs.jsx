import React, { useState } from 'react';

// This is the main container for all the tabs
function Tabs({ children }) {
  // Use the label of the first Tab as the default active tab
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div>
      <ul className="flex border-b border-gray-200 dark:border-gray-700">
        {children.map(child => (
          <li key={child.props.label}>
            <a
              href="#"
              onClick={e => handleClick(e, child.props.label)}
              className={`inline-block py-2 px-4 text-sm font-medium text-center rounded-t-lg border-b-2 transition-colors ${
                activeTab === child.props.label
                  ? 'border-cyan-500 text-cyan-500 dark:text-cyan-400 dark:border-cyan-400' // Active tab style
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300' // Inactive tab style
              }`}
            >
              {child.props.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="py-4">
        {children.map(child => {
          if (child.props.label === activeTab) {
            return <div key={child.props.label}>{child.props.children}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
}

// This is a simple component that holds the content for a single tab
function Tab({ label, children }) {
  return (
    <div label={label} className="hidden">
      {children}
    </div>
  );
}

export { Tabs, Tab };