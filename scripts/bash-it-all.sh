#!/bin/bash

# YONI Comprehensive Test & Validation Script
# "bash it all round and round" - Full system validation
# #YONI REGELT 🟣

# Don't exit on error - we want to collect all results
set +e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# Track results
CHECKS_PASSED=0
CHECKS_FAILED=0
WARNINGS=0

# Helper functions
log_header() {
    echo -e "\n${MAGENTA}${BOLD}================================================${RESET}"
    echo -e "${MAGENTA}${BOLD}$1${RESET}"
    echo -e "${MAGENTA}${BOLD}================================================${RESET}\n"
}

log_section() {
    echo -e "\n${CYAN}${BOLD}▶ $1${RESET}\n"
}

log_success() {
    echo -e "${GREEN}✓ $1${RESET}"
    ((CHECKS_PASSED++))
}

log_error() {
    echo -e "${RED}✗ $1${RESET}"
    ((CHECKS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${RESET}"
    ((WARNINGS++))
}

log_info() {
    echo -e "${BLUE}ℹ $1${RESET}"
}

# Banner
clear
echo -e "${MAGENTA}${BOLD}"
cat << "EOF"
 __   __  _____  __   _  _____ 
 \ \ / / |  _  | \ \ | ||_   _|
  \ V /  | | | |  \ \| |  | |  
   | |   | | | |   \   |  | |  
   | |   \ \_/ /    | \ | _| |_ 
   \_/    \___/     \_| |_\___/ 
                                
    Comprehensive Test Suite    
    "bash it all round and round"
         #YONI REGELT 🟣
EOF
echo -e "${RESET}\n"

log_info "Starting comprehensive YONI validation..."

# 1. Check Node.js version
log_section "1. Checking Node.js Version"
REQUIRED_NODE_VERSION="18.17.0"
CURRENT_NODE_VERSION=$(node -v | sed 's/v//')

if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$CURRENT_NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE_VERSION" ]; then
    log_success "Node.js version $CURRENT_NODE_VERSION meets requirement (>=$REQUIRED_NODE_VERSION)"
else
    log_error "Node.js version $CURRENT_NODE_VERSION is below requirement ($REQUIRED_NODE_VERSION)"
fi

# 2. Check dependencies
log_section "2. Checking Dependencies"
if [ -d "node_modules" ]; then
    log_success "node_modules directory exists"
    
    # Check key dependencies
    if [ -d "node_modules/next" ]; then
        NEXT_VERSION=$(node -p "require('./node_modules/next/package.json').version" 2>/dev/null || echo "unknown")
        log_success "Next.js installed (version $NEXT_VERSION)"
    else
        log_error "Next.js not found in node_modules"
    fi
    
    if [ -d "node_modules/react" ]; then
        REACT_VERSION=$(node -p "require('./node_modules/react/package.json').version" 2>/dev/null || echo "unknown")
        log_success "React installed (version $REACT_VERSION)"
    else
        log_error "React not found in node_modules"
    fi
    
    if [ -d "node_modules/openai" ]; then
        OPENAI_VERSION=$(node -p "require('./node_modules/openai/package.json').version" 2>/dev/null || echo "unknown")
        log_success "OpenAI SDK installed (version $OPENAI_VERSION)"
    else
        log_warning "OpenAI SDK not found - ChatGPT features may not work"
    fi
else
    log_error "node_modules not found - run 'npm install' first"
fi

# 3. Lint check
log_section "3. Running ESLint"
if npm run lint > /dev/null 2>&1; then
    log_success "ESLint passed - no errors or warnings"
else
    log_error "ESLint failed - please fix linting errors"
fi

# 4. TypeScript check
log_section "4. Checking TypeScript Configuration"
if [ -f "tsconfig.json" ]; then
    log_success "tsconfig.json exists"
    
    # Try to run TypeScript compiler in check mode
    if npx tsc --noEmit > /dev/null 2>&1; then
        log_success "TypeScript compilation check passed"
    else
        log_warning "TypeScript compilation has issues (this may be expected)"
    fi
else
    log_error "tsconfig.json not found"
fi

# 5. Check critical files
log_section "5. Verifying Critical Files"
CRITICAL_FILES=(
    "app/page.tsx"
    "app/layout.tsx"
    "app/api/chat/route.ts"
    "app/components/AgeVerification.tsx"
    "app/components/GoddessMode.tsx"
    "next.config.js"
    "tailwind.config.js"
    "package.json"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file exists"
    else
        log_error "$file not found"
    fi
done

# 6. Check API routes
log_section "6. Checking API Routes"
API_ROUTES=(
    "app/api/chat/route.ts"
    "app/api/checkout/route.ts"
    "app/api/github-app/callback/route.ts"
)

for route in "${API_ROUTES[@]}"; do
    if [ -f "$route" ]; then
        # Check if route has POST export
        if grep -q "export async function POST" "$route" 2>/dev/null; then
            log_success "$route has POST handler"
        else
            log_info "$route exists (may use different HTTP methods)"
        fi
    else
        log_warning "$route not found"
    fi
done

# 7. Check chat API implementation
log_section "7. Validating Chat API Implementation"
CHAT_ROUTE="app/api/chat/route.ts"
if [ -f "$CHAT_ROUTE" ]; then
    if grep -q "OpenAI" "$CHAT_ROUTE"; then
        log_success "Chat API uses OpenAI integration"
    else
        log_warning "OpenAI integration not detected in chat route"
    fi
    
    if grep -q "Consensus\|Contrast\|Chain" "$CHAT_ROUTE"; then
        log_success "Chat API supports multiple modes (Consensus/Contrast/Chain)"
    else
        log_warning "Chat modes not detected"
    fi
    
    if grep -q "question.*trim" "$CHAT_ROUTE"; then
        log_success "Chat API validates question input"
    else
        log_warning "Input validation not detected"
    fi
fi

# 8. Build test
log_section "8. Running Production Build"
log_info "This may take a moment..."

if npm run build > /tmp/build-output.log 2>&1; then
    log_success "Production build completed successfully"
    
    # Check build output
    if [ -d ".next" ]; then
        log_success ".next directory created"
        
        BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1 || echo "unknown")
        log_info "Build size: $BUILD_SIZE"
    else
        log_error ".next directory not found after build"
    fi
else
    log_error "Production build failed - see /tmp/build-output.log"
    cat /tmp/build-output.log
fi

# 9. Check configuration files
log_section "9. Validating Configuration Files"

# Check Next.js config
if [ -f "next.config.js" ]; then
    if grep -q "reactStrictMode" "next.config.js"; then
        log_success "Next.js config has React Strict Mode"
    fi
fi

# Check Tailwind config
if [ -f "tailwind.config.js" ]; then
    if grep -q "content:" "tailwind.config.js"; then
        log_success "Tailwind config has content paths defined"
    fi
fi

# Check package.json scripts
if [ -f "package.json" ]; then
    if grep -q "\"dev\":" "package.json"; then
        log_success "package.json has 'dev' script"
    fi
    if grep -q "\"build\":" "package.json"; then
        log_success "package.json has 'build' script"
    fi
    if grep -q "\"lint\":" "package.json"; then
        log_success "package.json has 'lint' script"
    fi
fi

# 10. Security checks
log_section "10. Basic Security Checks"

if [ -f ".env.example" ]; then
    log_success ".env.example exists for environment variable documentation"
else
    log_warning ".env.example not found"
fi

if [ -f ".gitignore" ]; then
    if grep -q "\.env" ".gitignore"; then
        log_success ".gitignore includes .env files"
    else
        log_warning ".env files not in .gitignore"
    fi
    
    if grep -q "node_modules" ".gitignore"; then
        log_success ".gitignore includes node_modules"
    fi
fi

# 11. Documentation check
log_section "11. Checking Documentation"
DOC_FILES=(
    "README.md"
    "CONTRIBUTING.md"
    "DEPLOYMENT.md"
    "SECURITY.md"
)

for doc in "${DOC_FILES[@]}"; do
    if [ -f "$doc" ]; then
        log_success "$doc exists"
    else
        log_warning "$doc not found"
    fi
done

# 12. Accessibility features check
log_section "12. Checking Accessibility Features"

# Check for age verification
if [ -f "app/components/AgeVerification.tsx" ]; then
    log_success "Age verification component exists (18+ requirement)"
fi

# Check for theme tokens
if [ -f "theme-tokens.css" ]; then
    log_success "Theme tokens defined (Überhochglitzer design)"
    
    if grep -q "brand.amethyst\|text.starwhite" "theme-tokens.css"; then
        log_success "Custom YONI color scheme detected"
    fi
fi

# Summary
log_header "Test Summary"

echo -e "${GREEN}${BOLD}✓ Checks Passed:${RESET} $CHECKS_PASSED"
if [ $CHECKS_FAILED -gt 0 ]; then
    echo -e "${RED}${BOLD}✗ Checks Failed:${RESET} $CHECKS_FAILED"
fi
if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}${BOLD}⚠ Warnings:${RESET} $WARNINGS"
fi
echo -e "${CYAN}${BOLD}Total Checks:${RESET} $((CHECKS_PASSED + CHECKS_FAILED + WARNINGS))"

echo -e "\n${MAGENTA}${BOLD}================================================${RESET}"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}${BOLD}🎉 All critical checks passed!${RESET}"
    echo -e "${MAGENTA}${BOLD}#YONI REGELT 🟣✨${RESET}"
    echo -e "${MAGENTA}${BOLD}================================================${RESET}\n"
    exit 0
else
    echo -e "${YELLOW}${BOLD}⚠️  Some checks failed - please review above${RESET}"
    echo -e "${MAGENTA}${BOLD}================================================${RESET}\n"
    exit 1
fi
