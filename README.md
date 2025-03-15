# Todo List 应用

这是一个使用React和Node.js构建的Todo List应用。前端使用React + Vite构建，后端使用Express + MongoDB。

## 部署说明

### 前端部署（GitHub Pages）

1. 确保你的GitHub仓库已经创建并初始化
2. 将代码推送到GitHub仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/to-do-list.git
   git push -u origin main
   ```

3. 安装依赖并部署：
   ```bash
   cd client
   npm install
   npm run deploy
   ```

4. 在GitHub仓库设置中启用GitHub Pages：
   - 进入仓库的Settings标签
   - 找到Pages设置
   - 选择gh-pages分支作为部署源

### 后端部署

后端API需要部署到支持Node.js的云平台（如Heroku、Vercel等）。部署后，需要更新前端代码中的API地址。

## 开发说明

### 前端开发

```bash
cd client
npm install
npm run dev
```

### 后端开发

```bash
npm install
npm start
```

## 环境变量

创建.env文件并配置以下环境变量：

```
MONGODB_URI=你的MongoDB连接字符串
JWT_SECRET=你的JWT密钥
PORT=3000
```

## 技术栈

- 前端：React、Vite、Ant Design、React Router
- 后端：Node.js、Express、MongoDB、Mongoose
- 部署：GitHub Pages（前端）、待定（后端）