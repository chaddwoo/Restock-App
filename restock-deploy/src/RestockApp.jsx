import { useState, useEffect, useCallback, useMemo, useRef } from "react";

const SUPABASE_URL = "https://unnonzpasuacdgiioqiu.supabase.co";
const SUPABASE_KEY = "sb_publishable_XJO2XX_U8CYxvPemov9YUg_nMh4dc6Y";

const sb = {
  async get(table, opts = {}) {
    let u = `${SUPABASE_URL}/rest/v1/${table}?`;
    if (opts.order) u += `order=${opts.order}&`;
    if (opts.filter) u += opts.filter + "&";
    if (opts.limit) u += `limit=${opts.limit}&`;
    const r = await fetch(u, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    return r.json();
  },
  async post(table, data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async patch(table, data, filter) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
      method: "PATCH", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async del(table, filter) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
      method: "DELETE", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    return r.ok;
  },
};

const DEFAULT_CATALOG = [
  { model_name: "Geek Bar Pulse 15k", brand: "Geek Bar", puffs: "15,000", category: "Vapes", flavors: ["B-Burst","Banana Ice","Berry Bliss","Black Cherry","Black Mintz","Blue Mint","Blue Razz Ice","Blueberry Watermelon","California Cherry","Cherry Bomb","Cool Mint","Crazy Melon","Creamy Mintz","Dragon Melon","Drop Sour Savers","Fcuking Fab","Frozen Blackberry Fab","Frozen Cherry Apple","Frozen Pina Colada","Frozen Strawberry","Frozen Watermelon","Frozen White Grape","Grape B-Pop","Grape Lemon","Haunted Blueberry","Icey Mintz","Juicy Peach Ice","Meta Moon","Mexico Mango","Miami Mint","OMG B-Burst","Orange Creamsicle","Orange Mint Savers","Peach Lemonade","Pepper Mintz","Pineapple Savers","Pink Lemonade","Punch","Raspberry Watermelon","Sour Apple B-Burst","Sour Apple Ice","Sour Blue Dust","Sour Cranapple","Sour Gush","Sour Strawberry","Sour Watermelon Drop","Spooky Vanilla","Stone Mintz","Strawberry B-Pop","Strawberry Banana","Strawberry Kiwi","Strawberry Mango","Strawberry Savers","Tropical Rainbow Blast","Watermelon Ice","White Gummy Ice","Wild Berry Savers"] },
  { model_name: "Geek Bar Pulse X 25k", brand: "Geek Bar", puffs: "25,000", category: "Vapes", flavors: ["ATL Mint","Banana Taffy Freeze","Blackberry B-Pop","Blackberry Blueberry","Blue Rancher","Blue Razz Ice","Blueberry Jam","Cola Slush","Cool Mint","Creamy Mintz","Dualicious","Grape Slush","Grapefruit Refresher","Lemon Heads","Lime Berry Orange","Miami Mint","Orange Dragon","Orange Fcuking Fab","Orange Jam Slush","Orange Mint","Orange Slush","Peach Jam","Peach Perfect Slush","Pear Of Thieves","Pepper Mintz","Pink And Blue","Pink Berry Lemonade","Raspberry Jam","Raspberry Peach Lime","Sour Apple Ice","Sour Fcuking Fab","Sour Mango Pineapple","Sour Straws","Strawberry B-Burst","Strawberry Colada","Strawberry Dragon","Strawberry Jam","Strawberry Kiwi Ice","Strawberry Watermelon","Watermelon Ice","White Peach Raspberry","Wild Cherry Slush"] },
  { model_name: "Geek Max 30k", brand: "Geek Bar", puffs: "30,000", category: "Vapes", flavors: ["Blackberry B-Pop","Blue Rancher","Blueberry Jam","Blueberry Watermelon","Cola Slush","Cool Mint","Crazy Melon","Dubai Chocolate Mint","Frozen Strawberry","Grapefruit Refresher","Honeydew Slush","Juicy Peach Ice","Lemon Heads","Lime Berry Orange","Mexico Mango","Miami Mint","Orange Dragon","Orange Fcuking Fab","Orange Jam","Orange Slush","Pink And Blue","Pink Lemonade","Punch","Raspberry Jam","Raspberry Peach Lime","Sour Apple Ice","Sour Mango Pineapple","Spearmint","Strawberry B-Pop","Strawberry Colada","Strawberry Kiwi Refresher","Strawberry Mango","Strawberry Watermelon","Watermelon Ice","White Gummy Ice","Wild Cherry Slush"] },
  { model_name: "Foger Switch Pro Kit 30k", brand: "Foger", puffs: "30,000", category: "Vapes", flavors: ["Blue Rancher B-Pop","Blue Razz Ice","Blueberry Watermelon","Cherry Bomb","Chocolate Cupcake","Clear","Coconut Cupcake","Coffee","Cola Slush","Cool Mint","Dragon Fruit Lemonade","Frozen Banana","Frozen Blueberry","Frozen Lemon","Frozen Watermelon","Grape Slush","Gum Mint","Gummy Bear","Hot Chocolate","Icy Mint","Juicy Peach Ice","Kiwi Dragon Berry","Meta Moon","Mexico Mango","Miami Mint","OMG B-Pop","Orange Slush","Peppermint","Pineapple Coconut","Pink And Blue","Pink Lemonade","Red Velvet Cupcake","Skittles Cupcake","Sour Apple Ice","Sour Blue Dust","Sour Cranapple","Sour Fcuking Fab","Sour Gush","Strawberry B-Pop","Strawberry Banana","Strawberry Cupcake","Strawberry Ice","Strawberry Kiwi","Strawberry Watermelon","Tobacco","Vanilla Cupcake","Watermelon Bubble Gum","Watermelon Ice","White Gummy"] },
  { model_name: "Foger Switch Pro Pod 30k", brand: "Foger", puffs: "30,000", category: "Vapes", flavors: ["Blue Rancher","Blue Rancher B-Pop","Blue Razz Ice","Blueberry Watermelon","Cherry Bomb","Cherry Slush","Chocolate Cupcake","Clear","Coconut Cupcake","Coffee","Cola Slush","Cool Mint","Dragon Fruit Lemonade","Frozen Banana","Frozen Blueberry","Frozen Lemon","Frozen Watermelon","Grape Slush","Gum Mint","Gummy Bear","Hawaiian Punch","Icy Mint","Juicy Peach Ice","Kiwi Dragon Berry","Meta Moon","Mexico Mango","Miami Mint","OMG B-Pop","Orange Slush","Peach Slush","Pineapple Coconut","Pink And Blue","Pink Lemon","Pink Lemonade","Purple Passion Punch","Red Velvet Cupcake","Skittles Cupcake","Sour Apple Ice","Sour Blue Dust","Sour Cranapple","Sour Fcuking Fab","Sour Gush","Sour Raspberry Punch","Strawberry B-Pop","Strawberry Banana","Strawberry Cupcake","Strawberry Ice","Strawberry Kiwi","Strawberry Slush","Strawberry Watermelon","Tobacco","Triple Berry Punch","Vanilla Cupcake","Watermelon Bubble Gum","Watermelon Ice","White Gummy"] },
  { model_name: "Foger Bit 35k", brand: "Foger", puffs: "35,000", category: "Vapes", flavors: ["Banana Taffy Freeze","Blue Razz Ice","Fcuking Fab","Georgia Peach","Miami Mint","Orange Cranberry Lime Ice","Passion Kiwi","Sour Blackberry Gush","Sour Blueberry Gush","Sour Cherry Gush","Sour Kiwi Gush","Sour Mango Pineapple","Strawberry Burst","Summer Mist","Wintergreen"] },
  { model_name: "Lost Mary MT 35k", brand: "Lost Mary", puffs: "35,000", category: "Vapes", flavors: ["Baja Splash","Berry Burst","Black Mint","Black Razz Lemon","Blackberry Blueberry","Blue Razz Ice","Blue Razz Lemonade","Classic Tobacco","Clear","Golden Berry","Half And Half","Kiwi Passion Fruit","Miami Mint","Mint Lemonade","Mountain Berry","Orange Passion Mango","Orange Pixy","Pineapple Lime","Pink Lemonade","Purple Pixy","Red Pixy","Rocket Freeze","Scary Berry","Strawberry","Strawberry Dragon Lemonade","Strawberry Kiwi","Strawmelon Peach","Summer Grape","Sunny Orange","Tigers Blood","Toasted Banana","Tropical Lemonade","Watermelon","White Gami","White Pixy","Winter Mint","Yellow Pixy"] },
  { model_name: "UT Bar 50k", brand: "UT Bar", puffs: "50,000", category: "Vapes", flavors: ["Aloe Grape Aloe Watermelon","Aloe Watermelon Sour Sweet","Banana Smoothie Strawberry","Blue Rancher Lemonade","Blue Razz Ice","Blue Razz Ice Triple Berry","Blue Razz Lemonade","Cherry Strawberry Gummy","Clear","Green Apple Fuji Apple","Miami Mint Mint Slushy","Naked Springwater","Passion Kiwi Pineapple","Passionfruit Mango","Pink Lemonade Mixberry","Raspberry Grape Guava","Root Soda Vanilla","Slushy Lemon","Sour Apple","Sour Fab Citrus Ice","Strawberry Swirl","Strawberry Watermelon","Strawberry Watermelon Icy","StrawNana Gelato","Thai Mango Juice Peach","Tropical Rainbow Blast","Watermelon B-Pop","Watermelon Ice","Watermelon Ice Slushy","Watermelon Sour Peach","White Gummy Cherry","White Peach Lemon Head","White Peach Raspberry","Wildberry Drop"] },
];

const QTY_OPTIONS = ["skip", "1", "2", "3", "4", "5+"];

// Warehouses
const WAREHOUSES = [{ code: "1515", name: "M&W", id: 1 },{ code: "3300", name: "W", id: 2 },{ code: "9630", name: "M", id: 3 }];
const getWarehouseByCode = (code) => WAREHOUSES.find(w => w.code === code);

// Improved quantity colors — calm to urgent gradient
const getQtyColor = (v) => {
  if (v === "skip") return "#ffffff20";
  if (v === "1") return "#4ECDC4"; // teal
  if (v === "2") return "#1DB954"; // green
  if (v === "3") return "#F4D35E"; // yellow
  if (v === "4") return "#FF6B35"; // orange
  return "#E63946"; // red for 5+
};

// Known brand colors + auto-assign palette for new brands
const FIXED_BRAND_COLORS = { "Geek Bar": "#6C5CE7", "Foger": "#FF6B35", "Lost Mary": "#E63946", "UT Bar": "#00B4D8" };
const AUTO_PALETTE = ["#A855F7","#EC4899","#14B8A6","#F59E0B","#8B5CF6","#06B6D4","#EF4444","#10B981","#F97316","#6366F1","#84CC16","#E879F9","#22D3EE","#FB923C","#A3E635"];
let autoIdx = 0;
const brandColorCache = {};
const getBrandColor = (brand) => {
  if (FIXED_BRAND_COLORS[brand]) return FIXED_BRAND_COLORS[brand];
  if (brandColorCache[brand]) return brandColorCache[brand];
  brandColorCache[brand] = AUTO_PALETTE[autoIdx % AUTO_PALETTE.length];
  autoIdx++;
  return brandColorCache[brand];
};

const timeAgo = (d) => { const m = Math.floor((new Date() - new Date(d)) / 60000); if (m < 1) return "just now"; if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ${m % 60}m ago`; return `${Math.floor(h / 24)}d ago`; };
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

// Employee session persistence
const LS_KEY = "restock_emp_session";
const saveSession = (d) => { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch(e){} };
const loadSession = () => { try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : null; } catch(e){ return null; } };
const clearSession = () => { try { localStorage.removeItem(LS_KEY); } catch(e){} };
const _saved = (() => { const s = loadSession(); if (!s) return null; const empViews = ["employee-login","employee-products","employee-flavors"]; if (!empViews.includes(s.view)) return null; return s; })();

export default function RestockApp() {
  const [view, setView] = useState(_saved?.view || "splash");
  const [empName, setEmpName] = useState(_saved?.empName || "");
  const [storeLoc, setStoreLoc] = useState(_saved?.storeLoc || "");
  const [empWarehouse, setEmpWarehouse] = useState(_saved?.empWarehouse || null);
  const [empCode, setEmpCode] = useState(_saved?.empCode || "");
  const [empCodeError, setEmpCodeError] = useState(false);
  const [selProduct, setSelProduct] = useState(_saved?.selProduct || null);
  const [orderData, setOrderData] = useState(_saved?.orderData || {});
  const [suggestion, setSuggestion] = useState("");
  const [suggestions, setSuggestions] = useState(_saved?.suggestions || []);
  const [selReport, setSelReport] = useState(null);
  const [bannerData, setBannerData] = useState({});
  const [bannerInput, setBannerInput] = useState("");
  const [editBanner, setEditBanner] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reports, setReports] = useState([]);
  const [allSugs, setAllSugs] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStore, setNewStore] = useState("");
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [mgrWarehouse, setMgrWarehouse] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [catLoaded, setCatLoaded] = useState(false);
  const [mgrView, setMgrView] = useState("dashboard");
  const [editModel, setEditModel] = useState(null);
  const [newFlavor, setNewFlavor] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [newModelBrand, setNewModelBrand] = useState("");
  const [newModelPuffs, setNewModelPuffs] = useState("");
  const [newModelCategory, setNewModelCategory] = useState("Vapes");
  const [showAddModel, setShowAddModel] = useState(false);
  const [editingModelInfo, setEditingModelInfo] = useState(false);
  const [editModelName, setEditModelName] = useState("");
  const [editModelBrand, setEditModelBrand] = useState("");
  const [editModelPuffs, setEditModelPuffs] = useState("");
  const [editModelCategory, setEditModelCategory] = useState("");
  const [selCategory, setSelCategory] = useState(_saved?.selCategory || null);
  const [showOrderEdit, setShowOrderEdit] = useState(false);
  const [pickedItems, setPickedItems] = useState({});

  const PIN = "2588";

  const activeWid = empWarehouse?.id || mgrWarehouse?.id || null;
  const catalogObj = useMemo(() => {
    const obj = {};
    catalog.forEach(c => {
      const whVis = c.warehouse_visibility || {};
      const hiddenForWarehouse = (activeWid && whVis[String(activeWid)]) ? whVis[String(activeWid)] : [];
      const activeFlavors = (c.flavors || []).filter(f => !hiddenForWarehouse.includes(f));
      obj[c.model_name] = { brand: c.brand, puffs: c.puffs, flavors: c.flavors || [], activeFlavors, hidden_flavors: hiddenForWarehouse, warehouse_visibility: whVis, id: c.id, category: c.category || "Vapes" };
    });
    return obj;
  }, [catalog, activeWid]);

  const categories = useMemo(() => [...new Set(catalog.map(c => c.category || "Vapes"))].sort(), [catalog]);

  const loadCatalog = useCallback(async () => {
    try {
      const data = await sb.get("catalog", { order: "brand.asc,model_name.asc" });
      if (data && Array.isArray(data) && data.length > 0) {
        setCatalog(data);
      } else {
        for (const item of DEFAULT_CATALOG) { await sb.post("catalog", item); }
        const seeded = await sb.get("catalog", { order: "brand.asc,model_name.asc" });
        setCatalog(seeded || []);
      }
      setCatLoaded(true);
    } catch (e) { console.error(e); setCatLoaded(true); }
  }, []);

  const loadBanner = useCallback(async () => {
    try {
      const d = await sb.get("banner", { order: "id.asc" });
      if (d && d.length > 0) {
        const map = {};
        d.forEach(b => { map[b.warehouse_id || 1] = { message: b.message || "", active: b.active, id: b.id }; });
        setBannerData(map);
      }
    } catch (e) { console.error(e); }
  }, []);

  const loadMgr = useCallback(async () => {
    if (!mgrWarehouse) return;
    setLoading(true);
    try {
      const [subs, sugs, sl] = await Promise.all([
        sb.get("submissions", { order: "created_at.desc", filter: `warehouse_id=eq.${mgrWarehouse.id}` }),
        sb.get("suggestions", { order: "created_at.desc", filter: `status=eq.pending&warehouse_id=eq.${mgrWarehouse.id}` }),
        sb.get("stores", { order: "name.asc", filter: `warehouse_id=eq.${mgrWarehouse.id}` }),
      ]);
      setReports(subs || []); setAllSugs(sugs || []); setStores(sl || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [mgrWarehouse]);

  useEffect(() => { loadCatalog(); loadBanner(); }, [loadCatalog, loadBanner]);
  useEffect(() => { if (view === "manager" && authed && mgrWarehouse) loadMgr(); }, [view, authed, mgrWarehouse, loadMgr]);

  // Save employee session to localStorage on every relevant change
  useEffect(() => {
    const empViews = ["employee-login", "employee-products", "employee-flavors"];
    if (empViews.includes(view)) {
      saveSession({ view, empName, storeLoc, empWarehouse, empCode, selProduct, orderData, suggestions, selCategory });
    }
  }, [view, empName, storeLoc, empWarehouse, empCode, selProduct, orderData, suggestions, selCategory]);

  // Warn before unload if employee has items in order
  useEffect(() => {
    const handler = (e) => {
      if (Object.keys(orderData).length > 0 && ["employee-products", "employee-flavors"].includes(view)) {
        e.preventDefault(); e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [orderData, view]);

  // Block pull-to-refresh on mobile
  useEffect(() => {
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";
    return () => { document.body.style.overscrollBehavior = ""; document.documentElement.style.overscrollBehavior = ""; };
  }, []);

  const submitOrder = async () => {
    if (!empWarehouse) return;
    setSubmitting(true);
    try {
      const items = Object.entries(orderData);
      let tu = 0; items.forEach(([, v]) => { tu += v === "5+" ? 5 : parseInt(v) || 0; });
      await sb.post("submissions", { employee_name: empName.trim(), store_location: storeLoc.trim(), items: orderData, total_flavors: items.length, total_units: tu, warehouse_id: empWarehouse.id });
      for (const sg of suggestions) { await sb.post("suggestions", { suggestion_text: sg.text, employee_name: sg.from, store_location: sg.store, warehouse_id: empWarehouse.id }); }
      sndSubmit(); clearSession(); setView("employee-done");
    } catch (e) { console.error(e); alert("Error submitting — check connection."); }
    setSubmitting(false);
  };

  // Preloaded sound pool — multiple instances per sound for rapid tapping
  const sounds = useRef({});
  useEffect(() => {
    ["click","back","submit","login","add","remove","done"].forEach(k => {
      const POOL = k === "click" ? 8 : 4;
      sounds.current[k] = { pool: [], idx: 0 };
      for (let i = 0; i < POOL; i++) {
        const a = new Audio(process.env.PUBLIC_URL + "/snd-" + k + ".wav");
        a.preload = "auto"; a.volume = 0.5; sounds.current[k].pool.push(a);
      }
    });
  }, []);
  const playSound = (key) => { try { const s = sounds.current[key]; if (!s) return; const a = s.pool[s.idx % s.pool.length]; s.idx++; a.currentTime = 0; const p = a.play(); if (p) p.catch(() => {}); } catch (e) {} };
  const sndClick = () => playSound("click");
  const sndBack = () => playSound("back");
  const sndSubmit = () => playSound("submit");
  const sndLogin = () => playSound("login");
  const sndAdd = () => playSound("add");
  const sndRemove = () => playSound("remove");
  const sndDone = () => playSound("done");

  const deleteSubmission = async (id) => { try { await sb.del("submissions", `id=eq.${id}`); sndRemove(); setReports(p => p.filter(r => r.id !== id)); if (selReport && selReport.id === id) setSelReport(null); } catch (e) { console.error(e); } };
  const saveBanner = async () => {
    if (!mgrWarehouse) return;
    const wid = mgrWarehouse.id;
    const bd = bannerData[wid];
    if (bd) {
      try { await sb.patch("banner", { message: bannerInput, active: true, updated_at: new Date().toISOString() }, `id=eq.${bd.id}`); setBannerData(p => ({ ...p, [wid]: { ...p[wid], message: bannerInput, active: true } })); setEditBanner(false); } catch (e) { console.error(e); }
    }
  };
  const toggleBanner = async () => {
    if (!mgrWarehouse) return;
    const wid = mgrWarehouse.id;
    const bd = bannerData[wid];
    if (bd) {
      try { await sb.patch("banner", { active: !bd.active, updated_at: new Date().toISOString() }, `id=eq.${bd.id}`); setBannerData(p => ({ ...p, [wid]: { ...p[wid], active: !bd.active } })); } catch (e) { console.error(e); }
    }
  };
  const dismissSug = async (id) => { try { await sb.patch("suggestions", { status: "dismissed" }, `id=eq.${id}`); sndRemove(); setAllSugs(p => p.filter(s => s.id !== id)); } catch (e) { console.error(e); } };
  const approveSug = async (id) => { try { await sb.patch("suggestions", { status: "approved" }, `id=eq.${id}`); sndAdd(); setAllSugs(p => p.filter(s => s.id !== id)); } catch (e) { console.error(e); } };
  const addStore = async () => { if (!newStore.trim() || !mgrWarehouse) return; try { await sb.post("stores", { name: newStore.trim(), warehouse_id: mgrWarehouse.id }); sndAdd(); setNewStore(""); loadMgr(); } catch (e) { console.error(e); } };
  const removeStore = async (id) => { try { await sb.del("stores", `id=eq.${id}`); sndRemove(); setStores(p => p.filter(s => s.id !== id)); } catch (e) { console.error(e); } };

  const addFlavorToModel = async (modelId, flavor) => {
    const model = catalog.find(c => c.id === modelId); if (!model || !flavor.trim()) return;
    const updated = [...(model.flavors || []), flavor.trim()].sort();
    try { await sb.patch("catalog", { flavors: updated }, `id=eq.${modelId}`); sndAdd(); setCatalog(p => p.map(c => c.id === modelId ? { ...c, flavors: updated } : c)); } catch (e) { console.error(e); }
  };
  const removeFlavorFromModel = async (modelId, flavor) => {
    const model = catalog.find(c => c.id === modelId); if (!model) return;
    const updated = (model.flavors || []).filter(f => f !== flavor);
    const whVis = { ...(model.warehouse_visibility || {}) };
    Object.keys(whVis).forEach(k => { whVis[k] = (whVis[k] || []).filter(f => f !== flavor); });
    try { await sb.patch("catalog", { flavors: updated, warehouse_visibility: whVis }, `id=eq.${modelId}`); sndRemove(); setCatalog(p => p.map(c => c.id === modelId ? { ...c, flavors: updated, warehouse_visibility: whVis } : c)); } catch (e) { console.error(e); }
  };
  const toggleFlavorVisibility = async (modelId, flavor) => {
    if (!mgrWarehouse) return;
    const model = catalog.find(c => c.id === modelId); if (!model) return;
    const whVis = { ...(model.warehouse_visibility || {}) };
    const wid = String(mgrWarehouse.id);
    const hidden = whVis[wid] || [];
    const isHidden = hidden.includes(flavor);
    whVis[wid] = isHidden ? hidden.filter(f => f !== flavor) : [...hidden, flavor];
    try { await sb.patch("catalog", { warehouse_visibility: whVis }, `id=eq.${modelId}`); sndClick(); setCatalog(p => p.map(c => c.id === modelId ? { ...c, warehouse_visibility: whVis } : c)); } catch (e) { console.error(e); }
  };
  const addModel = async () => {
    if (!newModelName.trim() || !newModelBrand.trim()) return;
    try {
      const res = await sb.post("catalog", { model_name: newModelName.trim(), brand: newModelBrand.trim(), puffs: newModelPuffs.trim() || "N/A", category: newModelCategory.trim() || "Vapes", flavors: [] });
      if (res && res[0]) { sndAdd(); setCatalog(p => [...p, res[0]].sort((a, b) => (a.category || "").localeCompare(b.category || "") || a.brand.localeCompare(b.brand) || a.model_name.localeCompare(b.model_name))); }
      setNewModelName(""); setNewModelBrand(""); setNewModelPuffs(""); setNewModelCategory("Vapes"); setShowAddModel(false);
    } catch (e) { console.error(e); }
  };
  const deleteModel = async (id) => { try { await sb.del("catalog", `id=eq.${id}`); sndRemove(); setCatalog(p => p.filter(c => c.id !== id)); setEditModel(null); setMgrView("catalog"); } catch (e) { console.error(e); } };
  const updateModelInfo = async (id) => {
    if (!editModelName.trim() || !editModelBrand.trim()) return;
    try {
      await sb.patch("catalog", { model_name: editModelName.trim(), brand: editModelBrand.trim(), puffs: editModelPuffs.trim() || "N/A", category: editModelCategory.trim() || "Vapes" }, `id=eq.${id}`);
      setCatalog(p => p.map(c => c.id === id ? { ...c, model_name: editModelName.trim(), brand: editModelBrand.trim(), puffs: editModelPuffs.trim() || "N/A", category: editModelCategory.trim() || "Vapes" } : c));
      setEditingModelInfo(false);
    } catch (e) { console.error(e); }
  };

  const setOrder = (product, flavor, value) => {
    sndClick();

    setOrderData(prev => {
      const key = `${product}|||${flavor}`;
      if (value === "skip" || prev[key] === value) { const next = { ...prev }; delete next[key]; return next; }
      return { ...prev, [key]: value };
    });
  };
  const getFilledCount = () => Object.keys(orderData).length;
  const getProductOrderCount = (name) => (catalogObj[name]?.activeFlavors || []).filter(f => orderData[`${name}|||${f}`]).length;
  const getTotalUnits = () => { let t = 0; Object.values(orderData).forEach(v => { t += v === "5+" ? 5 : parseInt(v) || 0; }); return t; };
  const getPending = () => { const sub = reports.map(r => r.store_location.toLowerCase().trim()); return stores.filter(s => !sub.includes(s.name.toLowerCase().trim())); };

  const st = {
    page: { minHeight: "100vh", background: "#0B0B0F", fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", padding: "24px 20px", maxWidth: "480px", margin: "0 auto" },
    back: { background: "none", border: "none", color: "#ffffff45", fontSize: "13px", cursor: "pointer", padding: "4px 0", marginBottom: "12px" },
    h1: { color: "#fff", fontSize: "28px", fontWeight: 800, margin: "0 0 4px 0", letterSpacing: "-0.8px" },
    h2: { color: "#fff", fontSize: "22px", fontWeight: 800, margin: "0 0 4px 0", letterSpacing: "-0.5px" },
    sub: { color: "#ffffff45", fontSize: "13px", margin: "0 0 24px 0" },
    input: { width: "100%", padding: "16px 18px", borderRadius: "12px", border: "1px solid #ffffff12", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: "15px", fontWeight: 500, outline: "none", boxSizing: "border-box" },
    label: { color: "#ffffff60", fontSize: "12px", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px", display: "block" },
    btn: { width: "100%", padding: "18px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,53,0.3)" },
    btnOff: { width: "100%", padding: "18px", borderRadius: "14px", border: "none", background: "#ffffff10", color: "#ffffff25", fontSize: "15px", fontWeight: 700, cursor: "not-allowed" },
  };

  const Banner = () => {
    const wid = empWarehouse?.id || mgrWarehouse?.id || 1;
    const bd = bannerData[wid];
    if (!bd || !bd.active || !bd.message) return null;
    const txt = bd.message;
    return (
      <div style={{ background: "linear-gradient(90deg, #FF6B35, #E63946, #FF6B35)", padding: "10px 0", marginBottom: "20px", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ display: "flex", animation: "scrollBanner 15s linear infinite", whiteSpace: "nowrap" }}>
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700, paddingRight: "80px" }}>{"⚠️ " + txt + " \u00A0\u00A0\u00A0 ⚠️ " + txt + " \u00A0\u00A0\u00A0 ⚠️ " + txt}</span>
        </div>
        <style>{`@keyframes scrollBanner { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }`}</style>
      </div>
    );
  };

  if (!catLoaded) return (<div style={{ ...st.page, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#ffffff40", fontSize: "14px" }}>Loading catalog...</p></div>);

  // Floating back button — fixed bottom-left
  const FloatingBack = ({ onClick }) => (
    <button onClick={() => { sndBack(); onClick(); }} style={{ position: "fixed", bottom: "24px", left: "20px", width: "56px", height: "56px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#000", fontSize: "22px", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 90, boxShadow: "0 4px 20px rgba(255,107,53,0.4)" }}>←</button>
  );

  // Order edit drawer
  const OrderDrawer = () => {
    const ic = getFilledCount(); const tu = getTotalUnits();
    if (ic === 0) return null;
    const items = Object.entries(orderData);
    const grouped = {}; items.forEach(([k, q]) => { const [pr, fl] = k.split("|||"); if (!grouped[pr]) grouped[pr] = []; grouped[pr].push({ flavor: fl, qty: q, key: k }); });
    return (
      <>
        {/* Floating order bar */}
        <div onClick={() => setShowOrderEdit(!showOrderEdit)} style={{ position: "fixed", bottom: "24px", left: "78px", right: "20px", padding: "14px 18px", borderRadius: "14px", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#fff", cursor: "pointer", zIndex: 90, boxShadow: "0 4px 24px rgba(255,107,53,0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>📋</span>
            <div><div style={{ fontSize: "14px", fontWeight: 700 }}>{ic} item{ic > 1 ? "s" : ""} • ~{tu} units</div></div>
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, opacity: 0.8 }}>{showOrderEdit ? "Close ▼" : "Edit ▲"}</span>
        </div>
        {/* Expanded edit drawer */}
        {showOrderEdit && (
          <div style={{ position: "fixed", bottom: "85px", left: "20px", right: "20px", maxHeight: "60vh", overflowY: "auto", borderRadius: "16px", background: "rgba(20,20,28,0.97)", backdropFilter: "blur(10px)", border: "1px solid #ffffff15", zIndex: 89, boxShadow: "0 -4px 30px rgba(0,0,0,0.6)", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ color: "#FF6B35", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Your Order</span>
              <button onClick={() => setShowOrderEdit(false)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ffffff20", background: "transparent", color: "#ffffff60", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Done ✓</button>
            </div>
            {Object.entries(grouped).map(([pr, flavors]) => (
              <div key={pr} style={{ marginBottom: "10px" }}>
                <div style={{ color: "#ffffff40", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>{pr}</div>
                {flavors.map(({ flavor, qty, key }) => {
                  const col = getQtyColor(qty);
                  return (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #ffffff08" }}>
                      <span style={{ color: "#fff", fontSize: "13px" }}>{flavor}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color: col, fontSize: "14px", fontWeight: 800 }}>×{qty}</span>
                        <button onClick={() => { sndRemove(); setOrderData(prev => { const next = { ...prev }; delete next[key]; return next; }); }}
                          style={{ background: "none", border: "1px solid #E6394630", borderRadius: "6px", color: "#E63946", fontSize: "10px", fontWeight: 700, cursor: "pointer", padding: "3px 8px" }}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  // SPLASH
  if (view === "splash") return (
    <div style={{ ...st.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "12px" }}>
      <div style={{ fontSize: "56px", marginBottom: "4px" }}>📦</div>
      <h1 style={{ color: "#fff", fontSize: "38px", fontWeight: 900, letterSpacing: "-2px", margin: 0 }}>RESTOCK</h1>
      <p style={{ color: "#ffffff35", fontSize: "12px", margin: 0, letterSpacing: "4px", textTransform: "uppercase" }}>Tell Us What You Need</p>
      <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        <button onClick={() => setView("employee-login")} style={st.btn}>🏪 Submit Restock Request</button>
        <button onClick={() => { setAuthed(false); setPin(""); setMgrView("dashboard"); setMgrWarehouse(null); setView("manager-login"); }} style={{ ...st.btn, background: "rgba(255,255,255,0.05)", border: "1px solid #ffffff15", boxShadow: "none" }}>📊 Manager Dashboard</button>
      </div>
      <p style={{ color: "#ffffff18", fontSize: "11px", marginTop: "60px", letterSpacing: "1px" }}>v3.0</p>
    </div>
  );

  // MANAGER LOGIN
  if (view === "manager-login") return (
    <div style={st.page}>
      <button onClick={() => { sndBack(); setView("splash"); }} style={st.back}>← Back</button>
      <h1 style={st.h1}>📊 Manager Access</h1><p style={st.sub}>Enter your PIN to continue</p>
      <div style={{ marginBottom: "24px" }}><label style={st.label}>Manager PIN</label>
        <input type="password" placeholder="Enter PIN" value={pin} onChange={e => setPin(e.target.value)} style={st.input} onKeyDown={e => { if (e.key === "Enter" && pin === PIN) { sndLogin(); setAuthed(true); setView("manager-warehouse"); } }} />
      </div>
      {pin.length >= 4 && pin !== PIN && <p style={{ color: "#E63946", fontSize: "13px", marginBottom: "12px" }}>Incorrect PIN</p>}
      <button onClick={() => { if (pin === PIN) { sndLogin(); setAuthed(true); setView("manager-warehouse"); } }} style={pin === PIN ? st.btn : st.btnOff} disabled={pin !== PIN}>Enter Dashboard →</button>
    </div>
  );

  // MANAGER WAREHOUSE SELECT
  if (view === "manager-warehouse" && authed) return (
    <div style={st.page}>
      <button onClick={() => { sndBack(); setView("manager-login"); setAuthed(false); setPin(""); }} style={st.back}>← Back</button>
      <h1 style={st.h1}>📊 Select Warehouse</h1><p style={st.sub}>Which warehouse are you managing?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {WAREHOUSES.map(w => (
          <button key={w.id} onClick={() => { sndLogin(); setMgrWarehouse(w); setView("manager"); }}
            style={{ padding: "22px 20px", borderRadius: "14px", border: "1px solid #6C5CE730", background: "rgba(108,92,231,0.06)", color: "#fff", fontSize: "18px", fontWeight: 800, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{w.name}</span>
            <span style={{ color: "#6C5CE7", fontSize: "20px" }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );

  // EMPLOYEE LOGIN
  if (view === "employee-login") {
    const codeValid = empCode.trim().length === 0 || getWarehouseByCode(empCode.trim());
    const ok = empName.trim().length > 0 && empCode.trim().length > 0 && storeLoc.trim().length > 0 && codeValid;
    return (
      <div style={st.page}>
        <button onClick={() => { 
          if (Object.keys(orderData).length > 0) {
            if (!window.confirm("You have items in your order. Backing out will lose your progress. Are you sure?")) return;
          }
          sndBack(); clearSession(); setView("splash"); setEmpCode(""); setEmpCodeError(false); 
        }} style={st.back}>← Back</button><Banner />
        <h1 style={st.h1}>Restock Request</h1><p style={st.sub}>Enter your info to start your order</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div><label style={st.label}>Your Name</label><input type="text" placeholder="e.g. Marcus" value={empName} onChange={e => setEmpName(e.target.value)} style={st.input} /></div>
          <div><label style={st.label}>Store Code</label>
            <input type="text" inputMode="numeric" placeholder="Enter your store code" value={empCode} onChange={e => { setEmpCode(e.target.value); setEmpCodeError(false); }} style={{ ...st.input, borderColor: empCodeError ? "#E63946" : "#ffffff12" }} />
            {empCodeError && <p style={{ color: "#E63946", fontSize: "12px", marginTop: "6px" }}>Invalid store code</p>}
          </div>
          <div><label style={st.label}>Store Name</label><input type="text" placeholder="e.g. Downtown, Eastside Mall" value={storeLoc} onChange={e => setStoreLoc(e.target.value)} style={st.input} /></div>
        </div>
        <button onClick={() => {
          if (!empName.trim() || !empCode.trim() || !storeLoc.trim()) return;
          const wh = getWarehouseByCode(empCode.trim());
          if (!wh) { setEmpCodeError(true); return; }
          sndLogin(); setEmpWarehouse(wh); setView("employee-products");
        }} style={{ ...(ok ? st.btn : st.btnOff), marginTop: "32px" }} disabled={!ok}>Continue →</button>
      </div>
    );
  }

  // EMPLOYEE PRODUCTS — category drill-down
  if (view === "employee-products") {
    const tu = getTotalUnits(); const ic = getFilledCount();
    // Group by category
    const catGroups = {};
    Object.entries(catalogObj).forEach(([name, data]) => {
      if (data.activeFlavors.length === 0) return;
      const cat = data.category || "Vapes";
      if (!catGroups[cat]) catGroups[cat] = { brands: {}, totalModels: 0, totalItems: 0, ordered: 0 };
      if (!catGroups[cat].brands[data.brand]) catGroups[cat].brands[data.brand] = [];
      catGroups[cat].brands[data.brand].push(name);
      catGroups[cat].totalModels++;
      catGroups[cat].totalItems += data.activeFlavors.length;
      catGroups[cat].ordered += getProductOrderCount(name);
    });
    const catKeys = Object.keys(catGroups).sort();
    const onlyOneCat = catKeys.length === 1;

    // If only one category, skip the category screen
    const activeCat = onlyOneCat ? catKeys[0] : selCategory;

    // Category emoji & color mapping
    const CAT_STYLE = {
      "Vapes": { emoji: "💨", gradient: "linear-gradient(135deg, #6C5CE7, #a855f7)", border: "#6C5CE740" },
      "Cigarettes": { emoji: "🚬", gradient: "linear-gradient(135deg, #E63946, #FF6B35)", border: "#E6394640" },
      "Pouches": { emoji: "👅", gradient: "linear-gradient(135deg, #00B4D8, #14B8A6)", border: "#00B4D840" },
      "E-Juice / Salt Nic": { emoji: "💧", gradient: "linear-gradient(135deg, #1DB954, #4ECDC4)", border: "#1DB95440" },
      "Mushroom Chocolate": { emoji: "🍄", gradient: "linear-gradient(135deg, #A855F7, #EC4899)", border: "#A855F740" },
      "Accessories": { emoji: "🔧", gradient: "linear-gradient(135deg, #F59E0B, #FF6B35)", border: "#F59E0B40" },
      "CBD": { emoji: "🌿", gradient: "linear-gradient(135deg, #10B981, #84CC16)", border: "#10B98140" },
      "Kratom": { emoji: "🍃", gradient: "linear-gradient(135deg, #14B8A6, #06B6D4)", border: "#14B8A640" },
      "Rolling Papers": { emoji: "📜", gradient: "linear-gradient(135deg, #F97316, #F59E0B)", border: "#F9731640" },
    };
    const defaultCatStyle = { emoji: "📦", gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)", border: "#6366F140" };

    // CATEGORY LIST VIEW
    if (!activeCat) {
      return (
        <div style={{ ...st.page, paddingBottom: ic > 0 ? "100px" : "24px" }}>
          <Banner />
          <h2 style={st.h2}>What Do You Need?</h2>
          <p style={{ color: "#ffffff50", fontSize: "13px", margin: "0 0 20px 0" }}>{empName} • {storeLoc}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {catKeys.map(cat => {
              const g = catGroups[cat];
              const hasOrders = g.ordered > 0;
              const cs = CAT_STYLE[cat] || defaultCatStyle;
              return (
                <button key={cat} onClick={() => setSelCategory(cat)}
                  style={{ padding: "0", borderRadius: "16px", border: `1px solid ${cs.border}`, background: "rgba(255,255,255,0.02)", color: "#fff", cursor: "pointer", textAlign: "left", overflow: "hidden", display: "flex", alignItems: "stretch" }}>
                  <div style={{ width: "72px", minHeight: "80px", background: cs.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0 }}>{cs.emoji}</div>
                  <div style={{ flex: 1, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>{cat}</div>
                      <div style={{ fontSize: "12px", color: "#ffffff35", fontWeight: 500 }}>{g.totalModels} model{g.totalModels > 1 ? "s" : ""} • {g.totalItems} items</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {hasOrders && <span style={{ padding: "4px 10px", borderRadius: "8px", background: "#FF6B3520", color: "#FF6B35", fontSize: "11px", fontWeight: 800 }}>{g.ordered}</span>}
                      <span style={{ color: "#ffffff30", fontSize: "20px", fontWeight: 300 }}>›</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: "20px", padding: "16px", borderRadius: "12px", border: "1px dashed #ffffff15", background: "rgba(255,255,255,0.015)" }}>
            <label style={{ ...st.label, marginBottom: "10px" }}>💡 Suggest a Product</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" placeholder="e.g. Funky Republic Ti7000" value={suggestion} onChange={e => setSuggestion(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
              <button onClick={() => { if (suggestion.trim()) { setSuggestions(p => [...p, { text: suggestion.trim(), from: empName, store: storeLoc }]); setSuggestion(""); } }}
                style={{ padding: "12px 18px", borderRadius: "10px", border: "none", background: suggestion.trim() ? "#FF6B35" : "#ffffff10", color: suggestion.trim() ? "#fff" : "#ffffff25", fontSize: "13px", fontWeight: 700, cursor: suggestion.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>Send</button>
            </div>
            {suggestions.map((sg, i) => (<div key={i} style={{ padding: "8px 12px", borderRadius: "8px", background: "#1DB95410", border: "1px solid #1DB95420", color: "#1DB954", fontSize: "12px", fontWeight: 600, marginTop: "6px" }}>✓ Suggested: {sg.text}</div>))}
          </div>
          {ic > 0 && (
            <button onClick={submitOrder} disabled={submitting} style={{ ...( submitting ? st.btnOff : st.btn), marginTop: "20px", background: submitting ? "#ffffff10" : "linear-gradient(135deg, #1DB954, #10B981)", boxShadow: submitting ? "none" : "0 4px 20px rgba(29,185,84,0.3)" }}>
              {submitting ? "Submitting..." : `✅ Submit Full Order (${ic} item${ic > 1 ? "s" : ""} • ~${tu} units)`}
            </button>
          )}
          <FloatingBack onClick={() => { 
            setView("employee-login"); setSelCategory(null); 
          }} />
          <OrderDrawer />
        </div>
      );
    }

    // BRAND/MODEL LIST VIEW (inside a category)
    const brands = catGroups[activeCat]?.brands || {};
    return (
      <div style={{ ...st.page, paddingBottom: ic > 0 ? "100px" : "80px" }}>
        <Banner />
        <h2 style={st.h2}>{activeCat}</h2>
        <p style={{ color: "#ffffff50", fontSize: "13px", margin: "0 0 16px 0" }}>{empName} • {storeLoc}</p>
        {Object.entries(brands).map(([brand, models]) => {
          const bc = getBrandColor(brand);
          return (
            <div key={brand} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <div style={{ width: "3px", height: "16px", borderRadius: "2px", background: bc }}></div>
                <span style={{ color: bc, fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{brand}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {models.map(model => {
                  const p = catalogObj[model]; const o = getProductOrderCount(model);
                  return (
                    <button key={model} onClick={() => { setSelProduct(model); setView("employee-flavors"); }}
                      style={{ padding: "16px", borderRadius: "12px", border: `1px solid ${o > 0 ? bc + "25" : "#ffffff0a"}`, background: o > 0 ? bc + "08" : "rgba(255,255,255,0.025)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><div style={{ marginBottom: "3px" }}>{model}</div><div style={{ fontSize: "11px", color: "#ffffff30", fontWeight: 500 }}>{p.puffs !== "N/A" ? p.puffs + " puffs • " : ""}{p.activeFlavors.length} items</div></div>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: o > 0 ? bc : "#ffffff25", whiteSpace: "nowrap" }}>{o > 0 ? `${o} requested` : ""}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <FloatingBack onClick={() => {
          if (onlyOneCat) {
            setView("employee-login");
          } else { setSelCategory(null); }
        }} />
        <OrderDrawer />
      </div>
    );
  }

  // EMPLOYEE FLAVORS
  if (view === "employee-flavors") {
    const p = catalogObj[selProduct];
    if (!p) { setView("employee-products"); setSelProduct(null); return null; }
    const bc = getBrandColor(p.brand);
    const ic = getFilledCount();
    return (
      <div style={{ ...st.page, paddingBottom: ic > 0 ? "100px" : "80px" }}>
        <span style={{ color: bc, fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>{p.brand}{p.puffs !== "N/A" ? ` • ${p.puffs} puffs` : ""}</span>
        <h2 style={{ ...st.h2, marginTop: "4px", marginBottom: "4px" }}>{selProduct}</h2>
        <p style={st.sub}>How many of each do you need?</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button onClick={() => p.activeFlavors.forEach(f => { const key = `${selProduct}|||${f}`; setOrderData(prev => { const next = { ...prev }; delete next[key]; return next; }); })}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #ffffff15", background: "transparent", color: "#ffffff40", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Skip All</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {p.activeFlavors.map(flavor => {
            const key = `${selProduct}|||${flavor}`; const cur = orderData[key]; const has = cur !== undefined; const col = has ? getQtyColor(cur) : "#ffffff10";
            return (
              <div key={flavor} style={{ padding: "14px 16px", borderRadius: "12px", border: `1px solid ${has ? col + "30" : "#ffffff08"}`, background: has ? col + "08" : "rgba(255,255,255,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>{flavor}</span>
                  {has && <span style={{ fontSize: "16px", fontWeight: 800, color: col, minWidth: "28px", textAlign: "right" }}>×{cur}</span>}
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {QTY_OPTIONS.map(opt => {
                    const isSkip = opt === "skip"; const isSel = isSkip ? !has : cur === opt; const oc = isSkip ? "#ffffff30" : getQtyColor(opt);
                    return (<button key={opt} onClick={() => setOrder(selProduct, flavor, opt)} style={{ flex: 1, padding: "10px 4px", borderRadius: "8px", border: isSel ? `2px solid ${oc}` : "1px solid #ffffff10", background: isSel ? oc + "20" : "transparent", color: isSel ? oc : "#ffffff25", fontSize: isSkip ? "10px" : "14px", fontWeight: 700, cursor: "pointer", textTransform: isSkip ? "uppercase" : "none", letterSpacing: isSkip ? "0.5px" : "0" }}>{isSkip ? "Skip" : opt}</button>);
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {/* Bottom action bar */}
        <div style={{ position: "fixed", bottom: "24px", left: "20px", right: "20px", display: "flex", gap: "10px", alignItems: "center", zIndex: 90 }}>
          <button onClick={() => { sndBack(); setView("employee-products"); }}
            style={{ width: "56px", height: "56px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#000", fontSize: "22px", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 20px rgba(255,107,53,0.4)" }}>←</button>
          {ic > 0 && (
            <div onClick={() => setShowOrderEdit(!showOrderEdit)} style={{ flex: 1, padding: "16px", borderRadius: "14px", background: "rgba(30,30,40,0.95)", border: "1px solid #ffffff15", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(10px)" }}>
              <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>📋 {ic} item{ic > 1 ? "s" : ""}</span>
              <span style={{ color: "#ffffff50", fontSize: "11px", fontWeight: 600 }}>{showOrderEdit ? "Close ▼" : "Edit ▲"}</span>
            </div>
          )}
          <button onClick={() => { sndDone(); setView("employee-products"); }}
            style={{ height: "56px", paddingLeft: "20px", paddingRight: "20px", borderRadius: "28px", border: "none", background: "linear-gradient(135deg, #1DB954, #10B981)", color: "#fff", fontSize: "14px", fontWeight: 800, cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 20px rgba(29,185,84,0.4)", whiteSpace: "nowrap" }}>Done ✓</button>
        </div>
        {/* Order edit drawer */}
        {showOrderEdit && ic > 0 && (() => {
          const items = Object.entries(orderData);
          const grouped = {}; items.forEach(([k, q]) => { const [pr, fl] = k.split("|||"); if (!grouped[pr]) grouped[pr] = []; grouped[pr].push({ flavor: fl, qty: q, key: k }); });
          return (
            <div style={{ position: "fixed", bottom: "95px", left: "20px", right: "20px", maxHeight: "55vh", overflowY: "auto", borderRadius: "16px", background: "rgba(20,20,28,0.97)", backdropFilter: "blur(10px)", border: "1px solid #ffffff15", zIndex: 89, boxShadow: "0 -4px 30px rgba(0,0,0,0.6)", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ color: "#FF6B35", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Your Order</span>
                <button onClick={() => setShowOrderEdit(false)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ffffff20", background: "transparent", color: "#ffffff60", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Done ✓</button>
              </div>
              {Object.entries(grouped).map(([pr, flavors]) => (
                <div key={pr} style={{ marginBottom: "10px" }}>
                  <div style={{ color: "#ffffff40", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>{pr}</div>
                  {flavors.map(({ flavor, qty, key }) => {
                    const col = getQtyColor(qty);
                    return (
                      <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #ffffff08" }}>
                        <span style={{ color: "#fff", fontSize: "13px" }}>{flavor}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ color: col, fontSize: "14px", fontWeight: 800 }}>×{qty}</span>
                          <button onClick={() => { sndRemove(); setOrderData(prev => { const next = { ...prev }; delete next[key]; return next; }); }}
                            style={{ background: "none", border: "1px solid #E6394630", borderRadius: "6px", color: "#E63946", fontSize: "10px", fontWeight: 700, cursor: "pointer", padding: "3px 8px" }}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    );
  }

  // EMPLOYEE DONE
  if (view === "employee-done") {
    const items = Object.entries(orderData); const tu = getTotalUnits();
    const grouped = {}; items.forEach(([k, q]) => { const [pr, fl] = k.split("|||"); if (!grouped[pr]) grouped[pr] = []; grouped[pr].push({ flavor: fl, qty: q }); });
    return (
      <div style={{ ...st.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "12px" }}>✅</div>
        <h2 style={{ ...st.h1, fontSize: "26px" }}>Request Submitted!</h2>
        <p style={{ color: "#ffffff50", fontSize: "14px", margin: "8px 0" }}><strong>{empName}</strong> • {storeLoc}</p>
        <div style={{ marginTop: "16px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid #ffffff10", textAlign: "left", width: "100%", maxWidth: "360px" }}>
          <div style={{ color: "#FF6B35", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "12px" }}>Order Summary — {items.length} items • ~{tu} units</div>
          {Object.entries(grouped).map(([pr, flavors]) => (
            <div key={pr} style={{ marginBottom: "12px" }}>
              <div style={{ color: "#ffffff45", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>{pr}</div>
              {flavors.map(({ flavor, qty }) => (<div key={flavor} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span style={{ color: "#ffffff70", fontSize: "13px" }}>{flavor}</span><span style={{ color: getQtyColor(qty), fontSize: "13px", fontWeight: 700 }}>×{qty}</span></div>))}
            </div>
          ))}
        </div>
        {suggestions.length > 0 && (<div style={{ marginTop: "12px", padding: "12px 16px", borderRadius: "10px", background: "#6C5CE710", border: "1px solid #6C5CE720", width: "100%", maxWidth: "360px", textAlign: "left" }}><span style={{ color: "#6C5CE7", fontSize: "12px", fontWeight: 700 }}>💡 {suggestions.length} suggestion{suggestions.length > 1 ? "s" : ""} sent</span></div>)}
        <button onClick={() => { clearSession(); setView("splash"); setOrderData({}); setEmpName(""); setStoreLoc(""); setEmpCode(""); setEmpWarehouse(null); setSuggestions([]); setSelCategory(null); }} style={{ ...st.btn, marginTop: "32px", background: "rgba(255,255,255,0.05)", border: "1px solid #ffffff15", boxShadow: "none", maxWidth: "360px" }}>Done</button>
      </div>
    );
  }

  // MANAGER CATALOG
  if (view === "manager" && authed && mgrView === "catalog") {
    const catBrands = {};
    catalog.forEach(c => { const cat = c.category || "Vapes"; if (!catBrands[cat]) catBrands[cat] = {}; if (!catBrands[cat][c.brand]) catBrands[cat][c.brand] = []; catBrands[cat][c.brand].push(c); });
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setMgrView("dashboard"); }} style={st.back}>← Back to Dashboard</button>
        <h1 style={st.h1}>🗂️ Manage Catalog</h1><p style={st.sub}>Managing for {mgrWarehouse?.name} • toggle visibility per warehouse</p>
        {!showAddModel ? (
          <button onClick={() => setShowAddModel(true)} style={{ padding: "10px 18px", borderRadius: "8px", background: "#1DB95420", color: "#1DB954", border: "1px solid #1DB95430", fontSize: "13px", fontWeight: 700, cursor: "pointer", marginBottom: "20px" }}>+ Add New Model / Product</button>
        ) : (
          <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid #1DB95430", background: "#1DB95408", marginBottom: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input type="text" placeholder="Product name (e.g. Geek Bar Skyview 20k)" value={newModelName} onChange={e => setNewModelName(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
              <input type="text" placeholder="Brand (e.g. Geek Bar, RAW, etc)" value={newModelBrand} onChange={e => setNewModelBrand(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
              <input type="text" placeholder="Category (e.g. Vapes, Accessories, CBD)" value={newModelCategory} onChange={e => setNewModelCategory(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
              <input type="text" placeholder="Puff count (leave blank if not a vape)" value={newModelPuffs} onChange={e => setNewModelPuffs(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={addModel} style={{ padding: "10px 18px", borderRadius: "8px", background: "#1DB954", color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Save</button>
                <button onClick={() => { setShowAddModel(false); setNewModelName(""); setNewModelBrand(""); setNewModelPuffs(""); setNewModelCategory("Vapes"); }} style={{ padding: "10px 18px", borderRadius: "8px", background: "transparent", color: "#ffffff40", border: "1px solid #ffffff15", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {Object.entries(catBrands).map(([cat, brands]) => (
          <div key={cat}>
            <div style={{ padding: "8px 0", marginBottom: "8px", marginTop: "12px", borderBottom: "1px solid #ffffff10", paddingBottom: "10px" }}>
              <span style={{ color: "#ffffff70", fontSize: "15px", fontWeight: 800 }}>{cat}</span>
            </div>
            {Object.entries(brands).map(([brand, models]) => {
              const bc = getBrandColor(brand);
              return (
                <div key={brand} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "3px", height: "16px", borderRadius: "2px", background: bc }}></div>
                    <span style={{ color: bc, fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{brand}</span>
                  </div>
                  {models.map(m => {
                    const whVis = m.warehouse_visibility || {};
                    const hiddenCount = mgrWarehouse ? (whVis[String(mgrWarehouse.id)] || []).length : 0;
                    return (
                    <button key={m.id} onClick={() => { setEditModel(m); setMgrView("editModel"); setNewFlavor(""); setEditingModelInfo(false); }}
                      style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #ffffff0a", background: "rgba(255,255,255,0.025)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div><div>{m.model_name}</div><div style={{ fontSize: "11px", color: "#ffffff30", marginTop: "2px" }}>{m.puffs !== "N/A" ? m.puffs + " puffs" : cat}</div></div>
                      <span style={{ fontSize: "12px", color: hiddenCount > 0 ? "#F59E0B" : "#ffffff40" }}>{(m.flavors || []).length} items{hiddenCount > 0 ? ` • ${hiddenCount} off` : ""} ›</span>
                    </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ height: "70px" }} />
        <FloatingBack onClick={() => setMgrView("dashboard")} />
      </div>
    );
  }

  // MANAGER EDIT MODEL
  if (view === "manager" && authed && mgrView === "editModel" && editModel) {
    const m = catalog.find(c => c.id === editModel.id) || editModel;
    const bc = getBrandColor(m.brand);
    const whVis = m.warehouse_visibility || {};
    const hiddenForThis = mgrWarehouse ? (whVis[String(mgrWarehouse.id)] || []) : [];
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setMgrView("catalog"); setEditModel(null); setEditingModelInfo(false); }} style={st.back}>← Back to Catalog</button>
        {!editingModelInfo ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ color: bc, fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>{m.brand} {m.puffs !== "N/A" ? `• ${m.puffs} puffs` : ""} • {m.category || "Vapes"}</span>
                <h2 style={{ ...st.h2, marginTop: "4px" }}>{m.model_name}</h2>
              </div>
              <button onClick={() => { setEditingModelInfo(true); setEditModelName(m.model_name); setEditModelBrand(m.brand); setEditModelPuffs(m.puffs || ""); setEditModelCategory(m.category || "Vapes"); }}
                style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #ffffff20", background: "transparent", color: "#ffffff50", fontSize: "11px", fontWeight: 700, cursor: "pointer", marginTop: "4px" }}>✏️ Edit</button>
            </div>
            <p style={st.sub}>{(m.flavors || []).length} items{hiddenForThis.length > 0 ? ` • ${hiddenForThis.length} hidden for ${mgrWarehouse?.name}` : ""}</p>
          </div>
        ) : (
          <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid #00B4D830", background: "#00B4D808", marginBottom: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div><label style={st.label}>Model Name</label><input type="text" value={editModelName} onChange={e => setEditModelName(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} /></div>
              <div><label style={st.label}>Brand</label><input type="text" value={editModelBrand} onChange={e => setEditModelBrand(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} /></div>
              <div><label style={st.label}>Category</label><input type="text" value={editModelCategory} onChange={e => setEditModelCategory(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} /></div>
              <div><label style={st.label}>Puff Count</label><input type="text" value={editModelPuffs} onChange={e => setEditModelPuffs(e.target.value)} placeholder="Leave blank if not a vape" style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} /></div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => updateModelInfo(m.id)} style={{ padding: "10px 18px", borderRadius: "8px", background: "#00B4D8", color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
                <button onClick={() => setEditingModelInfo(false)} style={{ padding: "10px 18px", borderRadius: "8px", background: "transparent", color: "#ffffff40", border: "1px solid #ffffff15", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <input type="text" placeholder="Add new item..." value={newFlavor} onChange={e => setNewFlavor(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && newFlavor.trim()) { addFlavorToModel(m.id, newFlavor); setNewFlavor(""); } }}
            style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
          <button onClick={() => { if (newFlavor.trim()) { addFlavorToModel(m.id, newFlavor); setNewFlavor(""); } }}
            style={{ padding: "12px 18px", borderRadius: "10px", border: "none", background: newFlavor.trim() ? "#1DB954" : "#ffffff10", color: newFlavor.trim() ? "#fff" : "#ffffff25", fontSize: "13px", fontWeight: 700, cursor: newFlavor.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>+ Add</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ color: "#ffffff30", fontSize: "12px", fontWeight: 600 }}>{hiddenForThis.length === 0 ? "All visible" : `${(m.flavors || []).length - hiddenForThis.length} visible / ${hiddenForThis.length} hidden`}</span>
          <button onClick={async () => {
            if (!mgrWarehouse) return;
            const allFlavors = m.flavors || [];
            const allHidden = hiddenForThis.length === allFlavors.length;
            const whVis = { ...(m.warehouse_visibility || {}) };
            const wid = String(mgrWarehouse.id);
            whVis[wid] = allHidden ? [] : [...allFlavors];
            try { await sb.patch("catalog", { warehouse_visibility: whVis }, `id=eq.${m.id}`); sndClick(); setCatalog(p => p.map(c => c.id === m.id ? { ...c, warehouse_visibility: whVis } : c)); } catch (e) { console.error(e); }
          }} style={{ padding: "6px 14px", borderRadius: "8px", border: `1px solid ${hiddenForThis.length === (m.flavors || []).length ? "#1DB95430" : "#E6394630"}`, background: hiddenForThis.length === (m.flavors || []).length ? "#1DB95410" : "#E6394610", color: hiddenForThis.length === (m.flavors || []).length ? "#1DB954" : "#E63946", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
            {hiddenForThis.length === (m.flavors || []).length ? "Turn All On" : "Turn All Off"}
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(m.flavors || []).map(f => {
            const isHidden = hiddenForThis.includes(f);
            return (
              <div key={f} style={{ padding: "12px 14px", borderRadius: "8px", background: isHidden ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.025)", border: `1px solid ${isHidden ? "#ffffff05" : "#ffffff08"}`, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s ease" }}>
                <span style={{ color: isHidden ? "#ffffff30" : "#fff", fontSize: "13px", fontWeight: 600, textDecoration: isHidden ? "line-through" : "none", flex: 1 }}>{f}</span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                  <button onClick={() => toggleFlavorVisibility(m.id, f)}
                    style={{ width: "44px", height: "24px", borderRadius: "12px", border: "none", background: isHidden ? "#ffffff15" : "#1DB954", cursor: "pointer", position: "relative", transition: "background 0.2s ease", padding: 0 }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: isHidden ? "3px" : "23px", transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
                  </button>
                  <button onClick={() => removeFlavorFromModel(m.id, f)} style={{ background: "none", border: "1px solid #E6394630", borderRadius: "6px", color: "#E63946", fontSize: "11px", fontWeight: 700, cursor: "pointer", padding: "4px 10px" }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "40px", padding: "16px", borderRadius: "12px", border: "1px solid #E6394630", background: "rgba(230,57,70,0.05)" }}>
          <p style={{ color: "#E63946", fontSize: "12px", fontWeight: 700, margin: "0 0 10px 0" }}>DANGER ZONE</p>
          <button onClick={() => { if (window.confirm(`Delete ${m.model_name} and all its items?`)) deleteModel(m.id); }}
            style={{ padding: "10px 18px", borderRadius: "8px", background: "#E63946", color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Delete Entire Model</button>
        </div>
        <div style={{ height: "70px" }} />
        <FloatingBack onClick={() => { setMgrView("catalog"); setEditModel(null); setEditingModelInfo(false); }} />
      </div>
    );
  }

  // MANAGER DASHBOARD
  if (view === "manager" && authed && mgrView === "dashboard" && !selReport) {
    const pending = getPending();
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setView("manager-warehouse"); setMgrWarehouse(null); }} style={st.back}>← Switch Warehouse</button>
        <h1 style={st.h1}>📊 {mgrWarehouse?.name} Dashboard</h1><p style={st.sub}>{loading ? "Loading..." : `${reports.length} pending order${reports.length !== 1 ? "s" : ""}`}</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button onClick={loadMgr} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ffffff15", background: "transparent", color: "#ffffff50", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>🔄 Refresh</button>
          <button onClick={() => setMgrView("catalog")} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #6C5CE730", background: "#6C5CE710", color: "#6C5CE7", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>🗂️ Manage Catalog</button>
        </div>
        <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid #FF6B3530", background: "rgba(255,107,53,0.05)", marginBottom: "20px" }}>
          {(() => { const wid = mgrWarehouse?.id || 1; const bd = bannerData[wid] || { message: "", active: false }; const bannerText = bd.message; const bannerOn = bd.active; return (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editBanner ? "12px" : "0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "14px" }}>📢</span><span style={{ color: "#FF6B35", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Employee Banner</span></div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button onClick={toggleBanner} style={{ padding: "4px 12px", borderRadius: "20px", border: "none", fontSize: "11px", fontWeight: 700, cursor: "pointer", background: bannerOn ? "#1DB95425" : "#ffffff10", color: bannerOn ? "#1DB954" : "#ffffff30" }}>{bannerOn ? "ON" : "OFF"}</button>
              <button onClick={() => { setEditBanner(!editBanner); setBannerInput(bannerText); }} style={{ padding: "4px 12px", borderRadius: "20px", border: "1px solid #ffffff15", background: "transparent", color: "#ffffff50", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>{editBanner ? "Cancel" : "Edit"}</button>
            </div>
          </div>
          {!editBanner && bannerText && <div style={{ color: "#ffffff60", fontSize: "13px", marginTop: "8px", fontStyle: "italic" }}>"{bannerText}"</div>}
          {editBanner && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <textarea value={bannerInput} onChange={e => setBannerInput(e.target.value)} placeholder="Type message..." rows={2} style={{ ...st.input, fontSize: "13px", padding: "12px 14px", resize: "vertical", minHeight: "60px", fontFamily: "inherit" }} />
              <button onClick={saveBanner} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: bannerInput.trim() ? "#FF6B35" : "#ffffff10", color: bannerInput.trim() ? "#fff" : "#ffffff25", fontSize: "13px", fontWeight: 700, cursor: bannerInput.trim() ? "pointer" : "not-allowed", alignSelf: "flex-end" }}>Save & Broadcast</button>
            </div>
          )}
          </>); })()}
        </div>
        <div style={{ marginBottom: "8px" }}><span style={{ color: "#ffffff60", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Pending Restock Requests</span></div>
        {reports.length === 0 && !loading && <div style={{ padding: "24px", textAlign: "center", borderRadius: "12px", border: "1px dashed #ffffff12", marginBottom: "20px" }}><p style={{ color: "#ffffff30", fontSize: "14px", margin: 0 }}>No pending orders</p></div>}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          {reports.map(r => (
            <div key={r.id} style={{ padding: "16px", borderRadius: "12px", border: "1px solid #ffffff0a", background: "rgba(255,255,255,0.025)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ cursor: "pointer", flex: 1 }} onClick={() => setSelReport(r)}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{r.employee_name}</div>
                <div style={{ fontSize: "12px", color: "#ffffff35" }}>{r.store_location} • {fmtTime(r.created_at)} • {timeAgo(r.created_at)}</div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ padding: "4px 10px", borderRadius: "6px", background: "#FF6B3518", color: "#FF6B35", fontSize: "11px", fontWeight: 700 }}>{r.total_flavors} • ~{r.total_units}u</span>
                <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Remove ${r.employee_name}'s submission?`)) deleteSubmission(r.id); }}
                  style={{ background: "none", border: "1px solid #E6394630", borderRadius: "6px", color: "#E63946", fontSize: "12px", cursor: "pointer", padding: "4px 8px", fontWeight: 700 }}>✕</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: "8px" }}><span style={{ color: "#E63946", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>⏳ Still Waiting ({pending.length})</span></div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
          {pending.map(s => (<span key={s.id} style={{ padding: "7px 12px", borderRadius: "8px", background: "rgba(230,57,70,0.07)", border: "1px solid #E6394620", fontSize: "12px", fontWeight: 600, color: "#E63946", display: "flex", alignItems: "center", gap: "6px" }}>{s.name}<button onClick={() => removeStore(s.id)} style={{ background: "none", border: "none", color: "#E6394680", cursor: "pointer", fontSize: "10px", padding: "0 2px" }}>✕</button></span>))}
          {pending.length === 0 && stores.length > 0 && <span style={{ color: "#1DB954", fontSize: "12px", fontWeight: 600 }}>✓ All stores submitted!</span>}
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <input type="text" placeholder="Add store..." value={newStore} onChange={e => setNewStore(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addStore(); }} style={{ ...st.input, fontSize: "12px", padding: "10px 14px" }} />
          <button onClick={addStore} style={{ padding: "10px 16px", borderRadius: "10px", border: "none", background: newStore.trim() ? "#E63946" : "#ffffff10", color: newStore.trim() ? "#fff" : "#ffffff25", fontSize: "12px", fontWeight: 700, cursor: newStore.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>+ Add</button>
        </div>
        {allSugs.length > 0 && (
          <div>
            <span style={{ color: "#6C5CE7", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>💡 Suggestions ({allSugs.length})</span>
            {allSugs.map(sg => (
              <div key={sg.id} style={{ padding: "12px 16px", borderRadius: "10px", background: "#6C5CE708", border: "1px solid #6C5CE715", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>{sg.suggestion_text}</div><div style={{ color: "#ffffff35", fontSize: "11px", marginTop: "2px" }}>from {sg.employee_name} @ {sg.store_location}</div></div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => approveSug(sg.id)} style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #1DB95430", background: "#1DB95410", color: "#1DB954", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Add ✓</button>
                  <button onClick={() => dismissSug(sg.id)} style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ffffff10", background: "transparent", color: "#ffffff30", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // MANAGER REPORT DETAIL
  if (view === "manager" && authed && selReport) {
    const r = selReport; const entries = Object.entries(r.items || {});
    const grp = {}; entries.forEach(([k, q]) => { const [pr, fl] = k.split("|||"); if (!grp[pr]) grp[pr] = []; grp[pr].push({ flavor: fl, qty: q }); });
    const totalItems = entries.length;
    const totalPicked = Object.keys(pickedItems).filter(k => pickedItems[k]).length;
    const allDone = totalPicked === totalItems && totalItems > 0;
    const togglePick = (key) => { sndClick(); setPickedItems(p => ({ ...p, [key]: !p[key] })); };
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setSelReport(null); setPickedItems({}); }} style={st.back}>← Back to Dashboard</button>
        <h2 style={st.h2}>{r.employee_name}'s Request</h2>
        <p style={{ color: "#ffffff45", fontSize: "13px", margin: "4px 0 20px 0" }}>{r.store_location} • {fmtTime(r.created_at)}</p>
        <div style={{ padding: "20px", borderRadius: "14px", marginBottom: "12px", background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(230,57,70,0.08))", border: "1px solid #FF6B3520", display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <div><div style={{ fontSize: "28px", fontWeight: 900, color: "#FF6B35", lineHeight: 1 }}>{r.total_flavors}</div><div style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B35", marginTop: "4px", opacity: 0.7 }}>ITEMS</div></div>
          <div style={{ width: "1px", background: "#ffffff10" }}></div>
          <div><div style={{ fontSize: "28px", fontWeight: 900, color: "#E63946", lineHeight: 1 }}>~{r.total_units}</div><div style={{ fontSize: "11px", fontWeight: 700, color: "#E63946", marginTop: "4px", opacity: 0.7 }}>TOTAL UNITS</div></div>
        </div>
        {/* Floating progress bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 80, padding: "12px 16px", borderRadius: "12px", background: allDone ? "rgba(29,185,84,0.15)" : "rgba(11,11,15,0.95)", backdropFilter: "blur(12px)", border: `1px solid ${allDone ? "#1DB95430" : "#ffffff10"}`, marginBottom: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ color: allDone ? "#1DB954" : "#ffffff50", fontSize: "12px", fontWeight: 700 }}>{allDone ? "✅ ALL PICKED!" : `Picked ${totalPicked} of ${totalItems}`}</span>
            <span style={{ color: allDone ? "#1DB954" : "#ffffff30", fontSize: "12px", fontWeight: 700 }}>{totalItems > 0 ? Math.round((totalPicked / totalItems) * 100) : 0}%</span>
          </div>
          <div style={{ height: "6px", borderRadius: "3px", background: "#ffffff10", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: "3px", background: allDone ? "#1DB954" : "linear-gradient(90deg, #FF6B35, #FF8C42)", width: `${totalItems > 0 ? (totalPicked / totalItems) * 100 : 0}%`, transition: "width 0.3s ease" }} />
          </div>
        </div>
        <p style={{ color: "#ffffff25", fontSize: "11px", margin: "0 0 16px 0", textAlign: "center" }}>Tap items to mark as picked</p>
        {Object.entries(grp).map(([product, items]) => {
          const bn = catalogObj[product]?.brand; const bc = getBrandColor(bn);
          const sectionPicked = items.filter(({ flavor }) => pickedItems[`${r.id}|||${product}|||${flavor}`]).length;
          const sectionDone = sectionPicked === items.length;
          return (
            <div key={product} style={{ marginBottom: "20px", borderLeft: `4px solid ${sectionDone ? "#1DB954" : bc}`, borderRadius: "12px", background: sectionDone ? "rgba(29,185,84,0.05)" : `${bc}08`, padding: "16px", paddingLeft: "16px", transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ color: sectionDone ? "#1DB954" : bc, fontSize: "14px", fontWeight: 800, letterSpacing: "0.3px" }}>{sectionDone ? "✓ " : ""}{product}</span>
                <span style={{ color: sectionDone ? "#1DB954" : bc, fontSize: "11px", fontWeight: 700, opacity: 0.6 }}>{sectionPicked}/{items.length} picked</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {items.sort((a, b) => (b.qty === "5+" ? 6 : parseInt(b.qty)) - (a.qty === "5+" ? 6 : parseInt(a.qty))).map(({ flavor, qty }) => {
                  const key = `${r.id}|||${product}|||${flavor}`;
                  const picked = pickedItems[key];
                  const col = picked ? "#1DB954" : getQtyColor(qty);
                  return (
                    <div key={flavor} onClick={() => togglePick(key)}
                      style={{ padding: "10px 12px", borderRadius: "8px", background: picked ? "rgba(29,185,84,0.12)" : "rgba(0,0,0,0.25)", border: picked ? "1px solid #1DB95425" : "1px solid transparent", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.2s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ width: "22px", height: "22px", borderRadius: "6px", border: picked ? "2px solid #1DB954" : "2px solid #ffffff20", background: picked ? "#1DB954" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", flexShrink: 0, transition: "all 0.2s ease" }}>{picked ? "✓" : ""}</span>
                        <span style={{ color: picked ? "#ffffff40" : "#fff", fontSize: "13px", fontWeight: 600, textDecoration: picked ? "line-through" : "none", transition: "all 0.2s ease" }}>{flavor}</span>
                      </div>
                      <span style={{ fontSize: "18px", fontWeight: 800, color: col, minWidth: "36px", textAlign: "right", opacity: picked ? 0.4 : 1, transition: "opacity 0.2s ease" }}>×{qty}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <button onClick={() => { if (window.confirm(`Remove ${r.employee_name}'s submission?`)) { deleteSubmission(r.id); } }}
          style={{ marginTop: "20px", width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E6394630", background: "rgba(230,57,70,0.05)", color: "#E63946", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>🗑️ Delete This Submission</button>
        <div style={{ height: "70px" }} />
        <FloatingBack onClick={() => { setSelReport(null); setPickedItems({}); }} />
      </div>
    );
  }

  return null;
}
