var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_os = __toESM(require("os"), 1);
var import_child_process = require("child_process");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// src/data/mockData.ts
var INITIAL_PRODUCTS = [
  {
    id: "p1",
    rank: "01",
    name: "Ultra-Light Mesh Runner Pro 2",
    myPrice: 129e3,
    compPrice: 134e3,
    gmvEst: 8425e5,
    status: "\uAC00\uACA9 \uC6B0\uC704",
    category: "\uC2A4\uD3EC\uCE20/\uC7AC\uD328\uB7F4",
    marginRate: 0.32,
    salesCount: 6531
  },
  {
    id: "p2",
    rank: "02",
    name: "Tech-Series Wireless Earbuds X",
    myPrice: 89e3,
    compPrice: 89e3,
    gmvEst: 6152e5,
    status: "\uCD5C\uC800\uAC00 \uC720\uC9C0",
    category: "\uB514\uC9C0\uD138/\uAC00\uC804",
    marginRate: 0.25,
    salesCount: 6912
  },
  {
    id: "p3",
    rank: "03",
    name: "Ergo-Comfort Workspace Chair",
    myPrice: 245e3,
    compPrice: 249e3,
    gmvEst: 5881e5,
    status: "\uAC00\uACA9 \uC6B0\uC704",
    category: "\uAC00\uAD6C/\uC778\uD14C\uB9AC\uC5B4",
    marginRate: 0.4,
    salesCount: 2400
  },
  {
    id: "p4",
    rank: "04",
    name: "\uC6B8\uD2B8\uB77C \uAC00\uBCBC\uC6B4 \uB9E5\uBD81 \uC5D0\uC5B4 \uD30C\uC6B0\uCE58 13\uC778\uCE58",
    myPrice: 24900,
    compPrice: 24900,
    gmvEst: 1245e4,
    status: "\uCD5C\uC800\uAC00 \uC720\uC9C0",
    category: "\uB514\uC9C0\uD138/\uC7A1\uD654",
    marginRate: 0.45,
    salesCount: 500
  },
  {
    id: "p5",
    rank: "05",
    name: "\uACE0\uD574\uC0C1\uB3C4 C-Type \uD5C8\uBE0C 7-in-1",
    myPrice: 45e3,
    compPrice: 42800,
    gmvEst: 892e4,
    status: "\uACBD\uC7C1 \uBC00\uB9BC",
    category: "\uB514\uC9C0\uD138/\uC7A1\uD654",
    marginRate: 0.28,
    salesCount: 198
  },
  {
    id: "p6",
    rank: "06",
    name: "\uBBF8\uB2C8\uBA40\uB9AC\uC2A4\uD2B8 \uAC00\uC8FD \uCE74\uB4DC\uC9C0\uAC11",
    myPrice: 19800,
    compPrice: 18500,
    gmvEst: 54e5,
    status: "\uACBD\uC7C1 \uBC00\uB9BC",
    category: "\uD328\uC158/\uC758\uB958",
    marginRate: 0.35,
    salesCount: 272
  },
  {
    id: "p7",
    rank: "07",
    name: "\uB178\uC774\uC988\uCE94\uC2AC\uB9C1 \uD5E4\uB4DC\uD3F0 H900",
    myPrice: 32e4,
    compPrice: 32e4,
    gmvEst: 48e6,
    status: "\uCD5C\uC800\uAC00 \uC720\uC9C0",
    category: "\uB514\uC9C0\uD138/\uAC00\uC804",
    marginRate: 0.2,
    salesCount: 150
  },
  {
    id: "p8",
    rank: "08",
    name: "4K \uC775\uC2A4\uD2B8\uB9BC \uC561\uC158\uCEA0 \uD504\uB85C",
    myPrice: 159e3,
    compPrice: 149e3,
    gmvEst: 2385e4,
    status: "\uACBD\uC7C1 \uBC00\uB9BC",
    category: "\uB808\uC800/\uC544\uC6C3\uB3C4\uC5B4",
    marginRate: 0.22,
    salesCount: 150
  },
  {
    id: "p9",
    rank: "09",
    name: "\uC2A4\uB9C8\uD2B8 \uC544\uC6C3\uB3C4\uC5B4 \uC2A4\uD3EC\uCE20 \uC6CC\uCE58",
    myPrice: 189e3,
    compPrice: 189e3,
    gmvEst: 378e5,
    status: "\uCD5C\uC800\uAC00 \uC720\uC9C0",
    category: "\uC2A4\uD3EC\uCE20/\uB808\uC800",
    marginRate: 0.3,
    salesCount: 200
  },
  {
    id: "p10",
    rank: "10",
    name: "\uD504\uB9AC\uBBF8\uC5C4 \uC694\uAC00\uB9E4\uD2B8 8mm",
    myPrice: 35e3,
    compPrice: 34e3,
    gmvEst: 105e5,
    status: "\uACBD\uC7C1 \uBC00\uB9BC",
    category: "\uC2A4\uD3EC\uCE20/\uB808\uC800",
    marginRate: 0.4,
    salesCount: 300
  },
  {
    id: "p11",
    rank: "11",
    name: "\uC2A4\uB9C8\uD2B8 \uACE0\uC18D \uCDA9\uC804 \uBCF4\uC870\uBC30\uD130\uB9AC 20000mAh",
    myPrice: 28e3,
    compPrice: 28e3,
    gmvEst: 224e5,
    status: "\uCD5C\uC800\uAC00 \uC720\uC9C0",
    category: "\uB514\uC9C0\uD138/\uAC00\uC804",
    marginRate: 0.25,
    salesCount: 800
  }
];
var INITIAL_TASKS = [
  {
    id: "t1",
    title: "BSD \uC2E4\uC801 \uBD84\uC11D \uC2DC\uAC01\uD654 \uB9AC\uD3EC\uD2B8 \uC0DD\uC131",
    target: "Top 100 Products",
    metric: "GMV & Price Trend",
    status: "\uADF8\uB798\uD504 \uC0DD\uC131 \uC644\uB8CC",
    date: "2026-06-11"
  },
  {
    id: "t2",
    title: "\uCD08\uC800\uAC00 \uCD5C\uC801\uD654 \uAC00\uACA9 \uB9E4\uCE6D \uBD84\uC11D",
    target: "\uACBD\uC7C1 \uBC00\uB9BC \uC0C1\uD488\uAD70 (5\uC885)",
    metric: "\uC608\uC0C1 \uB9C8\uC9C4\uC728 \uBC0F \uAC00\uC804 \uD310\uB9E4\uB7C9 \uC2DC\uBBAC\uB808\uC774\uC158",
    status: "\uC644\uB8CC",
    date: "2026-06-10"
  },
  {
    id: "t3",
    title: "6\uC6D4 \uC8FC\uB9D0 \uCFE0\uD3F0 \uD6A8\uC728 \uC2DC\uBBAC\uB808\uC774\uC158",
    target: "\uAC00\uAD6C \uBC0F \uC0DD\uD65C\uC6A9\uD488 \uCE74\uD14C\uACE0\uB9AC",
    metric: "\uD560\uC778 \uCFE0\uD3F0 \uC18C\uC9C4 \uC18D\uB3C4 \uBC0F GMV \uC0C1\uC2B9 \uCD94\uC815",
    status: "\uB300\uAE30 \uC911",
    date: "2026-06-09"
  }
];

// server.ts
import_dotenv.default.config();
var products = [...INITIAL_PRODUCTS];
var tasks = [...INITIAL_TASKS];
var hasGeminiKey = !!process.env.GEMINI_API_KEY;
var ai = null;
if (hasGeminiKey) {
  ai = new import_genai.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
} else {
  console.warn("WARN: GEMINI_API_KEY is not defined. Falling back to heuristic/AI-simulated answers.");
}
function getLocalNetworkUrls(port) {
  const urls = [];
  const interfaces = import_os.default.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    if (!entries) continue;
    for (const entry of entries) {
      if (entry.family === "IPv4" && !entry.internal) {
        urls.push(`http://${entry.address}:${port}`);
      }
    }
  }
  return urls;
}
function startPublicTunnel(port) {
  const child = (0, import_child_process.spawn)(
    "npx",
    ["--yes", "cloudflared", "tunnel", "--url", `http://127.0.0.1:${port}`],
    { shell: true, stdio: ["ignore", "pipe", "pipe"] }
  );
  let printed = false;
  const handleOutput = (data) => {
    const match = data.toString().match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match && !printed) {
      printed = true;
      console.log("  \uC678\uBD80 \uACF5\uC720:  " + match[0]);
      console.log("  (\uB2E4\uB978 \uC0AC\uB78C\uC5D0\uAC8C \uC804\uB2EC\uD560 URL \xB7 \uBCF8\uC778\uC740 localhost \uC0AC\uC6A9 \uAD8C\uC7A5)");
      console.log("  \u203B \uD130\uBBF8\uB110\uC744 \uB2EB\uC73C\uBA74 \uC678\uBD80 URL\uB3C4 \uD568\uAED8 \uC885\uB8CC\uB429\uB2C8\uB2E4");
      console.log("========================================\n");
    }
  };
  child.stdout?.on("data", handleOutput);
  child.stderr?.on("data", handleOutput);
  child.on("error", (err) => {
    console.error("  \uD130\uB110 \uC0DD\uC131 \uC2E4\uD328:", err.message);
    console.log("  npx cloudflared tunnel --url http://localhost:" + port);
    console.log("========================================\n");
  });
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/products", (req, res) => {
    res.json(products);
  });
  app.post("/api/products/:id/price", (req, res) => {
    const { id } = req.params;
    const { price } = req.body;
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const item = products[productIndex];
    item.myPrice = Number(price);
    if (item.myPrice < item.compPrice) {
      item.status = "\uAC00\uACA9 \uC6B0\uC704";
      item.gmvEst = Math.round(item.salesCount * item.myPrice * 1.35);
    } else if (item.myPrice === item.compPrice) {
      item.status = "\uCD5C\uC800\uAC00 \uC720\uC9C0";
      item.gmvEst = Math.round(item.salesCount * item.myPrice * 1.15);
    } else {
      item.status = "\uACBD\uC7C1 \uBC00\uB9BC";
      item.gmvEst = Math.round(item.salesCount * item.myPrice * 0.45);
    }
    res.json(item);
  });
  app.post("/api/products/optimize-all", (req, res) => {
    products = products.map((item) => {
      const oldPrice = item.myPrice;
      const targetPrice = item.compPrice;
      const updatedItem = {
        ...item,
        myPrice: targetPrice,
        status: "\uCD5C\uC800\uAC00 \uC720\uC9C0",
        gmvEst: Math.round(item.salesCount * targetPrice * 1.15)
      };
      return updatedItem;
    });
    res.json(products);
  });
  app.get("/api/tasks", (req, res) => {
    res.json(tasks);
  });
  app.post("/api/tasks", (req, res) => {
    const { title, target, metric } = req.body;
    const newTask = {
      id: `t${tasks.length + 1}`,
      title,
      target,
      metric,
      status: "\uADF8\uB798\uD504 \uC0DD\uC131 \uC644\uB8CC",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    tasks.push(newTask);
    res.json(newTask);
  });
  app.post("/api/chat", async (req, res) => {
    const { message, chatHistory } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }
    const productSummaries = products.map(
      (p) => `- [${p.rank}] ${p.name}: \uB0B4 \uD310\uB9E4\uAC00 \u20A9${p.myPrice.toLocaleString()} VS \uACBD\uC7C1\uAC00 \u20A9${p.compPrice.toLocaleString()} -> \uC0C1\uD0DC [${p.status}], \uCD94\uC815 GMV: \u20A9${p.gmvEst.toLocaleString()}`
    ).join("\n");
    const systemInstruction = `You are Gmarket PriceQ, Gmarket's premium, institutional AI pricing assistant and business intelligence analyst.
Your target audience is an e-commerce seller who wants data-driven suggestions on how to maximize revenue (GMV) and maintain competitive prices.
Translate complex analytical data into crisp, highly strategic Korean business advice.

Current store inventory catalog state:
${productSummaries}

Specific rule for queries:
1. When the user asks "\uC774\uBC88 5\uC6D4 BSD\uC5D0\uC11C \uAC00\uC7A5 \uC798 \uD314\uB9B0 \uC0C1\uD488 \uB9AC\uC2A4\uD2B8 100\uAC1C\uC640 \uAC00\uACA9 \uADF8\uB9AC\uACE0 GMV \uC54C\uB824\uC918." or mentions "5\uC6D4 BSD \uC2E4\uC801", you MUST give a clear breakdown of the top 3 items:
   - Rank 01: Ultra-Light Mesh Runner Pro 2 (Price: \u20A9129,000, Est. GMV: \u20A9842.5M)
   - Rank 02: Tech-Series Wireless Earbuds X (Price: \u20A989,000, Est. GMV: \u20A9615.2M)
   - Rank 03: Ergo-Comfort Workspace Chair (Price: \u20A9245,000, Est. GMV: \u20A9588.1M)
   Write a professional analytical text in Korean first, then offer a "Download Full List (CSV)" button or describe how it can be downloaded. Give brief strategic insights regarding these items (e.g., Ultra-Light Runner has a \u20A95,000 price advantage which drove high conversion!). Recommend checking the Visualized Report on the Dashboard.

2. When the user asks for "\uB300\uC2DC\uBCF4\uB4DC\uC5D0\uC11C \uADF8\uB798\uD504\uB85C \uBCFC \uC218 \uC788\uAC8C \uD574\uC918." (Show it as a graph on the dashboard), reply warmly that:
   - You have created a visualized report task under the title "BSD \uC2E4\uC801 \uBD84\uC11D \uC2DC\uAC01\uD654 \uB9AC\uD3EC\uD2B8 \uC0DD\uC131".
   - Confirm status is "\uADF8\uB798\uD504 \uC0DD\uC131 \uC644\uB8CC" (Graph completed).
   - Advise them to click the "\uB300\uC2DC\uBCF4\uB4DC \uBA54\uB274\uB85C \uC774\uB3D9" (Go to Dashboard) action to view the beautiful interactive graphs.

3. When the user asks "\uC9C0\uAE08 \uB77C\uC774\uBE0C \uC911\uC778 \uB098\uC758 \uC0C1\uD488 \uC911\uC5D0\uC11C GMV \uC0C1\uC704 10\uAC1C \uC0C1\uD488 \uC54C\uB824\uC918." or mentions "\uB77C\uC774\uBE0C \uC0C1\uD488 GMV \uC0C1\uC704 10\uAC1C", give a breakdown of the top live items highlighting Rank 01 ("\uC6B8\uD2B8\uB77C \uAC00\uBCBC\uC6B4 \uB9E5\uBD81 \uC5D0\uC5B4 \uD30C\uC6B0\uCE58 13\uC778\uCE58") with \u20A912,450,000 GMV maintaining minimum lowest price, and Rank 02 ("\uACE0\uD574\uC0C1\uB3C4 C-Type \uD5C8\uBE0C 7-in-1") with \u20A98,920,000 GMV which is currently "\uACBD\uC7C1 \uBC00\uB9BC" (Competitor price is lower: \u20A942,800). Suggest matching the lowest competitor rates immediately.

4. When the user asks "\uD0C0\uC0AC \uCD5C\uC800\uAC00\uB97C \uB9DE\uCDB0\uC57C \uD558\uB294 \uC0C1\uD488 \uB9AC\uC2A4\uD2B8 \uC804\uB2EC\uD574\uC918" or "\uCD5C\uC800\uAC00 \uB9E4\uCE6D", explain that there are competitive risks in "\uACBD\uC7C1 \uBC00\uB9BC" items (like C-Type Hub, Card Wallet, Action Cam, Yoga Mat). Recommend clicking the "\uCD5C\uC800\uAC00 \uC790\uB3D9 \uCD5C\uC801\uD654" button or matching their specific lowest prices on the Price Management panel.

Be professional, structured with clean Markdown, and highly pragmatic. Avoid flowery self-praise. Use bullet points.`;
    if (ai) {
      try {
        console.log(`Sending message to Gemini 3.5 Flash: ${message}`);
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });
        res.json({ text: response.text });
      } catch (err) {
        console.error("Gemini API Error:", err);
        res.status(500).json({
          error: "Gemini API Error occurred.",
          details: err.message,
          fallback: true
        });
      }
    } else {
      setTimeout(() => {
        let text = "";
        if (message.includes("5\uC6D4 BSD") || message.includes("\uC2E4\uC801") || message.includes("\uC0C1\uC704 100\uAC1C")) {
          text = `\uB124, 5\uC6D4 BSD \uC2E4\uC801\uC744 \uBD84\uC11D\uD558\uC5EC \uC0C1\uC704 100\uAC1C \uC0C1\uD488 \uB9AC\uC2A4\uD2B8\uB97C \uCD94\uCD9C\uD588\uC2B5\uB2C8\uB2E4. \uC8FC\uC694 \uC9C0\uD45C \uC694\uC57D\uC740 \uB2E4\uC74C\uACFC \uAC19\uC2B5\uB2C8\uB2E4.

\uD2B9\uD788 **Ultra-Light Mesh Runner Pro 2** \uC0C1\uD488\uC740 \uACBD\uC7C1\uC0AC \uB300\uBE44 \u20A95,000\uC758 \uAC00\uACA9 \uC6B0\uC704(\u20A9129,000)\uB97C \uAE30\uBC18\uC73C\uB85C \uACE0\uC804\uD658\uC744 \uAE30\uB85D\uD558\uBA70 \uCD1D \u20A9842.5M\uC758 \uC555\uB3C4\uC801\uC778 GMV\uB97C \uB2EC\uC131\uD588\uC2B5\uB2C8\uB2E4.

\uC544\uB798 \uD45C \uBD84\uC11D\uC744 \uD1B5\uD574 \uC0C1\uC138 \uD310\uB9E4 \uD604\uD669\uC744 \uD655\uC778\uD558\uC2E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB370\uC774\uD130\uC758 \uC2DC\uAC01\uC801\uC778 \uC0C1\uC138 \uBD84\uC11D\uC774 \uD544\uC694\uD55C \uACBD\uC6B0, \uC5B8\uC81C\uB4E0\uC9C0 \uB300\uC2DC\uBCF4\uB4DC \uC2DC\uAC01\uD654 \uC0DD\uC131\uC744 \uC694\uCCAD\uD574\uC8FC\uC138\uC694.`;
        } else if (message.includes("\uB300\uC2DC\uBCF4\uB4DC") || message.includes("\uADF8\uB798\uD504")) {
          text = `\uB124, \uC694\uCCAD\uD558\uC2E0 \uB300\uC2DC\uBCF4\uB4DC \uC2DC\uAC01\uD654 \uB9AC\uD3EC\uD2B8 \uC791\uC131\uC744 \uC644\uB8CC\uD588\uC2B5\uB2C8\uB2E4. 

**[BSD \uC2E4\uC801 \uBD84\uC11D \uC2DC\uAC01\uD654 \uB9AC\uD3EC\uD2B8 \uC0DD\uC131]**
* **\uBD84\uC11D \uB300\uC0C1:** \uC0C1\uC704 100\uAC1C \uC81C\uD488 \uC2E4\uC801 \uBC0F GMV \uBD84\uD3EC
* **\uCD94\uCD9C \uC9C0\uD45C:** \uC81C\uD488\uBCC4 \uD3C9\uADE0 \uB2E8\uAC00 \uB300\uBE44 GMV \uB9E4\uD2B8\uB9AD\uC2A4
* **\uCC98\uB9AC \uACB0\uACFC:** \uADF8\uB798\uD504 \uC0DD\uC131 \uC644\uB8CC 

\uC544\uB798 '\uB300\uC2DC\uBCF4\uB4DC \uBA54\uB274\uB85C \uC774\uB3D9' \uBC84\uD2BC\uC744 \uD1B5\uD574 \uC0C8\uB85C \uC0DD\uC131\uB41C \uC2E4\uC801 \uC2DC\uAC01\uD654 \uB9AC\uD3EC\uD2B8\uC640 \uBD84\uC11D \uADF8\uB798\uD504\uB97C \uBC14\uB85C \uD655\uC778\uD574\uBCF4\uC138\uC694.`;
        } else if (message.includes("\uB77C\uC774\uBE0C") || message.includes("\uB098\uC758 \uC0C1\uD488") || message.includes("GMV \uC0C1\uC704 10\uAC1C")) {
          text = `\uD604\uC7AC \uB77C\uC774\uBE0C \uC911\uC778 \uC0C1\uD488\uC758 \uCD5C\uADFC 24\uC2DC\uAC04 GMV \uAE30\uC900 \uC0C1\uC704 10\uAC1C \uB9AC\uC2A4\uD2B8\uB97C \uCD94\uCD9C\uD574\uB4DC\uB838\uC2B5\uB2C8\uB2E4.

\uD604\uC7AC **\uC6B8\uD2B8\uB77C \uAC00\uBCBC\uC6B4 \uB9E5\uBD81 \uC5D0\uC5B4 \uD30C\uC6B0\uCE58 13\uC778\uCE58** \uC81C\uD488\uC740 \u20A912,450,000\uC758 \uC2E4\uC801\uC744 \uC62C\uB9AC\uBA70 \uCD5C\uC800\uAC00 \uBC29\uC5B4\uC5D0 \uC131\uACF5(\uCD5C\uC800\uAC00 \uC720\uC9C0) \uC911\uC785\uB2C8\uB2E4. \uBC18\uBA74, **\uACE0\uD574\uC0C1\uB3C4 C-Type \uD5C8\uBE0C 7-in-1**\uC758 \uACBD\uC6B0 \uACBD\uC7C1\uC0AC\uAC00 \u20A942,800\uC73C\uB85C \uAC00\uACA9\uC744 \uB0AE\uCDA4\uC5D0 \uB530\uB77C '\uACBD\uC7C1 \uBC00\uB9BC' \uC0C1\uD0DC\uAC00 \uB418\uC5C8\uC73C\uBA70, \uB2E8\uAE30 \uC804\uD658\uC728 \uD558\uB77D\uC774 \uAD00\uCC30\uB429\uB2C8\uB2E4.

\uC774\uC678\uC5D0 \uACBD\uC7C1\uC0AC \uAC00\uACA9 \uBCC0\uB3D9\uC5D0 \uB530\uB978 \uAE34\uAE09 \uC870\uCE58\uAC00 \uD544\uC694\uD55C \uC0C1\uD488\uC774 4\uC885 \uB354 \uC2DD\uBCC4\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`;
        } else {
          text = `\uC548\uB155\uD558\uC138\uC694! Gmarket PriceQ AI \uBD84\uC11D \uC5D4\uC9C4\uC785\uB2C8\uB2E4. 

\uD604\uC7AC \uADC0\uD558\uC758 \uC2A4\uD1A0\uC5B4\uC5D0\uC11C \uD310\uB9E4 \uC911\uC778 \uCD1D ${products.length}\uAC1C\uC758 \uB77C\uC774\uBE0C \uC0C1\uD488\uC744 \uBAA8\uB2C8\uD130\uB9C1 \uC911\uC785\uB2C8\uB2E4. 
- **\uCD5C\uC800\uAC00 \uC720\uC9C0 \uC0C1\uD488:** ${products.filter((p) => p.status === "\uCD5C\uC800\uAC00 \uC720\uC9C0").length}\uAC1C
- **\uAC00\uACA9 \uC6B0\uC704 \uC0C1\uD488:** ${products.filter((p) => p.status === "\uAC00\uACA9 \uC6B0\uC704").length}\uAC1C
- **\uACBD\uC7C1 \uBC00\uB9BC \uC0C1\uD488:** ${products.filter((p) => p.status === "\uACBD\uC7C1 \uBC00\uB9BC").length}\uAC1C (\uC989\uC2DC \uAC00\uACA9 \uCD5C\uC801\uD654 \uAD8C\uC7A5!)

\uC5B4\uB5A4 \uC804\uB7B5\uC801 \uC758\uC0AC\uACB0\uC815\uC744 \uB3C4\uC640\uB4DC\uB9B4\uAE4C\uC694? "\uCD5C\uADFC GMV \uC0C1\uC704 \uD488\uBAA9 \uBD84\uC11D", "\uD0C0\uC0AC \uCD5C\uC800\uAC00 \uC77C\uCE58", "\uB300\uC2DC\uBCF4\uB4DC \uC2DC\uAC01\uD654 \uAE30\uB2A5" \uB4F1\uC5D0 \uB300\uD574 \uBB3C\uC5B4\uBCF4\uC138\uC694!`;
        }
        res.json({ text });
      }, 800);
    }
  });
  if (process.env.NODE_ENV !== "production") {
    app.use((req, _res, next) => {
      const host = req.headers.host ?? "";
      if (!host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
        req.headers.host = `localhost:${PORT}`;
        req.headers["x-forwarded-host"] = host;
      }
      next();
    });
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true,
        host: true,
        allowedHosts: "all"
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log("\n========================================");
    console.log("  Gmarket PriceQ \uC11C\uBC84\uAC00 \uC2E4\uD589\uB418\uC5C8\uC2B5\uB2C8\uB2E4");
    console.log("========================================");
    console.log(`  \uB0B4 PC:     http://localhost:${PORT}  \u2190 \uBCF8\uC778\uC740 \uC774 \uC8FC\uC18C \uC0AC\uC6A9`);
    const networkUrls = getLocalNetworkUrls(PORT);
    if (networkUrls.length > 0) {
      console.log("  \uAC19\uC740 Wi-Fi:");
      networkUrls.forEach((url) => console.log(`             ${url}`));
    }
    if (process.env.TUNNEL === "true") {
      console.log("  \uC678\uBD80 \uACF5\uC720:  \uD130\uB110 \uC0DD\uC131 \uC911...");
      startPublicTunnel(PORT);
    } else {
      console.log("  \uC678\uBD80 \uACF5\uC720:  npm run share \uC2E4\uD589 \uD6C4 URL \uD655\uC778");
      console.log("========================================\n");
    }
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
