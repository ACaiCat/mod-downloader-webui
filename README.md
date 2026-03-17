# Trashy Workshop Downloader

垃圾Steam创意工坊模组镜像下载器的前端页面，`https://workshop.755757.xyz`的前端版 (100% AI)

## 开发

```bash
pnpm install
pnpm run dev
```

## 构建

```bash
pnpm run build
```

产物在`dist/`目录下。

## 部署

1. 执行`pnpm run build`生成静态文件
2. 将`dist/`目录下的所有文件部署到你的 Web服务器
3. 默认 API 地址为`https://workshop.755757.xyz`，如需修改请编辑 `src/services/api.js`中的`API_BASE`
4. 如果前端和后端不同域，后端需要配置CORS头

### Nginx 参考配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## API 文档

见 [API.md](API.md)。
