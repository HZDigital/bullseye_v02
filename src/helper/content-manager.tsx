import {
  HashRouter as Router, Routes, Route
} from "react-router-dom";
import { routes } from "./routes";

export function ContentManager() {
  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    </Router>
  )
}