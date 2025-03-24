
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
   - 任务计划配置

3. 常用操作命令：
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