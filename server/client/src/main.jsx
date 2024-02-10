import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import NotFound from './pages/NotFound.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { LoginForm } from './features/auth/pages/Login.jsx'
import { RegisterForm } from './features/auth/pages/RegisterPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element:  <App/>,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm/>
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
