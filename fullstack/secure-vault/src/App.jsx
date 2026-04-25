import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import DATA from "../data.json";
import { flattenVisible, filterTree, collectIds, ensureMeta } from "./utils.jsx";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import PropertiesPanel from "./components/PropertiesPanel";

export default function App() {
  return <h1 style={{ textAlign: "center", marginTop: "50px" }}>Secure Vault</h1>;
}
