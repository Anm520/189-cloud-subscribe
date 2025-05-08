
# 天翼云盘订阅管理工具 如有侵权，请联系删除。

基于Docker的云端同步解决方案，提供便捷的天翼云盘订阅管理服务

## 主要功能

✅ 自动定时同步分享文件  
✅ 多账户订阅管理  
✅ 定时同步任务配置  
✅ 基于Web的管理界面  
✅ Docker容器化部署

## 快速部署
```bash
# 拉取镜像
docker pull anm520/189-cloud-subscribe:latest
# 运行容器
docker run -d --name 189-cloud-subscribe -p 8080:80  anm520/189-cloud-subscribe:latest
```
### 使用Docker Compose
创建 `docker-compose.yml` 文件：
```yaml:189-cloud-subscribe/README.md
version: '3.8'
services:
  189-cloud-subscribe:
    image: anm520/189-cloud-subscribe:latest
    container_name: 189-cloud-subscribe
    restart: unless-stopped
    ports:
      - "8080:80"
```

启动服务：
```bash
docker-compose up -d
```

## 使用方式

1. 访问管理界面：
   ```
   http://服务器IP:8080
   ```

2. 首次使用需在Web界面完成：
   - 账户绑定验证
   - 定时配置
   - 订阅任务
3. 定时配置-消息推送 推荐使用钉钉推送、WxPusher消息推送平台
  - 钉钉机器人推送token https://oapi.dingtalk.com/robot/send?access_token=123456 添加access_token=后边的内容；推送关键词添加两个：订阅 通知
  -  [WxPusher消息推送平台](https://wxpusher.zjiecode.com/docs/#/?id=获取spt) 方式二：极简推送  扫码获取wx_push_spt     
   <img src="https://wxpusher.zjiecode.com/api/qrcode/RwjGLMOPTYp35zSYQr0HxbCPrV9eU0wKVBXU1D5VVtya0cQXEJWPjqBdW3gKLifS.jpg" width="200" />
4. 频道消息 需要 tg消息获取程序配合
  - [tg消息获取程序](https://github.com/Anm520/cloud-chanel-py)
5. 常用操作命令：
```bash
# 查看实时日志
docker logs -f 189-cloud-subscribe

# 重启服务
docker restart 189-cloud-subscribe
```

【升级说明】
```bash
docker pull anm520/189-cloud-subscribe:latest
docker-compose down && docker-compose up -d
```
如有侵权，请联系删除。