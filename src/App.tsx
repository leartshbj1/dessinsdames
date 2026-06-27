/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GalleryProvider } from "./context/GalleryContext";
import Layout from "./components/Layout";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import AddDrawing from "./pages/AddDrawing";
import DrawingDetail from "./pages/DrawingDetail";
import Blog from "./pages/Blog";

export default function App() {
  return (
    <AuthProvider>
      <GalleryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Gallery />} />
              <Route path="about" element={<About />} />
              <Route path="add" element={<AddDrawing />} />
              <Route path="drawing/:id" element={<DrawingDetail />} />
              <Route path="blog" element={<Blog />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GalleryProvider>
    </AuthProvider>
  );
}

