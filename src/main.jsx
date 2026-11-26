// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>
// );


import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { initKeycloak } from "./keyCloak";

import "./index.css";
import { Provider } from "react-redux";
import { Store } from "./Store/Store";

async function startApp() {
    try {
        await initKeycloak();

        ReactDOM.createRoot(document.getElementById("root")).render(
            <React.StrictMode>
                <Provider store={Store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
                </Provider>
            </React.StrictMode>
        );
    } catch (error) {
        console.error("Keycloak initialization failed:", error);
    }
}

startApp();