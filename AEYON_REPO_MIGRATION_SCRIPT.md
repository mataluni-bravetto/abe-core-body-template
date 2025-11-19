# AEYON Repo Migration Script - Complete Execution Plan

**Date:** 2025-11-18  
**Status:** 🔥 **MIGRATION REQUIRED**  
**Pattern:** AEYON × MIGRATION × RECOVERY × ONE  
**Frequency:** 999 Hz (AEYON)

---

## 🎯 DIAGNOSIS UPDATED

**Root Cause:** GitHub Git Protocol Infrastructure Failure  
**Evidence:** Clone, push, fetch, ls-remote all return HTTP 500  
**Scope:** Affects ALL repositories (original + newly created)  
**API Status:** ✅ REST API fully functional  
**Local Git:** ✅ Repository intact (bundle created: 327MB)

**Critical Finding:** Even newly created repositories fail git protocol operations, indicating a broader GitHub infrastructure issue affecting this account/region, not repository-specific corruption.

---

## ⚠️ CRITICAL UPDATE

**Git Protocol Currently Failing:** Even the recovery repository returns HTTP 500 for git operations. This indicates a GitHub infrastructure issue affecting git protocol endpoints.

**Immediate Actions:**
1. ✅ Git bundle created: `/tmp/AiGuardian-recovery.bundle` (327MB)
2. ⏳ Wait 30 minutes, then retry git operations
3. 📞 Contact GitHub Support if issue persists
4. 🔄 Test alternative git host to verify local git works

**See:** `GITHUB_GIT_PROTOCOL_FAILURE_REPORT.md` for complete diagnosis

---

## 🚀 AEYON REPO MIGRATION SCRIPT

**⚠️ NOTE:** Execute these steps AFTER git protocol recovers or use alternative methods below.

### Step 1: Create New Recovery Repository

```bash
cd /Users/michaelmataluni/Documents/AbeOne_Master/AiGuardian-Chrome-Ext-dev

# Create new repository via GitHub CLI
gh repo create AiGuardian-Chrome-Ext-Recovered \
  --private \
  --description "Chrome Extension Version of the AI-Guardians Suite (Recovered)" \
  --clone=false
```

**Expected Output:**
```
✓ Created repository bravetto/AiGuardian-Chrome-Ext-Recovered
```

---

### Step 2: Add Recovery Remote

```bash
cd /Users/michaelmataluni/Documents/AbeOne_Master/AiGuardian-Chrome-Ext-dev

# Add recovery repository as new remote
git remote add recover https://github.com/bravetto/AiGuardian-Chrome-Ext-Recovered.git

# Verify remotes
git remote -v
```

**Expected Output:**
```
origin	https://github.com/bravetto/AiGuardian-Chrome-Ext.git (fetch)
origin	https://github.com/bravetto/AiGuardian-Chrome-Ext.git (push)
recover	https://github.com/bravetto/AiGuardian-Chrome-Ext-Recovered.git (fetch)
recover	https://github.com/bravetto/AiGuardian-Chrome-Ext-Recovered.git (push)
```

---

### Step 3: Push All Branches and Commits

```bash
cd /Users/michaelmataluni/Documents/AbeOne_Master/AiGuardian-Chrome-Ext-dev

# Push dev branch (base branch)
git push recover dev

# Push feature branch with all commits
git push recover fix/analysis-history-and-auth-issues

# Push all other branches (if any exist locally)
git push recover --all

# Push all tags (if any)
git push recover --tags
```

**Expected Output:**
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Delta compression using up to X threads
Compressing objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
Total X (delta X), reused X (delta X)
To https://github.com/bravetto/AiGuardian-Chrome-Ext-Recovered.git
 * [new branch]      dev -> dev
 * [new branch]      fix/analysis-history-and-auth-issues -> fix/analysis-history-and-auth-issues
```

---

### Step 4: Validate Recovery Repository

```bash
cd /Users/michaelmataluni/Documents/AbeOne_Master/AiGuardian-Chrome-Ext-dev

# Test git operations on recovery repo
git ls-remote recover

# Verify branches exist
gh repo view bravetto/AiGuardian-Chrome-Ext-Recovered

# List branches
gh api repos/bravetto/AiGuardian-Chrome-Ext-Recovered/git/refs
```

**Expected Output:**
```
✅ git ls-remote works (no HTTP 500)
✅ Repository accessible
✅ Branches visible
```

---

### Step 5: Update Local Repository Configuration

```bash
cd /Users/michaelmataluni/Documents/AbeOne_Master/AiGuardian-Chrome-Ext-dev

# Option A: Replace origin with recovery (recommended)
git remote remove origin
git remote rename recover origin

# Option B: Keep both remotes (for reference)
# Keep as-is, use 'recover' for new operations
```

---

### Step 6: Create PR in Recovery Repository

```bash
cd /Users/michaelmataluni/Documents/AbeOne_Master/AiGuardian-Chrome-Ext-dev

# Create PR from feature branch to dev
gh pr create \
  --repo bravetto/AiGuardian-Chrome-Ext-Recovered \
  --base dev \
  --head fix/analysis-history-and-auth-issues \
  --title "Fix: Analysis History and Auth Issues" \
  --body-file PR_SUMMARY.md
```

---

## 📋 COMPLETE ONE-LINER SCRIPT

```bash
cd /Users/michaelmataluni/Documents/AbeOne_Master/AiGuardian-Chrome-Ext-dev && \
gh repo create AiGuardian-Chrome-Ext-Recovered --private --description "Chrome Extension Version of the AI-Guardians Suite (Recovered)" --clone=false && \
git remote add recover https://github.com/bravetto/AiGuardian-Chrome-Ext-Recovered.git && \
git push recover dev && \
git push recover fix/analysis-history-and-auth-issues && \
git push recover --all && \
git push recover --tags && \
git ls-remote recover && \
echo "✅ Migration complete! Recovery repo: bravetto/AiGuardian-Chrome-Ext-Recovered"
```

---

## ✅ VALIDATION CHECKLIST

After migration, verify:

- [ ] `git ls-remote recover` works (no HTTP 500)
- [ ] All branches pushed successfully
- [ ] All commits present in recovery repo
- [ ] Feature branch exists: `fix/analysis-history-and-auth-issues`
- [ ] Base branch exists: `dev`
- [ ] PR can be created in recovery repo
- [ ] GitHub web UI shows all branches

---

## 🔄 OPTIONAL: Rename Recovery Repo Back

After validation and PR merge:

```bash
# Delete broken repo (requires admin access)
gh repo delete bravetto/AiGuardian-Chrome-Ext --yes

# Rename recovery repo to original name
gh api repos/bravetto/AiGuardian-Chrome-Ext-Recovered -X PATCH -f name=AiGuardian-Chrome-Ext

# Update local remote
git remote set-url origin https://github.com/bravetto/AiGuardian-Chrome-Ext.git
```

**Note:** GitHub will automatically redirect old URLs for 90 days.

---

## 🛡️ GUARDIAN ALIGNMENT

**Pattern:** AEYON × MIGRATION × RECOVERY × ONE  
**Frequency:** 999 Hz (AEYON)  
**Status:** ✅ **MIGRATION SCRIPT READY**  
**Love Coefficient:** ∞

---

## 🔄 ALTERNATIVE: Restore from Git Bundle

When git protocol recovers or using alternative host:

```bash
# Clone from bundle
cd /tmp
git clone /tmp/AiGuardian-recovery.bundle AiGuardian-Restored

# Add recovery remote
cd AiGuardian-Restored
git remote add recover https://github.com/mataluni-bravetto/AiGuardian-Chrome-Ext-Recovered.git

# Push all branches
git push recover --all
git push recover --tags
```

---

## 📋 CURRENT STATUS

- ✅ **Recovery repo created:** `mataluni-bravetto/AiGuardian-Chrome-Ext-Recovered`
- ✅ **Git bundle created:** `/tmp/AiGuardian-recovery.bundle` (327MB)
- ❌ **Git protocol:** Currently failing (HTTP 500)
- ✅ **REST API:** Fully functional
- ✅ **Local repository:** Intact with all branches and history

**Next Step:** Wait 30 minutes, then retry git push. If still failing, contact GitHub Support.

---

**Ready to execute?** Wait for git protocol recovery, then run the migration script above.

