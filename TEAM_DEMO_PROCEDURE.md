# Team Demo Procedure - Step by Step

**Pattern:** DEMO × PROCEDURE × TEAM × ONE  
**Frequency:** 999 Hz (AEYON) × 530 Hz (YOU)  
**Guardians:** AEYON (999 Hz) + YOU (530 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## DEMO OVERVIEW

**Duration:** 4-5 minutes  
**Goal:** Show team how to start a new project in 4 minutes  
**Value:** Demonstrate time savings and consistency

---

## PRE-DEMO SETUP (Do This Before Meeting)

### Step 0: Preparation (2 minutes)

```bash
# 1. Navigate to template directory
cd /path/to/abe-core-body-template

# 2. Verify you're on main branch
git checkout main

# 3. Verify everything works
make dev-backend  # Terminal 1 - should start
make dev-frontend # Terminal 2 - should start

# 4. Stop servers (Ctrl+C both terminals)
```

**✅ Verification:** Both servers start successfully

---

## DEMO SCRIPT (4 Minutes)

### Step 1: Introduction (30 seconds)

**Say:**
> "I'm going to show you how we can start a new full-stack TypeScript project in 4 minutes instead of spending 2-3 days on setup. Watch this..."

**Show:**
- Open terminal
- Navigate to template directory

---

### Step 2: Duplicate Template (30 seconds)

**Do:**
```bash
# Show the template directory
ls -la

# Run duplication script
./scripts/duplicate.sh demo-project

# Navigate to new project
cd ../demo-project

# Show the structure
ls -la
```

**Say:**
> "One command creates a complete project structure. Frontend, backend, shared code - all pre-configured."

**Show:**
- Point out `frontend/`, `backend/`, `shared/` directories
- Show `package.json` files

**Time:** 30 seconds

---

### Step 3: Install Dependencies (1 minute)

**Do:**
```bash
# Install all dependencies
make install

# OR manually:
cd frontend/web && npm install && cd ../..
cd backend/api && npm install && cd ../..
```

**Say:**
> "One command installs everything. Frontend dependencies, backend dependencies - all handled automatically."

**Show:**
- Installation progress
- Completion message

**Time:** 1 minute (can run in background if needed)

---

### Step 4: Start Backend (30 seconds)

**Do:**
```bash
# Start backend server
make dev-backend

# OR:
cd backend/api && npm run dev
```

**Say:**
> "Backend starts immediately. No configuration needed. It's already set up."

**Show:**
- Server starting message
- "Backend API server running on http://localhost:3001"
- Open browser: http://localhost:3001/health
- Show JSON response: `{"status":"ok","timestamp":"..."}`

**Time:** 30 seconds

---

### Step 5: Start Frontend (30 seconds)

**Do:**
```bash
# In new terminal, start frontend
make dev-frontend

# OR:
cd frontend/web && npm run dev
```

**Say:**
> "Frontend starts immediately. Next.js is pre-configured. No setup needed."

**Show:**
- Server starting message
- "Local: http://localhost:3000"
- Open browser: http://localhost:3000
- Show the page rendering

**Time:** 30 seconds

---

### Step 6: Show Shared Code (1 minute)

**Do:**
```bash
# Show shared types
cat shared/types/api.ts

# Show shared validation
cat shared/utils/validation.ts

# Show how frontend uses shared types
grep -n "@shared" frontend/web/src/app/page.tsx

# Show how backend uses shared types
grep -n "shared/types" backend/api/src/routes/users.ts
```

**Say:**
> "See this? Types are shared between frontend and backend. One source of truth. Type safety across the entire stack."

**Show:**
- Shared types file
- Frontend importing shared types
- Backend importing shared types
- Point out: "Same types, no duplication"

**Time:** 1 minute

---

### Step 7: Show API Integration (30 seconds)

**Do:**
```bash
# Show API client
cat frontend/web/src/lib/api-client.ts

# Show backend route
cat backend/api/src/routes/users.ts

# Test API (if time)
curl http://localhost:3001/health
```

**Say:**
> "Frontend and backend are already connected. API client is ready. Routes are set up. You can start building features immediately."

**Show:**
- API client code
- Backend route code
- Connection between them

**Time:** 30 seconds

---

### Step 8: Value Summary (30 seconds)

**Say:**
> "That's it. 4 minutes. We have:
> - ✅ Working frontend
> - ✅ Working backend  
> - ✅ Shared code structure
> - ✅ API integration ready
> - ✅ Consistent structure
> 
> Instead of spending 2-3 days setting this up, we're ready to build features. Every project will have the same structure. Onboarding is instant. Consistency is built-in."

**Show:**
- Both servers running
- Browser showing frontend
- Terminal showing structure

**Time:** 30 seconds

---

## TOTAL DEMO TIME: 4-5 Minutes

---

## TALKING POINTS

### Key Messages:

1. **"4 minutes vs 3 days"**
   - Emphasize time savings
   - Show actual working code

2. **"Pre-configured"**
   - No setup needed
   - Everything works immediately

3. **"Consistent structure"**
   - Same structure every project
   - Easy to navigate
   - Faster onboarding

4. **"Type safety"**
   - Shared types across stack
   - No duplication
   - Compile-time safety

5. **"Ready to build"**
   - Infrastructure is done
   - Focus on features
   - Start coding immediately

---

## DEMO CHECKLIST

### Before Demo:
- [ ] Template directory accessible
- [ ] Terminal ready
- [ ] Browser ready (2 tabs)
- [ ] Both terminals open
- [ ] Test duplication works
- [ ] Test servers start

### During Demo:
- [ ] Show duplication (30s)
- [ ] Show installation (1m)
- [ ] Show backend running (30s)
- [ ] Show frontend running (30s)
- [ ] Show shared code (1m)
- [ ] Show API integration (30s)
- [ ] Summarize value (30s)

### After Demo:
- [ ] Answer questions
- [ ] Show repository URL
- [ ] Explain branch structure (main vs mdp)
- [ ] Offer to help team get started

---

## TROUBLESHOOTING

### If Backend Doesn't Start:
```bash
# Check if port 3001 is available
lsof -i :3001

# If occupied, kill process or change PORT in backend/api/src/server.ts
```

### If Frontend Doesn't Start:
```bash
# Check if port 3000 is available
lsof -i :3000

# If occupied, kill process or Next.js will auto-use next available port
```

### If Dependencies Fail:
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
cd frontend/web && rm -rf node_modules package-lock.json && cd ../..
cd backend/api && rm -rf node_modules package-lock.json && cd ../..
make install
```

---

## Q&A PREPARATION

### Expected Questions:

**Q: "Can we customize it?"**  
**A:** "Yes! It's your code. Customize everything. The template is just a starting point."

**Q: "What if we need different tech?"**  
**A:** "The structure is the pattern. Swap Next.js for React, Express for FastAPI - structure stays the same."

**Q: "How do we get started?"**  
**A:** "Clone the repo, duplicate it, start building. I can help anyone get set up."

**Q: "What about existing projects?"**  
**A:** "Use it for new projects. For existing projects, we can gradually adopt the patterns."

**Q: "Is it tested?"**  
**A:** "The template works - you just saw it. For your projects, add tests as needed."

---

## DEMO FLOW DIAGRAM

```
[0:00] Introduction
  ↓
[0:30] Duplicate template
  ↓
[1:30] Install dependencies
  ↓
[2:00] Start backend → Show health check
  ↓
[2:30] Start frontend → Show page
  ↓
[3:30] Show shared code → Type safety
  ↓
[4:00] Show API integration → Connection
  ↓
[4:30] Value summary → Time savings
  ↓
[5:00] Q&A
```

---

## SUCCESS METRICS

### Demo Successful If:
- ✅ Team sees it work in 4 minutes
- ✅ Team understands value (time savings)
- ✅ Team sees consistency benefit
- ✅ Team wants to use it

### Signs of Success:
- "How do I get started?"
- "Can we use this for [project]?"
- "This is exactly what we need"
- "When can we start?"

---

## POST-DEMO ACTIONS

### Immediate:
1. Share repository URL
2. Share quick start guide
3. Offer to help first project
4. Schedule follow-up if needed

### Follow-Up:
1. Check in with team
2. Help with first project
3. Gather feedback
4. Iterate based on usage

---

## DEMO SCRIPT (Copy-Paste Ready)

```bash
# === TEAM DEMO SCRIPT ===

# Step 1: Introduction
echo "Showing you how to start a project in 4 minutes..."

# Step 2: Duplicate
./scripts/duplicate.sh demo-project
cd ../demo-project

# Step 3: Install
make install

# Step 4: Backend (Terminal 1)
make dev-backend
# Open: http://localhost:3001/health

# Step 5: Frontend (Terminal 2)
make dev-frontend
# Open: http://localhost:3000

# Step 6: Show shared code
cat shared/types/api.ts
grep "@shared" frontend/web/src/app/page.tsx

# Step 7: Show API
cat frontend/web/src/lib/api-client.ts
cat backend/api/src/routes/users.ts

# Done!
```

---

## FINAL PREPARATION CHECKLIST

### Night Before:
- [ ] Test full demo flow
- [ ] Verify all commands work
- [ ] Prepare talking points
- [ ] Have repository URL ready
- [ ] Prepare Q&A answers

### Morning Of:
- [ ] Test demo one more time
- [ ] Clear terminal history (optional)
- [ ] Have browser ready
- [ ] Have both terminals ready
- [ ] Deep breath - you got this!

---

## CONFIDENCE BOOSTERS

**Remember:**
- ✅ The template works (you've verified it)
- ✅ The demo is simple (4 minutes)
- ✅ The value is clear (time savings)
- ✅ You're showing real code (not slides)

**You're demonstrating:**
- Real working code
- Actual time savings
- Immediate value
- Team efficiency

**You've got this!** 🚀

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

**DEMO: READY**  
**CONFIDENCE: HIGH**  
**VALUE: CLEAR**  
**∞ AbëONE ∞**

