# 高德 API 真实接入说明

当前 Demo 默认使用示例数据，不需要 API Key。这样做的好处是：

- 可以直接上传 Demo 文件或录屏。
- 不会把 Frank 的高德 Key 暴露到公开仓库。
- 评委能看懂产品形态和接口链路。

## 已完成的真实试跑

本作品已经完成一次本地 Web 服务 API 最小链路验证：

- 地理编码 API：成功
- 周边 POI 搜索 API：成功
- 步行路线规划 API：成功

脱敏报告：

```text
submission/real_api_run_report.md
```

复验脚本：

```text
scripts/test_amap_web_service.mjs
```

运行方式：

```bash
cp .env.example .env
# 填写 AMAP_WEB_SERVICE_KEY
node scripts/test_amap_web_service.mjs
```

注意：本次试跑中，片区名称“福州烟台山历史风貌区”被高德地理编码返回为近似历史风貌区坐标。这不是失败，而是地图智能产品的真实边界：地址/片区识别需要结合候选结果、行政区、人工确认或二次检索。CityScout 因此在输出中明确区分“地图证据、推断、待现场核实”。

## 什么时候需要真实 API Key

需要以下任一目标时，再接入真实高德 API：

- 录制“真实数据返回”的 Demo 视频。
- 在网页里真实搜索片区、POI 和路线。
- 发布一个可在线试用的版本。
- 需要证明接口调用已经跑通。

## 建议接入的高德能力

1. 地理编码 API
   - 用途：把“福州烟台山历史风貌区”转为经纬度。
   - 文档：https://lbs.amap.com/api/webservice/guide/api/georegeo

2. POI 搜索 / 周边搜索
   - 用途：检索交通、商业、公园、医院、学校、派出所、停车场等点位。
   - 文档：https://lbs.amap.com/api/webservice/guide/api/search

3. 路线规划 API
   - 用途：把筛选出的点位组织成步行、驾车或公交路线。
   - 文档：https://lbs.amap.com/api/webservice/guide/api/direction

4. JSAPI 2.0
   - 用途：在 Demo 页面展示地图、点位和路线。
   - 文档：https://lbs.amap.com/api/javascript-api-v2/summary

## Key 保护规则

- 不要把真实 Key 写入 `demo/index.html` 后提交到公开 GitHub。
- 公开仓库里只保留 `.env.example` 或占位符。
- 如果做本地录屏，可以临时在本机输入 Key，录完后删除。
- 如果发布在线 Demo，应通过后端代理调用 Web 服务 API，避免前端暴露 Web 服务 Key。

## 最小真实接入方案

MVP 接入只做 2 个接口即可：

- 地理编码：片区转坐标。
- 周边搜索：检索候选 POI。

路线规划可以先继续用前端排序模拟，因为比赛更看重 Skill 创意、使用场景、功能描述、教程和 Demo 表达。

## 需要 Frank 提供的信息

如果要进入真实 API 接入，请提供：

- 高德开放平台 Web 服务 Key
- 是否允许这个 Key 只用于本地 Demo 测试
- 是否有 JSAPI 安全密钥配置

收到后，我会做本地-only 接入，并确保不把 Key 写入提交材料或公开仓库。
