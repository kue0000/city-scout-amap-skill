# 城市踏勘官 CityScout

高德开放平台 Skill 创意征集赛作品。

城市踏勘官 CityScout 是一个面向城市更新、商业选址、文旅动线和街区活力评估的地图智能 Skill。用户输入城市片区、任务目标、时间预算和出行方式，即可生成可执行的现场踏勘路线、观察清单、风险点、拍照建议和 3 句汇报摘要。

## 核心价值

普通路线推荐解决“去哪玩”，城市踏勘官解决“为了一个工作判断，应该怎么去现场获取证据”。

它的重点不是泛旅游推荐，而是把高德地图能力封装成面向真实工作流的现场证据获取工具。

适用人群：

- 城市规划与建筑设计管理人员
- 商业选址与招商运营人员
- 文旅策划人员
- 政府项目和街区治理工作人员
- 需要快速组织现场调研的 AI Agent 用户

## 高德能力调用

- 地理编码 API：将片区、地名、地址转成坐标。
- POI 搜索 / 周边搜索：检索交通、商业、公共服务、安全节点等设施。
- 路径规划 API：根据出行方式和时间预算组织现场路线。
- 行政区划能力：补充片区背景。
- 天气 API：补充现场踏勘提醒。
- JSAPI / 静态地图：展示路线和点位。

## 文件结构

```text
submission/skill.md       # 可上传的 Skill 文件
submission/tutorial.md    # 使用教程
submission/form_answer.md # 报名表填写稿
submission/social_post.md # 外站传播稿
submission/amap_api_integration.md # 真实高德 API 接入说明
demo/index.html           # 本地静态 Demo
city-scout-amap-skill/    # ClawHub/GitHub 发布用 Skill 包
```

## Demo

直接打开：

```text
demo/index.html
```

当前 Demo 使用示例数据模拟高德 API 返回结果。正式接入时，可将示例数据替换为高德 Web 服务 API 和 JSAPI 的实时结果。

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
输出点位、观察清单、拍照建议和 3 句汇报摘要。
```

## 输出内容

- 任务判断
- 高德能力调用说明
- 推荐路线
- 点位观察清单
- 风险与机会
- 现场执行清单
- 3 句汇报摘要
- 待核实数据

## 原创声明

本作品为原创 Skill 设计，未在其他赛事中获奖，未公开发表或商业化。
