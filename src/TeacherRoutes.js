/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Dashboard.js";
import Profile from "views/examples/Profile.js";
import Login from "views/examples/Login.js";
import Users from "views/examples/Users.js";
import Examples from "views/examples/Examples.js";
import Teachers from "views/examples/Teachers";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/teacher",
  },
  {
    path: "/teachers",
    name: "Teachers",
    icon: "ni ni-hat-3 text-blue",
    component: <Teachers />,
    layout: "/teacher",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/teacher",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni ni-single-02 text-blue",
    component: <Users />,
    layout: "/teacher",
  },
  {
    path: "/examples",
    name: "Examples",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Examples />,
    layout: "/teacher",
  },
];
export default routes;
