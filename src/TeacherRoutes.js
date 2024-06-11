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
import Teachers from "views/examples/Examples.js";
import Reports from "views/examples/Reports.js";

var routes = [
  {
    path: "/index",
    name: "Información",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/teacher",
  },
  {
    path: "/students",
    name: "Estudiantes",
    icon: "ni ni-hat-3 text-green",
    component: <Teachers />,
    layout: "/teacher",
  },
  {
    path: "/reports",
    name: "Informes",
    icon: "ni ni-single-copy-04 text-blue",
    component: <Reports />,
    layout: "/teacher",
  },
  {
    path: "/user-profile",
    name: "Perfil de Usuario",
    icon: "ni ni-single-02 text-red",
    component: <Profile />,
    layout: "/teacher",
  },

];
export default routes;