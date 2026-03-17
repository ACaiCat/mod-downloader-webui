# Trashy Workshop Downloader

垃圾Steam创意工坊模组镜像下载器的前端页面，会自动使用当前访问域名下的 API (100% AI)

## 开发

```bash
pnpm install
pnpm run dev
```

如需在本地开发时指向其他后端，可设置`VITE_API_BASE`，例如：

```bash
VITE_API_BASE=https://workshop.755757.xyz pnpm run dev
```

## 构建

```bash
pnpm run build
```

产物在`dist/`目录下。

## 部署

1. 执行`pnpm run build`生成静态文件
2. 将`dist/`目录下的所有文件部署到你的 Web服务器
3. 前端会自动请求当前访问域名下的`/api`和`/depots`
4. 如需覆盖默认行为，可通过`VITE_API_BASE`指定 API 根地址
5. 如果后端不和前端部署在同一域名下，推荐在 Web 服务器上将`/api`和`/depots`反向代理到后端服务

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

    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
    }

    location /depots/ {
        proxy_pass http://127.0.0.1:8080/depots/;
    }
}
```

## API 文档

见 [API.md](API.md)。
