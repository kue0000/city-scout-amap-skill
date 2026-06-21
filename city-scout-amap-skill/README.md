# 城市踏勘官 CityScout

这是一个面向高德开放平台 Skill 创意征集赛的 Skill 包。

## 一句话

**唤醒城市沉睡的基因。** 输入城市片区、任务目标和时间预算，生成可执行的现场证据路线、观察清单、风险点、拍照建议和 3 句汇报摘要。

CityScout 不是推荐“去哪玩”的普通 Citywalk 工具，而是帮助用户带着一个城市判断走进现场：哪里值得看、为什么看、现场看什么、拍什么、哪些只是推断、哪些还要核实。

## 推荐评审入口

如果要快速理解作品，请先看最终状态看板：

```text
http://127.0.0.1:8766/demo/scale.html
```

Scale Demo 已验证：

- 真实高德 Web 服务 API
- 高德 JSAPI 地图底图
- 8 个 POI 线索
- 245m 首段步行路线
- 15 个路线折点
- 地图证据 / 现场推断 / 待核实三分法

交互 Demo：

```text
http://127.0.0.1:8766/demo/index.html
```

启动本地代理：

```bash
node scripts/amap_demo_server.mjs
```

## 适用场景

- 城市更新现场踏勘
- 商业选址调研
- 文旅动线策划
- 街区活力评估
- 夜间安全巡查

## 高德开放平台能力

- 地理编码 API：把片区名转成空间坐标
- POI 搜索 / 周边搜索：发现交通、商业、公共服务、安全节点等城市线索
- 路线规划 API：把线索串成可执行的现场证据路线
- 行政区划能力：补充片区背景
- 天气 API：补充现场踏勘提醒
- JSAPI / 静态地图展示：把证据路线可视化

## 输出结构

CityScout 的输出重点不是路线本身，而是支撑一个城市判断：

- 任务判断
- 被唤醒的城市基因
- 高德能力调用说明
- 证据路线
- 地图证据 / 现场推断 / 待核实
- 风险与机会
- 现场执行清单
- 3 句汇报摘要
- 下一步

## 文件

- `SKILL.md`：Skill 主文件
- `examples/example_prompt.md`：示例输入
- `examples/example_output.md`：示例输出

完整参赛材料、Demo 和打包文件位于 GitHub 仓库：

```text
https://github.com/kue0000/city-scout-amap-skill
```

## API Key

本 Skill 包不包含真实高德 API Key。真实 Key 仅放在本地 `.env`，不进入公开仓库或浏览器页面。公开仓库只保留 `.env.example`。

## 真实 API 验证

根仓库已提供本地验证脚本和脱敏试跑报告：

```text
scripts/test_amap_web_service.mjs
submission/real_api_run_report.md
```

已验证链路包括：地理编码、周边 POI 搜索、步行路线规划。
