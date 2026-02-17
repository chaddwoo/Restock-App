import { useState, useEffect, useCallback } from "react";

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

export default function RestockApp() {
  const [view, setView] = useState("splash");
  const [empName, setEmpName] = useState("");
  const [storeLoc, setStoreLoc] = useState("");
  const [selProduct, setSelProduct] = useState(null);
  const [orderData, setOrderData] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selReport, setSelReport] = useState(null);
  const [bannerText, setBannerText] = useState("");
  const [bannerInput, setBannerInput] = useState("");
  const [bannerOn, setBannerOn] = useState(true);
  const [editBanner, setEditBanner] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reports, setReports] = useState([]);
  const [allSugs, setAllSugs] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStore, setNewStore] = useState("");
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
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

  const PIN = "2588";

  const catalogObj = {};
  catalog.forEach(c => { catalogObj[c.model_name] = { brand: c.brand, puffs: c.puffs, flavors: c.flavors || [], id: c.id, category: c.category || "Vapes" }; });

  // Get unique categories
  const categories = [...new Set(catalog.map(c => c.category || "Vapes"))].sort();

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
    try { const d = await sb.get("banner", { limit: 1, order: "id.asc" }); if (d && d[0]) { setBannerText(d[0].message || ""); setBannerOn(d[0].active); } } catch (e) { console.error(e); }
  }, []);

  const loadMgr = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const [subs, sugs, sl] = await Promise.all([
        sb.get("submissions", { order: "created_at.desc", filter: `created_at=gte.${today}T00:00:00` }),
        sb.get("suggestions", { order: "created_at.desc", filter: "status=eq.pending" }),
        sb.get("stores", { order: "name.asc" }),
      ]);
      setReports(subs || []); setAllSugs(sugs || []); setStores(sl || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { loadCatalog(); loadBanner(); }, [loadCatalog, loadBanner]);
  useEffect(() => { if (view === "manager" && authed) loadMgr(); }, [view, authed, loadMgr]);

  const submitOrder = async () => {
    setSubmitting(true);
    try {
      const items = Object.entries(orderData);
      let tu = 0; items.forEach(([, v]) => { tu += v === "5+" ? 5 : parseInt(v) || 0; });
      await sb.post("submissions", { employee_name: empName.trim(), store_location: storeLoc.trim(), items: orderData, total_flavors: items.length, total_units: tu });
      for (const sg of suggestions) { await sb.post("suggestions", { suggestion_text: sg.text, employee_name: sg.from, store_location: sg.store }); }
      sndSubmit(); setView("employee-done");
    } catch (e) { console.error(e); alert("Error submitting — check connection."); }
    setSubmitting(false);
  };

  // Sound effects — custom audio files
  const playSound = (src) => { try { const a = new Audio(process.env.PUBLIC_URL + src); a.volume = 0.5; a.play(); } catch (e) {} };
  const sndClick = () => playSound("/snd-click.wav");
  const sndBack = () => playSound("/snd-back.wav");
  const sndSubmit = () => playSound("/snd-submit.wav");
  const sndLogin = () => playSound("/snd-login.wav");
  const sndAdd = () => playSound("/snd-add.wav");
  const sndRemove = () => playSound("/snd-remove.wav");

  const deleteSubmission = async (id) => { try { await sb.del("submissions", `id=eq.${id}`); sndRemove(); setReports(p => p.filter(r => r.id !== id)); if (selReport && selReport.id === id) setSelReport(null); } catch (e) { console.error(e); } };
  const saveBanner = async () => { try { await sb.patch("banner", { message: bannerInput, active: true, updated_at: new Date().toISOString() }, "id=eq.1"); setBannerText(bannerInput); setBannerOn(true); setEditBanner(false); } catch (e) { console.error(e); } };
  const toggleBanner = async () => { try { await sb.patch("banner", { active: !bannerOn, updated_at: new Date().toISOString() }, "id=eq.1"); setBannerOn(!bannerOn); } catch (e) { console.error(e); } };
  const dismissSug = async (id) => { try { await sb.patch("suggestions", { status: "dismissed" }, `id=eq.${id}`); sndRemove(); setAllSugs(p => p.filter(s => s.id !== id)); } catch (e) { console.error(e); } };
  const approveSug = async (id) => { try { await sb.patch("suggestions", { status: "approved" }, `id=eq.${id}`); sndAdd(); setAllSugs(p => p.filter(s => s.id !== id)); } catch (e) { console.error(e); } };
  const addStore = async () => { if (!newStore.trim()) return; try { await sb.post("stores", { name: newStore.trim() }); sndAdd(); setNewStore(""); loadMgr(); } catch (e) { console.error(e); } };
  const removeStore = async (id) => { try { await sb.del("stores", `id=eq.${id}`); sndRemove(); setStores(p => p.filter(s => s.id !== id)); } catch (e) { console.error(e); } };

  const addFlavorToModel = async (modelId, flavor) => {
    const model = catalog.find(c => c.id === modelId); if (!model || !flavor.trim()) return;
    const updated = [...(model.flavors || []), flavor.trim()].sort();
    try { await sb.patch("catalog", { flavors: updated }, `id=eq.${modelId}`); sndAdd(); setCatalog(p => p.map(c => c.id === modelId ? { ...c, flavors: updated } : c)); } catch (e) { console.error(e); }
  };
  const removeFlavorFromModel = async (modelId, flavor) => {
    const model = catalog.find(c => c.id === modelId); if (!model) return;
    const updated = (model.flavors || []).filter(f => f !== flavor);
    try { await sb.patch("catalog", { flavors: updated }, `id=eq.${modelId}`); sndRemove(); setCatalog(p => p.map(c => c.id === modelId ? { ...c, flavors: updated } : c)); } catch (e) { console.error(e); }
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
  const getProductOrderCount = (name) => (catalogObj[name]?.flavors || []).filter(f => orderData[`${name}|||${f}`]).length;
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
    if (!bannerOn || !bannerText) return null;
    return (
      <div style={{ background: "linear-gradient(90deg, #FF6B35, #E63946, #FF6B35)", padding: "10px 0", marginBottom: "20px", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ display: "flex", animation: "scrollBanner 15s linear infinite", whiteSpace: "nowrap" }}>
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700, paddingRight: "80px" }}>{"⚠️ " + bannerText + " \u00A0\u00A0\u00A0 ⚠️ " + bannerText + " \u00A0\u00A0\u00A0 ⚠️ " + bannerText}</span>
        </div>
        <style>{`@keyframes scrollBanner { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }`}</style>
      </div>
    );
  };

  if (!catLoaded) return (<div style={{ ...st.page, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#ffffff40", fontSize: "14px" }}>Loading catalog...</p></div>);

  // SPLASH
  if (view === "splash") return (
    <div style={{ ...st.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "12px" }}>
      <div style={{ fontSize: "56px", marginBottom: "4px" }}>📦</div>
      <h1 style={{ color: "#fff", fontSize: "38px", fontWeight: 900, letterSpacing: "-2px", margin: 0 }}>RESTOCK</h1>
      <p style={{ color: "#ffffff35", fontSize: "12px", margin: 0, letterSpacing: "4px", textTransform: "uppercase" }}>Tell Us What You Need</p>
      <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        <button onClick={() => setView("employee-login")} style={st.btn}>🏪 Submit Restock Request</button>
        <button onClick={() => { setAuthed(false); setPin(""); setMgrView("dashboard"); setView("manager-login"); }} style={{ ...st.btn, background: "rgba(255,255,255,0.05)", border: "1px solid #ffffff15", boxShadow: "none" }}>📊 Manager Dashboard</button>
      </div>
      <p style={{ color: "#ffffff18", fontSize: "11px", marginTop: "60px", letterSpacing: "1px" }}>v2.1</p>
    </div>
  );

  // MANAGER LOGIN
  if (view === "manager-login") return (
    <div style={st.page}>
      <button onClick={() => { sndBack(); setView("splash"); }} style={st.back}>← Back</button>
      <h1 style={st.h1}>📊 Manager Access</h1><p style={st.sub}>Enter your PIN to continue</p>
      <div style={{ marginBottom: "24px" }}><label style={st.label}>Manager PIN</label>
        <input type="password" placeholder="Enter PIN" value={pin} onChange={e => setPin(e.target.value)} style={st.input} onKeyDown={e => { if (e.key === "Enter" && pin === PIN) { sndLogin(); setAuthed(true); setView("manager"); } }} />
      </div>
      {pin.length >= 4 && pin !== PIN && <p style={{ color: "#E63946", fontSize: "13px", marginBottom: "12px" }}>Incorrect PIN</p>}
      <button onClick={() => { if (pin === PIN) { sndLogin(); setAuthed(true); setView("manager"); } }} style={pin === PIN ? st.btn : st.btnOff} disabled={pin !== PIN}>Enter Dashboard →</button>
    </div>
  );

  // EMPLOYEE LOGIN
  if (view === "employee-login") {
    const ok = empName.trim().length > 0 && storeLoc.trim().length > 0;
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setView("splash"); }} style={st.back}>← Back</button><Banner />
        <h1 style={st.h1}>Restock Request</h1><p style={st.sub}>Enter your info to start your order</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div><label style={st.label}>Your Name</label><input type="text" placeholder="e.g. Marcus" value={empName} onChange={e => setEmpName(e.target.value)} style={st.input} /></div>
          <div><label style={st.label}>Store Location</label><input type="text" placeholder="e.g. Downtown, Eastside Mall" value={storeLoc} onChange={e => setStoreLoc(e.target.value)} style={st.input} /></div>
        </div>
        <button onClick={() => { if (ok) { sndLogin(); setView("employee-products"); } }} style={{ ...(ok ? st.btn : st.btnOff), marginTop: "32px" }} disabled={!ok}>Continue →</button>
      </div>
    );
  }

  // EMPLOYEE PRODUCTS — grouped by category then brand
  if (view === "employee-products") {
    const tu = getTotalUnits(); const ic = getFilledCount();
    // Group: category → brand → models
    const catBrands = {};
    Object.entries(catalogObj).forEach(([name, data]) => {
      const cat = data.category || "Vapes";
      if (!catBrands[cat]) catBrands[cat] = {};
      if (!catBrands[cat][data.brand]) catBrands[cat][data.brand] = [];
      catBrands[cat][data.brand].push(name);
    });
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setView("employee-login"); }} style={st.back}>← Back</button><Banner />
        <h2 style={st.h2}>What Do You Need?</h2>
        <p style={{ color: "#ffffff50", fontSize: "13px", margin: "0 0 16px 0" }}>{empName} • {storeLoc}</p>
        {ic > 0 && (
          <div style={{ padding: "14px 16px", borderRadius: "12px", marginBottom: "20px", background: "linear-gradient(135deg, rgba(255,107,53,0.1), rgba(230,57,70,0.1))", border: "1px solid #FF6B3525", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ color: "#FF6B35", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Current Request</div><div style={{ color: "#fff", fontSize: "14px", fontWeight: 600, marginTop: "2px" }}>{ic} item{ic > 1 ? "s" : ""} • ~{tu} units</div></div>
            <div style={{ color: "#FF6B35", fontSize: "24px", fontWeight: 900 }}>📋</div>
          </div>
        )}
        {Object.entries(catBrands).map(([cat, brands]) => (
          <div key={cat}>
            {Object.keys(catBrands).length > 1 && (
              <div style={{ padding: "8px 0", marginBottom: "8px", marginTop: "8px" }}>
                <span style={{ color: "#ffffff70", fontSize: "15px", fontWeight: 800, letterSpacing: "-0.3px" }}>{cat}</span>
              </div>
            )}
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
                          <div><div style={{ marginBottom: "3px" }}>{model}</div><div style={{ fontSize: "11px", color: "#ffffff30", fontWeight: 500 }}>{p.puffs !== "N/A" ? p.puffs + " puffs • " : ""}{p.flavors.length} items</div></div>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: o > 0 ? bc : "#ffffff25", whiteSpace: "nowrap" }}>{o > 0 ? `${o} requested` : "No requests"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: "12px", padding: "16px", borderRadius: "12px", border: "1px dashed #ffffff15", background: "rgba(255,255,255,0.015)" }}>
          <label style={{ ...st.label, marginBottom: "10px" }}>💡 Suggest a Product</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" placeholder="e.g. Funky Republic Ti7000" value={suggestion} onChange={e => setSuggestion(e.target.value)} style={{ ...st.input, fontSize: "13px", padding: "12px 14px" }} />
            <button onClick={() => { if (suggestion.trim()) { setSuggestions(p => [...p, { text: suggestion.trim(), from: empName, store: storeLoc }]); setSuggestion(""); } }}
              style={{ padding: "12px 18px", borderRadius: "10px", border: "none", background: suggestion.trim() ? "#FF6B35" : "#ffffff10", color: suggestion.trim() ? "#fff" : "#ffffff25", fontSize: "13px", fontWeight: 700, cursor: suggestion.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>Send</button>
          </div>
          {suggestions.map((sg, i) => (<div key={i} style={{ padding: "8px 12px", borderRadius: "8px", background: "#1DB95410", border: "1px solid #1DB95420", color: "#1DB954", fontSize: "12px", fontWeight: 600, marginTop: "6px" }}>✓ Suggested: {sg.text}</div>))}
        </div>
        {ic > 0 && <button onClick={submitOrder} disabled={submitting} style={{ ...(submitting ? st.btnOff : st.btn), marginTop: "24px" }}>{submitting ? "Submitting..." : `Submit Request (${ic} item${ic > 1 ? "s" : ""} • ~${tu} units) →`}</button>}
      </div>
    );
  }

  // EMPLOYEE FLAVORS
  if (view === "employee-flavors") {
    const p = catalogObj[selProduct]; const bc = getBrandColor(p.brand);
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setView("employee-products"); }} style={st.back}>← Back to Products</button>
        <span style={{ color: bc, fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>{p.brand}{p.puffs !== "N/A" ? ` • ${p.puffs} puffs` : ""}</span>
        <h2 style={{ ...st.h2, marginTop: "4px", marginBottom: "4px" }}>{selProduct}</h2>
        <p style={st.sub}>How many of each do you need?</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button onClick={() => p.flavors.forEach(f => { const key = `${selProduct}|||${f}`; setOrderData(prev => { const next = { ...prev }; delete next[key]; return next; }); })}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #ffffff15", background: "transparent", color: "#ffffff40", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Skip All</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {p.flavors.map(flavor => {
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
        <button onClick={() => setView("employee-products")} style={{ ...st.btn, marginTop: "20px" }}>← Save & Back</button>
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
        <button onClick={() => { setView("splash"); setOrderData({}); setEmpName(""); setStoreLoc(""); setSuggestions([]); }} style={{ ...st.btn, marginTop: "32px", background: "rgba(255,255,255,0.05)", border: "1px solid #ffffff15", boxShadow: "none", maxWidth: "360px" }}>Done</button>
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
        <h1 style={st.h1}>🗂️ Manage Catalog</h1><p style={st.sub}>Add or remove models and items</p>
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
                  {models.map(m => (
                    <button key={m.id} onClick={() => { setEditModel(m); setMgrView("editModel"); setNewFlavor(""); setEditingModelInfo(false); }}
                      style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #ffffff0a", background: "rgba(255,255,255,0.025)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div><div>{m.model_name}</div><div style={{ fontSize: "11px", color: "#ffffff30", marginTop: "2px" }}>{m.puffs !== "N/A" ? m.puffs + " puffs" : cat}</div></div>
                      <span style={{ fontSize: "12px", color: "#ffffff40" }}>{(m.flavors || []).length} items ›</span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // MANAGER EDIT MODEL
  if (view === "manager" && authed && mgrView === "editModel" && editModel) {
    const m = catalog.find(c => c.id === editModel.id) || editModel;
    const bc = getBrandColor(m.brand);
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
            <p style={st.sub}>{(m.flavors || []).length} items</p>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(m.flavors || []).map(f => (
            <div key={f} style={{ padding: "12px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.025)", border: "1px solid #ffffff08", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{f}</span>
              <button onClick={() => removeFlavorFromModel(m.id, f)} style={{ background: "none", border: "1px solid #E6394630", borderRadius: "6px", color: "#E63946", fontSize: "11px", fontWeight: 700, cursor: "pointer", padding: "4px 10px" }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "40px", padding: "16px", borderRadius: "12px", border: "1px solid #E6394630", background: "rgba(230,57,70,0.05)" }}>
          <p style={{ color: "#E63946", fontSize: "12px", fontWeight: 700, margin: "0 0 10px 0" }}>DANGER ZONE</p>
          <button onClick={() => { if (window.confirm(`Delete ${m.model_name} and all its items?`)) deleteModel(m.id); }}
            style={{ padding: "10px 18px", borderRadius: "8px", background: "#E63946", color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Delete Entire Model</button>
        </div>
      </div>
    );
  }

  // MANAGER DASHBOARD
  if (view === "manager" && authed && mgrView === "dashboard" && !selReport) {
    const pending = getPending();
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setView("splash"); setAuthed(false); }} style={st.back}>← Back</button>
        <h1 style={st.h1}>📊 Dashboard</h1><p style={st.sub}>{loading ? "Loading..." : `${reports.length} submission${reports.length !== 1 ? "s" : ""} today`}</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button onClick={loadMgr} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ffffff15", background: "transparent", color: "#ffffff50", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>🔄 Refresh</button>
          <button onClick={() => setMgrView("catalog")} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #6C5CE730", background: "#6C5CE710", color: "#6C5CE7", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>🗂️ Manage Catalog</button>
        </div>
        <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid #FF6B3530", background: "rgba(255,107,53,0.05)", marginBottom: "20px" }}>
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
        </div>
        <div style={{ marginBottom: "8px" }}><span style={{ color: "#ffffff60", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Today's Restock Requests</span></div>
        {reports.length === 0 && !loading && <div style={{ padding: "24px", textAlign: "center", borderRadius: "12px", border: "1px dashed #ffffff12", marginBottom: "20px" }}><p style={{ color: "#ffffff30", fontSize: "14px", margin: 0 }}>No submissions yet today</p></div>}
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
    return (
      <div style={st.page}>
        <button onClick={() => { sndBack(); setSelReport(null); }} style={st.back}>← Back to Dashboard</button>
        <h2 style={st.h2}>{r.employee_name}'s Request</h2>
        <p style={{ color: "#ffffff45", fontSize: "13px", margin: "4px 0 20px 0" }}>{r.store_location} • {fmtTime(r.created_at)}</p>
        <div style={{ padding: "20px", borderRadius: "14px", marginBottom: "20px", background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(230,57,70,0.08))", border: "1px solid #FF6B3520", display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <div><div style={{ fontSize: "28px", fontWeight: 900, color: "#FF6B35", lineHeight: 1 }}>{r.total_flavors}</div><div style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B35", marginTop: "4px", opacity: 0.7 }}>ITEMS</div></div>
          <div style={{ width: "1px", background: "#ffffff10" }}></div>
          <div><div style={{ fontSize: "28px", fontWeight: 900, color: "#E63946", lineHeight: 1 }}>~{r.total_units}</div><div style={{ fontSize: "11px", fontWeight: 700, color: "#E63946", marginTop: "4px", opacity: 0.7 }}>TOTAL UNITS</div></div>
        </div>
        {Object.entries(grp).map(([product, items]) => {
          const bn = catalogObj[product]?.brand; const bc = getBrandColor(bn);
          return (
            <div key={product} style={{ marginBottom: "20px", borderLeft: `4px solid ${bc}`, borderRadius: "12px", background: `${bc}08`, padding: "16px", paddingLeft: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ color: bc, fontSize: "14px", fontWeight: 800, letterSpacing: "0.3px" }}>{product}</span>
                <span style={{ color: bc, fontSize: "11px", fontWeight: 700, opacity: 0.6 }}>{items.length} item{items.length > 1 ? "s" : ""}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {items.sort((a, b) => (b.qty === "5+" ? 6 : parseInt(b.qty)) - (a.qty === "5+" ? 6 : parseInt(a.qty))).map(({ flavor, qty }) => {
                  const col = getQtyColor(qty);
                  return (<div key={flavor} style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(0,0,0,0.25)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{flavor}</span><span style={{ fontSize: "18px", fontWeight: 800, color: col, minWidth: "36px", textAlign: "right" }}>×{qty}</span></div>);
                })}
              </div>
            </div>
          );
        })}
        <button onClick={() => { if (window.confirm(`Remove ${r.employee_name}'s submission?`)) { deleteSubmission(r.id); } }}
          style={{ marginTop: "20px", width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E6394630", background: "rgba(230,57,70,0.05)", color: "#E63946", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>🗑️ Delete This Submission</button>
      </div>
    );
  }

  return null;
}
