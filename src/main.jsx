import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import About from './pages/about.jsx';
import Projects from './pages/projects.jsx';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "about",
        element: <About/>,
    },
    {
        path: "projects",
        element: <Projects/>,
    },
    
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
