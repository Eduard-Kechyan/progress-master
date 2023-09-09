import React, { useEffect } from 'react';
import "./Dashboard.scss";

import loadingBg from '../../assets/images/loading_background.jpg';

export default function Dashboard(props) {
  useEffect(() => {
    props.setPageTitle("Dashboard");
  }, [])

  return (
    <>
      {/* Top */}
      <div className="dashboard_top">
        <img src={loadingBg} alt="Dashboard Top Background" />
        <div className="overlay" />

        <div className="main">

        </div>

        <div className="secondary">
          <div class="single-chart">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg"
                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path class="circle"
                stroke-dasharray="30, 100"
                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" class="percentage">30%</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard_content">
        sds
      </div>
    </>
  )
}
