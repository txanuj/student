# 🔐 GitHub Authentication & Push Guide

## ⚠️ Authentication Required

GitHub requires authentication to push code. You have two options:

## Option 1: GitHub CLI (Recommended - Easiest)

### Install GitHub CLI
Download from: https://cli.github.com/

### Authenticate and Push
```bash
# Login to GitHub
gh auth login

# Follow the prompts:
# - Choose: GitHub.com
# - Choose: HTTPS
# - Authenticate with: Login with a web browser
# - Copy the code and press Enter
# - Browser will open, paste code and authorize

# Push your code
git push -u origin main
```

## Option 2: Personal Access Token

### Create Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "Inventory System"
4. Select scopes: `repo` (all)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

### Configure Git
```bash
# Set your credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Push with token (replace YOUR_TOKEN)
git remote set-url origin https://YOUR_TOKEN@github.com/txanuj/student.git
git push -u origin main
```

## Option 3: SSH Key (Most Secure)

### Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# Press Enter for all prompts
```

### Add to GitHub
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
# Or on Windows:
type %USERPROFILE%\.ssh\id_ed25519.pub
```

1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Paste your public key
4. Click "Add SSH key"

### Update Remote and Push
```bash
git remote set-url origin git@github.com:txanuj/student.git
git push -u origin main
```

## Quick Fix (Use GitHub CLI)

**Easiest method:**
```bash
# 1. Install GitHub CLI from https://cli.github.com/
# 2. Run:
gh auth login

# 3. Push:
git push -u origin main
```

## Verify Your Repository

After successful push, visit:
**https://github.com/txanuj/student**

## Troubleshooting

### "Permission denied"
- Make sure you're logged in to the correct GitHub account
- Verify the repository exists and you have write access

### "Repository not found"
- Check the remote URL: `git remote -v`
- Make sure the repository exists on GitHub

### "Authentication failed"
- Token might be expired
- Generate a new token with `repo` scope

---

**Need help?** Let me know which method you prefer and I'll guide you through it!
