# 🌐 Hosting & Automatic Deployment Guide

Follow these steps to host your website for free and enable automatic updates from GitHub.

## 1. Create a GitHub Repository
1. Go to [GitHub](https://github.com/new) and create a repository named `sves-website`.
2. Open your terminal in the project folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

## 2. Set Up Free Hosting (InfinityFree)
1. Sign up at [InfinityFree.com](https://www.infinityfree.com/).
2. Create a new account and choose a domain (e.g., `svescollege.great-site.net`).
3. Go to **Control Panel** -> **MySQL Databases** and create a database.
4. Go to **phpMyAdmin** and import the `database.sql` file from your project.

## 3. Connect GitHub to Hosting (The "Auto-Update" Magic)
To make the website update automatically when you push to GitHub:
1. In your **GitHub Repository**, go to **Settings** > **Secrets and variables** > **Actions**.
2. Add the following **New repository secrets**:
   - `FTP_SERVER`: (Found in InfinityFree "FTP Details") - usually `ftpupload.net`
   - `FTP_USERNAME`: (Found in InfinityFree "FTP Details") - e.g., `if0_38123456`
   - `FTP_PASSWORD`: (Found in InfinityFree "FTP Details")

## 4. Update Database Credentials
Edit `includes/db.php` on GitHub (or locally and push) to match your **InfinityFree MySQL Details**:
- `host`: e.g., `sql302.infinityfree.com`
- `user`: Your MySQL username
- `dbname`: Your MySQL database name

---
**Success!** Now, every time you run `git push`, your website will automatically update online.
