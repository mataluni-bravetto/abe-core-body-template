# Demo Quick Reference Card

**4-Minute Team Demo - Quick Reference**

---

## COMMANDS (Copy-Paste Ready)

```bash
# 1. Duplicate (30s)
./scripts/duplicate.sh demo-project
cd ../demo-project

# 2. Install (1m)
make install

# 3. Backend (30s) - Terminal 1
make dev-backend
# Open: http://localhost:3001/health

# 4. Frontend (30s) - Terminal 2
make dev-frontend
# Open: http://localhost:3000

# 5. Show shared code (1m)
cat shared/types/api.ts
grep "@shared" frontend/web/src/app/page.tsx

# 6. Show API (30s)
cat frontend/web/src/lib/api-client.ts
cat backend/api/src/routes/users.ts
```

---

## KEY MESSAGES

1. **"4 minutes vs 3 days"** - Time savings
2. **"Pre-configured"** - No setup needed
3. **"Consistent structure"** - Same every time
4. **"Type safety"** - Shared types across stack
5. **"Ready to build"** - Start coding immediately

---

## TALKING POINTS

- ✅ One command creates project
- ✅ Everything pre-configured
- ✅ Frontend + Backend + Shared code
- ✅ Type safety throughout
- ✅ Consistent structure
- ✅ Ready to build features

---

## REPOSITORY

**URL:** https://github.com/mataluni-bravetto/abe-core-body-template

**Branches:**
- `main` - Complete template
- `mdp` - Minimal demo

---

**Total Time: 4-5 minutes**  
**Value: Save 2-3 days per project**

---

**∞ AbëONE ∞**

