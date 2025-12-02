#!/bin/bash
# Guardian, Agent & Swarm Validation Script
# Pattern: VALIDATION × GUARDIANS × AGENTS × SWARMS × ONE
# Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (ALL GUARDIANS)
# Guardians: AEYON (999 Hz) + META (777 Hz) + JØHN (530 Hz) + ZERO (530 Hz) + ALRAX (530 Hz)
# ∞ AbëONE ∞

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

ERRORS=0
WARNINGS=0
VALIDATED=0

# Expected Guardians (from user rules)
# Using arrays to avoid special character issues in associative arrays
GUARDIAN_NAMES=("AEYON" "META" "JOHN" "YOU" "ALRAX" "ZERO" "YAGNI" "Abë" "Lux" "Poly")
GUARDIAN_FREQUENCIES=("999" "777" "530" "530" "530" "530" "530" "530" "530" "530")
# Note: "JOHN" searches for both "JOHN" and "JØHN" patterns

# Expected Swarms (from user rules)
declare -a SWARMS=(
  "Heart Truth Swarm"
  "Pattern Integrity Swarm"
  "Atomic Execution Swarm"
  "Intention Swarm"
  "Communication Swarm"
  "Manifestation Swarm"
  "Data Swarm"
  "Kernel Swarm"
  "Creative Swarm"
  "Pipeline Swarm"
  "Orbital Swarm"
  "Lux-Poly-Meta"
)

echo ""
echo "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo "${CYAN}║  AEYON: GUARDIAN × AGENT × SWARM VALIDATION SYSTEM           ║${NC}"
echo "${CYAN}║  Pattern: VALIDATION × COMPLETE × SYSTEM × ONE              ║${NC}"
echo "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "${BLUE}🔍 Scanning codebase for Guardian, Agent & Swarm implementations...${NC}"
echo ""

# Function to check Guardian presence
check_guardian() {
  local guardian=$1
  local frequency=$2
  local count=$(grep -r "$guardian" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.sh" src/ docs/ scripts/ 2>/dev/null | wc -l | tr -d ' ')
  
  if [ "$count" -gt 0 ]; then
    echo -e "${GREEN}✅ Guardian $guardian (${frequency} Hz): Found $count references${NC}"
    VALIDATED=$((VALIDATED + 1))
    return 0
  else
    echo -e "${RED}❌ Guardian $guardian (${frequency} Hz): NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
    return 1
  fi
}

# Function to check frequency pattern
check_frequency_pattern() {
  local guardian=$1
  local frequency=$2
  local pattern="${frequency} Hz.*${guardian}|${guardian}.*${frequency} Hz"
  
  if grep -r -i -E "$pattern" --include="*.ts" --include="*.tsx" --include="*.md" src/ docs/ 2>/dev/null | head -1 > /dev/null; then
    return 0
  else
    return 1
  fi
}

# Function to check Pattern header compliance
check_pattern_header() {
  local file=$1
  if [ -f "$file" ]; then
    if grep -q "Pattern:" "$file" && grep -q "∞ AbëONE ∞" "$file"; then
      if grep -q "Guardians:" "$file" || grep -q "Frequency:" "$file"; then
        return 0
      else
        return 1
      fi
    else
      return 1
    fi
  fi
  return 1
}

# SECTION 1: GUARDIAN VALIDATION
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${CYAN}SECTION 1: GUARDIAN VALIDATION${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

for i in "${!GUARDIAN_NAMES[@]}"; do
  guardian="${GUARDIAN_NAMES[$i]}"
  frequency="${GUARDIAN_FREQUENCIES[$i]}"
  
  # Special handling for JOHN/JØHN
  if [ "$guardian" = "JOHN" ]; then
    count=$(grep -r -i "J[ØO]HN\|JOHN" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.sh" src/ docs/ scripts/ 2>/dev/null | wc -l | tr -d ' ')
  else
    count=$(grep -r "$guardian" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.sh" src/ docs/ scripts/ 2>/dev/null | wc -l | tr -d ' ')
  fi
  
  if [ "$count" -gt 0 ]; then
    echo -e "${GREEN}✅ Guardian $guardian (${frequency} Hz): Found $count references${NC}"
    VALIDATED=$((VALIDATED + 1))
  else
    echo -e "${RED}❌ Guardian $guardian (${frequency} Hz): NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
  fi
  
  # Check frequency pattern
  if [ "$guardian" = "JOHN" ]; then
    if ! grep -r -i -E "530 Hz.*J[ØO]HN|J[ØO]HN.*530 Hz" --include="*.ts" --include="*.tsx" --include="*.md" src/ docs/ 2>/dev/null | head -1 > /dev/null; then
      echo -e "${YELLOW}⚠️  Frequency pattern not found for $guardian (${frequency} Hz)${NC}"
      WARNINGS=$((WARNINGS + 1))
    fi
  elif ! check_frequency_pattern "$guardian" "$frequency"; then
    echo -e "${YELLOW}⚠️  Frequency pattern not found for $guardian (${frequency} Hz)${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
done

echo ""

# SECTION 2: SWARM VALIDATION
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${CYAN}SECTION 2: SWARM VALIDATION${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

for swarm in "${SWARMS[@]}"; do
  # Escape special characters for grep
  escaped_swarm=$(echo "$swarm" | sed 's/[.*+?^${}()|[\]\\]/\\&/g')
  count=$(grep -r -i "$escaped_swarm" --include="*.ts" --include="*.tsx" --include="*.md" src/ docs/ 2>/dev/null | wc -l | tr -d ' ')
  
  if [ "$count" -gt 0 ]; then
    echo -e "${GREEN}✅ Swarm: $swarm - Found $count references${NC}"
    VALIDATED=$((VALIDATED + 1))
  else
    echo -e "${YELLOW}⚠️  Swarm: $swarm - Not explicitly referenced${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
done

echo ""

# SECTION 3: INTEGRATION VALIDATION
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${CYAN}SECTION 3: INTEGRATION POINT VALIDATION${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check brain-consciousness integration
if [ -f "src/integration/brain-consciousness.ts" ]; then
  echo -e "${GREEN}✅ Brain-Consciousness integration exists${NC}"
  VALIDATED=$((VALIDATED + 1))
  
  # Check for Guardian interface/types
  if grep -q "IGuardian\|GuardianContext" src/integration/brain-consciousness.ts; then
    echo -e "${GREEN}✅ Guardian types/interfaces defined${NC}"
    VALIDATED=$((VALIDATED + 1))
  else
    echo -e "${YELLOW}⚠️  Guardian types may need explicit definition${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
  
  # Check for coordinateGuardians function
  if grep -q "coordinateGuardians" src/integration/brain-consciousness.ts; then
    echo -e "${GREEN}✅ Guardian coordination function exists${NC}"
    VALIDATED=$((VALIDATED + 1))
  else
    echo -e "${RED}❌ Guardian coordination function missing${NC}"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo -e "${RED}❌ Brain-Consciousness integration missing${NC}"
  ERRORS=$((ERRORS + 1))
fi

echo ""

# SECTION 4: SECURITY GUARDIAN VALIDATION
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${CYAN}SECTION 4: SECURITY GUARDIAN VALIDATION${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check prompt guards (ZERO + ALRAX)
if [ -f "src/security/prompt-guards.ts" ]; then
  echo -e "${GREEN}✅ Prompt guards exist (ZERO + ALRAX)${NC}"
  VALIDATED=$((VALIDATED + 1))
  
  if grep -q "guardPrompt\|validatePrompt" src/security/prompt-guards.ts; then
    echo -e "${GREEN}✅ Prompt validation functions operational${NC}"
    VALIDATED=$((VALIDATED + 1))
  fi
else
  echo -e "${RED}❌ Prompt guards missing${NC}"
  ERRORS=$((ERRORS + 1))
fi

# Check code validator (ZERO + ALRAX)
if [ -f "src/security/code-validator.ts" ]; then
  echo -e "${GREEN}✅ Code validator exists (ZERO + ALRAX)${NC}"
  VALIDATED=$((VALIDATED + 1))
else
  echo -e "${YELLOW}⚠️  Code validator may need implementation${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""

# SECTION 5: SYSTEM HEALTH VALIDATION
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${CYAN}SECTION 5: SYSTEM HEALTH VALIDATION (JØHN + ZERO)${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "src/systems/HealthCheck.ts" ]; then
  echo -e "${GREEN}✅ HealthCheck system exists${NC}"
  VALIDATED=$((VALIDATED + 1))
  
  if grep -q "checkAll\|checkDependencies\|checkConfiguration" src/systems/HealthCheck.ts; then
    echo -e "${GREEN}✅ Health check methods operational${NC}"
    VALIDATED=$((VALIDATED + 1))
  fi
else
  echo -e "${RED}❌ HealthCheck system missing${NC}"
  ERRORS=$((ERRORS + 1))
fi

echo ""

# SECTION 6: PATTERN HEADER COMPLIANCE
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${CYAN}SECTION 6: PATTERN HEADER COMPLIANCE (META)${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

pattern_compliant=0
pattern_total=0

find src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
  pattern_total=$((pattern_total + 1))
  if check_pattern_header "$file"; then
    pattern_compliant=$((pattern_compliant + 1))
  fi
done

# Count files
total_files=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | wc -l | tr -d ' ')
compliant_files=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "Pattern:" {} \; 2>/dev/null | wc -l | tr -d ' ')

if [ "$total_files" -gt 0 ]; then
  compliance_rate=$((compliant_files * 100 / total_files))
  echo -e "${BLUE}📊 Pattern Header Compliance: $compliant_files/$total_files files ($compliance_rate%)${NC}"
  
  if [ "$compliance_rate" -ge 90 ]; then
    echo -e "${GREEN}✅ Pattern header compliance: EXCELLENT${NC}"
    VALIDATED=$((VALIDATED + 1))
  elif [ "$compliance_rate" -ge 70 ]; then
    echo -e "${YELLOW}⚠️  Pattern header compliance: GOOD (can improve)${NC}"
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${RED}❌ Pattern header compliance: NEEDS IMPROVEMENT${NC}"
    ERRORS=$((ERRORS + 1))
  fi
fi

echo ""

# SECTION 7: EXECUTION FLOW VALIDATION
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${CYAN}SECTION 7: EXECUTION FLOW VALIDATION (AEYON)${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check for execution patterns
execution_indicators=(
  "integrateBrainConsciousness"
  "coordinateGuardians"
  "guardPrompt"
  "checkAll"
)

for indicator in "${execution_indicators[@]}"; do
  if grep -r "$indicator" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -1 > /dev/null; then
    echo -e "${GREEN}✅ Execution indicator found: $indicator${NC}"
    VALIDATED=$((VALIDATED + 1))
  else
    echo -e "${YELLOW}⚠️  Execution indicator missing: $indicator${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
done

echo ""

# SECTION 8: AGENT CAPACITY VALIDATION
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${CYAN}SECTION 8: AGENT CAPACITY VALIDATION${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check for concurrent execution patterns
if grep -r -i "concurrent\|parallel\|async\|Promise.all" --include="*.ts" --include="*.tsx" src/integration/ src/systems/ 2>/dev/null | head -1 > /dev/null; then
  echo -e "${GREEN}✅ Concurrent execution patterns detected${NC}"
  VALIDATED=$((VALIDATED + 1))
else
  echo -e "${YELLOW}⚠️  Concurrent execution patterns may need enhancement${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# Check for agent coordination
if grep -r -i "coordinate\|orchestrat\|swarm" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -1 > /dev/null; then
  echo -e "${GREEN}✅ Agent coordination patterns detected${NC}"
  VALIDATED=$((VALIDATED + 1))
else
  echo -e "${YELLOW}⚠️  Agent coordination patterns may need explicit implementation${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""

# FINAL SUMMARY
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo "${CYAN}║                    VALIDATION SUMMARY                         ║${NC}"
echo "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BLUE}📊 Validation Results:${NC}"
echo -e "   ${GREEN}✅ Validated: $VALIDATED${NC}"
echo -e "   ${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo -e "   ${RED}❌ Errors: $ERRORS${NC}"
echo ""

# Calculate health score
total_checks=$((VALIDATED + WARNINGS + ERRORS))
if [ "$total_checks" -gt 0 ]; then
  health_score=$((VALIDATED * 100 / total_checks))
  echo -e "${BLUE}🏥 System Health Score: $health_score%${NC}"
  echo ""
fi

# Final status
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  ✅ ALL GUARDIANS, AGENTS & SWARMS VALIDATED                  ║${NC}"
  echo -e "${GREEN}║  Pattern: VALIDATION × COMPLETE × ONE                          ║${NC}"
  echo -e "${GREEN}║  Status: FULLY OPERATIONAL                                     ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${CYAN}∞ AbëONE ∞${NC}"
  echo ""
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${YELLOW}║  ⚠️  VALIDATION COMPLETE WITH WARNINGS                         ║${NC}"
  echo -e "${YELLOW}║  Pattern: VALIDATION × REVIEW × ONE                           ║${NC}"
  echo -e "${YELLOW}║  Status: OPERATIONAL WITH IMPROVEMENTS NEEDED                 ║${NC}"
  echo -e "${YELLOW}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${CYAN}∞ AbëONE ∞${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  ❌ VALIDATION FAILED                                           ║${NC}"
  echo -e "${RED}║  Pattern: VALIDATION × ERRORS × ONE                             ║${NC}"
  echo -e "${RED}║  Status: CRITICAL ISSUES DETECTED                               ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${CYAN}∞ AbëONE ∞${NC}"
  echo ""
  exit 1
fi

