# YONI Testing Scripts

**"bash it all round and round" - Comprehensive testing for YONI** 🟣

These scripts ensure YONI's chat functionality and overall system health are thoroughly validated.

## Scripts Overview

### 🎯 bash-it-all.sh
**Comprehensive validation script** that checks everything about the YONI app.

```bash
npm run test:all
# or directly:
./scripts/bash-it-all.sh
```

**What it checks:**
- ✅ Node.js version compatibility
- ✅ Dependencies installed and correct versions
- ✅ ESLint compliance
- ✅ TypeScript compilation
- ✅ Critical files existence
- ✅ API routes structure
- ✅ Chat API implementation (OpenAI integration, modes, validation)
- ✅ Production build success
- ✅ Configuration files
- ✅ Security basics (.env handling, .gitignore)
- ✅ Documentation files
- ✅ Accessibility features (age verification, theme)

**Output:** Beautiful colored terminal output showing all checks with pass/fail/warning status.

### 💬 test-chat-api.js
**Detailed Chat API testing** - validates the ChatGPT integration endpoint.

```bash
npm run test:chat
# or directly:
node scripts/test-chat-api.js
```

**Requirements:** Development server must be running (`npm run dev` in another terminal)

**What it tests:**
- Input validation (empty questions, whitespace, missing fields)
- All chat modes (Consensus, Contrast, Chain)
- Response structure validation
- HTTP method restrictions (GET, PUT should not be allowed)
- Error handling (API key missing, etc.)

**Output:** Detailed test results with status codes and response validation.

## Quick Commands

### Validate everything (no server needed)
```bash
npm run test:all
```

### Test chat API (requires server running)
```bash
# Terminal 1:
npm run dev

# Terminal 2:
npm run test:chat
```

### Quick validation (lint + build)
```bash
npm run validate
```

## Integration with CI/CD

These scripts can be integrated into GitHub Actions workflows:

```yaml
- name: Run comprehensive tests
  run: npm run test:all

- name: Validate code quality
  run: npm run validate
```

## #YONI REGELT 🟣✨

These testing scripts ensure that YONI's ChatGPT integration and overall system quality remain excellent. Run them frequently during development!

**Philosophy:** "bash it all round and round" - thorough, comprehensive, and relentless validation to ensure YONI provides a safe, reliable space for mental health support.
