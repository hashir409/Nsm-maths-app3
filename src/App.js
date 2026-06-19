import { useState, useRef, useEffect, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const XP_MAP = { Easy: 5, Medium: 10, Hard: 15 };
const HINT_FREE = 3;
const HINT_COST = 10;
const DC = { Easy: "#22C55E", Medium: "#F59E0B", Hard: "#EF4444" };
const DB = { Easy: "#052E16", Medium: "#1C1200", Hard: "#1C0000" };

// ─── BOOKS ───────────────────────────────────────────────────────────────────
const BOOKS = {
  D1:{label:"Book 1",subtitle:"Foundation",color:"#3B82F6",chapters:[
    {id:"1",title:"Primes, HCF and LCM",sections:[{id:"1.1",title:"Prime numbers"},{id:"1.2",title:"Square roots and cube roots"},{id:"1.3",title:"HCF and LCM"}]},
    {id:"2",title:"Fractions",sections:[{id:"2.1",title:"Fractions and mixed numbers"},{id:"2.2",title:"Adding and subtracting fractions"},{id:"2.3",title:"Multiplying fractions"},{id:"2.4",title:"Dividing fractions"}]},
    {id:"3",title:"Decimals",sections:[{id:"3.1",title:"Decimals and fractions"},{id:"3.2",title:"Operations with decimals"},{id:"3.3",title:"Unit conversions"}]},
    {id:"4",title:"Integers, Rational and Real Numbers",sections:[{id:"4.1",title:"Negative numbers"},{id:"4.2",title:"Adding/subtracting negative integers"},{id:"4.3",title:"Multiplying/dividing negative integers"},{id:"4.4",title:"Negative fractions"},{id:"4.5",title:"Negative decimals"},{id:"4.6",title:"Rational and irrational numbers"}]},
    {id:"5",title:"Approximation and Estimation",sections:[{id:"5.1",title:"Rounding and significant figures"},{id:"5.2",title:"Limits of accuracy"},{id:"5.3",title:"Approximation errors"},{id:"5.4",title:"Estimation in real-world contexts"}]},
    {id:"6",title:"Basic Algebra",sections:[{id:"6.1",title:"Algebraic concepts and notations"},{id:"6.2",title:"Adding and subtracting linear terms"},{id:"6.3",title:"Expansion and factorisation"},{id:"6.4",title:"Fractional coefficients"}]},
    {id:"7",title:"Linear Equations",sections:[{id:"7.1",title:"Linear equations"},{id:"7.2",title:"Fractional linear equations"},{id:"7.3",title:"Applications of linear equations"},{id:"7.4",title:"Mathematical formulae"}]},
    {id:"8",title:"Percentage",sections:[{id:"8.1",title:"Percentage"},{id:"8.2",title:"Percentage change and reverse percentage"}]},
    {id:"9",title:"Ratio and Rate",sections:[{id:"9.1",title:"Ratio"},{id:"9.2",title:"Rate"},{id:"9.3",title:"Speed"}]},
    {id:"10",title:"Basic Geometry",sections:[{id:"10.1",title:"Geometrical concepts"},{id:"10.2",title:"Angles from intersecting lines"},{id:"10.3",title:"Angles with parallel lines"}]},
    {id:"11",title:"Polygons and Constructions",sections:[{id:"11.1",title:"Triangles"},{id:"11.2",title:"Quadrilaterals"},{id:"11.3",title:"Geometrical constructions"},{id:"11.4",title:"Polygons"}]},
    {id:"12",title:"Perimeter and Area",sections:[{id:"12.1",title:"Unit conversion"},{id:"12.2",title:"Rectangles and triangles"},{id:"12.3",title:"Parallelograms"},{id:"12.4",title:"Trapeziums"},{id:"12.5",title:"Circles"}]},
    {id:"13",title:"Statistical Data Handling",sections:[{id:"13.1",title:"Frequency table"},{id:"13.2",title:"Pictogram"},{id:"13.3",title:"Bar graph"},{id:"13.4",title:"Pie chart"},{id:"13.5",title:"Evaluating statistical data"},{id:"13.6",title:"Statistical investigation"}]},
  ]},
  D2:{label:"Book 2",subtitle:"Core",color:"#10B981",chapters:[
    {id:"1",title:"Linear Functions and Graphs",sections:[{id:"1.1",title:"Cartesian coordinates"},{id:"1.2",title:"Functions"},{id:"1.3",title:"Linear functions"},{id:"1.4",title:"Applications of linear graphs"}]},
    {id:"2",title:"Linear Graphs and Simultaneous Equations",sections:[{id:"2.1",title:"Equations of straight lines"},{id:"2.2",title:"Graphs of ax + by = k"},{id:"2.3",title:"Graphical simultaneous equations"},{id:"2.4",title:"Algebraic simultaneous equations"},{id:"2.5",title:"Real-world applications"}]},
    {id:"3",title:"Linear Inequalities",sections:[{id:"3.1",title:"Simple inequalities"},{id:"3.2",title:"Solving linear inequalities"},{id:"3.3",title:"Problems with inequalities"},{id:"3.4",title:"Simultaneous inequalities"},{id:"3.5",title:"Problems with simultaneous inequalities"},{id:"3.6",title:"Inequalities in two variables"}]},
    {id:"4",title:"Expansion and Factorisation",sections:[{id:"4.1",title:"Quadratic expressions"},{id:"4.2",title:"Expansion of (a+b)(c+d)"},{id:"4.3",title:"Complex expansions"},{id:"4.4",title:"Factorisation of quadratics"},{id:"4.5",title:"Factorisation of (a+b)(c+d)"},{id:"4.6",title:"Special identities (expansion)"},{id:"4.7",title:"Special identities (factorisation)"}]},
    {id:"5",title:"Number Patterns",sections:[{id:"5.1",title:"Number sequences"},{id:"5.2",title:"Sequences and patterns"}]},
    {id:"6",title:"Financial Transactions",sections:[{id:"6.1",title:"Percentage, ratio and rate"},{id:"6.2",title:"Profit, loss, discount"},{id:"6.3",title:"Taxation, zakat and ushr"},{id:"6.4",title:"Insurance and hire purchase"},{id:"6.5",title:"Inheritance and partnership"}]},
    {id:"7",title:"Direct and Inverse Proportion",sections:[{id:"7.1",title:"Direct proportion"},{id:"7.2",title:"Graphical direct proportion"},{id:"7.3",title:"Other forms of direct proportion"},{id:"7.4",title:"Inverse proportion"},{id:"7.5",title:"Graphical inverse proportion"},{id:"7.6",title:"Other forms of inverse proportion"}]},
    {id:"8",title:"Congruence and Similarity",sections:[{id:"8.1",title:"Congruent figures"},{id:"8.2",title:"Similar figures"},{id:"8.3",title:"Similarity and enlargement"}]},
    {id:"9",title:"Pythagoras' Theorem",sections:[{id:"9.1",title:"Pythagoras' Theorem"},{id:"9.2",title:"Real-world applications"},{id:"9.3",title:"Converse of Pythagoras"}]},
    {id:"10",title:"Trigonometric Ratios",sections:[{id:"10.1",title:"Trigonometric ratios"},{id:"10.2",title:"Finding unknown sides"},{id:"10.3",title:"Finding unknown angles"},{id:"10.4",title:"Real-world applications"}]},
    {id:"11",title:"Volume and Surface Area",sections:[{id:"11.1",title:"Unit conversion"},{id:"11.2",title:"3D solids"},{id:"11.3",title:"Cubes and cuboids"},{id:"11.4",title:"Prisms"},{id:"11.5",title:"Cylinders"},{id:"11.6",title:"Composite solids"},{id:"11.7",title:"Symmetry in prisms"}]},
    {id:"12",title:"Sets and Probability",sections:[{id:"12.1",title:"Sets and notation"},{id:"12.2",title:"Venn diagrams"},{id:"12.3",title:"Probability and sample space"},{id:"12.4",title:"Probability of single events"},{id:"12.5",title:"Further probability"},{id:"12.6",title:"Experimental probability"}]},
  ]},
  D3:{label:"Book 3",subtitle:"Extended",color:"#8B5CF6",chapters:[
    {id:"1",title:"Algebraic Fractions and Formulae",sections:[{id:"1.1",title:"Algebraic fractions"},{id:"1.2",title:"Multiplying/dividing algebraic fractions"},{id:"1.3",title:"Adding/subtracting algebraic fractions"},{id:"1.4",title:"Equations with algebraic fractions"},{id:"1.5",title:"Manipulating formulae"}]},
    {id:"2",title:"Quadratic Equations and Graphs",sections:[{id:"2.1",title:"Solving by factorisation"},{id:"2.2",title:"Quadratic functions and graphs"},{id:"2.3",title:"Sketching quadratic graphs"}]},
    {id:"3",title:"Quadratic and Fractional Equations",sections:[{id:"3.1",title:"Completing the square"},{id:"3.2",title:"Quadratic formula"},{id:"3.3",title:"Fractional to quadratic equations"},{id:"3.4",title:"Graphical method"},{id:"3.5",title:"Real-world applications"}]},
    {id:"4",title:"Indices, Surds and Standard Form",sections:[{id:"4.1",title:"Indices"},{id:"4.2",title:"Laws of indices"},{id:"4.3",title:"Zero and negative indices"},{id:"4.4",title:"Rational indices"},{id:"4.5",title:"Surds"},{id:"4.6",title:"Exponential growth and decay"},{id:"4.7",title:"Standard form"}]},
    {id:"5",title:"Coordinate Geometry",sections:[{id:"5.1",title:"Length of a line segment"},{id:"5.2",title:"Gradient of a line"},{id:"5.3",title:"Equation of a straight line"},{id:"5.4",title:"Midpoint"},{id:"5.5",title:"Parallel and perpendicular lines"},{id:"5.6",title:"Lines involving parallel/perpendicular"}]},
    {id:"6",title:"Graphs of Functions",sections:[{id:"6.1",title:"Cubic functions"},{id:"6.2",title:"Reciprocal functions"},{id:"6.3",title:"Functions involving √x"},{id:"6.4",title:"Exponential functions"},{id:"6.5",title:"Rational functions"},{id:"6.6",title:"Gradient of a curve"},{id:"6.7",title:"Real-world graph applications"}]},
    {id:"7",title:"Pyramids, Cones and Spheres",sections:[{id:"7.1",title:"Pyramids"},{id:"7.2",title:"Cones"},{id:"7.3",title:"Spheres"},{id:"7.4",title:"Composite solids"}]},
    {id:"8",title:"Averages of Statistical Data",sections:[{id:"8.1",title:"Mean"},{id:"8.2",title:"Median"},{id:"8.3",title:"Mode"},{id:"8.4",title:"Measures of central tendency"}]},
  ]},
  D4:{label:"Book 4",subtitle:"Advanced",color:"#EF4444",chapters:[
    {id:"1",title:"Linear Inequalities in Two Variables",sections:[{id:"1.1",title:"Linear inequalities in two variables"},{id:"1.2",title:"Systems of inequalities"}]},
    {id:"2",title:"Further Sets",sections:[{id:"2.1",title:"Venn diagrams in problem sums"},{id:"2.2",title:"Formulas in set theory"}]},
    {id:"3",title:"Probability of Combined Events",sections:[{id:"3.1",title:"Single event probability"},{id:"3.2",title:"Combined events and tree diagrams"},{id:"3.3",title:"Addition law"},{id:"3.4",title:"Multiplication law"}]},
    {id:"4",title:"Statistical Data Analysis",sections:[{id:"4.1",title:"Cumulative frequency"},{id:"4.2",title:"Median, quartiles and IQR"},{id:"4.3",title:"Box-and-whisker plots"},{id:"4.4",title:"Standard deviation"}]},
    {id:"5",title:"Matrices",sections:[{id:"5.1",title:"Introduction to matrices"},{id:"5.2",title:"Addition and subtraction"},{id:"5.3",title:"Matrix multiplication"},{id:"5.4",title:"Determinant"},{id:"5.5",title:"Inverse of a matrix"},{id:"5.6",title:"Applications of matrices"}]},
    {id:"6",title:"Further Geometrical Transformations",sections:[{id:"6.1",title:"Enlargement"},{id:"6.2",title:"Transformations and matrices"},{id:"6.3",title:"Transformation matrix for enlargement"},{id:"6.4",title:"Inverse and combined transformations"}]},
    {id:"7",title:"Vectors",sections:[{id:"7.1",title:"Vectors in two dimensions"},{id:"7.2",title:"Addition of vectors"},{id:"7.3",title:"Vector subtraction"},{id:"7.4",title:"Scalar multiples"},{id:"7.5",title:"Vector in terms of two others"},{id:"7.6",title:"Position vectors"},{id:"7.7",title:"Applications of vectors"}]},
    {id:"8",title:"Loci",sections:[{id:"8.1",title:"Introduction to loci"},{id:"8.2",title:"Locus theorems"},{id:"8.3",title:"Intersection of loci"},{id:"8.4",title:"Further loci"}]},
    {id:"9",title:"Revision: Numbers and Algebra",sections:[{id:"9.1",title:"Numbers and percentages"},{id:"9.2",title:"Proportion, ratio, rate and speed"},{id:"9.3",title:"Algebraic manipulation"},{id:"9.4",title:"Equations and inequalities"},{id:"9.5",title:"Functions and graphs"},{id:"9.6",title:"Graphs in practical situations"},{id:"9.7",title:"Sets"},{id:"9.8",title:"Matrices"}]},
    {id:"10",title:"Revision: Geometry and Measurement",sections:[{id:"10.1",title:"Angles, triangles and polygons"},{id:"10.2",title:"Congruence and similarity"},{id:"10.3",title:"Pythagoras and trigonometry"},{id:"10.4",title:"Mensuration"},{id:"10.5",title:"Transformations and symmetry"},{id:"10.6",title:"Coordinate geometry"},{id:"10.7",title:"Vectors"},{id:"10.8",title:"Properties of circles"}]},
    {id:"11",title:"Revision: Probability and Statistics",sections:[{id:"11.1",title:"Probability"},{id:"11.2",title:"Statistics"}]},
  ]},
};

// ─── AUTH (localStorage – no backend needed) ─────────────────────────────────
const USERS_KEY = "nsm_users";
const SESSION_KEY = "nsm_session";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch { return {}; }
}
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getSession() {
  try { return localStorage.getItem(SESSION_KEY) || null; } catch { return null; }
}
function setSession(u) { localStorage.setItem(SESSION_KEY, u || ""); }

function registerUser(username, password) {
  const users = getUsers();
  if (users[username]) return { ok: false, error: "Username already taken" };
  users[username] = { password, progress: freshProgress() };
  saveUsers(users);
  return { ok: true };
}

function loginUser(username, password) {
  const users = getUsers();
  if (!users[username]) return { ok: false, error: "Username not found" };
  if (users[username].password !== password) return { ok: false, error: "Wrong password" };
  return { ok: true };
}

function loadUserProgress(username) {
  const users = getUsers();
  return users[username]?.progress || freshProgress();
}

function saveUserProgress(username, progress) {
  const users = getUsers();
  if (users[username]) {
    users[username].progress = progress;
    saveUsers(users);
  }
}

// ─── PROGRESS HELPERS ────────────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().slice(0, 10); }

function freshProgress() {
  return {
    xp: 0,
    hintsUsedToday: 0,
    hintsResetDate: todayStr(),
    chapterProgress: {},
    totalSolved: { Easy: 0, Medium: 0, Hard: 0 },
  };
}

function xpToLevel(xp) {
  const t = [0,50,130,250,420,650,950,1350,1900,2600];
  let lv = 1;
  for (let i = 0; i < t.length; i++) { if (xp >= t[i]) lv = i + 1; }
  return { level: lv, current: xp - (t[lv-1]||0), next: (t[lv]||9999) - (t[lv-1]||0) };
}

// ─── AI ──────────────────────────────────────────────────────────────────────
async function callAI(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6", max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  const text = data.content.map(i => i.text || "").join("");
  return JSON.parse(text.replace(/```json\n?|```/g, "").trim());
}

function makeQPrompt(bookLabel, chTitle, secTitle, diff) {
  const guide = {
    Easy: "straightforward, single or simple two-step, basic application.",
    Medium: "multi-step, combining two ideas, moderate challenge.",
    Hard: "multi-step reasoning, deeper thinking, real-world context."
  };
  return `Cambridge O Level NSM examiner. Book: ${bookLabel}, Chapter: "${chTitle}", Section: "${secTitle}", Difficulty: ${diff} (${guide[diff]})

Generate ONE exercise question at this difficulty. No labels, no intro text.

Return ONLY valid JSON:
{"question":"Full question text","parts":["(a)...","(b)..."],"hasParts":true,"marks":4,"steps":[{"label":"Step label","task":"What to compute","answer":"exact answer","hint":"Hint without giving answer"}],"fullSolution":"Complete worked solution"}`;
}

function makeCheckPrompt(task, correct, student) {
  return `Cambridge maths marker. Task: "${task}" Correct: "${correct}" Student: "${student}"
Mathematically equivalent? Be lenient with equivalent forms.
Return ONLY: {"correct":true,"errorMessage":"if wrong","hint":"helpful hint"}`;
}

// ─── AD COMPONENT ────────────────────────────────────────────────────────────
// Replace data-ad-client and data-ad-slot with your real AdSense values
function AdBanner({ slot = "horizontal" }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);
  // Placeholder shown until AdSense is configured
  return (
    <div style={{
      background:"#1A1A2E", border:"1px dashed #2E2E45", borderRadius:10,
      padding:"12px", textAlign:"center", margin:"12px 0", color:"#33335A", fontSize:12
    }}>
      {/* Uncomment below and add your publisher ID after AdSense approval:
      <ins className="adsbygoogle"
        style={{ display:"block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true" />
      */}
      📢 Ad Space — Configure AdSense after deployment
    </div>
  );
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handle() {
    setError(""); setLoading(true);
    const u = username.trim().toLowerCase();
    const p = password;
    if (!u || !p) { setError("Fill in all fields"); setLoading(false); return; }
    if (p.length < 6) { setError("Password must be 6+ characters"); setLoading(false); return; }

    if (mode === "signup") {
      const r = registerUser(u, p);
      if (!r.ok) { setError(r.error); setLoading(false); return; }
      setSession(u);
      onLogin(u);
    } else {
      const r = loginUser(u, p);
      if (!r.ok) { setError(r.error); setLoading(false); return; }
      setSession(u);
      onLogin(u);
    }
    setLoading(false);
  }

  const inp = {
    width:"100%", background:"#12121F", border:"1px solid #2E2E45",
    borderRadius:10, padding:"12px 16px", color:"#E8E8F5", fontSize:15,
    outline:"none", marginBottom:12,
  };

  return (
    <div style={{minHeight:"100vh",background:"#0E0E1C",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:380}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:11,letterSpacing:4,color:"#55557A",textTransform:"uppercase",marginBottom:10}}>New Syllabus Mathematics</div>
          <div style={{fontSize:34,fontWeight:900,color:"#fff",letterSpacing:-1}}>NSM Maths</div>
          <div style={{fontSize:14,color:"#55557A",marginTop:6}}>Cambridge O Level Practice</div>
        </div>

        <div style={{background:"#1C1C2E",borderRadius:20,padding:"32px 28px",border:"1px solid #2E2E45"}}>
          {/* Tabs */}
          <div style={{display:"flex",background:"#12121F",borderRadius:10,padding:4,marginBottom:24,gap:4}}>
            {["login","signup"].map(m => (
              <button key={m} onClick={()=>{setMode(m);setError("");}}
                style={{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700,fontSize:14,
                  background:mode===m?"#3B82F6":"transparent",
                  color:mode===m?"#fff":"#55557A",transition:"all 0.2s"}}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" style={inp} />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (6+ chars)"
            type="password" style={inp} onKeyDown={e=>e.key==="Enter"&&handle()} />

          {error && <div style={{color:"#EF4444",fontSize:13,marginBottom:12,background:"#2E0A0A",padding:"8px 12px",borderRadius:8}}>{error}</div>}

          <button onClick={handle} disabled={loading}
            style={{width:"100%",background:"#3B82F6",border:"none",borderRadius:12,padding:"14px",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer",opacity:loading?0.6:1}}>
            {loading ? "..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div style={{textAlign:"center",marginTop:20,fontSize:13,color:"#55557A"}}>
            {mode==="login" ? "No account? " : "Already have one? "}
            <button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");}}
              style={{background:"none",border:"none",color:"#3B82F6",cursor:"pointer",fontWeight:700,fontSize:13}}>
              {mode==="login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>

        <AdBanner />
        <div style={{textAlign:"center",color:"#33335A",fontSize:11,marginTop:16}}>
          Your data is stored locally on this device.
        </div>
      </div>
    </div>
  );
}

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
function XPToast({ amount, diff, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{position:"fixed",top:20,right:20,zIndex:999,background:DB[diff],border:`2px solid ${DC[diff]}`,
      borderRadius:14,padding:"14px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:`0 0 30px ${DC[diff]}60`,
      animation:"slideIn 0.3s ease"}}>
      <span style={{fontSize:24}}>⚡</span>
      <div><div style={{color:DC[diff],fontWeight:900,fontSize:22}}>+{amount} XP</div>
        <div style={{color:"#888",fontSize:12}}>{diff} solved</div></div>
    </div>
  );
}

function XPBar({ xp }) {
  const { level, current, next } = xpToLevel(xp);
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
      <div style={{background:"#FFD700",color:"#000",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:900,whiteSpace:"nowrap"}}>Lv {level}</div>
      <div style={{flex:1,background:"#1A1A2E",borderRadius:99,height:7,overflow:"hidden",minWidth:60}}>
        <div style={{width:`${(current/next)*100}%`,height:"100%",background:"linear-gradient(90deg,#818CF8,#38BDF8)",borderRadius:99,transition:"width 0.5s ease"}}/>
      </div>
      <div style={{fontSize:11,color:"#55557A",whiteSpace:"nowrap"}}>{xp}XP</div>
    </div>
  );
}

function ChapterRing({ chKey, progress, color }) {
  const cp = progress.chapterProgress[chKey] || {};
  const total = (cp.Easy||0)+(cp.Medium||0)+(cp.Hard||0);
  const r=16,circ=2*Math.PI*r,pct=Math.min(total/10,1);
  return (
    <div style={{position:"relative",width:40,height:40,flexShrink:0}}>
      <svg width={40} height={40} style={{transform:"rotate(-90deg)"}}>
        <circle cx={20} cy={20} r={r} fill="none" stroke="#2A2A3E" strokeWidth={4}/>
        <circle cx={20} cy={20} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 0.5s ease"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color}}>{total}</div>
    </div>
  );
}

function DiffPicker({ val, onChange }) {
  return (
    <div style={{display:"flex",gap:8}}>
      {["Easy","Medium","Hard"].map(d=>(
        <button key={d} onClick={()=>onChange(d)}
          style={{flex:1,padding:"8px 0",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",
            border:`2px solid ${val===d?DC[d]:"#2A2A3E"}`,
            background:val===d?DB[d]:"transparent",
            color:val===d?DC[d]:"#55557A",transition:"all 0.15s"}}>
          {d}<div style={{fontSize:10,fontWeight:400,marginTop:2,opacity:0.8}}>+{XP_MAP[d]}XP</div>
        </button>
      ))}
    </div>
  );
}

function StatsScreen({ progress, username, onBack, onLogout }) {
  const { level, current, next } = xpToLevel(progress.xp);
  const ts = progress.totalSolved;
  return (
    <div style={{minHeight:"100vh",background:"#0E0E1C",color:"#E8E8F5",fontFamily:"system-ui,sans-serif"}}>
      <div style={{maxWidth:600,margin:"0 auto",padding:"26px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:"#55557A",cursor:"pointer",fontSize:14,padding:0}}>← Back</button>
          <button onClick={onLogout} style={{background:"#2E0A0A",border:"1px solid #7F1D1D",borderRadius:10,padding:"6px 14px",color:"#EF4444",cursor:"pointer",fontSize:13,fontWeight:600}}>Sign Out</button>
        </div>

        <div style={{background:"#1C1C2E",borderRadius:18,padding:"20px",marginBottom:14,border:"1px solid #2E2E45",display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:48,height:48,background:"#3B82F6",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff",flexShrink:0}}>
            {username[0].toUpperCase()}
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:17}}>@{username}</div>
            <div style={{color:"#55557A",fontSize:13,marginTop:2}}>Level {level} · {progress.xp} XP total</div>
          </div>
        </div>

        <div style={{background:"#1C1C2E",borderRadius:18,padding:"22px",marginBottom:14,border:"1px solid #2E2E45"}}>
          <div style={{fontSize:13,color:"#55557A",marginBottom:14,fontWeight:700}}>XP Progress</div>
          <div style={{background:"#0E0E1C",borderRadius:99,height:12,overflow:"hidden",marginBottom:8}}>
            <div style={{width:`${(current/next)*100}%`,height:"100%",background:"linear-gradient(90deg,#818CF8,#38BDF8)",borderRadius:99,transition:"width 0.8s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#55557A"}}>
            <span>Level {level}</span><span>{current}/{next} XP to Level {level+1}</span>
          </div>
        </div>

        <div style={{background:"#1C1C2E",borderRadius:18,padding:"22px",marginBottom:14,border:"1px solid #2E2E45"}}>
          <div style={{fontSize:13,color:"#55557A",marginBottom:14,fontWeight:700}}>Questions Solved</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {["Easy","Medium","Hard"].map(d=>(
              <div key={d} style={{background:DB[d],border:`1px solid ${DC[d]}40`,borderRadius:12,padding:"14px 10px",textAlign:"center"}}>
                <div style={{fontSize:26,fontWeight:900,color:DC[d]}}>{ts[d]||0}</div>
                <div style={{fontSize:12,color:DC[d],opacity:0.8,marginTop:4}}>{d}</div>
                <div style={{fontSize:11,color:"#444",marginTop:2}}>+{XP_MAP[d]}XP</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"#1C1C2E",borderRadius:18,padding:"20px",border:"1px solid #2E2E45"}}>
          <div style={{fontSize:13,color:"#55557A",marginBottom:12,fontWeight:700}}>Daily Hints</div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{display:"flex",gap:8}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{width:36,height:36,borderRadius:10,
                  background:i<HINT_FREE-(progress.hintsUsedToday||0)?"#1C1200":"#1C1C2E",
                  border:`2px solid ${i<HINT_FREE-(progress.hintsUsedToday||0)?"#F59E0B":"#2A2A3E"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                  {i<HINT_FREE-(progress.hintsUsedToday||0)?"💡":"🔒"}
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:700}}>{Math.max(0,HINT_FREE-(progress.hintsUsedToday||0))} free today</div>
              <div style={{fontSize:12,color:"#55557A",marginTop:2}}>Extra = 10 XP each · Resets daily</div>
            </div>
          </div>
        </div>
        <AdBanner />
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [username, setUsername] = useState(null);
  const [progress, setProgress] = useState(null);
  const [view, setView]         = useState("home");
  const [bookKey, setBookKey]   = useState(null);
  const [chapter, setChapter]   = useState(null);
  const [section, setSection]   = useState(null);
  const [difficulty, setDiff]   = useState("Medium");
  const [question, setQuestion] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [currentStep, setStep]  = useState(0);
  const [input, setInput]       = useState("");
  const [results, setResults]   = useState([]);
  const [checking, setChecking] = useState(false);
  const [showSol, setShowSol]   = useState(false);
  const [hintText, setHintText] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [xpToast, setXpToast]   = useState(null);
  const inputRef = useRef(null);

  // Check session on mount
  useEffect(() => {
    const u = getSession();
    if (u) {
      let p = loadUserProgress(u);
      if (p.hintsResetDate !== todayStr()) { p.hintsUsedToday = 0; p.hintsResetDate = todayStr(); }
      setUsername(u); setProgress(p);
    }
  }, []);

  const updateProgress = useCallback((updater) => {
    setProgress(prev => {
      const next = updater(prev);
      saveUserProgress(username, next);
      return next;
    });
  }, [username]);

  function handleLogin(u) {
    let p = loadUserProgress(u);
    if (p.hintsResetDate !== todayStr()) { p.hintsUsedToday = 0; p.hintsResetDate = todayStr(); }
    setUsername(u); setProgress(p);
  }

  function handleLogout() {
    setSession(null); setUsername(null); setProgress(null); setView("home");
  }

  const book = bookKey ? BOOKS[bookKey] : null;
  const allDone = question && currentStep >= question.steps.length;

  async function fetchQuestion(sec, ch, bk, diff) {
    setLoading(true);
    setQuestion(null); setStep(0); setInput(""); setResults([]);
    setHintText(null); setShowHint(false); setShowSol(false);
    try {
      const q = await callAI(makeQPrompt(BOOKS[bk].label, ch.title, sec.title, diff));
      setQuestion(q); setView("question");
    } catch { alert("Question generate nahi hua. Dobara try karo."); }
    setLoading(false);
  }

  async function checkStep() {
    if (!input.trim() || checking) return;
    setChecking(true); setShowHint(false);
    try {
      const step = question.steps[currentStep];
      const r = await callAI(makeCheckPrompt(step.task, step.answer, input));
      const newRes = [...results, { ...r, studentAnswer: input }];
      setResults(newRes);
      if (r.correct) {
        if (currentStep + 1 >= question.steps.length) {
          const gain = XP_MAP[difficulty];
          updateProgress(p => ({
            ...p, xp: p.xp + gain,
            totalSolved: { ...p.totalSolved, [difficulty]: (p.totalSolved[difficulty]||0)+1 },
            chapterProgress: {
              ...p.chapterProgress,
              [`${bookKey}-${chapter.id}`]: {
                ...(p.chapterProgress[`${bookKey}-${chapter.id}`]||{}),
                [difficulty]: ((p.chapterProgress[`${bookKey}-${chapter.id}`]||{})[difficulty]||0)+1
              }
            }
          }));
          setXpToast({ amount: gain, diff: difficulty });
        }
        setStep(c => c+1); setInput("");
        setTimeout(() => inputRef.current?.focus(), 80);
      } else { setHintText(r.hint); }
    } catch { alert("Check nahi hua. Dobara try karo."); }
    setChecking(false);
  }

  async function useHint() {
    const freeLeft = HINT_FREE - (progress.hintsUsedToday||0);
    if (freeLeft <= 0) {
      if (progress.xp < HINT_COST) { alert("Not enough XP! Need 10 XP for a hint."); return; }
      updateProgress(p => ({ ...p, xp: p.xp - HINT_COST, hintsUsedToday: p.hintsUsedToday+1 }));
    } else {
      updateProgress(p => ({ ...p, hintsUsedToday: p.hintsUsedToday+1 }));
    }
    setHintText(hintText || question?.steps[currentStep]?.hint || "Think about the method carefully.");
    setShowHint(true);
  }

  if (!username) return <AuthScreen onLogin={handleLogin} />;
  if (view === "stats") return <StatsScreen progress={progress} username={username} onBack={()=>setView("home")} onLogout={handleLogout} />;

  const S = { fontFamily:"system-ui,-apple-system,sans-serif", minHeight:"100vh", background:"#0E0E1C", color:"#E8E8F5" };

  // ── HOME ──
  if (view === "home") return (
    <div style={S}>
      {xpToast && <XPToast amount={xpToast.amount} diff={xpToast.diff} onDone={()=>setXpToast(null)}/>}
      <div style={{maxWidth:680,margin:"0 auto",padding:"32px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <div style={{fontSize:10,letterSpacing:4,color:"#55557A",textTransform:"uppercase",marginBottom:6}}>NSM 8th Ed.</div>
            <h1 style={{fontSize:26,fontWeight:900,margin:0,letterSpacing:-1}}>Cambridge O Level</h1>
          </div>
          <button onClick={()=>setView("stats")}
            style={{background:"#1C1C2E",border:"1px solid #2E2E45",borderRadius:12,padding:"8px 14px",cursor:"pointer",color:"#E8E8F5",fontSize:13,fontWeight:600}}>
            @{username} 📊
          </button>
        </div>

        <div style={{background:"#1C1C2E",borderRadius:16,padding:"14px 18px",marginBottom:18,border:"1px solid #2E2E45",display:"flex",alignItems:"center",gap:14}}>
          <XPBar xp={progress.xp}/>
          <div style={{display:"flex",gap:4,flexShrink:0}}>
            {[0,1,2].map(i=>(
              <span key={i} style={{fontSize:16,opacity:i<HINT_FREE-(progress.hintsUsedToday||0)?1:0.2}}>💡</span>
            ))}
          </div>
        </div>

        <AdBanner />

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {Object.entries(BOOKS).map(([k,b]) => {
            const solved = b.chapters.reduce((s,ch) => {
              const cp = progress.chapterProgress[`${k}-${ch.id}`]||{};
              return s+(cp.Easy||0)+(cp.Medium||0)+(cp.Hard||0);
            }, 0);
            return (
              <button key={k} onClick={()=>{setBookKey(k);setView("chapters");}}
                style={{background:"#1C1C2E",border:"2px solid #2E2E45",borderRadius:18,padding:"20px 18px",cursor:"pointer",textAlign:"left",color:"#E8E8F5",transition:"border-color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=b.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor="#2E2E45"}>
                <div style={{fontSize:28,fontWeight:900,color:b.color,letterSpacing:-1}}>{k}</div>
                <div style={{fontSize:14,fontWeight:700,marginTop:4}}>{b.label}</div>
                <div style={{fontSize:12,color:"#55557A",marginTop:2}}>{b.subtitle}</div>
                <div style={{marginTop:10,fontSize:12,color:"#55557A"}}>{b.chapters.length} chapters · <span style={{color:b.color,fontWeight:700}}>{solved} solved</span></div>
              </button>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(60px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );

  // ── CHAPTERS ──
  if (view === "chapters") return (
    <div style={S}>
      <div style={{maxWidth:740,margin:"0 auto",padding:"22px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:"#55557A",cursor:"pointer",fontSize:14,padding:0}}>← Books</button>
          <div style={{fontSize:13,color:"#818CF8",fontWeight:700}}>{progress.xp} XP</div>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,letterSpacing:4,color:book.color,textTransform:"uppercase",marginBottom:6}}>{bookKey} · {book.subtitle}</div>
          <h2 style={{fontSize:22,fontWeight:900,margin:"0 0 18px"}}>{book.label}</h2>
          <DiffPicker val={difficulty} onChange={setDiff}/>
        </div>
        <AdBanner/>
        {book.chapters.map(ch => {
          const chKey=`${bookKey}-${ch.id}`;
          const cp=progress.chapterProgress[chKey]||{};
          return (
            <div key={ch.id} style={{background:"#1C1C2E",borderRadius:14,padding:"14px 16px",marginBottom:10,border:"1px solid #2E2E45"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <ChapterRing chKey={chKey} progress={progress} color={book.color}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>
                    <span style={{color:book.color,marginRight:6,fontSize:12}}>Ch {ch.id}</span>{ch.title}
                  </div>
                  <div style={{display:"flex",gap:10,marginTop:3}}>
                    {["Easy","Medium","Hard"].map(d=>(
                      <span key={d} style={{fontSize:11,color:DC[d],opacity:0.8}}>{cp[d]||0} {d[0]}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {ch.sections.map(sec=>(
                  <button key={sec.id}
                    onClick={()=>{setChapter(ch);setSection(sec);fetchQuestion(sec,ch,bookKey,difficulty);}}
                    style={{background:"transparent",border:"1.5px solid #3A3A55",borderRadius:20,padding:"5px 12px",fontSize:12,color:"#A0A0C0",cursor:"pointer",transition:"all 0.15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=book.color;e.currentTarget.style.color="#fff";e.currentTarget.style.background=`${book.color}20`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#3A3A55";e.currentTarget.style.color="#A0A0C0";e.currentTarget.style.background="transparent";}}>
                    <span style={{color:"#444",marginRight:4,fontSize:10}}>{sec.id}</span>{sec.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {loading && (
        <div style={{position:"fixed",inset:0,background:"#0E0E1Cee",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,zIndex:99}}>
          <div style={{width:44,height:44,border:`4px solid ${book.color}33`,borderTop:`4px solid ${book.color}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
          <div style={{color:"#55557A",fontSize:14}}>Generating {difficulty} question…</div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
    </div>
  );

  // ── QUESTION ──
  if (view === "question" && question) {
    const step = !allDone ? question.steps[currentStep] : null;
    const freeLeft = HINT_FREE - (progress.hintsUsedToday||0);
    return (
      <div style={{...S,paddingBottom:160}}>
        {xpToast && <XPToast amount={xpToast.amount} diff={xpToast.diff} onDone={()=>setXpToast(null)}/>}
        <div style={{maxWidth:720,margin:"0 auto",padding:"18px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <button onClick={()=>setView("chapters")} style={{background:"none",border:"none",color:"#55557A",cursor:"pointer",fontSize:14,padding:0}}>← Chapters</button>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{background:DB[difficulty],border:`1.5px solid ${DC[difficulty]}`,borderRadius:20,padding:"4px 10px",fontSize:12,color:DC[difficulty],fontWeight:700}}>
                {difficulty} · +{XP_MAP[difficulty]}XP
              </span>
              <span style={{fontSize:12,color:"#818CF8",fontWeight:700}}>{progress.xp}XP</span>
            </div>
          </div>

          <div style={{fontSize:12,color:"#44445A",marginBottom:14}}>{bookKey} › Ch{chapter.id} · §{section.id} · {section.title}</div>

          <div style={{background:"#1C1C2E",borderRadius:16,padding:"18px",marginBottom:16,border:`1px solid ${book.color}40`}}>
            <div style={{fontSize:10,letterSpacing:3,color:book.color,textTransform:"uppercase",marginBottom:10}}>Question</div>
            <div style={{fontSize:16,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{question.question}</div>
            {question.hasParts && question.parts?.map((p,i)=>(
              <div key={i} style={{fontSize:15,color:"#C8C8E5",marginTop:8,paddingLeft:6,lineHeight:1.6}}>{p}</div>
            ))}
          </div>

          {results.map((r,i)=>r.correct&&(
            <div key={i} style={{background:"#0A2318",border:"1px solid #1B5C35",borderRadius:11,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,color:"#4ADE80",marginBottom:2}}>✓ {question.steps[i].label}</div>
                <div style={{color:"#86EFAC",fontSize:13}}>{question.steps[i].task}</div>
              </div>
              <div style={{color:"#4ADE80",fontWeight:700,fontSize:14}}>{r.studentAnswer}</div>
            </div>
          ))}

          {!allDone && step && (
            <div style={{background:"#1E1E35",border:"2px solid #4040AA",borderRadius:14,padding:"16px 18px",marginBottom:12}}>
              <div style={{fontSize:11,color:"#8888CC",marginBottom:6}}>{step.label} · Step {currentStep+1}/{question.steps.length}</div>
              <div style={{fontSize:15,color:"#C8C8E8",marginBottom:14,lineHeight:1.65}}>{step.task}</div>
              {results[currentStep]&&!results[currentStep].correct&&(
                <div style={{background:"#2E0A0A",border:"1px solid #7F1D1D",borderRadius:10,padding:"9px 12px",marginBottom:12}}>
                  <div style={{color:"#FCA5A5",fontSize:13,fontWeight:700}}>❌ {results[currentStep].errorMessage}</div>
                </div>
              )}
              <div style={{display:"flex",gap:10}}>
                <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&checkStep()}
                  placeholder="Type your answer…"
                  style={{flex:1,background:"#12121F",border:"1px solid #3A3A55",borderRadius:10,padding:"11px 14px",color:"#E8E8F5",fontSize:15,outline:"none"}}/>
                <button onClick={checkStep} disabled={checking||!input.trim()}
                  style={{background:book.color,border:"none",borderRadius:10,padding:"11px 20px",color:"#fff",fontWeight:800,fontSize:15,cursor:checking?"not-allowed":"pointer",opacity:checking||!input.trim()?0.5:1,minWidth:72}}>
                  {checking?"…":"Check"}
                </button>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
                <button onClick={()=>setShowSol(!showSol)} style={{background:"none",border:"none",color:"#44445A",fontSize:12,cursor:"pointer",padding:0}}>
                  {showSol?"Hide solution":"Show full solution"}
                </button>
                <button onClick={useHint} style={{background:"none",border:"none",color:freeLeft>0?"#F59E0B":"#EF4444",fontSize:12,cursor:"pointer",padding:0,fontWeight:600}}>
                  💡 {freeLeft>0?`Hint (${freeLeft} free)`:"Hint (−10XP)"}
                </button>
              </div>
            </div>
          )}

          {showSol&&(
            <div style={{background:"#1E1800",border:"1px solid #7A5A00",borderRadius:12,padding:"14px 16px",marginBottom:14}}>
              <div style={{color:"#FCD34D",fontSize:12,fontWeight:700,marginBottom:8}}>📖 Full Solution</div>
              <div style={{color:"#FEF3C7",fontSize:14,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{question.fullSolution}</div>
            </div>
          )}

          {allDone&&(
            <div style={{background:"#0A2318",border:"1px solid #1B5C35",borderRadius:18,padding:"26px",textAlign:"center",marginTop:12}}>
              <div style={{fontSize:36,marginBottom:8}}>🎉</div>
              <div style={{fontSize:20,fontWeight:900,color:"#4ADE80",marginBottom:6}}>Complete!</div>
              <div style={{color:"#F59E0B",fontWeight:700,fontSize:18,marginBottom:20}}>+{XP_MAP[difficulty]} XP earned!</div>
              <button onClick={()=>fetchQuestion(section,chapter,bookKey,difficulty)}
                style={{background:book.color,border:"none",borderRadius:12,padding:"12px 26px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",marginRight:10}}>
                New Question
              </button>
              <button onClick={()=>setView("chapters")}
                style={{background:"#1C1C2E",border:"1px solid #2E2E45",borderRadius:12,padding:"12px 18px",color:"#8888AA",fontWeight:600,fontSize:14,cursor:"pointer"}}>
                Change Section
              </button>
            </div>
          )}
          <AdBanner/>
        </div>

        {showHint&&hintText&&(
          <div style={{position:"fixed",bottom:24,right:24,maxWidth:280,background:"#1E1A2E",border:"2px solid #F59E0B",borderRadius:16,padding:"14px 16px",boxShadow:"0 8px 30px #F59E0B40",zIndex:100}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:13,fontWeight:700,color:"#F59E0B"}}>💡 Hint</div>
              <button onClick={()=>setShowHint(false)} style={{background:"none",border:"none",color:"#44445A",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
            </div>
            <div style={{color:"#C0C0E0",fontSize:14,lineHeight:1.6}}>{hintText}</div>
          </div>
        )}
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideIn{from{transform:translateX(60px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
      </div>
    );
  }
  return null;
}
