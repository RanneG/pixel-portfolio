# Branch Protection Setup Guide

## Overview

This guide explains how to protect the `main` branch to prevent direct pushes and require pull requests with reviews.

## Quick Setup (GitHub Web UI)

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository: https://github.com/RanneG/pixel-portfolio
2. Click **Settings** (top right)
3. Click **Branches** (left sidebar)
4. Under **Branch protection rules**, click **Add rule**

### Step 2: Configure Protection Rules

**Branch name pattern:** `main`

**Protection Settings:**

✅ **Require a pull request before merging**
   - Required number of approvals: `1`
   - Dismiss stale pull request approvals when new commits are pushed: ✅
   - Require review from Code Owners: ✅ (if you have CODEOWNERS file)

✅ **Require status checks to pass before merging**
   - Require branches to be up to date before merging: ✅
   - Status checks required:
     - `test` (from CI workflow)
     - `build` (from CI workflow)

✅ **Require conversation resolution before merging**: ✅

✅ **Require linear history**: ✅ (optional, keeps history clean)

✅ **Do not allow bypassing the above settings**: ✅

✅ **Restrict who can push to matching branches**: 
   - No one (forces PR workflow)

✅ **Allow force pushes**: ❌

✅ **Allow deletions**: ❌

### Step 3: Save Rules

Click **Create** to save the branch protection rules.

## Alternative: GitHub CLI Setup

If you have GitHub CLI installed and authenticated:

```bash
gh api repos/RanneG/pixel-portfolio/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["test","build"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field required_linear_history=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

## What This Protects Against

- ❌ Direct pushes to `main` branch
- ❌ Force pushes that rewrite history
- ❌ Deleting the `main` branch
- ❌ Merging PRs without reviews
- ❌ Merging PRs with failing CI checks
- ❌ Bypassing protection rules (even for admins)

## Workflow After Protection

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin feature/my-feature
   ```

4. **Create Pull Request:**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch → `main`
   - Fill out PR template
   - Request review (if required)

5. **Wait for CI checks to pass**

6. **Get approval** (if required)

7. **Merge PR** (squash merge recommended for clean history)

## Emergency Bypass

If you need to bypass protection in an emergency:

1. Go to repository **Settings** → **Branches**
2. Temporarily disable protection rules
3. Make emergency fix
4. Re-enable protection rules immediately

**⚠️ Warning:** Only use in true emergencies. Always re-enable protection immediately.

## Verification

After setup, try pushing directly to `main`:

```bash
git checkout main
git commit --allow-empty -m "Test protection"
git push origin main
```

You should see an error:
```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: At least 1 approving review is required by reviewers with write access.
```

This confirms protection is working! ✅

