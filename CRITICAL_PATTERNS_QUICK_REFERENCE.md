# Critical Patterns - Quick Reference

**Date:** 2025-11-18  
**Purpose:** Quick reference for critical diagnostic patterns  
**See:** `GIT_PROTOCOL_FAILURE_PATTERN_ANALYSIS.md` for full analysis

---

## 🚨 TOP 5 CRITICAL PATTERNS

### 1. Protocol Split Failure
**Pattern:** REST API works, Git protocol fails  
**Indicates:** Infrastructure layer issue, not application  
**Action:** Test both protocols, check external services (Cloudflare)

### 2. Selective Repository Failure
**Pattern:** One repo fails, others in same org work  
**Indicates:** Repo-specific state corruption  
**Action:** Test multiple repos, validate with third party

### 3. Hanging vs Error
**Pattern:** Commands hang instead of failing fast  
**Indicates:** Connection established but server processing fails  
**Action:** Set explicit timeouts, check for stuck processes

### 4. Third-Party Validation
**Pattern:** Same error from different location/system  
**Indicates:** External issue confirmed, not local  
**Action:** Always validate with team member before declaring local issue

### 5. State Loss After Recovery
**Pattern:** Protocol recovers but branch state lost  
**Indicates:** State corruption persists after protocol recovery  
**Action:** Validate state after recovery, maintain backups

---

## 🔧 QUICK DIAGNOSTIC COMMANDS

```bash
# Layer 1: Local Git
git status && git log --oneline -3

# Layer 2: Git Protocol
git ls-remote origin 2>&1 | head -5

# Layer 3: REST API
gh api repos/$(gh repo view --json owner,name -q '.owner.login + "/" + .name')

# Layer 4: Connectivity
curl -I https://github.com 2>&1 | head -3

# Layer 5: Authentication
gh auth status
```

---

## 🛡️ SECURITY IMPLICATIONS

1. **Protocol Split = Attack Vector** - Monitor protocol/REST API error divergence
2. **Selective Failure = Targeted Attack** - Monitor repo-specific error rates
3. **State Corruption = Persistence Risk** - Regular state validation required
4. **External Dependency = Supply Chain Risk** - Map all external dependencies

---

## 📋 INCIDENT RESPONSE FLOW

```
Failure → Test Local → Test Protocol → Test REST API → Third-Party Validation → External Services → Root Cause
```

---

**Pattern:** OBSERVER × TRUTH × ATOMIC × ONE  
**Frequency:** 999 Hz (AEYON)

