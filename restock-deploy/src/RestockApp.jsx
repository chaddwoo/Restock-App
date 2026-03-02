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
  async rpc(fn, params) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return r.json();
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

// Warehouses loaded from DB per-org (see loadWarehouses)

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
const LS_ORG_KEY = "backstock_org";
const saveSession = (d) => { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch(e){} };
const loadSession = () => { try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : null; } catch(e){ return null; } };
const clearSession = () => { try { localStorage.removeItem(LS_KEY); } catch(e){} };
const loadSavedOrg = () => { try { const s = localStorage.getItem(LS_ORG_KEY); return s ? JSON.parse(s) : null; } catch(e){ return null; } };
const saveOrg = (o) => { try { localStorage.setItem(LS_ORG_KEY, JSON.stringify(o)); } catch(e){} };
const clearOrg = () => { try { localStorage.removeItem(LS_ORG_KEY); } catch(e){} };
const _saved = (() => { const s = loadSession(); if (!s) return null; const empViews = ["employee-login","employee-products","employee-flavors","employee-confirm"]; if (!empViews.includes(s.view)) return null; return s; })();
const _savedOrg = loadSavedOrg();

export default function RestockApp() {
  // Org state
  const [currentOrg, setCurrentOrg] = useState(_savedOrg);
  const [orgCode, setOrgCode] = useState("");
  const [orgError, setOrgError] = useState("");
  const [orgLoading, setOrgLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  const orgId = currentOrg?.id || null;

  // Org-scoped database helper — injects org_id into every query
  const orgSb = useMemo(() => ({
    get(table, opts = {}) {
      if (!orgId) return Promise.resolve([]);
      const filter = opts.filter ? `${opts.filter}&org_id=eq.${orgId}` : `org_id=eq.${orgId}`;
      return sb.get(table, { ...opts, filter });
    },
    post(table, data) {
      if (!orgId) return Promise.resolve(null);
      return sb.post(table, { ...data, org_id: orgId });
    },
    patch(table, data, filter) {
      if (!orgId) return Promise.resolve(null);
      return sb.patch(table, data, `${filter}&org_id=eq.${orgId}`);
    },
    del(table, filter) {
      if (!orgId) return Promise.resolve(false);
      return sb.del(table, `${filter}&org_id=eq.${orgId}`);
    },
    rpc: sb.rpc,
  }), [orgId]);

  const getWarehouseByCode = (code) => warehouses.find(w => w.code === code);

  const [view, setView] = useState(_saved?.view || (_savedOrg ? "splash" : "org-entry"));
  const [empName, setEmpName] = useState(_saved?.empName || "");
  const [storeLoc, setStoreLoc] = useState(_saved?.storeLoc || "");
  const [empWarehouse, setEmpWarehouse] = useState(_saved?.empWarehouse || null);
  const [empCode, setEmpCode] = useState(_saved?.empCode || "");
  const [empCodeError, setEmpCodeError] = useState(false);
  const [selProduct, setSelProduct] = useState(_saved?.selProduct || null);
  const [orderData, setOrderData] = useState(_saved?.orderData || {});
  const [suggestion, setSuggestion] = useState("");
  const [empSearch, setEmpSearch] = useState("");
  const [empExpandedBrands, setEmpExpandedBrands] = useState({});
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
  const [expandedBrands, setExpandedBrands] = useState({});
  const [expandedCats, setExpandedCats] = useState({});
  const [catalogSearch, setCatalogSearch] = useState("");
  const [editingModelInfo, setEditingModelInfo] = useState(false);
  const [editModelName, setEditModelName] = useState("");
  const [editModelBrand, setEditModelBrand] = useState("");
  const [editModelPuffs, setEditModelPuffs] = useState("");
  const [editModelCategory, setEditModelCategory] = useState("");
  const [selCategory, setSelCategory] = useState(_saved?.selCategory || null);
  const [showOrderEdit, setShowOrderEdit] = useState(false);
  const [onboardStep, setOnboardStep] = useState(() => {
    try { return localStorage.getItem("backstock_onboarded") ? null : 0; } catch { return 0; }
  });
  const [pickedItems, setPickedItems] = useState({});
  const [adjustedQtys, setAdjustedQtys] = useState({});
  const [analyticsData, setAnalyticsData] = useState([]);
  const [analyticsRange, setAnalyticsRange] = useState("7d");
  const [receiveModel, setReceiveModel] = useState(null);
  const [receiveQtys, setReceiveQtys] = useState({});
  const [receiveNotes, setReceiveNotes] = useState("");
  const [receiveSearch, setReceiveSearch] = useState("");
  const [receiveExpCats, setReceiveExpCats] = useState({});
  const [receiveExpBrands, setReceiveExpBrands] = useState({});
  const [recentShipments, setRecentShipments] = useState([]);

  const [mgrPin, setMgrPin] = useState(null);
  const [ownerPin, setOwnerPin] = useState(null);
  const [execPin, setExecPin] = useState(null);
  const [pinLoading, setPinLoading] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null); // "owner", "manager", or "exec"

  // Cost/margin visible when exec on your org, OR manager on customer org (no exec_pin)
  const canSeeCostMargin = accessLevel === "exec" || (accessLevel === "manager" && !execPin);
  const isManagerOrExec = accessLevel === "manager" || accessLevel === "exec";

  const activeWid = empWarehouse?.id || mgrWarehouse?.id || null;
  const catalogObj = useMemo(() => {
    const obj = {};
    catalog.forEach(c => {
      const whVis = c.warehouse_visibility || {};
      const hiddenForWarehouse = (activeWid && whVis[String(activeWid)]) ? whVis[String(activeWid)] : [];
      const modelHidden = hiddenForWarehouse.includes("__ALL__");
      const stockLevels = c.stock_levels || {};
      const warehouseStock = (activeWid && stockLevels[String(activeWid)]) ? stockLevels[String(activeWid)] : {};
      // For employees: flavor must not be hidden AND must have stock > 0
      // For managers: show all flavors (they manage stock counts)
      const isEmployee = !!empWarehouse;
      const activeFlavors = modelHidden ? [] : (c.flavors || []).filter(f => {
        if (hiddenForWarehouse.includes(f)) return false;
        if (isEmployee) {
          const stock = warehouseStock[f];
          if (stock === undefined || stock === null || stock <= 0) return false;
        }
        return true;
      });
      obj[c.model_name] = { brand: c.brand, puffs: c.puffs, flavors: c.flavors || [], activeFlavors, hidden_flavors: hiddenForWarehouse, warehouse_visibility: whVis, stock_levels: stockLevels, id: c.id, category: c.category || "Vapes" };
    });
    return obj;
  }, [catalog, activeWid, empWarehouse]);

  const categories = useMemo(() => [...new Set(catalog.map(c => c.category || "Vapes"))].sort(), [catalog]);

  // Memoize category/brand structure — only rebuilds when catalog or warehouse changes
  const catStructure = useMemo(() => {
    const groups = {};
    Object.entries(catalogObj).forEach(([name, data]) => {
      if (data.activeFlavors.length === 0) return;
      const cat = data.category || "Vapes";
      if (!groups[cat]) groups[cat] = { brands: {}, totalModels: 0, totalItems: 0 };
      if (!groups[cat].brands[data.brand]) groups[cat].brands[data.brand] = [];
      groups[cat].brands[data.brand].push(name);
      groups[cat].totalModels++;
      groups[cat].totalItems += data.activeFlavors.length;
    });
    return groups;
  }, [catalogObj]);

  const loadCatalog = useCallback(async () => {
    if (!orgId) return;
    try {
      const data = await orgSb.get("catalog", { order: "brand.asc,model_name.asc" });
      if (data && Array.isArray(data) && data.length > 0) {
        setCatalog(data);
      } else {
        await Promise.all(DEFAULT_CATALOG.map(item => orgSb.post("catalog", item)));
        const seeded = await orgSb.get("catalog", { order: "brand.asc,model_name.asc" });
        setCatalog(seeded || []);
      }
      setCatLoaded(true);
    } catch (e) { console.error(e); setCatLoaded(true); }
  }, [orgId, orgSb]);

  const loadWarehouses = useCallback(async () => {
    if (!orgId) return;
    try {
      const data = await sb.get("warehouses", { order: "name.asc", filter: `org_id=eq.${orgId}` });
      if (data && Array.isArray(data)) setWarehouses(data);
    } catch (e) { console.error(e); }
  }, [orgId]);

  const loadBanner = useCallback(async () => {
    if (!orgId) return;
    try {
      const d = await orgSb.get("banner", { order: "id.asc" });
      if (d && d.length > 0) {
        const map = {};
        d.forEach(b => { map[b.warehouse_id || 1] = { message: b.message || "", active: b.active, id: b.id }; });
        setBannerData(map);
      }
    } catch (e) { console.error(e); }
  }, [orgId, orgSb]);

  const loadPin = useCallback(async () => {
    setPinLoading(true);
    try {
      // Fetch fresh org data by short_code (known to work through RLS)
      const code = currentOrg?.short_code;
      if (code) {
        const freshOrg = await sb.get("orgs", { filter: `short_code=eq.${code}`, limit: 1 });
        if (freshOrg && freshOrg[0]) {
          setMgrPin(freshOrg[0].manager_pin || null);
          setOwnerPin(freshOrg[0].owner_pin || null);
          setExecPin(freshOrg[0].exec_pin || null);
          setCurrentOrg(freshOrg[0]); saveOrg(freshOrg[0]);
        }
      }
    } catch (e) { console.error(e); }
    setPinLoading(false);
  }, [currentOrg?.short_code]);

  const loadMgr = useCallback(async () => {
    if (!mgrWarehouse || !orgId) return;
    setLoading(true);
    try {
      const [subs, sugs, sl] = await Promise.all([
        orgSb.get("submissions", { order: "created_at.desc", filter: `status=eq.pending&warehouse_id=eq.${mgrWarehouse.id}` }),
        orgSb.get("suggestions", { order: "created_at.desc", filter: `status=eq.pending&warehouse_id=eq.${mgrWarehouse.id}` }),
        orgSb.get("stores", { order: "name.asc", filter: `warehouse_id=eq.${mgrWarehouse.id}` }),
      ]);
      setReports(subs || []); setAllSugs(sugs || []); setStores(sl || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [mgrWarehouse, orgId, orgSb]);

  const loadAnalytics = useCallback(async (range) => {
    if (!mgrWarehouse || !orgId) return;
    const days = range === "30d" ? 30 : range === "14d" ? 14 : 7;
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString();
    try {
      const data = await orgSb.get("submissions", { order: "created_at.desc", filter: `warehouse_id=eq.${mgrWarehouse.id}&status=eq.completed&created_at=gte.${sinceStr}`, limit: 500 });
      setAnalyticsData(data || []);
    } catch (e) { console.error(e); setAnalyticsData([]); }
  }, [mgrWarehouse]);

  useEffect(() => { if (orgId) { loadCatalog(); loadBanner(); loadWarehouses(); loadPin(); } }, [orgId, loadCatalog, loadBanner, loadWarehouses, loadPin]);
  useEffect(() => { if (view === "manager" && authed && mgrWarehouse) loadMgr(); }, [view, authed, mgrWarehouse, loadMgr]);

  // Save employee session to localStorage on every relevant change
  // Save employee session — debounced to reduce writes
  const saveTimer = useRef(null);
  useEffect(() => {
    const empViews = ["employee-login", "employee-products", "employee-flavors", "employee-confirm"];
    if (empViews.includes(view)) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveSession({ view, empName, storeLoc, empWarehouse, empCode, selProduct, orderData, suggestions, selCategory });
      }, 500);
    }
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [view, empName, storeLoc, empWarehouse, empCode, selProduct, orderData, suggestions, selCategory]);

  // Warn before unload + flush pending save
  useEffect(() => {
    const handler = (e) => {
      if (Object.keys(orderData).length > 0 && ["employee-products", "employee-flavors", "employee-confirm"].includes(view)) {
        if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
        saveSession({ view, empName, storeLoc, empWarehouse, empCode, selProduct, orderData, suggestions, selCategory });
        e.preventDefault(); e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [orderData, view, empName, storeLoc, empWarehouse, empCode, selProduct, suggestions, selCategory]);

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
      
      // Build stock deduction map: "modelId:::flavor" -> qty
      const deductMap = {};
      items.forEach(([key, val]) => {
        const [product, flavor] = key.split("|||");
        const model = catalog.find(c => c.model_name === product);
        if (model) {
          const qty = val === "5+" ? 5 : parseInt(val) || 0;
          deductMap[`${model.id}:::${flavor}`] = qty;
        }
      });
      
      // Call atomic deduction function
      const adjustments = await sb.rpc("deduct_stock", { p_warehouse_id: empWarehouse.id, p_items: deductMap });
      
      // Check for partial fills
      let adjustedOrder = { ...orderData };
      let adjustMsgs = [];
      if (adjustments && typeof adjustments === "object" && Object.keys(adjustments).length > 0) {
        Object.entries(adjustments).forEach(([dKey, actualQty]) => {
          const [modelId, flavor] = dKey.split(":::");
          const model = catalog.find(c => c.id === parseInt(modelId));
          const orderKey = model ? `${model.model_name}|||${flavor}` : null;
          if (orderKey && adjustedOrder[orderKey]) {
            if (actualQty === 0) {
              delete adjustedOrder[orderKey];
              adjustMsgs.push(`${flavor} removed — out of stock`);
            } else {
              adjustedOrder[orderKey] = String(actualQty);
              adjustMsgs.push(`${flavor} adjusted to ${actualQty} — limited availability`);
            }
          }
        });
      }
      
      // Recalculate totals with adjusted order
      const adjItems = Object.entries(adjustedOrder);
      let adjTu = 0; adjItems.forEach(([, v]) => { adjTu += v === "5+" ? 5 : parseInt(v) || 0; });
      
      // Save submission with adjusted data and deduction map for restore
      if (adjItems.length > 0) {
        await orgSb.post("submissions", { employee_name: empName.trim(), store_location: storeLoc.trim(), items: adjustedOrder, total_flavors: adjItems.length, total_units: adjTu, warehouse_id: empWarehouse.id, status: "pending" });
        if (suggestions.length > 0) await Promise.all(suggestions.map(sg => orgSb.post("suggestions", { suggestion_text: sg.text, employee_name: sg.from, store_location: sg.store, warehouse_id: empWarehouse.id })));
      }
      
      // Update local catalog stock instead of full reload (stock already deducted server-side)
      setCatalog(prev => prev.map(c => {
        const wid = String(empWarehouse.id);
        const sl = { ...(c.stock_levels || {}) };
        const ws = { ...(sl[wid] || {}) };
        let changed = false;
        Object.entries(deductMap).forEach(([dKey, qty]) => {
          const [modelId, flavor] = dKey.split(":::");
          if (c.id === parseInt(modelId) && ws[flavor] !== undefined) {
            const adj = adjustments?.[dKey];
            const actualDeducted = adj !== undefined ? (qty - adj) : qty;
            ws[flavor] = Math.max(0, (parseInt(ws[flavor]) || 0) - actualDeducted);
            changed = true;
          }
        });
        if (changed) { sl[wid] = ws; return { ...c, stock_levels: sl }; }
        return c;
      }));
      
      if (adjustMsgs.length > 0) {
        alert("Order submitted with adjustments:\n\n" + adjustMsgs.join("\n"));
      }
      
      sndSubmit(); clearSession(); setView("employee-done");
    } catch (e) { console.error(e); alert("Error submitting — check connection."); }
    setSubmitting(false);
  };

  // Preloaded sound pool — multiple instances per sound for rapid tapping
  const sounds = useRef({});
  const drawerScrollRef = useRef(null);
  const drawerScrollPos = useRef(0);
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

  const completeSubmission = async (report, adjustments) => {
    try {
      // Build final items with adjustments applied
      const finalItems = { ...(report.items || {}) };
      const restoreMap = {};
      
      if (adjustments && Object.keys(adjustments).length > 0) {
        Object.entries(adjustments).forEach(([key, newQty]) => {
          const origQty = finalItems[key];
          const origNum = origQty === "5+" ? 5 : parseInt(origQty) || 0;
          const newNum = parseInt(newQty) || 0;
          const diff = origNum - newNum;
          
          if (diff > 0) {
            // Manager gave less than requested — restore the difference
            const [product, flavor] = key.split("|||");
            const model = catalog.find(c => c.model_name === product);
            if (model) {
              restoreMap[`${model.id}:::${flavor}`] = diff;
            }
          }
          
          if (newNum <= 0) {
            delete finalItems[key];
          } else {
            finalItems[key] = String(newNum);
          }
        });
      }
      
      // Restore stock difference
      if (Object.keys(restoreMap).length > 0) {
        try {
          await sb.rpc("restore_stock", { p_warehouse_id: report.warehouse_id || 1, p_items: restoreMap });
          setCatalog(prev => prev.map(c => {
            const wid = String(report.warehouse_id || 1);
            const sl = { ...(c.stock_levels || {}) };
            const ws = { ...(sl[wid] || {}) };
            let changed = false;
            Object.entries(restoreMap).forEach(([dKey, qty]) => {
              const [modelId, flavor] = dKey.split(":::");
              if (c.id === parseInt(modelId) && ws[flavor] !== undefined) {
                ws[flavor] = (parseInt(ws[flavor]) || 0) + qty;
                changed = true;
              }
            });
            if (changed) { sl[wid] = ws; return { ...c, stock_levels: sl }; }
            return c;
          }));
        } catch (stockErr) { console.error("Stock restore failed:", stockErr); }
      }
      
      // Recalculate totals
      const adjEntries = Object.entries(finalItems);
      let adjTu = 0; adjEntries.forEach(([, v]) => { adjTu += v === "5+" ? 5 : parseInt(v) || 0; });
      
      await orgSb.patch("submissions", { 
        status: "completed", 
        completed_at: new Date().toISOString(),
        items: finalItems,
        total_flavors: adjEntries.length,
        total_units: adjTu
      }, `id=eq.${report.id}`);
      
      sndDone(); 
      setReports(p => p.filter(r => r.id !== report.id)); 
      if (selReport && selReport.id === report.id) { setSelReport(null); setPickedItems({}); setAdjustedQtys({}); }
    } catch (e) { console.error("Complete failed:", e); alert("Failed to complete order. Try again."); }
  };
  const cancelSubmission = async (report) => {
    try {
      // Delete the submission first (most important action)
      const deleted = await orgSb.del("submissions", `id=eq.${report.id}`);
      if (!deleted) { console.error("Failed to delete submission"); return; }
      
      // Remove from UI immediately
      sndRemove(); 
      setReports(p => p.filter(r => r.id !== report.id)); 
      if (selReport && selReport.id === report.id) { setSelReport(null); setPickedItems({}); setAdjustedQtys({}); }
      
      // Try to restore stock (non-blocking)
      try {
        const restoreMap = {};
        Object.entries(report.items || {}).forEach(([key, val]) => {
          const [product, flavor] = key.split("|||");
          const model = catalog.find(c => c.model_name === product);
          if (model) {
            const qty = val === "5+" ? 5 : parseInt(val) || 0;
            restoreMap[`${model.id}:::${flavor}`] = qty;
          }
        });
        if (Object.keys(restoreMap).length > 0) {
          await sb.rpc("restore_stock", { p_warehouse_id: report.warehouse_id || 1, p_items: restoreMap });
          // Update local stock instead of full reload
          setCatalog(prev => prev.map(c => {
            const wid = String(report.warehouse_id || 1);
            const sl = { ...(c.stock_levels || {}) };
            const ws = { ...(sl[wid] || {}) };
            let changed = false;
            Object.entries(restoreMap).forEach(([dKey, qty]) => {
              const [modelId, flavor] = dKey.split(":::");
              if (c.id === parseInt(modelId) && ws[flavor] !== undefined) {
                ws[flavor] = (parseInt(ws[flavor]) || 0) + qty;
                changed = true;
              }
            });
            if (changed) { sl[wid] = ws; return { ...c, stock_levels: sl }; }
            return c;
          }));
        }
      } catch (stockErr) { console.error("Stock restore failed:", stockErr); }
    } catch (e) { console.error("Cancel failed:", e); alert("Failed to cancel order. Try again."); }
  };
  const saveBanner = async () => {
    if (!mgrWarehouse) return;
    const wid = mgrWarehouse.id;
    const bd = bannerData[wid];
    if (bd) {
      try { await orgSb.patch("banner", { message: bannerInput, active: true, updated_at: new Date().toISOString() }, `id=eq.${bd.id}`); setBannerData(p => ({ ...p, [wid]: { ...p[wid], message: bannerInput, active: true } })); setEditBanner(false); } catch (e) { console.error(e); }
    }
  };
  const toggleBanner = async () => {
    if (!mgrWarehouse) return;
    const wid = mgrWarehouse.id;
    const bd = bannerData[wid];
    if (bd) {
      try { await orgSb.patch("banner", { active: !bd.active, updated_at: new Date().toISOString() }, `id=eq.${bd.id}`); setBannerData(p => ({ ...p, [wid]: { ...p[wid], active: !bd.active } })); } catch (e) { console.error(e); }
    }
  };
  const dismissSug = async (id) => { try { await orgSb.patch("suggestions", { status: "dismissed" }, `id=eq.${id}`); sndRemove(); setAllSugs(p => p.filter(s => s.id !== id)); } catch (e) { console.error(e); } };
  const approveSug = async (id) => { try { await orgSb.patch("suggestions", { status: "approved" }, `id=eq.${id}`); sndAdd(); setAllSugs(p => p.filter(s => s.id !== id)); } catch (e) { console.error(e); } };
  const addStore = async () => { if (!newStore.trim() || !mgrWarehouse) return; try { await orgSb.post("stores", { name: newStore.trim(), warehouse_id: mgrWarehouse.id }); sndAdd(); setNewStore(""); loadMgr(); } catch (e) { console.error(e); } };
  const removeStore = async (id) => { try { await orgSb.del("stores", `id=eq.${id}`); sndRemove(); setStores(p => p.filter(s => s.id !== id)); } catch (e) { console.error(e); } };

  const addFlavorToModel = async (modelId, flavor) => {
    const model = catalog.find(c => c.id === modelId); if (!model || !flavor.trim()) return;
    const f = flavor.trim();
    const updated = [...(model.flavors || []), f].sort();
    // Auto-hide from other warehouses
    const whVis = { ...(model.warehouse_visibility || {}) };
    if (mgrWarehouse) {
      warehouses.forEach(w => {
        if (w.id !== mgrWarehouse.id) {
          whVis[String(w.id)] = [...(whVis[String(w.id)] || []), f];
        }
      });
    }
    // Initialize stock at 0 for current warehouse (manager sets count after)
    const sl = { ...(model.stock_levels || {}) };
    if (mgrWarehouse) {
      const wid = String(mgrWarehouse.id);
      sl[wid] = { ...(sl[wid] || {}), [f]: 0 };
    }
    try { await orgSb.patch("catalog", { flavors: updated, warehouse_visibility: whVis, stock_levels: sl }, `id=eq.${modelId}`); sndAdd(); setCatalog(p => p.map(c => c.id === modelId ? { ...c, flavors: updated, warehouse_visibility: whVis, stock_levels: sl } : c)); } catch (e) { console.error(e); }
  };
  const removeFlavorFromModel = async (modelId, flavor) => {
    const model = catalog.find(c => c.id === modelId); if (!model) return;
    const whVis = { ...(model.warehouse_visibility || {}) };
    const sl = { ...(model.stock_levels || {}) };
    if (mgrWarehouse) {
      const wid = String(mgrWarehouse.id);
      // Add to hidden list for this warehouse
      const hidden = whVis[wid] || [];
      if (!hidden.includes(flavor)) { whVis[wid] = [...hidden, flavor]; }
      // Remove stock for this warehouse only
      if (sl[wid]) { const ws = { ...sl[wid] }; delete ws[flavor]; sl[wid] = ws; }
    }
    // Only fully delete flavor from master list if hidden in ALL warehouses
    const allWarehouses = warehouses.map(w => String(w.id));
    const hiddenEverywhere = allWarehouses.every(wid => { const h = whVis[wid] || []; return h.includes("__ALL__") || h.includes(flavor); });
    const updated = hiddenEverywhere ? (model.flavors || []).filter(f => f !== flavor) : (model.flavors || []);
    try { await orgSb.patch("catalog", { flavors: updated, warehouse_visibility: whVis, stock_levels: sl }, `id=eq.${modelId}`); sndRemove(); setCatalog(p => p.map(c => c.id === modelId ? { ...c, flavors: updated, warehouse_visibility: whVis, stock_levels: sl } : c)); } catch (e) { console.error(e); }
  };
  // Stock update — instant local state, save after short delay, auto-flush on navigation
  const stockTimers = useRef({});
  const catalogRef = useRef(catalog);
  useEffect(() => { catalogRef.current = catalog; }, [catalog]);
  const saveStockNow = (modelId) => {
    const model = catalogRef.current.find(c => c.id === modelId);
    if (model) {
      orgSb.patch("catalog", { stock_levels: model.stock_levels || {} }, `id=eq.${modelId}`).catch(e => console.error(e));
    }
  };
  const flushStock = () => {
    Object.keys(stockTimers.current).forEach(pKey => {
      clearTimeout(stockTimers.current[pKey]);
      saveStockNow(parseInt(pKey));
      delete stockTimers.current[pKey];
    });
  };
  // Auto-flush on any navigation away or page unload
  useEffect(() => {
    const handleUnload = () => flushStock();
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);
    return () => { window.removeEventListener("beforeunload", handleUnload); window.removeEventListener("pagehide", handleUnload); };
  }, []);
  // Auto-flush when leaving editModel view
  const prevMgrView = useRef(mgrView);
  useEffect(() => {
    if (prevMgrView.current === "editModel" && mgrView !== "editModel") { flushStock(); }
    prevMgrView.current = mgrView;
  }, [mgrView]);
  const updateFlavorStock = (modelId, flavor, count) => {
    if (!mgrWarehouse) return;
    const wid = String(mgrWarehouse.id);
    const val = count === "" ? 0 : Math.max(0, parseInt(count) || 0);
    // Instant local update
    setCatalog(p => p.map(c => {
      if (c.id !== modelId) return c;
      const sl = { ...(c.stock_levels || {}) };
      sl[wid] = { ...(sl[wid] || {}), [flavor]: val };
      return { ...c, stock_levels: sl };
    }));
    // Debounced DB save per model (400ms - shorter, safer)
    const pKey = `${modelId}`;
    if (stockTimers.current[pKey]) clearTimeout(stockTimers.current[pKey]);
    stockTimers.current[pKey] = setTimeout(() => {
      saveStockNow(modelId);
      delete stockTimers.current[pKey];
    }, 400);
  };
  const bulkSetStock = async (modelId, count) => {
    if (!mgrWarehouse) return;
    const model = catalog.find(c => c.id === modelId); if (!model) return;
    const sl = { ...(model.stock_levels || {}) };
    const wid = String(mgrWarehouse.id);
    const ws = {};
    (model.flavors || []).forEach(f => { ws[f] = Math.max(0, parseInt(count) || 0); });
    sl[wid] = ws;
    try { await orgSb.patch("catalog", { stock_levels: sl }, `id=eq.${modelId}`); setCatalog(p => p.map(c => c.id === modelId ? { ...c, stock_levels: sl } : c)); } catch (e) { console.error(e); }
  };
  const toggleFlavorVisibility = async (modelId, flavor) => {
    if (!mgrWarehouse) return;
    const model = catalog.find(c => c.id === modelId); if (!model) return;
    const whVis = { ...(model.warehouse_visibility || {}) };
    const wid = String(mgrWarehouse.id);
    const hidden = whVis[wid] || [];
    const isHidden = hidden.includes(flavor);
    whVis[wid] = isHidden ? hidden.filter(f => f !== flavor) : [...hidden, flavor];
    try { await orgSb.patch("catalog", { warehouse_visibility: whVis }, `id=eq.${modelId}`); setCatalog(p => p.map(c => c.id === modelId ? { ...c, warehouse_visibility: whVis } : c)); } catch (e) { console.error(e); }
  };
  const addModel = async () => {
    if (!newModelName.trim()) { alert("Product name is required."); return; }
    if (!newModelBrand.trim()) { alert("Brand is required."); return; }
    // Hide from other warehouses entirely using __ALL__ marker
    const whVis = {};
    if (mgrWarehouse) {
      warehouses.forEach(w => { if (w.id !== mgrWarehouse.id) whVis[String(w.id)] = ["__ALL__"]; });
    }
    try {
      const res = await orgSb.post("catalog", { model_name: newModelName.trim(), brand: newModelBrand.trim(), puffs: newModelPuffs.trim() || "N/A", category: newModelCategory.trim() || "Vapes", flavors: [], warehouse_visibility: whVis });
      if (res && res[0]) { sndAdd(); setCatalog(p => [...p, res[0]].sort((a, b) => (a.category || "").localeCompare(b.category || "") || a.brand.localeCompare(b.brand) || a.model_name.localeCompare(b.model_name))); }
      else { alert("Failed to save. Check your connection and try again."); return; }
      setNewModelName(""); setNewModelBrand(""); setNewModelPuffs(""); setNewModelCategory("Vapes"); setShowAddModel(false);
    } catch (e) { console.error(e); alert("Error saving product. Check your connection."); }
  };
  const deleteModel = async (id) => {
    const model = catalog.find(c => c.id === id); if (!model) return;
    try {
      const whVis = { ...(model.warehouse_visibility || {}) };
      if (mgrWarehouse) {
        // Mark entire model hidden from this warehouse
        whVis[String(mgrWarehouse.id)] = ["__ALL__"];
        // Also clear stock for this warehouse
        const sl = { ...(model.stock_levels || {}) };
        delete sl[String(mgrWarehouse.id)];
        // Check if hidden from ALL warehouses — if so, truly delete from DB
        const allWarehouses = warehouses.map(w => String(w.id));
        const hiddenEverywhere = allWarehouses.every(wid => (whVis[wid] || []).includes("__ALL__"));
        if (hiddenEverywhere) {
          await orgSb.del("catalog", `id=eq.${id}`); sndRemove(); setCatalog(p => p.filter(c => c.id !== id));
        } else {
          await orgSb.patch("catalog", { warehouse_visibility: whVis, stock_levels: sl }, `id=eq.${id}`); sndRemove(); setCatalog(p => p.map(c => c.id === id ? { ...c, warehouse_visibility: whVis, stock_levels: sl } : c));
        }
      } else {
        await orgSb.del("catalog", `id=eq.${id}`); sndRemove(); setCatalog(p => p.filter(c => c.id !== id));
      }
      setEditModel(null); setMgrView("catalog");
    } catch (e) { console.error(e); }
  };
  const updateModelInfo = async (id) => {
    if (!editModelName.trim() || !editModelBrand.trim()) return;
    try {
      await orgSb.patch("catalog", { model_name: editModelName.trim(), brand: editModelBrand.trim(), puffs: editModelPuffs.trim() || "N/A", category: editModelCategory.trim() || "Vapes" }, `id=eq.${id}`);
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
    const wid = empWarehouse?.id || null;
    if (!wid) return null;
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

  if (!catLoaded && view !== "splash" && view !== "org-entry" && view !== "manager-login" && view !== "manager-warehouse") return (<div style={{ ...st.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
    <div style={{ fontSize: "40px", marginBottom: "16px" }}>📦</div>
    <p style={{ color: "#ffffff40", fontSize: "14px" }}>Loading...</p>
  </div>);

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
        <div style={{ position: "fixed", bottom: "24px", left: "78px", right: "20px", borderRadius: "14px", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#fff", cursor: "pointer", zIndex: 90, boxShadow: "0 4px 24px rgba(255,107,53,0.4)", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div onClick={() => setShowOrderEdit(!showOrderEdit)} style={{ flex: 1, padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>📋</span>
            <div style={{ fontSize: "14px", fontWeight: 700 }}>{ic} item{ic > 1 ? "s" : ""} • ~{tu} units</div>
          </div>
          <div onClick={() => setView("employee-confirm")} style={{ padding: "14px 18px", background: "rgba(0,0,0,0.15)", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>Review ›</div>
        </div>
        {/* Expanded edit drawer */}
        {showOrderEdit && (
          <div ref={el => { if (el) { drawerScrollRef.current = el; requestAnimationFrame(() => { el.scrollTop = drawerScrollPos.current; }); } }}
            onScroll={e => { drawerScrollPos.current = e.target.scrollTop; }}
            style={{ position: "fixed", bottom: "85px", left: "20px", right: "20px", maxHeight: "60vh", overflowY: "auto", borderRadius: "16px", background: "rgba(20,20,28,0.97)", backdropFilter: "blur(10px)", border: "1px solid #ffffff15", zIndex: 89, boxShadow: "0 -4px 30px rgba(0,0,0,0.6)", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ color: "#FF6B35", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Your Order</span>
              <button onClick={() => setShowOrderEdit(false)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ffffff20", background: "transparent", color: "#ffffff60", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Done ✓</button>
            </div>
            {Object.entries(grouped).map(([pr, flavors]) => (
              <div key={pr} style={{ marginBottom: "10px" }}>
                <div style={{ color: "#ffffff40", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>{pr}</div>
                {flavors.map(({ flavor, qty, key }) => {
                  const col = getQtyColor(qty);
                  const qNum = qty === "5+" ? 5 : parseInt(qty) || 1;
                  const decrement = () => { if (qNum <= 1) return; sndClick(); setOrderData(prev => ({ ...prev, [key]: String(qNum - 1) })); };
                  const increment = () => { if (qty === "5+") return; sndClick(); setOrderData(prev => ({ ...prev, [key]: qNum >= 4 ? "5+" : String(qNum + 1) })); };
                  return (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #ffffff08" }}>
                      <span style={{ color: "#fff", fontSize: "14px", flex: 1 }}>{flavor}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <button onClick={decrement} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: qNum <= 1 ? "rgba(255,255,255,0.05)" : "rgba(230,57,70,0.2)", color: qNum <= 1 ? "#ffffff20" : "#E63946", fontSize: "18px", fontWeight: 700, cursor: qNum <= 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>−</button>
                        <span style={{ color: col, fontSize: "16px", fontWeight: 800, minWidth: "30px", textAlign: "center" }}>{qty}</span>
                        <button onClick={increment} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: qty === "5+" ? "rgba(255,255,255,0.05)" : "rgba(29,185,84,0.2)", color: qty === "5+" ? "#ffffff20" : "#1DB954", fontSize: "18px", fontWeight: 700, cursor: qty === "5+" ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>+</button>
                      </div>
                      <button onClick={() => { sndRemove(); setOrderData(prev => { const next = { ...prev }; delete next[key]; return next; }); }}
                        style={{ background: "none", border: "1px solid #E6394630", borderRadius: "6px", color: "#E63946", fontSize: "11px", fontWeight: 700, cursor: "pointer", padding: "4px 8px", marginLeft: "24px" }}>✕</button>
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

  // ORG ENTRY
  if (view === "org-entry") {
    const handleOrgLookup = async () => {
      if (!orgCode.trim()) return;
      setOrgLoading(true); setOrgError("");
      try {
        const data = await sb.get("orgs", { filter: `short_code=eq.${orgCode.trim().toLowerCase()}&active=eq.true`, limit: 1 });
        if (data && data[0]) {
          setCurrentOrg(data[0]); saveOrg(data[0]); setView("splash"); setOrgCode("");
        } else {
          setOrgError("Organization not found. Check your code and try again.");
        }
      } catch (e) { console.error(e); setOrgError("Connection error. Please try again."); }
      setOrgLoading(false);
    };
    return (
      <div style={{ ...st.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "12px", background: "radial-gradient(ellipse at 50% 20%, #1a1a2e 0%, #0B0B0F 70%)", minHeight: "100vh" }}>
        <div style={{ fontSize: "56px", marginBottom: "8px" }}>📦</div>
        <h1 style={{ color: "#fff", fontSize: "36px", fontWeight: 900, letterSpacing: "-2px", margin: 0 }}>BACKSTOCK</h1>
        <p style={{ color: "#ffffff45", fontSize: "14px", margin: "4px 0 0 0", fontWeight: 500, fontStyle: "italic" }}>Inventory that just works.</p>
        <div style={{ marginTop: "32px", width: "100%", maxWidth: "320px" }}>
          <label style={{ ...st.label, textAlign: "left", display: "block", marginBottom: "8px" }}>Organization Code</label>
          <input type="text" placeholder="Enter your code" value={orgCode}
            onChange={e => { setOrgCode(e.target.value); setOrgError(""); }}
            onKeyDown={e => { if (e.key === "Enter") handleOrgLookup(); }}
            style={{ ...st.input, fontSize: "16px", padding: "16px 18px", textAlign: "center", letterSpacing: "1px" }} />
          {orgError && <p style={{ color: "#E63946", fontSize: "12px", marginTop: "8px" }}>{orgError}</p>}
          <button onClick={handleOrgLookup} disabled={orgLoading || !orgCode.trim()}
            style={{ ...(orgCode.trim() ? st.btn : st.btnOff), marginTop: "16px", opacity: orgLoading ? 0.5 : 1 }}>
            {orgLoading ? "Looking up..." : "Continue →"}
          </button>
        </div>
        <p style={{ color: "#ffffff12", fontSize: "11px", marginTop: "60px", letterSpacing: "1px" }}>v6.0</p>
      </div>
    );
  }

  // SPLASH
  const onboardSteps = [
    { emoji: "📦", title: "Welcome to Backstock", desc: "Tell us what your store needs — fast, simple, and organized. No phone calls, no paper lists.", btn: "Show me how →" },
    { emoji: "🔍", title: "Find What You Need", desc: "Search by name or browse categories. Tap a product to select how many your store needs.", btn: "Next →" },
    { emoji: "✅", title: "Review & Submit", desc: "Your order builds at the bottom of the screen. Review it, adjust quantities, then submit. That's it.", btn: "Got it ✓" },
  ];
  const finishOnboarding = () => { setOnboardStep(null); try { localStorage.setItem("backstock_onboarded", "true"); } catch {} };
  if (view === "splash") return (
    <div style={{ ...st.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "12px", background: "radial-gradient(ellipse at 50% 20%, #1a1a2e 0%, #0B0B0F 70%)" }}>
      <div style={{ fontSize: "56px", marginBottom: "8px" }}>📦</div>
      <h1 style={{ color: "#fff", fontSize: "36px", fontWeight: 900, letterSpacing: "-2px", margin: 0 }}>BACKSTOCK</h1>
      <p style={{ color: "#ffffff45", fontSize: "14px", margin: "4px 0 0 0", fontWeight: 500, fontStyle: "italic" }}>Inventory that just works.</p>
      <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        <button onClick={() => setView("employee-login")} style={{ ...st.btn, padding: "20px 24px" }}>
          🏪 Submit Restock Request
        </button>
        <button onClick={() => { setAuthed(false); setPin(""); setMgrView("dashboard"); setMgrWarehouse(null); setMgrPin(null); setOwnerPin(null); setExecPin(null); setAccessLevel(null); loadPin(); setView("manager-login"); }} style={{ ...st.btn, background: "rgba(255,255,255,0.04)", border: "1px solid #ffffff12", boxShadow: "none", padding: "20px 24px" }}>
          📊 Manager Dashboard
        </button>
      </div>
      <button onClick={() => { clearOrg(); setCurrentOrg(null); setWarehouses([]); setCatalog([]); setCatLoaded(false); setView("org-entry"); }}
        style={{ background: "none", border: "none", color: "#ffffff12", fontSize: "11px", cursor: "pointer", marginTop: "60px", letterSpacing: "1px" }}>v6.0</button>
      {/* Onboarding overlay */}
      {onboardStep !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
          <button onClick={finishOnboarding} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#ffffff30", fontSize: "13px", fontWeight: 600, cursor: "pointer", padding: "8px" }}>Skip</button>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>{onboardSteps[onboardStep].emoji}</div>
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>{onboardSteps[onboardStep].title}</h2>
          <p style={{ color: "#ffffff60", fontSize: "15px", lineHeight: "1.6", margin: "0 0 36px 0", maxWidth: "320px" }}>{onboardSteps[onboardStep].desc}</p>
          <button onClick={() => { if (onboardStep >= onboardSteps.length - 1) { finishOnboarding(); } else { setOnboardStep(s => s + 1); } }}
            style={{ padding: "16px 40px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,53,0.4)", minWidth: "200px" }}>
            {onboardSteps[onboardStep].btn}
          </button>
          <div style={{ display: "flex", gap: "8px", marginTop: "28px" }}>
            {onboardSteps.map((_, i) => (
              <div key={i} style={{ width: i === onboardStep ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === onboardStep ? "#FF6B35" : i < onboardStep ? "#FF6B3560" : "#ffffff15", transition: "all 0.3s ease" }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // MANAGER LOGIN
  if (view === "manager-login") {
    const isExecPin = execPin && pin === execPin;
    const isMgrPin = mgrPin && pin === mgrPin;
    const isOwnerPin = ownerPin && pin === ownerPin;
    const pinMatch = isExecPin || isMgrPin || isOwnerPin;
    const pinWrong = (mgrPin || ownerPin || execPin) && pin.length >= 4 && !pinMatch;
    const handleLogin = () => {
      if (isExecPin) { sndLogin(); setAccessLevel("exec"); setAuthed(true); setView("manager-warehouse"); }
      else if (isMgrPin) { sndLogin(); setAccessLevel("manager"); setAuthed(true); setView("manager-warehouse"); }
      else if (isOwnerPin) { sndLogin(); setAccessLevel("owner"); setAuthed(true); setView("manager-warehouse"); }
    };
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setView("splash"); }} style={st.back}>← Back</button>
        <h1 style={st.h1}>📊 Manager Access</h1><p style={st.sub}>{pinLoading ? "Loading..." : "Enter your PIN to continue"}</p>
        <div style={{ marginBottom: "24px" }}><label style={st.label}>Manager PIN</label>
          <input type="password" placeholder="Enter PIN" value={pin} onChange={e => setPin(e.target.value)} style={st.input} onKeyDown={e => { if (e.key === "Enter" && pinMatch) handleLogin(); }} />
        </div>
        {pinWrong && <p style={{ color: "#E63946", fontSize: "13px", marginBottom: "12px" }}>Incorrect PIN</p>}
        <button onClick={handleLogin} style={pinMatch ? st.btn : st.btnOff} disabled={!pinMatch}>Enter Dashboard →</button>
      </div>
    );
  }

  // MANAGER WAREHOUSE SELECT
  if (view === "manager-warehouse" && authed) return (
    <div style={st.page}>
      <button onClick={() => { sndBack(); setView("manager-login"); setAuthed(false); setPin(""); }} style={st.back}>← Back</button>
      <h1 style={st.h1}>📊 Select Warehouse</h1><p style={st.sub}>Which warehouse are you managing?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {warehouses.map(w => (
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
        }} style={st.back}>← Back</button>
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
    // Use memoized structure, add order counts (lightweight)
    const catGroups = {};
    Object.entries(catStructure).forEach(([cat, data]) => {
      let ordered = 0;
      Object.values(data.brands).forEach(models => models.forEach(name => { ordered += getProductOrderCount(name); }));
      catGroups[cat] = { ...data, ordered };
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
      const empSearchTerm = empSearch.toLowerCase().trim();
      const searchResults = empSearchTerm ? Object.entries(catalogObj).filter(([name, p]) =>
        name.toLowerCase().includes(empSearchTerm) ||
        p.brand.toLowerCase().includes(empSearchTerm) ||
        (p.category || "").toLowerCase().includes(empSearchTerm) ||
        p.activeFlavors.some(f => f.toLowerCase().includes(empSearchTerm))
      ) : [];
      return (
        <div style={{ ...st.page, paddingBottom: ic > 0 ? "110px" : "90px" }}>
          <Banner />
          <h2 style={st.h2}>What Do You Need?</h2>
          <p style={{ color: "#ffffff50", fontSize: "13px", margin: "0 0 16px 0" }}>{empName} • {storeLoc}</p>
          <div style={{ marginBottom: "20px", position: "sticky", top: 0, zIndex: 80, paddingTop: "8px", paddingBottom: "12px", background: "linear-gradient(180deg, #0B0B0F 85%, transparent)", marginLeft: "-20px", marginRight: "-20px", paddingLeft: "20px", paddingRight: "20px" }}>
            <input type="text" placeholder="🔍  Search products, brands, flavors..." value={empSearch} onChange={e => setEmpSearch(e.target.value)}
              style={{ ...st.input, fontSize: "15px", padding: "16px 20px", background: "rgba(255,255,255,0.07)", border: `1px solid ${empSearch ? "#FF6B3540" : "#ffffff18"}`, borderRadius: "14px", boxShadow: empSearch ? "0 0 20px rgba(255,107,53,0.1)" : "none", transition: "all 0.2s ease" }} />
            {empSearchTerm ? <div style={{ color: "#ffffff30", fontSize: "11px", marginTop: "6px", textAlign: "center" }}>{searchResults.length} result{searchResults.length !== 1 ? "s" : ""}</div> : <div style={{ color: "#ffffff15", fontSize: "11px", marginTop: "6px", textAlign: "center" }}>or browse categories below</div>}
          </div>
          {empSearchTerm ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {searchResults.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center" }}><p style={{ color: "#ffffff30", fontSize: "14px" }}>No results for "{empSearch}"</p></div>}
              {searchResults.map(([model, p]) => {
                const bc = getBrandColor(p.brand);
                const o = getProductOrderCount(model);
                return (
                  <button key={model} onClick={() => { setSelProduct(model); setView("employee-flavors"); }}
                    style={{ padding: "16px", borderRadius: "12px", border: `1px solid ${o > 0 ? bc + "25" : "#ffffff0a"}`, background: o > 0 ? bc + "08" : "rgba(255,255,255,0.025)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ marginBottom: "3px" }}>{model}</div>
                      <div style={{ fontSize: "11px", color: "#ffffff30", fontWeight: 500 }}>{p.brand} • {p.activeFlavors.length} items</div>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: o > 0 ? bc : "#ffffff25", whiteSpace: "nowrap" }}>{o > 0 ? `${o} requested` : ""}</span>
                  </button>
                );
              })}
            </div>
          ) : (
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
          )}
          <div style={{ marginTop: "20px", padding: "16px", borderRadius: "12px", border: "1px dashed #ffffff15", background: "rgba(255,255,255,0.015)" }}>
            <label style={{ ...st.label, marginBottom: "10px" }}>💡 Suggest a Product</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" placeholder="e.g. Funky Republic Ti7000" value={suggestion} onChange={e => setSuggestion(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
              <button onClick={() => { if (suggestion.trim()) { setSuggestions(p => [...p, { text: suggestion.trim(), from: empName, store: storeLoc }]); setSuggestion(""); } }}
                style={{ padding: "12px 18px", borderRadius: "10px", border: "none", background: suggestion.trim() ? "#FF6B35" : "#ffffff10", color: suggestion.trim() ? "#fff" : "#ffffff25", fontSize: "13px", fontWeight: 700, cursor: suggestion.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>Send</button>
            </div>
            {suggestions.map((sg, i) => (<div key={`${sg.text}-${i}`} style={{ padding: "8px 12px", borderRadius: "8px", background: "#1DB95410", border: "1px solid #1DB95420", color: "#1DB954", fontSize: "12px", fontWeight: 600, marginTop: "6px" }}>✓ Suggested: {sg.text}</div>))}
          </div>
          <div style={{ height: "70px" }} />
          <FloatingBack onClick={() => { 
            setView("employee-login"); setSelCategory(null); setEmpSearch(""); 
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
          const brandKey = `${activeCat}:::${brand}`;
          const isExpanded = empExpandedBrands[brandKey];
          const brandOrdered = models.reduce((s, m) => s + getProductOrderCount(m), 0);
          const totalModels = models.length;
          return (
            <div key={brand} style={{ marginBottom: "6px" }}>
              <button onClick={() => { setEmpExpandedBrands(p => ({ ...p, [brandKey]: !isExpanded })); }}
                style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: `1px solid ${isExpanded ? bc + "20" : brandOrdered > 0 ? bc + "15" : "#ffffff08"}`, background: isExpanded ? `${bc}08` : brandOrdered > 0 ? `${bc}05` : "rgba(255,255,255,0.02)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", transition: "all 0.2s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "3px", height: "20px", borderRadius: "2px", background: bc }}></div>
                  <div>
                    <span style={{ color: bc, fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{brand}</span>
                    <div style={{ color: "#ffffff25", fontSize: "10px", marginTop: "2px" }}>{totalModels} model{totalModels !== 1 ? "s" : ""}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {brandOrdered > 0 && <span style={{ padding: "3px 8px", borderRadius: "6px", background: bc + "20", color: bc, fontSize: "11px", fontWeight: 800 }}>{brandOrdered}</span>}
                  <span style={{ color: "#ffffff25", fontSize: "16px", transition: "transform 0.2s ease", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                </div>
              </button>
              {isExpanded && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "12px", marginTop: "6px" }}>
                {models.map(model => {
                  const p = catalogObj[model]; const o = getProductOrderCount(model);
                  return (
                    <button key={model} onClick={() => { setSelProduct(model); setView("employee-flavors"); }}
                      style={{ padding: "14px 16px", borderRadius: "12px", border: `1px solid ${o > 0 ? bc + "25" : "#ffffff0a"}`, background: o > 0 ? bc + "08" : "rgba(255,255,255,0.025)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><div style={{ marginBottom: "3px" }}>{model}</div><div style={{ fontSize: "11px", color: "#ffffff30", fontWeight: 500 }}>{p.puffs !== "N/A" ? p.puffs + " puffs • " : ""}{p.activeFlavors.length} items</div></div>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: o > 0 ? bc : "#ffffff25", whiteSpace: "nowrap" }}>{o > 0 ? `${o} requested` : ""}</span>
                    </button>
                  );
                })}
              </div>
              )}
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

  // EMPLOYEE CONFIRM — review before submit
  if (view === "employee-confirm") {
    const items = Object.entries(orderData);
    const tu = getTotalUnits(); const ic = getFilledCount();
    const grouped = {};
    items.forEach(([k, q]) => { const [pr, fl] = k.split("|||"); if (!grouped[pr]) grouped[pr] = []; grouped[pr].push({ flavor: fl, qty: q, key: k }); });
    const sortedProducts = Object.keys(grouped).sort();
    return (
      <div style={{ ...st.page, paddingBottom: "120px" }}>
        <button onClick={() => { sndBack(); setView("employee-products"); }} style={st.back}>← Back to Order</button>
        <h2 style={{ ...st.h2, marginBottom: "4px" }}>Review Your Order</h2>
        <p style={st.sub}>{empName} • {storeLoc}</p>
        <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid #ffffff10", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <div><div style={{ fontSize: "24px", fontWeight: 900, color: "#fff" }}>{ic}</div><div style={{ fontSize: "10px", color: "#ffffff35", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginTop: "2px" }}>Items</div></div>
            <div style={{ width: "1px", background: "#ffffff10" }}></div>
            <div><div style={{ fontSize: "24px", fontWeight: 900, color: "#fff" }}>~{tu}</div><div style={{ fontSize: "10px", color: "#ffffff35", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginTop: "2px" }}>Units</div></div>
            <div style={{ width: "1px", background: "#ffffff10" }}></div>
            <div><div style={{ fontSize: "24px", fontWeight: 900, color: "#fff" }}>{sortedProducts.length}</div><div style={{ fontSize: "10px", color: "#ffffff35", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginTop: "2px" }}>Products</div></div>
          </div>
        </div>
        {sortedProducts.map(pr => {
          const flavors = grouped[pr].sort((a, b) => a.flavor.localeCompare(b.flavor));
          const bc = getBrandColor(catalogObj[pr]?.brand || "");
          return (
            <div key={pr} style={{ marginBottom: "12px", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid #ffffff08" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{ width: "3px", height: "14px", borderRadius: "2px", background: bc }}></div>
                <span style={{ color: "#ffffff60", fontSize: "12px", fontWeight: 700 }}>{pr}</span>
                <span style={{ color: "#ffffff25", fontSize: "10px", marginLeft: "auto" }}>{flavors.length} item{flavors.length !== 1 ? "s" : ""}</span>
              </div>
              {flavors.map(({ flavor, qty, key }) => {
                const col = getQtyColor(qty);
                const qNum = qty === "5+" ? 5 : parseInt(qty) || 1;
                const decrement = () => { if (qNum <= 1) return; sndClick(); setOrderData(prev => ({ ...prev, [key]: String(qNum - 1) })); };
                const increment = () => { if (qty === "5+") return; sndClick(); setOrderData(prev => ({ ...prev, [key]: qNum >= 4 ? "5+" : String(qNum + 1) })); };
                return (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #ffffff06" }}>
                    <span style={{ color: "#ffffffcc", fontSize: "14px", flex: 1 }}>{flavor}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <button onClick={decrement} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: qNum <= 1 ? "rgba(255,255,255,0.05)" : "rgba(230,57,70,0.2)", color: qNum <= 1 ? "#ffffff20" : "#E63946", fontSize: "18px", fontWeight: 700, cursor: qNum <= 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>−</button>
                      <span style={{ color: col, fontSize: "16px", fontWeight: 800, minWidth: "30px", textAlign: "center" }}>{qty}</span>
                      <button onClick={increment} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: qty === "5+" ? "rgba(255,255,255,0.05)" : "rgba(29,185,84,0.2)", color: qty === "5+" ? "#ffffff20" : "#1DB954", fontSize: "18px", fontWeight: 700, cursor: qty === "5+" ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>+</button>
                    </div>
                    <button onClick={() => { sndRemove(); setOrderData(prev => { const next = { ...prev }; delete next[key]; return next; }); if (Object.keys(orderData).length <= 1) setView("employee-products"); }}
                      style={{ background: "none", border: "1px solid #E6394625", borderRadius: "6px", color: "#E63946", fontSize: "11px", fontWeight: 700, cursor: "pointer", padding: "4px 8px", marginLeft: "24px" }}>✕</button>
                  </div>
                );
              })}
            </div>
          );
        })}
        {suggestions.length > 0 && (<div style={{ padding: "10px 14px", borderRadius: "10px", background: "#6C5CE708", border: "1px solid #6C5CE715", marginBottom: "12px" }}><span style={{ color: "#6C5CE7", fontSize: "11px", fontWeight: 700 }}>💡 {suggestions.length} suggestion{suggestions.length > 1 ? "s" : ""} will be sent</span></div>)}
        <div style={{ position: "fixed", bottom: "24px", left: "20px", right: "20px", display: "flex", gap: "10px", alignItems: "center", zIndex: 90 }}>
          <button onClick={() => { sndBack(); setView("employee-products"); }}
            style={{ width: "56px", height: "56px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#000", fontSize: "22px", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 20px rgba(255,107,53,0.4)" }}>←</button>
          <button onClick={submitOrder} disabled={submitting} style={{ flex: 1, padding: "16px", borderRadius: "14px", border: "none", background: submitting ? "#ffffff10" : "linear-gradient(135deg, #1DB954, #10B981)", color: submitting ? "#ffffff25" : "#fff", fontSize: "15px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 4px 20px rgba(29,185,84,0.3)" }}>
            {submitting ? "Submitting..." : "✅ Confirm & Submit"}
          </button>
        </div>
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

  // MANAGER ANALYTICS
  if (view === "manager" && authed && isManagerOrExec && mgrView === "analytics") {
    const data = analyticsData;
    const totalOrders = data.length;
    const totalUnits = data.reduce((s, r) => s + (r.total_units || 0), 0);
    const totalFlavors = data.reduce((s, r) => s + (r.total_flavors || 0), 0);
    const uniqueStores = [...new Set(data.map(r => r.store_location))];
    
    // Top flavors
    const flavorCounts = {};
    data.forEach(r => {
      Object.entries(r.items || {}).forEach(([key, qty]) => {
        const [product, flavor] = key.split("|||");
        const fKey = `${flavor}`;
        const q = qty === "5+" ? 5 : parseInt(qty) || 0;
        flavorCounts[fKey] = (flavorCounts[fKey] || 0) + q;
      });
    });
    const topFlavors = Object.entries(flavorCounts).sort((a, b) => b[1] - a[1]).slice(0, 15);
    
    // Top products (models)
    const productCounts = {};
    data.forEach(r => {
      Object.entries(r.items || {}).forEach(([key, qty]) => {
        const [product] = key.split("|||");
        const q = qty === "5+" ? 5 : parseInt(qty) || 0;
        productCounts[product] = (productCounts[product] || 0) + q;
      });
    });
    const topProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    
    // Orders per store
    const storeOrders = {};
    data.forEach(r => { storeOrders[r.store_location] = (storeOrders[r.store_location] || 0) + 1; });
    const storeRank = Object.entries(storeOrders).sort((a, b) => b[1] - a[1]);
    
    // Orders per day
    const dailyCounts = {};
    data.forEach(r => {
      const d = new Date(r.created_at);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      dailyCounts[key] = (dailyCounts[key] || 0) + 1;
    });
    const days = analyticsRange === "30d" ? 30 : analyticsRange === "14d" ? 14 : 7;
    const dailyLabels = [];
    const dailyValues = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      dailyLabels.push(key);
      dailyValues.push(dailyCounts[key] || 0);
    }

    // Units per store
    const storeUnits = {};
    data.forEach(r => { storeUnits[r.store_location] = (storeUnits[r.store_location] || 0) + (r.total_units || 0); });
    const storeUnitRank = Object.entries(storeUnits).sort((a, b) => b[1] - a[1]);

    const maxBar = topFlavors.length > 0 ? topFlavors[0][1] : 1;
    const maxProd = topProducts.length > 0 ? topProducts[0][1] : 1;
    const maxDaily = Math.max(...dailyValues, 1);

    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setMgrView("dashboard"); setEditModel(null); }} style={st.back}>← Back to Dashboard</button>
        <h1 style={st.h1}>📈 Analytics</h1><p style={st.sub}>{mgrWarehouse?.name} • completed orders</p>
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {["7d", "14d", "30d"].map(r => (
            <button key={r} onClick={() => { setAnalyticsRange(r); loadAnalytics(r); }}
              style={{ padding: "6px 14px", borderRadius: "8px", border: `1px solid ${analyticsRange === r ? "#00B4D850" : "#ffffff15"}`, background: analyticsRange === r ? "#00B4D820" : "transparent", color: analyticsRange === r ? "#00B4D8" : "#ffffff40", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>{r === "7d" ? "7 Days" : r === "14d" ? "14 Days" : "30 Days"}</button>
          ))}
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(29,185,84,0.06)", border: "1px solid #1DB95420", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#1DB954" }}>{totalUnits}</div>
            <div style={{ fontSize: "11px", color: "#1DB95480", fontWeight: 700, marginTop: "4px" }}>UNITS MOVED</div>
          </div>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(0,180,216,0.06)", border: "1px solid #00B4D820", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#00B4D8" }}>{totalOrders}</div>
            <div style={{ fontSize: "11px", color: "#00B4D880", fontWeight: 700, marginTop: "4px" }}>ORDERS</div>
          </div>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,107,53,0.06)", border: "1px solid #FF6B3520", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#FF6B35" }}>{uniqueStores.length}</div>
            <div style={{ fontSize: "11px", color: "#FF6B3580", fontWeight: 700, marginTop: "4px" }}>ACTIVE STORES</div>
          </div>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(108,92,231,0.06)", border: "1px solid #6C5CE720", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#6C5CE7" }}>{totalOrders > 0 ? Math.round(totalUnits / totalOrders) : 0}</div>
            <div style={{ fontSize: "11px", color: "#6C5CE780", fontWeight: 700, marginTop: "4px" }}>AVG ORDER SIZE</div>
          </div>
        </div>

        {/* Margin analytics — only when cost mode active */}
        {canSeeCostMargin && (() => {
          let periodCost = 0; let periodRetail = 0;
          const storeCosts = {}; const storeRetails = {};
          const brandCosts = {}; const brandRetails = {}; const brandUnits = {};
          data.forEach(r => {
            let orderCost = 0; let orderRetail = 0;
            Object.entries(r.items || {}).forEach(([key, qty]) => {
              const [product] = key.split("|||");
              const q = qty === "5+" ? 5 : parseInt(qty) || 0;
              const model = catalog.find(c => c.model_name === product);
              const cp = model?.cost_price || 0;
              const rp = model?.retail_price || 0;
              const br = model?.brand || "Unknown";
              orderCost += cp * q; orderRetail += rp * q;
              brandCosts[br] = (brandCosts[br] || 0) + cp * q;
              brandRetails[br] = (brandRetails[br] || 0) + rp * q;
              brandUnits[br] = (brandUnits[br] || 0) + q;
            });
            periodCost += orderCost; periodRetail += orderRetail;
            storeCosts[r.store_location] = (storeCosts[r.store_location] || 0) + orderCost;
            storeRetails[r.store_location] = (storeRetails[r.store_location] || 0) + orderRetail;
          });
          const periodProfit = periodRetail - periodCost;
          const periodMargin = periodRetail > 0 ? (periodProfit / periodRetail * 100) : 0;
          const storeMargins = Object.keys(storeCosts).map(s => ({
            store: s, cost: storeCosts[s], retail: storeRetails[s],
            profit: storeRetails[s] - storeCosts[s],
            margin: storeRetails[s] > 0 ? ((storeRetails[s] - storeCosts[s]) / storeRetails[s] * 100) : 0
          })).sort((a, b) => b.profit - a.profit);
          const brandMargins = Object.keys(brandCosts).map(b => ({
            brand: b, cost: brandCosts[b], retail: brandRetails[b], units: brandUnits[b],
            profit: brandRetails[b] - brandCosts[b],
            margin: brandRetails[b] > 0 ? ((brandRetails[b] - brandCosts[b]) / brandRetails[b] * 100) : 0
          })).sort((a, b) => b.profit - a.profit);
          return (
            <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(230,57,70,0.06)", border: "1px solid #E6394620", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 900, color: "#E63946" }}>${periodCost.toFixed(0)}</div>
                <div style={{ fontSize: "10px", color: "#E6394680", fontWeight: 700, marginTop: "4px" }}>TOTAL COST</div>
              </div>
              <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(29,185,84,0.06)", border: "1px solid #1DB95420", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 900, color: "#1DB954" }}>${periodRetail.toFixed(0)}</div>
                <div style={{ fontSize: "10px", color: "#1DB95480", fontWeight: 700, marginTop: "4px" }}>RETAIL VALUE</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              <div style={{ padding: "20px 16px", borderRadius: "12px", background: periodProfit >= 0 ? "rgba(29,185,84,0.08)" : "rgba(230,57,70,0.08)", border: `1px solid ${periodProfit >= 0 ? "#1DB95425" : "#E6394625"}`, textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: periodProfit >= 0 ? "#1DB954" : "#E63946" }}>${periodProfit.toFixed(0)}</div>
                <div style={{ fontSize: "10px", color: periodProfit >= 0 ? "#1DB95480" : "#E6394680", fontWeight: 700, marginTop: "4px" }}>GROSS PROFIT</div>
              </div>
              <div style={{ padding: "20px 16px", borderRadius: "12px", background: periodMargin >= 30 ? "rgba(29,185,84,0.08)" : "rgba(245,158,11,0.08)", border: `1px solid ${periodMargin >= 30 ? "#1DB95425" : "#F59E0B25"}`, textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: periodMargin >= 30 ? "#1DB954" : "#F59E0B" }}>{periodMargin.toFixed(1)}%</div>
                <div style={{ fontSize: "10px", color: "#ffffff50", fontWeight: 700, marginTop: "4px" }}>AVG MARGIN</div>
              </div>
            </div>
            {/* Margin by store */}
            {storeMargins.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <span style={{ color: "#FF6B35", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>💰 Profit by Store</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "12px" }}>
                  {storeMargins.map(s => (
                    <div key={s.store} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
                      <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600, flex: 1 }}>{s.store}</span>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: s.profit >= 0 ? "#1DB954" : "#E63946", fontWeight: 800 }}>${s.profit.toFixed(0)}</span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: s.margin >= 30 ? "#1DB954" : "#F59E0B", minWidth: "44px", textAlign: "right" }}>{s.margin.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Margin by brand */}
            {brandMargins.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <span style={{ color: "#6C5CE7", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>🏷️ Margin by Brand</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "12px" }}>
                  {brandMargins.map(b => (
                    <div key={b.brand} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
                      <div>
                        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{b.brand}</span>
                        <span style={{ color: "#ffffff25", fontSize: "11px", marginLeft: "8px" }}>{b.units}u</span>
                      </div>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "#1DB954", fontWeight: 600 }}>${b.profit.toFixed(0)} profit</span>
                        <span style={{ fontSize: "13px", fontWeight: 900, color: b.margin >= 30 ? "#1DB954" : "#F59E0B", minWidth: "48px", textAlign: "right" }}>{b.margin.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </>
          );
        })()}

        {/* Top products first */}
        {topProducts.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <span style={{ color: "#FF6B35", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>📦 Top Products</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "12px" }}>
              {topProducts.map(([name, count], i) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ color: "#ffffff30", fontSize: "11px", fontWeight: 700, width: "20px" }}>#{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>{name}</span>
                      <span style={{ color: "#FF6B35", fontSize: "12px", fontWeight: 800 }}>{count}u</span>
                    </div>
                    <div style={{ height: "4px", borderRadius: "2px", background: "#ffffff08", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: "2px", background: "#FF6B35", width: `${(count / maxProd) * 100}%`, transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top flavors */}
        {topFlavors.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <span style={{ color: "#1DB954", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>🔥 Top Flavors</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "12px" }}>
              {topFlavors.map(([name, count], i) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ color: "#ffffff30", fontSize: "11px", fontWeight: 700, width: "20px" }}>#{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>{name}</span>
                      <span style={{ color: "#1DB954", fontSize: "12px", fontWeight: 800 }}>{count}u</span>
                    </div>
                    <div style={{ height: "4px", borderRadius: "2px", background: "#ffffff08", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: "2px", background: "#1DB954", width: `${(count / maxBar) * 100}%`, transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily order chart */}
        <div style={{ marginBottom: "24px" }}>
          <span style={{ color: "#00B4D8", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>📊 Orders Per Day</span>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "120px", marginTop: "12px", padding: "0 4px" }}>
            {dailyValues.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                  <div style={{ width: "100%", height: `${Math.max((v / maxDaily) * 100, v > 0 ? 8 : 2)}%`, background: v > 0 ? "linear-gradient(180deg, #00B4D8, #00B4D860)" : "#ffffff08", borderRadius: "3px 3px 0 0", transition: "height 0.3s ease" }} />
                </div>
                {v > 0 && <span style={{ fontSize: "9px", color: "#00B4D8", fontWeight: 700, marginTop: "2px" }}>{v}</span>}
                <span style={{ fontSize: "8px", color: "#ffffff25", marginTop: "2px" }}>{dailyLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Store rankings */}
        {storeUnitRank.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <span style={{ color: "#6C5CE7", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>🏪 Units Per Store</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "12px" }}>
              {storeUnitRank.map(([name, units]) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{name}</span>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ color: "#6C5CE7", fontSize: "13px", fontWeight: 800 }}>{units}u</span>
                    <span style={{ color: "#ffffff25", fontSize: "11px" }}>{storeOrders[name]} order{storeOrders[name] !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalOrders === 0 && <div style={{ padding: "40px 20px", textAlign: "center", borderRadius: "12px", border: "1px dashed #ffffff12" }}><p style={{ color: "#ffffff30", fontSize: "14px", margin: 0 }}>No completed orders yet for this period</p><p style={{ color: "#ffffff20", fontSize: "12px", marginTop: "8px" }}>Complete orders from your dashboard to see analytics here</p></div>}

        {/* Order History */}
        {data.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <span style={{ color: "#ffffff60", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>📋 Order History</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
              {data.map(order => {
                const entries = Object.entries(order.items || {});
                const dateStr = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
                return (
                  <div key={order.id} style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid #ffffff08", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>{order.employee_name}</div>
                      <div style={{ color: "#ffffff35", fontSize: "11px", marginTop: "2px" }}>{order.store_location} • {dateStr}</div>
                      <div style={{ color: "#ffffff25", fontSize: "11px", marginTop: "2px" }}>{order.total_flavors} items • {order.total_units}u</div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
                    <button onClick={() => {
                      // Group by category → product → flavors, all alphabetical
                      const catGrp = {};
                      entries.forEach(([k, q]) => {
                        const [pr, fl] = k.split("|||");
                        const model = catalog.find(c => c.model_name === pr);
                        const cat = model?.category || "Other";
                        if (!catGrp[cat]) catGrp[cat] = {};
                        if (!catGrp[cat][pr]) catGrp[cat][pr] = [];
                        catGrp[cat][pr].push({ flavor: fl, qty: q });
                      });
                      // Sort everything
                      const sortedCats = Object.keys(catGrp).sort();
                      const completedDate = order.completed_at ? new Date(order.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : dateStr;
                      const orderDate = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
                      let rows = "";
                      const showCost = canSeeCostMargin;
                      const colSpan = showCost ? "4" : "2";
                      let grandTotalCost = 0;
                      let grandTotalRetail = 0;
                      sortedCats.forEach(cat => {
                        rows += `<tr><td colspan="${colSpan}" style="padding:12px;font-weight:800;font-size:15px;background:#e8e8e8;border-bottom:2px solid #ddd;text-transform:uppercase;letter-spacing:0.5px;color:#444">${cat}</td></tr>`;
                        const sortedProducts = Object.keys(catGrp[cat]).sort();
                        sortedProducts.forEach(product => {
                          const items = catGrp[cat][product].sort((a, b) => a.flavor.localeCompare(b.flavor));
                          const productUnits = items.reduce((s, i) => s + (parseInt(i.qty) || 0), 0);
                          const model = catalog.find(c => c.model_name === product);
                          const costP = model?.cost_price || 0;
                          const retailP = model?.retail_price || 0;
                          const prodCostTotal = costP * productUnits;
                          const prodRetailTotal = retailP * productUnits;
                          grandTotalCost += prodCostTotal;
                          grandTotalRetail += prodRetailTotal;
                          rows += `<tr><td style="padding:10px 12px;font-weight:700;background:#f5f5f5;border-bottom:1px solid #eee;font-size:13px;">${product}</td><td style="padding:10px 12px;background:#f5f5f5;border-bottom:1px solid #eee;text-align:right;font-size:11px;color:#888;font-weight:600">${items.length} items &bull; ${productUnits}u</td>${showCost ? `<td style="padding:10px 12px;background:#f5f5f5;border-bottom:1px solid #eee;text-align:right;font-size:11px;color:#c44;font-weight:700">$${prodCostTotal.toFixed(2)}</td><td style="padding:10px 12px;background:#f5f5f5;border-bottom:1px solid #eee;text-align:right;font-size:11px;color:#2a8;font-weight:700">$${prodRetailTotal.toFixed(2)}</td>` : ""}</tr>`;
                          items.forEach(({ flavor, qty }) => {
                            const q = parseInt(qty) || 0;
                            rows += `<tr><td style="padding:8px 12px 8px 28px;border-bottom:1px solid #f0f0f0;font-size:13px;">${flavor}</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;font-size:13px;">&times;${qty}</td>${showCost ? `<td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px;color:#c44;">$${(costP * q).toFixed(2)}</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px;color:#2a8;">$${(retailP * q).toFixed(2)}</td>` : ""}</tr>`;
                          });
                        });
                      });
                      if (showCost) {
                        const grandMargin = grandTotalRetail > 0 ? ((grandTotalRetail - grandTotalCost) / grandTotalRetail * 100).toFixed(1) : "0";
                        const grandProfit = grandTotalRetail - grandTotalCost;
                        rows += `<tr><td colspan="2" style="padding:12px;font-weight:900;font-size:14px;background:#333;color:#fff;border-top:3px solid #222">TOTALS</td><td style="padding:12px;background:#333;color:#f88;font-weight:900;text-align:right;border-top:3px solid #222;font-size:14px">$${grandTotalCost.toFixed(2)}</td><td style="padding:12px;background:#333;color:#6d8;font-weight:900;text-align:right;border-top:3px solid #222;font-size:14px">$${grandTotalRetail.toFixed(2)}</td></tr>`;
                        rows += `<tr><td colspan="2" style="padding:10px 12px;font-weight:700;font-size:13px;background:#f8f8f8">NET PROFIT</td><td colspan="2" style="padding:10px 12px;background:#f8f8f8;text-align:right;font-weight:900;font-size:16px;color:${grandProfit >= 0 ? '#2a8' : '#c44'}">$${grandProfit.toFixed(2)} (${grandMargin}%)</td></tr>`;
                      }
                      const costHeaders = showCost ? `<th style="padding:10px 12px;text-align:right;font-size:11px;color:#888;border-bottom:2px solid #ddd">COST</th><th style="padding:10px 12px;text-align:right;font-size:11px;color:#888;border-bottom:2px solid #ddd">RETAIL</th>` : "";
                      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice - ${order.store_location}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:40px;color:#222;max-width:${showCost ? "750" : "600"}px;margin:0 auto}@media print{body{padding:20px}}</style></head><body>
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px">
                          <div><h1 style="font-size:24px;font-weight:800;margin-bottom:4px">Backstock Invoice</h1><p style="color:#888;font-size:13px">${mgrWarehouse?.name || "Warehouse"}</p></div>
                          <div style="text-align:right"><p style="font-size:12px;color:#888">Order #${order.id}</p></div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
                          <div style="padding:14px;border-radius:8px;border:1px solid #eee"><p style="font-size:11px;color:#888;font-weight:600;margin-bottom:4px">STORE</p><p style="font-size:14px;font-weight:700">${order.store_location}</p></div>
                          <div style="padding:14px;border-radius:8px;border:1px solid #eee"><p style="font-size:11px;color:#888;font-weight:600;margin-bottom:4px">EMPLOYEE</p><p style="font-size:14px;font-weight:700">${order.employee_name}</p></div>
                          <div style="padding:14px;border-radius:8px;border:1px solid #eee"><p style="font-size:11px;color:#888;font-weight:600;margin-bottom:4px">ORDERED</p><p style="font-size:14px;font-weight:700">${orderDate}</p></div>
                          <div style="padding:14px;border-radius:8px;border:1px solid #eee"><p style="font-size:11px;color:#888;font-weight:600;margin-bottom:4px">COMPLETED</p><p style="font-size:14px;font-weight:700">${completedDate}</p></div>
                        </div>
                        <div style="padding:16px;border-radius:8px;background:#f8f8f8;display:flex;justify-content:space-around;text-align:center;margin-bottom:24px">
                          <div><p style="font-size:24px;font-weight:900">${order.total_flavors}</p><p style="font-size:11px;color:#888;font-weight:600">ITEMS</p></div>
                          <div style="width:1px;background:#ddd"></div>
                          <div><p style="font-size:24px;font-weight:900">${order.total_units}</p><p style="font-size:11px;color:#888;font-weight:600">TOTAL UNITS</p></div>
                          ${showCost ? `<div style="width:1px;background:#ddd"></div>
                          <div><p style="font-size:24px;font-weight:900;color:#2a8">$${grandTotalRetail.toFixed(2)}</p><p style="font-size:11px;color:#888;font-weight:600">RETAIL VALUE</p></div>
                          <div style="width:1px;background:#ddd"></div>
                          <div><p style="font-size:24px;font-weight:900;color:#c44">$${grandTotalCost.toFixed(2)}</p><p style="font-size:11px;color:#888;font-weight:600">COST</p></div>` : ""}
                        </div>
                        <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden">${showCost ? `<tr><th style="padding:10px 12px;text-align:left;font-size:11px;color:#888;border-bottom:2px solid #ddd">ITEM</th><th style="padding:10px 12px;text-align:right;font-size:11px;color:#888;border-bottom:2px solid #ddd">QTY</th>${costHeaders}</tr>` : ""}${rows}</table>
                        <p style="text-align:center;color:#bbb;font-size:11px;margin-top:30px">Generated by Backstock &bull; ${new Date().toLocaleDateString()}</p>
                      </body></html>`;
                      const blob = new Blob([html], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      const w = window.open(url, "_blank");
                      if (w) { w.onload = () => { setTimeout(() => { w.print(); }, 300); }; }
                      else { const a = document.createElement("a"); a.href = url; a.download = `invoice-${order.store_location}-${order.id}.html`; a.click(); }
                      setTimeout(() => URL.revokeObjectURL(url), 5000);
                    }}
                      style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #ffffff15", background: "transparent", color: "#ffffff50", fontSize: "11px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>📄 Invoice</button>
                    <button onClick={async () => { if (window.confirm(`Delete ${order.employee_name}'s completed order?`)) { try { await orgSb.del("submissions", `id=eq.${order.id}`); sndRemove(); setAnalyticsData(p => p.filter(o => o.id !== order.id)); } catch (e) { console.error(e); } } }}
                      style={{ padding: "8px 8px", borderRadius: "8px", border: "1px solid #E6394625", background: "transparent", color: "#E6394680", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ height: "70px" }} />
        <FloatingBack onClick={() => { setMgrView("dashboard"); setEditModel(null); }} />
      </div>
    );
  }

  // MANAGER CATALOG
  if (view === "manager" && authed && mgrView === "catalog") {
    const isOwnerView = accessLevel === "owner";
    const searchTerm = catalogSearch.toLowerCase().trim();
    const wid = mgrWarehouse ? String(mgrWarehouse.id) : null;
    const filteredCatalog = (searchTerm ? catalog.filter(c => 
      c.model_name.toLowerCase().includes(searchTerm) || 
      c.brand.toLowerCase().includes(searchTerm) || 
      (c.category || "").toLowerCase().includes(searchTerm) ||
      (c.flavors || []).some(f => f.toLowerCase().includes(searchTerm))
    ) : catalog).filter(c => {
      // Hide models where ALL flavors are hidden from this warehouse
      if (!wid) return true;
      const hidden = (c.warehouse_visibility || {})[wid] || [];
      if (hidden.includes("__ALL__")) return false;
      const allFlavors = c.flavors || [];
      if (allFlavors.length === 0) return true;
      return !allFlavors.every(f => hidden.includes(f));
    });
    const catBrands = {};
    filteredCatalog.forEach(c => { const cat = c.category || "Vapes"; if (!catBrands[cat]) catBrands[cat] = {}; if (!catBrands[cat][c.brand]) catBrands[cat][c.brand] = []; catBrands[cat][c.brand].push(c); });
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setCatalogSearch(""); setMgrView("dashboard"); setEditModel(null); }} style={st.back}>← Back to Dashboard</button>
        <h1 style={st.h1}>🗂️ {isOwnerView ? "View" : "Manage"} Catalog</h1><p style={st.sub}>{isOwnerView ? `Browsing ${mgrWarehouse?.name} catalog` : `Managing for ${mgrWarehouse?.name} • set stock counts per item`}</p>
        {!isOwnerView && (!showAddModel ? (
          <button onClick={() => setShowAddModel(true)} style={{ padding: "10px 18px", borderRadius: "8px", background: "#1DB95420", color: "#1DB954", border: "1px solid #1DB95430", fontSize: "13px", fontWeight: 700, cursor: "pointer", marginBottom: "20px" }}>+ Add New Model / Product</button>
        ) : (
          <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid #1DB95430", background: "#1DB95408", marginBottom: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input type="text" placeholder="Product name (e.g. Geek Bar Skyview 20k)" value={newModelName} onChange={e => setNewModelName(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
              <input type="text" placeholder="Brand (e.g. Geek Bar, RAW, etc)" value={newModelBrand} onChange={e => setNewModelBrand(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
              <input type="text" placeholder="Category (e.g. Vapes, Accessories, CBD)" value={newModelCategory} onChange={e => setNewModelCategory(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
              <input type="text" placeholder="Puff count (leave blank if not a vape)" value={newModelPuffs} onChange={e => setNewModelPuffs(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button onClick={addModel} disabled={!newModelName.trim() || !newModelBrand.trim()}
                  style={{ padding: "10px 18px", borderRadius: "8px", background: newModelName.trim() && newModelBrand.trim() ? "#1DB954" : "#ffffff10", color: newModelName.trim() && newModelBrand.trim() ? "#fff" : "#ffffff25", border: "none", fontSize: "13px", fontWeight: 700, cursor: newModelName.trim() && newModelBrand.trim() ? "pointer" : "not-allowed" }}>Save</button>
                <button onClick={() => { setShowAddModel(false); setNewModelName(""); setNewModelBrand(""); setNewModelPuffs(""); setNewModelCategory("Vapes"); }} style={{ padding: "10px 18px", borderRadius: "8px", background: "transparent", color: "#ffffff40", border: "1px solid #ffffff15", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                {(!newModelName.trim() || !newModelBrand.trim()) && (newModelName || newModelBrand) && <span style={{ color: "#F59E0B", fontSize: "11px", fontWeight: 600 }}>Name & brand required</span>}
              </div>
            </div>
          </div>
        ))}
        <div style={{ marginBottom: "20px", position: "sticky", top: 0, zIndex: 80, paddingTop: "8px", paddingBottom: "12px", background: "linear-gradient(180deg, #0B0B0F 85%, transparent)", marginLeft: "-20px", marginRight: "-20px", paddingLeft: "20px", paddingRight: "20px" }}>
          <input type="text" placeholder="🔍  Search models, brands, flavors..." value={catalogSearch} onChange={e => setCatalogSearch(e.target.value)}
            style={{ ...st.input, fontSize: "14px", padding: "14px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid #ffffff15", borderRadius: "12px" }} />
          {searchTerm && <div style={{ color: "#ffffff30", fontSize: "11px", marginTop: "6px", textAlign: "center" }}>{filteredCatalog.length} result{filteredCatalog.length !== 1 ? "s" : ""}</div>}
        </div>
        {Object.keys(catBrands).length === 0 && searchTerm && <div style={{ padding: "40px 20px", textAlign: "center" }}><p style={{ color: "#ffffff30", fontSize: "14px" }}>No results for "{catalogSearch}"</p></div>}
        {Object.entries(catBrands).map(([cat, brands]) => {
          const catExpanded = searchTerm ? true : expandedCats[cat];
          const catBrandCount = Object.keys(brands).length;
          const catModelCount = Object.values(brands).reduce((s, m) => s + m.length, 0);
          const catTotalStock = Object.values(brands).flat().reduce((sum, m) => {
            const mws = mgrWarehouse ? ((m.stock_levels || {})[String(mgrWarehouse.id)] || {}) : {};
            return sum + Object.values(mws).reduce((s, v) => s + (parseInt(v) || 0), 0);
          }, 0);
          return (
          <div key={cat} style={{ marginBottom: "8px" }}>
            <button onClick={() => { setExpandedCats(p => ({ ...p, [cat]: !catExpanded })); }}
              style={{ width: "100%", padding: "16px 18px", borderRadius: "12px", background: catExpanded ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)", border: "1px solid #ffffff08", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
              <div>
                <span style={{ color: "#fff", fontSize: "16px", fontWeight: 800 }}>{cat}</span>
                <div style={{ color: "#ffffff30", fontSize: "11px", marginTop: "3px" }}>{catBrandCount} brand{catBrandCount !== 1 ? "s" : ""} • {catModelCount} model{catModelCount !== 1 ? "s" : ""}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {!isOwnerView && <span style={{ color: catTotalStock > 0 ? "#1DB95480" : "#E6394680", fontSize: "12px", fontWeight: 700 }}>{catTotalStock}u</span>}
                <span style={{ color: "#ffffff25", fontSize: "18px", transition: "transform 0.2s ease", transform: catExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
              </div>
            </button>
            {catExpanded && (
              <div style={{ paddingLeft: "4px", paddingTop: "6px" }}>
            {Object.entries(brands).map(([brand, models]) => {
              const bc = getBrandColor(brand);
              const brandKey = `${cat}:::${brand}`;
              const isExpanded = searchTerm ? true : expandedBrands[brandKey];
              const brandTotalStock = models.reduce((sum, m) => {
                const mws = mgrWarehouse ? ((m.stock_levels || {})[String(mgrWarehouse.id)] || {}) : {};
                return sum + Object.values(mws).reduce((s, v) => s + (parseInt(v) || 0), 0);
              }, 0);
              return (
                <div key={brand} style={{ marginBottom: "4px" }}>
                  <button onClick={() => { setExpandedBrands(p => ({ ...p, [brandKey]: !isExpanded })); }}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${isExpanded ? bc + "20" : "#ffffff06"}`, background: isExpanded ? `${bc}08` : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", transition: "all 0.2s ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "3px", height: "18px", borderRadius: "2px", background: bc }}></div>
                      <div>
                        <span style={{ color: bc, fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{brand}</span>
                        <div style={{ color: "#ffffff25", fontSize: "10px", marginTop: "2px" }}>{models.length} model{models.length !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {!isOwnerView && <span style={{ color: brandTotalStock > 0 ? "#1DB954" : "#E63946", fontSize: "12px", fontWeight: 700 }}>{brandTotalStock}u</span>}
                      <span style={{ color: "#ffffff20", fontSize: "14px", transition: "transform 0.2s ease", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                    </div>
                  </button>
                  {isExpanded && (
                    <div style={{ paddingLeft: "16px", marginTop: "4px", marginBottom: "4px" }}>
                  {models.map(m => {
                    const msl = m.stock_levels || {};
                    const mws = mgrWarehouse ? (msl[String(mgrWarehouse.id)] || {}) : {};
                    const mTotalStock = Object.values(mws).reduce((s, v) => s + (parseInt(v) || 0), 0);
                    const mTracked = Object.keys(mws).length;
                    const mTotal = (m.flavors || []).length;
                    return (
                    <button key={m.id} onClick={() => { if (!isOwnerView) { setEditModel(m); setMgrView("editModel"); setNewFlavor(""); setEditingModelInfo(false); } }}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #ffffff06", background: "rgba(255,255,255,0.02)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: isOwnerView ? "default" : "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", transition: "background 0.15s ease" }}>
                      <div><div style={{ fontSize: "13px" }}>{m.model_name}</div><div style={{ fontSize: "10px", color: "#ffffff25", marginTop: "2px" }}>{m.puffs !== "N/A" ? m.puffs + " puffs" : m.brand}</div></div>
                      {isOwnerView
                        ? <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff40" }}>{mTotal} flavor{mTotal !== 1 ? "s" : ""}</span>
                        : <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {canSeeCostMargin && m.cost_price > 0 && m.retail_price > 0 && (
                              <span style={{ fontSize: "10px", fontWeight: 800, color: ((m.retail_price - m.cost_price) / m.retail_price * 100) >= 30 ? "#1DB954" : "#F59E0B", padding: "2px 6px", borderRadius: "4px", background: ((m.retail_price - m.cost_price) / m.retail_price * 100) >= 30 ? "#1DB95415" : "#F59E0B15" }}>
                                {Math.round((m.retail_price - m.cost_price) / m.retail_price * 100)}%
                              </span>
                            )}
                            <span style={{ fontSize: "12px", fontWeight: 700, color: mTracked < mTotal ? "#F59E0B" : mTotalStock > 0 ? "#1DB954" : "#E63946" }}>{mTotalStock} in stock ›</span>
                          </div>
                      }
                    </button>
                    );
                  })}
                    </div>
                  )}
                </div>
              );
            })}
              </div>
            )}
          </div>
          );
        })}
        <div style={{ height: "70px" }} />
        <FloatingBack onClick={() => { setMgrView("dashboard"); setEditModel(null); }} />
      </div>
    );
  }

  // MANAGER EDIT MODEL (manager only, not owner)
  if (view === "manager" && authed && isManagerOrExec && mgrView === "editModel" && editModel) {
    const m = catalog.find(c => c.id === editModel.id) || editModel;
    const bc = getBrandColor(m.brand);
    const whVis = m.warehouse_visibility || {};
    const hiddenForThis = mgrWarehouse ? (whVis[String(mgrWarehouse.id)] || []) : [];
    const sl = m.stock_levels || {};
    const warehouseStock = mgrWarehouse ? (sl[String(mgrWarehouse.id)] || {}) : {};
    const totalStock = Object.values(warehouseStock).reduce((sum, v) => sum + (parseInt(v) || 0), 0);
    const trackedCount = Object.keys(warehouseStock).length;
    return (
      <div style={st.page}>
        <button onClick={() => { flushStock(); sndBack(); setMgrView("catalog"); setEditModel(null); setEditingModelInfo(false); }} style={st.back}>← Back to Catalog</button>
        {!editingModelInfo ? (
          <div style={{ marginBottom: "20px" }}>
            <span style={{ color: bc, fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>{m.brand} {m.puffs !== "N/A" ? `• ${m.puffs} puffs` : ""} • {m.category || "Vapes"}</span>
            <h2 style={{ ...st.h2, marginTop: "4px", marginBottom: "6px" }}>{m.model_name}</h2>
            <p style={{ ...st.sub, margin: "0 0 14px 0" }}>{(m.flavors || []).length} items • {totalStock} total in stock for {mgrWarehouse?.name}</p>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => { setEditingModelInfo(true); setEditModelName(m.model_name); setEditModelBrand(m.brand); setEditModelPuffs(m.puffs || ""); setEditModelCategory(m.category || "Vapes"); }}
                style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #ffffff15", background: "rgba(255,255,255,0.03)", color: "#ffffff50", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>✏️ Edit Info</button>
              <button onClick={async () => { await loadCatalog(); const updated = catalog.find(c => c.id === m.id); if (updated) setEditModel(updated); }}
                style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #ffffff15", background: "rgba(255,255,255,0.03)", color: "#ffffff50", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>🔄 Refresh</button>
            </div>
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
        {/* Master warehouse visibility toggle */}
        {(() => {
          const isModelHidden = hiddenForThis.includes("__ALL__");
          const toggleModel = async () => {
            const whVis = { ...(m.warehouse_visibility || {}) };
            const wid = String(mgrWarehouse.id);
            if (isModelHidden) {
              whVis[wid] = [];
            } else {
              whVis[wid] = ["__ALL__"];
            }
            try { await orgSb.patch("catalog", { warehouse_visibility: whVis }, `id=eq.${m.id}`); setCatalog(p => p.map(c => c.id === m.id ? { ...c, warehouse_visibility: whVis } : c)); } catch (e) { console.error(e); }
          };
          return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "10px", background: isModelHidden ? "rgba(230,57,70,0.08)" : "rgba(29,185,84,0.08)", border: `1px solid ${isModelHidden ? "#E6394620" : "#1DB95420"}`, marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: isModelHidden ? "#E63946" : "#1DB954" }}>{isModelHidden ? "Hidden from " : "Visible at "}{mgrWarehouse?.name}</div>
                <div style={{ fontSize: "10px", color: "#ffffff30", marginTop: "2px" }}>{isModelHidden ? "Employees can't see this product" : "All tracked flavors shown to employees"}</div>
              </div>
              <button onClick={toggleModel} style={{ width: "52px", height: "28px", borderRadius: "14px", border: "none", background: isModelHidden ? "#ffffff15" : "#1DB954", cursor: "pointer", position: "relative", transition: "background 0.2s ease", padding: 0 }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "11px", background: "#fff", position: "absolute", top: "3px", left: isModelHidden ? "3px" : "27px", transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
              </button>
            </div>
          );
        })()}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input type="text" placeholder="Add new item..." value={newFlavor} onChange={e => setNewFlavor(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && newFlavor.trim()) { addFlavorToModel(m.id, newFlavor); setNewFlavor(""); } }}
            style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
          <button onClick={() => { if (newFlavor.trim()) { addFlavorToModel(m.id, newFlavor); setNewFlavor(""); } }}
            style={{ padding: "12px 18px", borderRadius: "10px", border: "none", background: newFlavor.trim() ? "#1DB954" : "#ffffff10", color: newFlavor.trim() ? "#fff" : "#ffffff25", fontSize: "13px", fontWeight: 700, cursor: newFlavor.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>+ Add</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ color: "#ffffff30", fontSize: "12px", fontWeight: 600 }}>{trackedCount}/{(m.flavors || []).length} tracked • {totalStock} total</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => { const val = prompt("Set all flavors to this stock count:"); if (val !== null) bulkSetStock(m.id, val); }}
              style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #00B4D830", background: "#00B4D810", color: "#00B4D8", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Set All</button>
          </div>
        </div>
        {/* Cost & Retail Pricing — manager only, hidden unless cost mode active */}
        {canSeeCostMargin && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", padding: "14px 16px", borderRadius: "10px", background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.1)" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "10px", color: "#FF6B35", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Cost Price</label>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#ffffff30", fontSize: "14px", fontWeight: 700 }}>$</span>
              <input type="number" inputMode="decimal" step="0.01" value={m.cost_price ?? ""} placeholder="0.00"
                onChange={e => {
                  const val = e.target.value === "" ? null : parseFloat(e.target.value);
                  setCatalog(p => p.map(c => c.id === m.id ? { ...c, cost_price: val } : c));
                  clearTimeout(window._costTimer); window._costTimer = setTimeout(() => { orgSb.patch("catalog", { cost_price: val }, `id=eq.${m.id}`); }, 800);
                }}
                onFocus={e => e.target.select()}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ffffff15", background: "rgba(255,255,255,0.04)", color: "#FF6B35", fontSize: "16px", fontWeight: 800, outline: "none" }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "10px", color: "#1DB954", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Retail Price</label>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#ffffff30", fontSize: "14px", fontWeight: 700 }}>$</span>
              <input type="number" inputMode="decimal" step="0.01" value={m.retail_price ?? ""} placeholder="0.00"
                onChange={e => {
                  const val = e.target.value === "" ? null : parseFloat(e.target.value);
                  setCatalog(p => p.map(c => c.id === m.id ? { ...c, retail_price: val } : c));
                  clearTimeout(window._retailTimer); window._retailTimer = setTimeout(() => { orgSb.patch("catalog", { retail_price: val }, `id=eq.${m.id}`); }, 800);
                }}
                onFocus={e => e.target.select()}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ffffff15", background: "rgba(255,255,255,0.04)", color: "#1DB954", fontSize: "16px", fontWeight: 800, outline: "none" }} />
            </div>
          </div>
          {m.cost_price > 0 && m.retail_price > 0 && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minWidth: "60px" }}>
              <span style={{ fontSize: "10px", color: "#ffffff30", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Margin</span>
              <span style={{ fontSize: "18px", fontWeight: 900, color: ((m.retail_price - m.cost_price) / m.retail_price * 100) >= 30 ? "#1DB954" : "#F59E0B" }}>
                {Math.round((m.retail_price - m.cost_price) / m.retail_price * 100)}%
              </span>
            </div>
          )}
        </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(m.flavors || []).map(f => {
            const isHidden = hiddenForThis.includes(f);
            const stock = warehouseStock[f];
            const hasStock = stock !== undefined && stock !== null;
            const stockVal = hasStock ? parseInt(stock) : null;
            const isOut = hasStock && stockVal <= 0;
            return (
              <div key={f} style={{ padding: "10px 14px", borderRadius: "8px", background: isHidden ? "rgba(255,255,255,0.01)" : isOut ? "rgba(230,57,70,0.05)" : "rgba(255,255,255,0.025)", border: `1px solid ${isHidden ? "#ffffff05" : isOut ? "#E6394615" : "#ffffff08"}`, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s ease" }}>
                <span style={{ color: isHidden ? "#ffffff20" : isOut ? "#E63946" : "#fff", fontSize: "13px", fontWeight: 600, textDecoration: isHidden ? "line-through" : "none", flex: 1 }}>{f}</span>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
                  {!isHidden && (
                    <input type="number" inputMode="numeric" value={hasStock ? stockVal : ""} placeholder="—"
                      onChange={e => updateFlavorStock(m.id, f, e.target.value)}
                      onFocus={e => e.target.select()}
                      style={{ width: "56px", padding: "6px 8px", borderRadius: "6px", border: `1px solid ${isOut ? "#E6394640" : hasStock ? "#1DB95430" : "#ffffff15"}`, background: isOut ? "#E6394610" : hasStock ? "#1DB95408" : "transparent", color: isOut ? "#E63946" : hasStock ? "#1DB954" : "#ffffff30", fontSize: "14px", fontWeight: 800, textAlign: "center", outline: "none" }} />
                  )}
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
          <button onClick={() => { if (window.confirm(`Remove ${m.model_name} from ${mgrWarehouse?.name || "this warehouse"}? Other warehouses won't be affected.`)) deleteModel(m.id); }}
            style={{ padding: "10px 18px", borderRadius: "8px", background: "#E63946", color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Remove from {mgrWarehouse?.name || "Warehouse"}</button>
        </div>
        <div style={{ height: "70px" }} />
        <FloatingBack onClick={() => { flushStock(); setMgrView("catalog"); setEditModel(null); setEditingModelInfo(false); }} />
      </div>
    );
  }

  // RECEIVE STOCK
  if (view === "manager" && authed && isManagerOrExec && mgrView === "receive") {
    const wid = mgrWarehouse ? String(mgrWarehouse.id) : null;
    const availableModels = catalog.filter(c => {
      if (!wid) return true;
      const hidden = (c.warehouse_visibility || {})[wid] || [];
      return !hidden.includes("__ALL__");
    }).sort((a, b) => a.model_name.localeCompare(b.model_name));

    const receiveTotal = Object.values(receiveQtys).reduce((s, v) => s + (parseInt(v) || 0), 0);

    const handleReceive = async () => {
      if (!receiveModel || receiveTotal === 0) return;
      const m = catalog.find(c => c.id === receiveModel.id) || receiveModel;
      const sl = { ...(m.stock_levels || {}) };
      const ws = { ...(sl[wid] || {}) };
      const items = {};
      Object.entries(receiveQtys).forEach(([flavor, qty]) => {
        const q = parseInt(qty) || 0;
        if (q > 0) {
          ws[flavor] = (parseInt(ws[flavor]) || 0) + q;
          items[flavor] = q;
        }
      });
      sl[wid] = ws;
      try {
        await orgSb.patch("catalog", { stock_levels: sl }, `id=eq.${m.id}`);
        await orgSb.post("shipments", {
          warehouse_id: mgrWarehouse.id,
          model_id: m.id,
          model_name: m.model_name,
          items,
          total_units: receiveTotal,
          received_by: accessLevel,
          notes: receiveNotes.trim() || null,
        });
        setCatalog(p => p.map(c => c.id === m.id ? { ...c, stock_levels: sl } : c));
        sndAdd();
        setReceiveModel(null); setReceiveQtys({}); setReceiveNotes("");
        // Refresh shipment history
        orgSb.get("shipments", { order: "created_at.desc", filter: `warehouse_id=eq.${mgrWarehouse.id}`, limit: 20 }).then(d => setRecentShipments(d || []));
      } catch (e) { console.error(e); alert("Error receiving stock. Check connection."); }
    };

    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setMgrView("dashboard"); setReceiveModel(null); setReceiveQtys({}); }} style={st.back}>← Back to Dashboard</button>
        <h1 style={st.h1}>📥 Receive Stock</h1>
        <p style={st.sub}>Log incoming inventory for {mgrWarehouse?.name}</p>

        {!receiveModel ? (
          <>
          <div style={{ marginBottom: "16px" }}>
            {/* Search bar */}
            <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#0B0B0F", paddingBottom: "12px" }}>
              <input type="text" placeholder="🔍 Search products..." value={receiveSearch} onChange={e => setReceiveSearch(e.target.value)}
                style={{ ...st.input, fontSize: "14px", padding: "14px 16px", background: "rgba(29,185,84,0.06)", border: "1px solid #1DB95425", color: "#fff" }} />
              {receiveSearch && (
                <div style={{ fontSize: "11px", color: "#1DB95480", marginTop: "6px", fontWeight: 600 }}>
                  {availableModels.filter(m => m.model_name.toLowerCase().includes(receiveSearch.toLowerCase()) || (m.brand || "").toLowerCase().includes(receiveSearch.toLowerCase()) || (m.category || "").toLowerCase().includes(receiveSearch.toLowerCase())).length} results
                </div>
              )}
            </div>
            {(() => {
              const q = receiveSearch.toLowerCase().trim();
              const isSearching = q.length > 0;
              const filtered = q ? availableModels.filter(m => 
                m.model_name.toLowerCase().includes(q) || 
                (m.brand || "").toLowerCase().includes(q) || 
                (m.category || "").toLowerCase().includes(q) ||
                (m.flavors || []).some(f => f.toLowerCase().includes(q))
              ) : availableModels;
              const catBrands = {};
              filtered.forEach(m => {
                const cat = m.category || "Other";
                const br = m.brand || "Unknown";
                if (!catBrands[cat]) catBrands[cat] = {};
                if (!catBrands[cat][br]) catBrands[cat][br] = [];
                catBrands[cat][br].push(m);
              });
              const sortedCats = Object.keys(catBrands).sort();
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {sortedCats.map(cat => {
                    const catOpen = isSearching || receiveExpCats[cat];
                    const catModels = Object.values(catBrands[cat]).flat();
                    const catStock = catModels.reduce((s, m) => { const mws = wid ? ((m.stock_levels || {})[wid] || {}) : {}; return s + Object.values(mws).reduce((a, v) => a + (parseInt(v) || 0), 0); }, 0);
                    return (
                    <div key={cat}>
                      <button onClick={() => { if (!isSearching) setReceiveExpCats(p => ({ ...p, [cat]: !p[cat] })); }}
                        style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "rgba(29,185,84,0.06)", border: "1px solid #1DB95418", marginBottom: "4px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: "#1DB954", fontSize: "13px", transition: "transform 0.2s", transform: catOpen ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>›</span>
                          <span style={{ color: "#1DB954", fontSize: "12px", fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase" }}>{cat}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: "#ffffff20", fontSize: "10px", fontWeight: 600 }}>{catModels.length} products</span>
                          <span style={{ color: catStock > 0 ? "#1DB95460" : "#ffffff15", fontSize: "10px", fontWeight: 700 }}>{catStock}u</span>
                        </div>
                      </button>
                      {catOpen && Object.keys(catBrands[cat]).sort().map(brand => {
                        const bColor = getBrandColor(brand);
                        const brandKey = `${cat}||${brand}`;
                        const brandOpen = isSearching || receiveExpBrands[brandKey];
                        const brandModels = catBrands[cat][brand];
                        const brandStock = brandModels.reduce((s, m) => { const mws = wid ? ((m.stock_levels || {})[wid] || {}) : {}; return s + Object.values(mws).reduce((a, v) => a + (parseInt(v) || 0), 0); }, 0);
                        return (
                        <div key={brand} style={{ paddingLeft: "12px" }}>
                          <button onClick={() => { if (!isSearching) setReceiveExpBrands(p => ({ ...p, [brandKey]: !p[brandKey] })); }}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: `${bColor}08`, border: `1px solid ${bColor}12`, marginBottom: "3px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", borderLeft: `3px solid ${bColor}40` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ color: bColor, fontSize: "12px", transition: "transform 0.2s", transform: brandOpen ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>›</span>
                              <span style={{ color: bColor, fontSize: "12px", fontWeight: 700 }}>{brand}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ color: "#ffffff20", fontSize: "10px" }}>{brandModels.length}</span>
                              <span style={{ color: brandStock > 0 ? "#1DB95460" : "#ffffff15", fontSize: "10px", fontWeight: 700 }}>{brandStock}u</span>
                            </div>
                          </button>
                          {brandOpen && brandModels.map(m => {
                            const mws = wid ? ((m.stock_levels || {})[wid] || {}) : {};
                            const mStock = Object.values(mws).reduce((s, v) => s + (parseInt(v) || 0), 0);
                            return (
                              <button key={m.id} onClick={() => { setReceiveModel(m); setReceiveQtys({}); setReceiveNotes(""); setReceiveSearch(""); setReceiveExpCats({}); setReceiveExpBrands({}); }}
                                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: `1px solid ${bColor}10`, background: `${bColor}05`, color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px", marginLeft: "12px", maxWidth: "calc(100% - 12px)" }}>
                                <div>
                                  <span>{m.model_name}</span>
                                  <span style={{ color: "#ffffff20", fontSize: "10px", marginLeft: "6px" }}>{(m.flavors || []).length}fl</span>
                                </div>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: mStock > 0 ? "#1DB954" : "#ffffff20" }}>{mStock}u</span>
                              </button>
                            );
                          })}
                        </div>
                        );
                      })}
                    </div>
                    );
                  })}
                  {sortedCats.length === 0 && <div style={{ padding: "24px", textAlign: "center", color: "#ffffff25", fontSize: "13px" }}>No products match "{receiveSearch}"</div>}
                </div>
              );
            })()}
          </div>

          {/* Recent shipments */}
          {recentShipments.length > 0 && (
            <div style={{ marginTop: "24px", borderTop: "1px solid #ffffff08", paddingTop: "16px" }}>
              <span style={{ color: "#ffffff40", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>📋 Recent Receives</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
                {recentShipments.map(s => (
                  <div key={s.id} style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(29,185,84,0.04)", border: "1px solid #1DB95415" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>{s.model_name}</span>
                        <span style={{ color: "#1DB954", fontSize: "12px", fontWeight: 700, marginLeft: "8px" }}>+{s.total_units}u</span>
                      </div>
                      <span style={{ color: "#ffffff25", fontSize: "11px" }}>{timeAgo(s.created_at)}</span>
                    </div>
                    {s.notes && <div style={{ color: "#ffffff30", fontSize: "11px", marginTop: "4px", fontStyle: "italic" }}>{s.notes}</div>}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                      {Object.entries(s.items || {}).map(([f, q]) => (
                        <span key={f} style={{ padding: "2px 8px", borderRadius: "4px", background: "#1DB95410", color: "#1DB95490", fontSize: "10px", fontWeight: 600 }}>{f} +{q}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </>
        ) : (
          <>
          <div style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(29,185,84,0.06)", border: "1px solid #1DB95420", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#fff" }}>{receiveModel.model_name}</div>
              <div style={{ fontSize: "11px", color: "#ffffff30", marginTop: "2px" }}>{receiveModel.brand} • {(receiveModel.flavors || []).length} flavors</div>
            </div>
            <button onClick={() => { setReceiveModel(null); setReceiveQtys({}); }} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #ffffff15", background: "transparent", color: "#ffffff40", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Change</button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ color: "#ffffff30", fontSize: "12px", fontWeight: 600 }}>Enter quantities received</span>
            <button onClick={() => {
              const val = prompt("Set all flavors to this receive quantity:");
              if (val !== null) {
                const q = parseInt(val) || 0;
                const bulk = {};
                (receiveModel.flavors || []).forEach(f => { if (q > 0) bulk[f] = String(q); });
                setReceiveQtys(bulk);
              }
            }} style={{ padding: "4px 12px", borderRadius: "6px", border: "1px solid #1DB95430", background: "#1DB95410", color: "#1DB954", fontSize: "10px", fontWeight: 700, cursor: "pointer" }}>Set All</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "400px", overflowY: "auto", marginBottom: "16px" }}>
            {(receiveModel.flavors || []).map(f => {
              const currentStock = wid ? (parseInt(((receiveModel.stock_levels || {})[wid] || {})[f]) || 0) : 0;
              const addQty = parseInt(receiveQtys[f]) || 0;
              return (
                <div key={f} style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.025)", border: "1px solid #ffffff08", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{f}</span>
                    <span style={{ color: "#ffffff20", fontSize: "11px", marginLeft: "8px" }}>{currentStock} now{addQty > 0 ? ` → ${currentStock + addQty}` : ""}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: "#1DB954", fontSize: "13px", fontWeight: 700 }}>+</span>
                    <input type="number" inputMode="numeric" value={receiveQtys[f] || ""} placeholder="0"
                      onChange={e => setReceiveQtys(p => ({ ...p, [f]: e.target.value }))}
                      onFocus={e => e.target.select()}
                      style={{ width: "56px", padding: "6px 8px", borderRadius: "6px", border: "1px solid #1DB95430", background: "#1DB95408", color: "#1DB954", fontSize: "14px", fontWeight: 800, textAlign: "center", outline: "none" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <input type="text" placeholder="Notes (optional — e.g. 'Tuesday shipment from dist')" value={receiveNotes} onChange={e => setReceiveNotes(e.target.value)}
              style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
          </div>

          {receiveTotal > 0 && (
            <div style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(29,185,84,0.08)", border: "1px solid #1DB95425", marginBottom: "16px", textAlign: "center" }}>
              <span style={{ color: "#1DB954", fontSize: "22px", fontWeight: 900 }}>+{receiveTotal}</span>
              <span style={{ color: "#1DB95480", fontSize: "12px", fontWeight: 600, marginLeft: "8px" }}>units to receive</span>
            </div>
          )}

          <button onClick={handleReceive} disabled={receiveTotal === 0}
            style={{ width: "100%", padding: "18px 24px", borderRadius: "14px", border: "none", fontSize: "16px", fontWeight: 800, cursor: receiveTotal > 0 ? "pointer" : "not-allowed", textAlign: "center", background: receiveTotal > 0 ? "#1DB954" : "#ffffff10", color: receiveTotal > 0 ? "#fff" : "#ffffff25", boxShadow: receiveTotal > 0 ? "0 4px 20px rgba(29,185,84,0.3)" : "none" }}>
            Receive Shipment →
          </button>
          </>
        )}

        <div style={{ height: "70px" }} />
        <FloatingBack onClick={() => { setMgrView("dashboard"); setReceiveModel(null); setReceiveQtys({}); }} />
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
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button onClick={loadMgr} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ffffff15", background: "transparent", color: "#ffffff50", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>🔄 Refresh</button>
          {(isManagerOrExec || accessLevel === "owner") && <button onClick={() => setMgrView("catalog")} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #6C5CE730", background: "#6C5CE710", color: "#6C5CE7", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>🗂️ Catalog</button>}
          {isManagerOrExec && <button onClick={() => { setMgrView("analytics"); loadAnalytics(analyticsRange); }} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #00B4D830", background: "#00B4D810", color: "#00B4D8", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>📈 Analytics</button>}
          {isManagerOrExec && <button onClick={() => { setReceiveModel(null); setReceiveQtys({}); setReceiveNotes(""); setMgrView("receive"); orgSb.get("shipments", { order: "created_at.desc", filter: `warehouse_id=eq.${mgrWarehouse.id}`, limit: 20 }).then(d => setRecentShipments(d || [])); }} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #1DB95430", background: "#1DB95410", color: "#1DB954", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>📥 Receive</button>}
        </div>

        {/* NEGATIVE STOCK ALERTS */}
        {isManagerOrExec && (() => {
          const wid = mgrWarehouse ? String(mgrWarehouse.id) : null;
          if (!wid) return null;
          const negItems = [];
          catalog.forEach(c => {
            const hidden = (c.warehouse_visibility || {})[wid] || [];
            if (hidden.includes("__ALL__")) return;
            const ws = (c.stock_levels || {})[wid] || {};
            (c.flavors || []).forEach(f => {
              if (hidden.includes(f)) return;
              const stock = parseInt(ws[f]);
              if (!isNaN(stock) && stock < 0) negItems.push({ model: c.model_name, flavor: f, stock });
            });
          });
          if (negItems.length === 0) return null;
          return (
            <div style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(230,57,70,0.08)", border: "1px solid #E6394625", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px" }}>🚨</span>
                <span style={{ color: "#E63946", fontSize: "11px", fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase" }}>Oversold ({negItems.length})</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {negItems.slice(0, 12).map((item, i) => (
                  <span key={i} style={{ padding: "4px 8px", borderRadius: "6px", background: "#E6394615", border: "1px solid #E6394620", fontSize: "10px", fontWeight: 700, color: "#E63946" }}>
                    {item.flavor} <span style={{ opacity: 0.7 }}>{item.stock}</span>
                  </span>
                ))}
                {negItems.length > 12 && <span style={{ padding: "4px 8px", fontSize: "10px", color: "#E6394680" }}>+{negItems.length - 12} more</span>}
              </div>
            </div>
          );
        })()}

        {/* PENDING ORDERS — hero section */}
        <div style={{ marginBottom: "8px" }}><span style={{ color: "#ffffff60", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Pending Restock Requests</span></div>
        {reports.length === 0 && !loading && <div style={{ padding: "24px", textAlign: "center", borderRadius: "12px", border: "1px dashed #ffffff12", marginBottom: "20px" }}><p style={{ color: "#ffffff30", fontSize: "14px", margin: 0 }}>No pending orders</p></div>}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
          {reports.map(r => {
            // Count stock warnings in this order
            const wid = mgrWarehouse ? String(mgrWarehouse.id) : null;
            let warningCount = 0;
            const warningFlavors = [];
            if (wid) {
              Object.entries(r.items || {}).forEach(([key]) => {
                const [product, flavor] = key.split("|||");
                const model = catalogObj[product];
                if (model) {
                  const stock = parseInt(((model.stock_levels || {})[wid] || {})[flavor]);
                  if (!isNaN(stock) && stock <= 0) { warningCount++; warningFlavors.push({ flavor, stock }); }
                }
              });
            }
            return (
            <div key={r.id} style={{ padding: "16px", borderRadius: "12px", border: warningCount > 0 ? "1px solid #E6394625" : "1px solid #ffffff0a", background: warningCount > 0 ? "rgba(230,57,70,0.04)" : "rgba(255,255,255,0.025)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ cursor: "pointer", flex: 1 }} onClick={() => setSelReport(r)}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{r.employee_name}</div>
                <div style={{ fontSize: "12px", color: "#ffffff35" }}>{r.store_location} • {fmtTime(r.created_at)} • {timeAgo(r.created_at)}</div>
                {warningCount > 0 && (
                  <div style={{ marginTop: "6px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {warningFlavors.slice(0, 5).map((w, i) => (
                        <span key={i} style={{ padding: "2px 6px", borderRadius: "4px", background: "#E6394615", fontSize: "9px", fontWeight: 700, color: "#E63946" }}>
                          {w.flavor} {w.stock < 0 ? w.stock : "OUT"}
                        </span>
                      ))}
                      {warningFlavors.length > 5 && <span style={{ fontSize: "9px", color: "#E6394680", padding: "2px 4px" }}>+{warningFlavors.length - 5} more</span>}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ padding: "4px 10px", borderRadius: "6px", background: "#FF6B3518", color: "#FF6B35", fontSize: "11px", fontWeight: 700 }}>{r.total_flavors} • ~{r.total_units}u</span>
                <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Cancel ${r.employee_name}'s order? Stock will be restored.`)) cancelSubmission(r); }}
                  style={{ background: "none", border: "1px solid #E6394630", borderRadius: "6px", color: "#E63946", fontSize: "12px", cursor: "pointer", padding: "4px 8px", fontWeight: 700 }}>✕</button>
              </div>
            </div>
            );
          })}
        </div>

        {/* SETTINGS — visually separated */}
        {isManagerOrExec && <>
        <div style={{ borderTop: "1px solid #ffffff08", paddingTop: "20px" }}>
          {/* Banner */}
          <div style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid #ffffff08", background: "rgba(255,255,255,0.015)", marginBottom: "12px" }}>
          {(() => { const wid = mgrWarehouse?.id || 1; const bd = bannerData[wid] || { message: "", active: false }; const bannerText = bd.message; const bannerOn = bd.active; return (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editBanner ? "12px" : "0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "14px" }}>📢</span><span style={{ color: "#FF6B35", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Banner</span></div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button onClick={toggleBanner} style={{ padding: "4px 10px", borderRadius: "20px", border: "none", fontSize: "10px", fontWeight: 700, cursor: "pointer", background: bannerOn ? "#1DB95425" : "#ffffff10", color: bannerOn ? "#1DB954" : "#ffffff30" }}>{bannerOn ? "ON" : "OFF"}</button>
              <button onClick={() => { setEditBanner(!editBanner); setBannerInput(bannerText); }} style={{ padding: "4px 10px", borderRadius: "20px", border: "1px solid #ffffff12", background: "transparent", color: "#ffffff40", fontSize: "10px", fontWeight: 700, cursor: "pointer" }}>{editBanner ? "Cancel" : "Edit"}</button>
            </div>
          </div>
          {!editBanner && bannerText && <div style={{ color: "#ffffff50", fontSize: "12px", marginTop: "6px", fontStyle: "italic" }}>"{bannerText}"</div>}
          {editBanner && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <textarea value={bannerInput} onChange={e => setBannerInput(e.target.value)} placeholder="Type message..." rows={2} style={{ ...st.input, fontSize: "13px", padding: "12px 14px", resize: "vertical", minHeight: "60px", fontFamily: "inherit" }} />
              <button onClick={saveBanner} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: bannerInput.trim() ? "#FF6B35" : "#ffffff10", color: bannerInput.trim() ? "#fff" : "#ffffff25", fontSize: "13px", fontWeight: 700, cursor: bannerInput.trim() ? "pointer" : "not-allowed", alignSelf: "flex-end" }}>Save & Broadcast</button>
            </div>
          )}
          </>); })()}
          </div>

          {/* Still Waiting */}
          <div style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid #ffffff08", background: "rgba(255,255,255,0.015)", marginBottom: "12px" }}>
          <div style={{ marginBottom: "8px" }}><span style={{ color: "#E63946", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>⏳ Still Waiting ({pending.length})</span></div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: pending.length > 0 ? "10px" : "0" }}>
            {pending.map(s => (<span key={s.id} style={{ padding: "6px 10px", borderRadius: "8px", background: "rgba(230,57,70,0.07)", border: "1px solid #E6394620", fontSize: "11px", fontWeight: 600, color: "#E63946", display: "flex", alignItems: "center", gap: "6px" }}>{s.name}<button onClick={() => removeStore(s.id)} style={{ background: "none", border: "none", color: "#E6394680", cursor: "pointer", fontSize: "10px", padding: "0 2px" }}>✕</button></span>))}
            {pending.length === 0 && stores.length > 0 && <span style={{ color: "#1DB954", fontSize: "11px", fontWeight: 600 }}>✓ All stores submitted!</span>}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" placeholder="Add store..." value={newStore} onChange={e => setNewStore(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addStore(); }} style={{ ...st.input, fontSize: "12px", padding: "10px 14px" }} />
            <button onClick={addStore} style={{ padding: "10px 16px", borderRadius: "10px", border: "none", background: newStore.trim() ? "#E63946" : "#ffffff10", color: newStore.trim() ? "#fff" : "#ffffff25", fontSize: "12px", fontWeight: 700, cursor: newStore.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>+ Add</button>
          </div>
          </div>
        </div>

        {allSugs.length > 0 && (
          <div style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid #6C5CE715", background: "#6C5CE705" }}>
            <span style={{ color: "#6C5CE7", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>💡 Suggestions ({allSugs.length})</span>
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
        </>}
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
    const hasAdjustments = Object.keys(adjustedQtys).length > 0;
    const togglePick = (key) => { setPickedItems(p => ({ ...p, [key]: !p[key] })); };
    const adjustQty = (itemKey, newVal) => {
      const origQty = r.items[itemKey];
      const origNum = origQty === "5+" ? 5 : parseInt(origQty) || 0;
      const newNum = Math.max(0, parseInt(newVal) || 0);
      if (newNum === origNum) {
        setAdjustedQtys(p => { const n = { ...p }; delete n[itemKey]; return n; });
      } else {
        setAdjustedQtys(p => ({ ...p, [itemKey]: String(newNum) }));
      }
    };
    // Calculate adjusted totals
    let adjTotalUnits = 0;
    entries.forEach(([key, qty]) => {
      const adjQty = adjustedQtys[key];
      const num = adjQty !== undefined ? parseInt(adjQty) : (qty === "5+" ? 5 : parseInt(qty) || 0);
      adjTotalUnits += num;
    });
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setSelReport(null); setPickedItems({}); setAdjustedQtys({}); }} style={st.back}>← Back to Dashboard</button>
        <h2 style={st.h2}>{r.employee_name}'s Request</h2>
        <p style={{ color: "#ffffff45", fontSize: "13px", margin: "4px 0 20px 0" }}>{r.store_location} • {fmtTime(r.created_at)}</p>
        <div style={{ padding: "20px", borderRadius: "14px", marginBottom: "12px", background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(230,57,70,0.08))", border: "1px solid #FF6B3520", display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <div><div style={{ fontSize: "28px", fontWeight: 900, color: "#FF6B35", lineHeight: 1 }}>{r.total_flavors}</div><div style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B35", marginTop: "4px", opacity: 0.7 }}>ITEMS</div></div>
          <div style={{ width: "1px", background: "#ffffff10" }}></div>
          <div><div style={{ fontSize: "28px", fontWeight: 900, color: hasAdjustments ? "#F59E0B" : "#E63946", lineHeight: 1 }}>{hasAdjustments ? adjTotalUnits : `~${r.total_units}`}</div><div style={{ fontSize: "11px", fontWeight: 700, color: hasAdjustments ? "#F59E0B" : "#E63946", marginTop: "4px", opacity: 0.7 }}>{hasAdjustments ? "ADJUSTED" : "TOTAL UNITS"}</div></div>
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
        <p style={{ color: "#ffffff25", fontSize: "11px", margin: "0 0 16px 0", textAlign: "center" }}>Tap items to mark as picked • tap quantity to adjust</p>
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
                  const itemKey = `${product}|||${flavor}`;
                  const picked = pickedItems[key];
                  const origNum = qty === "5+" ? 5 : parseInt(qty) || 0;
                  const adjVal = adjustedQtys[itemKey];
                  const isAdjusted = adjVal !== undefined;
                  const displayQty = isAdjusted ? adjVal : qty;
                  const col = picked ? "#1DB954" : isAdjusted ? "#F59E0B" : getQtyColor(qty);
                  // Stock check for warnings
                  const model = catalogObj[product];
                  const wid = mgrWarehouse ? String(mgrWarehouse.id) : null;
                  const currentStock = model && wid ? (parseInt(((model.stock_levels || {})[wid] || {})[flavor]) || 0) : null;
                  const isNeg = currentStock !== null && currentStock < 0;
                  const isOut = currentStock !== null && currentStock === 0;
                  return (
                    <div key={flavor} style={{ padding: picked ? "6px 12px" : "10px 12px", borderRadius: "8px", background: picked ? "rgba(29,185,84,0.06)" : isNeg ? "rgba(230,57,70,0.08)" : isAdjusted ? "rgba(245,158,11,0.06)" : "rgba(0,0,0,0.25)", border: picked ? "1px solid #1DB95415" : isNeg ? "1px solid #E6394625" : isAdjusted ? "1px solid #F59E0B20" : "1px solid transparent", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s ease", opacity: picked ? 0.5 : 1, order: picked ? 1 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, cursor: "pointer" }} onClick={() => togglePick(key)}>
                        <span style={{ width: "22px", height: "22px", borderRadius: "6px", border: picked ? "2px solid #1DB954" : "2px solid #ffffff20", background: picked ? "#1DB954" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", flexShrink: 0, transition: "all 0.2s ease" }}>{picked ? "✓" : ""}</span>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ color: picked ? "#ffffff40" : "#fff", fontSize: "13px", fontWeight: 600, textDecoration: picked ? "line-through" : "none", transition: "all 0.2s ease" }}>{flavor}</span>
                          {!picked && isNeg && <span style={{ color: "#E63946", fontSize: "9px", fontWeight: 800, marginTop: "1px" }}>⚠ STOCK {currentStock} — OVERSOLD</span>}
                          {!picked && isOut && <span style={{ color: "#F59E0B", fontSize: "9px", fontWeight: 800, marginTop: "1px" }}>⚠ OUT OF STOCK</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                        <button onClick={(e) => { e.stopPropagation(); adjustQty(itemKey, (isAdjusted ? parseInt(adjVal) : origNum) - 1); }}
                          style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #ffffff15", background: "rgba(255,255,255,0.05)", color: "#ffffff60", fontSize: "16px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>−</button>
                        <span style={{ fontSize: "18px", fontWeight: 800, color: col, minWidth: "32px", textAlign: "center", opacity: picked ? 0.4 : 1, transition: "opacity 0.2s ease" }}>{displayQty}</span>
                        <button onClick={(e) => { e.stopPropagation(); adjustQty(itemKey, (isAdjusted ? parseInt(adjVal) : origNum) + 1); }}
                          style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #ffffff15", background: "rgba(255,255,255,0.05)", color: "#ffffff60", fontSize: "16px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={() => { 
            // Merge pick state: unchecked items get set to 0
            const finalAdj = { ...adjustedQtys };
            Object.entries(r.items || {}).forEach(([itemKey]) => {
              const pickKey = `${r.id}|||${itemKey}`;
              if (!pickedItems[pickKey]) {
                finalAdj[itemKey] = "0";
              }
            });
            const unpickedCount = Object.values(finalAdj).filter(v => v === "0").length;
            const adjCount = Object.keys(finalAdj).filter(k => finalAdj[k] !== undefined && finalAdj[k] !== r.items[k]).length;
            const totalEntries = Object.keys(r.items || {}).length;
            const pickedCount = totalEntries - unpickedCount;
            const msg = unpickedCount > 0 
              ? `Complete with ${pickedCount} of ${totalEntries} items? ${unpickedCount} unpicked item${unpickedCount > 1 ? "s" : ""} will be restored to stock.`
              : adjCount > 0 
                ? `Complete ${r.employee_name}'s order with ${adjCount} adjustment${adjCount > 1 ? "s" : ""}? Difference will be restored to stock.`
                : `Complete ${r.employee_name}'s order?`;
            if (window.confirm(msg)) { completeSubmission(r, finalAdj); }
          }}
            style={{ flex: 1, padding: "14px", borderRadius: "12px", border: `1px solid ${hasAdjustments ? "#F59E0B30" : "#1DB95430"}`, background: hasAdjustments ? "rgba(245,158,11,0.08)" : "rgba(29,185,84,0.08)", color: hasAdjustments ? "#F59E0B" : "#1DB954", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>{hasAdjustments ? "✅ Complete (Adjusted)" : "✅ Complete Order"}</button>
          <button onClick={() => { if (window.confirm(`Cancel ${r.employee_name}'s order? Stock will be restored.`)) { cancelSubmission(r); } }}
            style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid #E6394630", background: "rgba(230,57,70,0.05)", color: "#E63946", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>✕ Cancel Order</button>
        </div>
        <div style={{ height: "100px" }} />
        <FloatingBack onClick={() => { setSelReport(null); setPickedItems({}); setAdjustedQtys({}); }} />
      </div>
    );
  }

  return null;
}
