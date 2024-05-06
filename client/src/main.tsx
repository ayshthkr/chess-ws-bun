import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Game from "./routes/Game.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "/game",
        element: <Game/>
    }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
