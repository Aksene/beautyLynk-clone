import React, { useEffect, useState } from "react";
import "./Tab.css";

const Tab = ({ children, active = 0 }) => {
  const [activeTab, setActiveTab] = useState(active);
  const [tabsData, setTabsData] = useState([]);

  useEffect(() => {
    let data = [];

    React.Children.forEach(children, (element) => {
      if (!React.isValidElement(element)) return;

      const {
        props: { tab, children },
      } = element;
      data.push({ tab, children });
    });

    setTabsData(data);
  }, [children]);

  return (
    <div className=" custom-tab">
      <ul className="tab">
        {tabsData.map(({ tab }, idx) => (
          <li className="tab-item">
            <a
              className={`tab-link ${idx === activeTab ? "active" : ""}`}
              onClick={() => setActiveTab(idx)}
            >
              <h4>{tab}</h4>
            </a>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {tabsData[activeTab] && tabsData[activeTab].children}
      </div>
    </div>
  );
};

const TabPane = ({ children }) => {
  return { children };
};

Tab.TabPane = TabPane;

export default Tab;