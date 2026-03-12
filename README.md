# CloudFlare Warp KEY Automatic Collection Tool

[English](README.md) | [简体中文](README_CN.md)

**Warp Key Auto-Collector** is a robust tool that automatically collects, validates, and maintains a high-quality pool of Cloudflare Warp+ keys from multiple sources.

This project now features a modern Web UI powered by Next.js and Vercel, providing real-time visualization, change tracking, and easy-to-use API endpoints.

> **Note**: The original Go implementation is preserved for legacy support and private deployment.

## ✨ Features

- **Multi-source Collection**: Automatically scrapes keys from various Telegram channels and sources.
- **Smart Validation**: Verifies keys and removes duplicates to ensure high availability.
- **Change Tracking**: Visualizes newly added and removed keys in real-time on the web interface.
- **RESTful API**: Provides simple text-based endpoints for easy integration.
- **Dual Lists**:
  - **Full List**: Contains all verified keys (~100 keys).
  - **Lite List**: A random selection of 15 keys for quick access.
- **Automated Updates**: Runs hourly via Cron Jobs (Vercel) or Shell Scripts (Local).

## 🚀 Direct Access

You can access the latest Warp+ keys directly via our hosted API (updated hourly):

- **Web Interface**: [https://warpkey.vercel.app](https://warpkey.vercel.app)
- **Full List API**: [https://warpkey.vercel.app/api/full](https://warpkey.vercel.app/api/full)
- **Lite List API**: [https://warpkey.vercel.app/api/lite](https://warpkey.vercel.app/api/lite)

## 🛠️ Deployment

### Method 1: Vercel (Recommended)

This project is optimized for Vercel Serverless/Edge functions with Vercel Blob storage.

1.  **Fork** this repository.
2.  **Deploy** to Vercel.
3.  **Configure Storage**: Add the Vercel Blob integration and ensure `BLOB_READ_WRITE_TOKEN` is available to your project.
4.  **Set Environment Variables**:
    *   `BLOB_READ_WRITE_TOKEN`: Provided by the Vercel Blob integration for reading/writing the JSON files.
    *   `CRON_SECRET`: A secure random string for protecting the cron endpoint.
    *   `NEXT_PUBLIC_APP_URL`: Your Vercel app URL (e.g., `https://your-app.vercel.app`).
5.  **Setup Cron Job**: The `vercel.json` is already configured to run the update job hourly.

### Method 2: Private Deployment (Go)

You can still run the legacy Go version on your own server.

#### 1. Install Go
Download and install Go from the [official website](https://golang.org/dl/).

#### 2. Clone & Build
```bash
git clone https://github.com/nas-tool/warpkey.git
cd warpkey

# Build the application
chmod a+x build.sh
./build.sh
```
The compiled binary will be in the `./build` directory.

#### 3. Run
```bash
./build/warpkey
# Or with proxy
./build/warpkey --proxy http://127.0.0.1:7890
```
Keys will be saved in the `./data` directory.

#### 4. Auto Update
Use `crontab` to schedule the `update.sh` script to run periodically and commit changes to your Git repository.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Built by **Haoyu Wang**.
Visit my website: [www.wanghaoyu.com.cn](https://www.wanghaoyu.com.cn)
