# CloudFlare Warp KEY 自动收集工具

[English](README.md) | [简体中文](README_CN.md)

**Warp Key 自动收集工具** 是一个强大的自动化工具，用于从多个来源收集、验证和维护高质量的 Cloudflare Warp+ 密钥池。

本项目现已升级为基于 Next.js 和 Vercel 的现代化 Web 应用，提供实时数据可视化、变更追踪和便捷的 API 接口。

> **注意**: 原始的 Go 语言实现依然保留，可用于旧版兼容和私有化部署。

## ✨ 核心特性

- **多源自动采集**: 自动从多个 Telegram 频道和网络来源抓取密钥。
- **智能验证去重**: 自动验证密钥有效性并去除重复项，确保高可用性。
- **实时变更追踪**: 在 Web 界面上直观展示新增和失效的密钥（绿色/红色标记）。
- **RESTful API**: 提供简单的纯文本接口，方便集成到其他应用或脚本中。
- **双重列表支持**:
  - **完整列表 (Full)**: 包含所有约 100 个经过验证的有效密钥。
  - **精简列表 (Lite)**: 随机精选 15 个密钥，适合快速访问。
- **全自动更新**: 支持通过 Vercel Cron Job 或本地 Shell 脚本实现每小时自动更新。

## 🚀 直接获取

您可以直接通过我们要托管的 API 获取最新的 Warp+ 密钥（每小时更新）：

- **Web 界面**: https://warp-tool.vercel.app/
也可以访问我的博客获取更多信息：[Haoyu Wang's Blog](https://www.wanghaoyu.com.cn/archives/cloudflare-warp-key.html)

## 🛠️ 部署指南

### 方法一：Vercel 部署 (推荐)

项目已改为实时抓取，每次请求都会即时获取密钥列表，无需任何外部存储。

1.  **Fork** 本仓库到您的 GitHub。
2.  在 Vercel 中 **Import** 该项目。
3.  **设置环境变量**:
    *   `CRON_SECRET`: 设置一个复杂的随机字符串，用于保护定时任务接口。
    *   `NEXT_PUBLIC_APP_URL`: 您的 Vercel 部署域名 (例如 `https://your-app.vercel.app`)。
4.  **定时任务（可选）**: 仍可访问 `/api/cron` 做健康检查，但不会再持久化数据。

### 方法二：私有化部署 (Go)

您仍然可以在自己的服务器上运行传统的 Go 版本。

#### 1. 安装 Go
从 [Go 官方网站](https://golang.org/dl/) 下载并安装。

#### 2. 克隆与构建
```bash
git clone https://github.com/nas-tool/warpkey.git
cd warpkey

# 构建应用程序
chmod a+x build.sh
./build.sh
```
编译后的二进制文件将位于 `./build` 目录中。

#### 3. 运行
```bash
./build/warpkey
# 或者使用代理运行
./build/warpkey --proxy http://127.0.0.1:7890
```
采集到的密钥将保存在 `./data` 目录下。

#### 4. 自动更新
您可以使用 `crontab` 设置定时任务，定期执行 `update.sh` 脚本，将更新后的密钥自动提交到您的 Git 仓库。

## 📄 许可

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 👨‍💻 作者

由 **Haoyu Wang** 构建。
访问我的网站: [www.wanghaoyu.com.cn](https://www.wanghaoyu.com.cn)
