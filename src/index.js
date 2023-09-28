import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from './store/store';
import {register} from './serviceWorkerRegistration';

import App from "./App";

import { library } from "@fortawesome/fontawesome-svg-core";
import * as IconsSolid from "@fortawesome/free-solid-svg-icons";
import * as IconsRegular from "@fortawesome/free-regular-svg-icons";

const iconListSolid = Object.keys(IconsSolid)
  .filter((key) => key !== "fas" && key !== "prefix")
  .map((icon) => IconsSolid[icon]);
const iconListRegular = Object.keys(IconsRegular)
  .filter((key) => key !== "fas" && key !== "prefix")
  .map((icon) => IconsRegular[icon]);

library.add(...iconListSolid, ...iconListRegular);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(app);

register();