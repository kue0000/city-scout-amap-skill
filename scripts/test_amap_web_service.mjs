import fs from "node:fs";
import path from "node:path";

const envPath = process.env.ENV_FILE || ".env";
const outputDir = process.env.OUTPUT_DIR || "submission";
const area = process.env.AMAP_TEST_AREA || "福州烟台山历史风貌区";
const city = process.env.AMAP_TEST_CITY || "福州";

function readDotEnv(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const result = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index <= 0) continue;
    result[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return result;
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url.replace(/key=[^&]+/, "key=***")}`);
  }
  const data = await response.json();
  if (data.status !== "1") {
    throw new Error(`Amap API status=${data.status}, info=${data.info}, infocode=${data.infocode}`);
  }
  return data;
}

const env = readDotEnv(envPath);
const key = env.AMAP_WEB_SERVICE_KEY;
if (!key || key.startsWith("replace_with")) {
  throw new Error("AMAP_WEB_SERVICE_KEY is missing or still uses the placeholder.");
}

fs.mkdirSync(outputDir, { recursive: true });

const geoUrl = new URL("https://restapi.amap.com/v3/geocode/geo");
geoUrl.searchParams.set("address", area);
geoUrl.searchParams.set("city", city);
geoUrl.searchParams.set("key", key);
const geo = await getJson(geoUrl);
const firstGeo = geo.geocodes?.[0];
if (!firstGeo?.location) throw new Error(`No geocode result for ${area}`);

const aroundUrl = new URL("https://restapi.amap.com/v3/place/around");
aroundUrl.searchParams.set("location", firstGeo.location);
aroundUrl.searchParams.set("keywords", "公交|地铁|停车场|商业|公园|学校|医院|派出所|便利店|景点");
aroundUrl.searchParams.set("radius", "1500");
aroundUrl.searchParams.set("offset", "20");
aroundUrl.searchParams.set("page", "1");
aroundUrl.searchParams.set("extensions", "base");
aroundUrl.searchParams.set("key", key);
const around = await getJson(aroundUrl);
const pois = (around.pois || []).slice(0, 8);
if (pois.length < 2) throw new Error(`Not enough POI results around ${area}`);

const walkingUrl = new URL("https://restapi.amap.com/v3/direction/walking");
walkingUrl.searchParams.set("origin", pois[0].location);
walkingUrl.searchParams.set("destination", pois[1].location);
walkingUrl.searchParams.set("key", key);
const walking = await getJson(walkingUrl);
const firstPath = walking.route?.paths?.[0] || {};

const poiRows = pois.map((poi) =>
  `| ${poi.name || ""} | ${poi.type || ""} | ${poi.address || ""} | ${poi.location || ""} |`
);

const report = `# 城市踏勘官 CityScout 真实高德 API 试跑报告

生成时间：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}

## 结论

本次使用本地 \`.env\` 中的高德 Web 服务 Key 完成了最小真实链路验证：

- 地理编码 API：成功
- 周边 POI 搜索 API：成功
- 步行路线规划 API：成功

公开仓库不包含任何真实 Key。本报告只记录脱敏后的接口结果摘要。

## 输入

- 片区：${area}
- 城市：${city}
- 出行方式：步行
- 搜索半径：1500 米

## 地理编码结果

- 标准地址：${firstGeo.formatted_address || ""}
- 坐标：${firstGeo.location}

## 周边 POI 样例

| 名称 | 类型 | 地址 | 坐标 |
|---|---|---|---|
${poiRows.join("\n")}

## 步行路线验证

- 起点：${pois[0].name}
- 终点：${pois[1].name}
- 距离：${firstPath.distance || ""} 米
- 预计耗时：${firstPath.duration || ""} 秒

## 对参赛作品的意义

这证明 CityScout 不是单纯静态文案，而是可以落到高德开放平台的真实能力链路：

1. 用地理编码把片区名称转为空间坐标。
2. 用周边搜索获取踏勘候选点。
3. 用路线规划验证点位之间的可达性。
4. 再由 Skill 生成现场观察清单、拍照建议、风险与机会判断、汇报摘要。

## 安全说明

- 真实 Key 仅保存在本地 \`.env\`。
- \`.gitignore\` 已忽略 \`.env\` 和 \`.env.*\`。
- GitHub / ClawHub 只发布 \`.env.example\`。
`;

const reportPath = path.join(outputDir, "real_api_run_report.md");
fs.writeFileSync(reportPath, report, "utf8");

console.log(JSON.stringify({
  area,
  city,
  formattedAddress: firstGeo.formatted_address,
  location: firstGeo.location,
  poiCountReturned: (around.pois || []).length,
  walkingDistanceMeters: firstPath.distance || null,
  walkingDurationSeconds: firstPath.duration || null,
  reportPath: path.resolve(reportPath)
}, null, 2));
