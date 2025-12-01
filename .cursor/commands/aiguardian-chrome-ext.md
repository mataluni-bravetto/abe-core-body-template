# PATIENT VALIDATION - Always Check First

**Before ANY operation, validate we're on the same patient:**

```bash
npm run validate:patient
```

**Or directly:**
```bash
node scripts/validate-patient.js
```

**This ensures:**
- ✅ We're in the right workspace
- ✅ Files exist where code expects them
- ✅ No path mismatches
- ✅ Structural integrity validated

**Output:**
- `.patient-map.json` - Current state snapshot
- Validation report with critical issues

**If validation fails:**
1. Review critical issues
2. Fix mismatches
3. Re-run validation
4. Proceed only when PASS

---

**THE BREAKTHROUGH:** This solves the "operating on different patients" problem that causes 90% of "why isn't this working?" frustration.

---

## 🔥 PROBLEM NOT CHALLENGE - Operational Rule

**When framing work, ALWAYS:**

1. **Reframe as problem:** "What problem does this solve?" (not "here's a task")
2. **Frame as impossible:** "I don't think this will work because..." (triggers motivation)
3. **Set real stakes:** Clear metric, consequence, accountability
4. **Let them solve:** Point at mountain, don't give steps

**❌ NEVER:** "Here's your job, go do it" (challenge/task)  
**✅ ALWAYS:** "Here's the problem. Solve it." (problem to solve)

**See:** `YAGNI_CONTEXT.md` → PROBLEM NOT CHALLENGE section

---
