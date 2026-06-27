# 城市踏勘官 CityScout

高德开放平台 Skill 创意征集赛作品。

城市踏勘官 CityScout 是一个面向城市更新、商业选址、文旅动线和街区活力评估的地图智能 Skill。

它的核心叙事是：**唤醒城市沉睡的基因**。

每座城市都有一些还没被看见的线索：老街巷里的生活方式、被忽略的公共空间、断裂的慢行路径、尚未释放的商业活力。CityScout 用高德地图能力把这些线索从地图中找出来，转化成一条可以走、可以看、可以拍、可以汇报的现场证据路线。故事负责让人想走进城市，证据负责让判断站得住。

## 核心价值

普通路线推荐回答“去哪玩”，CityScout 追问“想判断什么”，再把城市线索组织成可现场验证的证据路线。

它不是泛旅游推荐，也不是抽象地讲城市故事。它用地理编码定位故事起点，用 POI 搜索发现城市线索，用路线规划串联现场证据，用观察清单完成城市判断。

适用人群：

- 城市规划与建筑设计管理人员
- 商业选址与招商运营人员
- 文旅策划人员
- 政府项目和街区治理工作人员
- 需要快速组织现场调研的 AI Agent 用户


## 为什么不是普通 Citywalk

| 普通地图 / Citywalk | CityScout |
|---|---|
| 推荐去哪玩 | 追问想判断什么 |
| 把 POI 当目的地 | 把 POI 当城市线索 |
| 生成游览路线 | 生成现场证据路线 |
| 强调好逛、好看、好吃 | 强调证据、推断、待核实 |
| 服务一次出行 | 支撑一个城市判断 |
## 高德能力调用

- 地理编码 API：找到城市故事的空间起点。
- POI 搜索 / 周边搜索：发现交通、商业、公共服务、安全节点等城市线索。
- 路径规划 API：把分散线索串成可执行的现场证据路线。
- 行政区划能力：补充片区背景和空间语境。
- 天气 API：补充现场踏勘提醒。
- JSAPI / 静态地图：把城市证据可视化。

## 文件结构

```text
submission/skill.md       # 可上传的 Skill 文件
submission/tutorial.md    # 使用教程
submission/form_answer.md # 报名表填写稿
submission/social_post.md # 外站传播稿
submission/promotion_mvp_pack.md # 传播与 MVP 推进包
submission/amap_api_integration.md # 真实高德 API 接入说明
demo/index.html           # 本地静态 Demo
demo/scale.html           # 当前最终状态 Scale Demo
city-scout-amap-skill/    # ClawHub/GitHub 发布用 Skill 包
```

## Demo

评委快速入口：

```text
http://127.0.0.1:8766/demo/judge.html
```

推荐评审入口：先打开最终状态看板，快速查看真实高德 API、地图底图、POI 点位、路线折线和 Skill 输出结构。

```text
http://127.0.0.1:8766/demo/scale.html
```

交互演示入口：

```text
demo/index.html
```

默认交互 Demo 使用示例数据模拟高德 API 返回结果，适合直接打开或上传报名表。

如果要查看真实高德 Web 服务返回，可使用本地代理模式。真实 Key 只由本机 Node 服务读取，不进入浏览器页面和公开仓库：

```bash
cp .env.example .env
# 填写 AMAP_WEB_SERVICE_KEY
node scripts/amap_demo_server.mjs
```

然后打开：

```text
http://127.0.0.1:8766/demo/index.html
```

查看当前最终状态看板：

```text
http://127.0.0.1:8766/demo/scale.html
```

`scale.html` 是当前推荐展示页，采用更接近开源高完成度后台模板的 dashboard 结构：首屏展示概念、真实地图、POI 数量、路线距离和证据状态，下方展示 API 摘要、POI 线索卡片、地图证据、现场推断和待核实清单。

## 真实 API 试跑

本仓库已完成一次本地高德 Web 服务 API 最小链路验证：

- 地理编码 API：片区名称转坐标。
- 周边 POI 搜索 API：获取候选踏勘点。
- 步行路线规划 API：验证点位之间的可达性。

试跑报告见：

```text
submission/real_api_run_report.md
```

真实 Key 仅保存在本地 `.env`，不会提交到 GitHub 或 ClawHub。公开仓库只保留 `.env.example`。

本次试跑也暴露了一个真实地图产品必须处理的问题：片区名称可能被地理编码到近似地点，因此 Skill 输出会区分“地图证据、推断、待现场核实”，避免把接口结果直接包装成规划结论。

本地复验命令：

```bash
cp .env.example .env
# 填写 AMAP_WEB_SERVICE_KEY 后运行
node scripts/test_amap_web_service.mjs
```

本地可视化验证：

```bash
node scripts/amap_demo_server.mjs
```

## SkillZone

高德开放平台 SkillZone：

```text
https://lbs.amap.com/ai/skillzone
```

## Published Links

- GitHub: https://github.com/kue0000/city-scout-amap-skill
- ClawHub: https://clawhub.ai/kue0000/city-scout-amap-skill

## 示例输入

```text
帮我为“福州烟台山历史风貌区城市更新踏勘”规划一条 90 分钟步行路线。
重点看商业活力、历史建筑利用、慢行体验、公共服务和夜间安全。
请帮我唤醒这个片区里沉睡的城市线索，并输出点位、观察清单、拍照建议和 3 句汇报摘要。
```

## 输出内容

- 任务判断
- 高德能力调用说明
- 证据路线
- 点位观察清单
- 风险与机会
- 现场执行清单
- 3 句汇报摘要
- 待核实数据

## 原创声明

本作品为原创 Skill 设计，未在其他赛事中获奖，未公开发表或商业化。








