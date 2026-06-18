import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 8766);
const host = process.env.HOST || "127.0.0.1";

function readDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index <= 0) continue;
    env[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return env;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(payload, null, 2));
}

async function getAmapJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  if (data.status !== "1") {
    throw new Error(`Amap ${data.info || "error"} (${data.infocode || "unknown"})`);
  }
  return data;
}

async function handleCityScout(req, res) {
  try {
    const requestUrl = new URL(req.url, `http://${host}:${port}`);
    const area = requestUrl.searchParams.get("area") || "福州烟台山历史风貌区";
    const city = requestUrl.searchParams.get("city") || "福州";
    const env = readDotEnv(path.join(rootDir, ".env"));
    const key = env.AMAP_WEB_SERVICE_KEY;
    if (!key || key.startsWith("replace_with")) {
      return sendJson(res, 400, {
        ok: false,
        error: "AMAP_WEB_SERVICE_KEY is missing in local .env"
      });
    }

    const geoUrl = new URL("https://restapi.amap.com/v3/geocode/geo");
    geoUrl.searchParams.set("address", area);
    geoUrl.searchParams.set("city", city);
    geoUrl.searchParams.set("key", key);
    const geo = await getAmapJson(geoUrl);
    const firstGeo = geo.geocodes?.[0];
    if (!firstGeo?.location) {
      throw new Error(`No geocode result for ${area}`);
    }

    const aroundUrl = new URL("https://restapi.amap.com/v3/place/around");
    aroundUrl.searchParams.set("location", firstGeo.location);
    aroundUrl.searchParams.set("keywords", "公交|地铁|停车场|商业|公园|学校|医院|派出所|便利店|景点");
    aroundUrl.searchParams.set("radius", "1500");
    aroundUrl.searchParams.set("offset", "20");
    aroundUrl.searchParams.set("page", "1");
    aroundUrl.searchParams.set("extensions", "base");
    aroundUrl.searchParams.set("key", key);
    const around = await getAmapJson(aroundUrl);
    const pois = (around.pois || []).slice(0, 8).map((poi) => ({
      name: poi.name || "",
      type: poi.type || "",
      address: Array.isArray(poi.address) ? poi.address.join("") : (poi.address || ""),
      location: poi.location || ""
    }));
    if (pois.length < 2) {
      throw new Error("Not enough POI results for route validation");
    }

    const walkingUrl = new URL("https://restapi.amap.com/v3/direction/walking");
    walkingUrl.searchParams.set("origin", pois[0].location);
    walkingUrl.searchParams.set("destination", pois[1].location);
    walkingUrl.searchParams.set("key", key);
    const walking = await getAmapJson(walkingUrl);
    const firstPath = walking.route?.paths?.[0] || {};
    const routeLine = (firstPath.steps || [])
      .flatMap((step) => String(step.polyline || "").split(";"))
      .filter(Boolean)
      .map((point) => point.split(",").map(Number))
      .filter((point) => point.length === 2 && point.every(Number.isFinite));

    sendJson(res, 200, {
      ok: true,
      source: "real-amap-web-service",
      area,
      city,
      geocode: {
        formattedAddress: firstGeo.formatted_address || "",
        location: firstGeo.location
      },
      pois,
      routeValidation: {
        origin: pois[0].name,
        destination: pois[1].name,
        distanceMeters: firstPath.distance || "",
        durationSeconds: firstPath.duration || "",
        line: routeLine
      },
      boundaryNote: "地理编码可能返回近似地点，正式踏勘前应人工核验片区坐标和候选点。"
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

function handleAmapJsConfig(res) {
  const env = readDotEnv(path.join(rootDir, ".env"));
  const key = env.AMAP_JSAPI_KEY;
  const securityJsCode = env.AMAP_JSAPI_SECURITY_CODE;
  if (!key || key.startsWith("replace_with")) {
    return sendJson(res, 400, {
      ok: false,
      error: "AMAP_JSAPI_KEY is missing in local .env"
    });
  }
  sendJson(res, 200, {
    ok: true,
    key,
    securityJsCode: securityJsCode && !securityJsCode.startsWith("replace_with") ? securityJsCode : ""
  });
}

function serveStatic(req, res) {
  const requestUrl = new URL(req.url, `http://${host}:${port}`);
  const pathname = decodeURIComponent(requestUrl.pathname === "/" ? "/demo/index.html" : requestUrl.pathname);
  const targetPath = path.resolve(rootDir, `.${pathname}`);
  if (!targetPath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = path.extname(targetPath).toLowerCase();
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8"
  };
  res.writeHead(200, {
    "content-type": contentTypes[ext] || "application/octet-stream",
    "cache-control": "no-store"
  });
  fs.createReadStream(targetPath).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.url?.startsWith("/api/city-scout")) {
    handleCityScout(req, res);
    return;
  }
  if (req.url?.startsWith("/api/amap-js-config")) {
    handleAmapJsConfig(res);
    return;
  }
  serveStatic(req, res);
});

server.listen(port, host, () => {
  console.log(`CityScout demo server: http://${host}:${port}/demo/index.html`);
});
