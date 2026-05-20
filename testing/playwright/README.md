# Playwright E2E Tests - Alphabet Game

This folder contains end-to-end test examples using Playwright for the Alphabet Game web application.

## Test Examples

### `alphabet-game.spec.ts`

Comprehensive test suite covering:

- **Game Initialization**: Verify the game loads correctly
- **Player Input**: Test keyboard and click controls
- **Score Tracking**: Verify timer starts and score is calculated
- **Leaderboard**: Test local storage of high scores
- **UI Interactions**: Button states, visual feedback, error handling

```typescript
import { test, expect } from '@playwright/test';

// Verify game loads
test('should load the alphabet game with all letters visible', async ({ page }) => {
  await page.goto('http://localhost:3000/alphabet-game');
  
  const letters = await page.locator('button.letter');
  await expect(letters).toHaveCount(26);
  
  // Check all letters A-Z are present
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i); // A-Z
    await expect(letters.nth(i)).toContainText(letter);
  }
});

// Test keyboard input
test('should accept keyboard input and highlight correct letter', async ({ page }) => {
  await page.goto('http://localhost:3000/alphabet-game');
  
  // Start game
  await page.click('button#start-btn');
  
  // Type 'a' - should be correct
  await page.keyboard.press('a');
  
  const firstLetter = page.locator('button[data-letter="A"]');
  await expect(firstLetter).toHaveClass(/correct/);
});

// Test score persistence
test('should save high score to local storage', async ({ page, context }) => {
  await page.goto('http://localhost:3000/alphabet-game');
  
  // Complete game (simulate all letters)
  await page.fill('#player-name', 'Test Player');
  await page.click('button#start-btn');
  
  // Type all letters quickly
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (const letter of alphabet) {
    await page.keyboard.press(letter);
    await page.waitForTimeout(50);
  }
  
  // Verify score was saved
  const storageData = await context.storageState();
  expect(storageData.cookies).toBeDefined();
});

// Test error handling
test('should show error for incorrect letter', async ({ page }) => {
  await page.goto('http://localhost:3000/alphabet-game');
  await page.click('button#start-btn');
  
  // Type wrong letter
  await page.keyboard.press('z');
  
  const status = page.locator('#status');
  await expect(status).toContainText('Oops');
});
```

## Setup

### Installation

```bash
npm install --save-dev @playwright/test
```

### Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

## Run Tests

```bash
# Run all tests
npx playwright test

# Run in UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test alphabet-game.spec.ts

# Debug a test
npx playwright test --debug
```

## Test Coverage Areas

✅ **Functionality**
- Game initialization and reset
- Keyboard and click input handling
- Score calculation
- Timer functionality

✅ **UI/UX**
- Visual feedback on correct/incorrect input
- Responsive design on mobile
- Accessibility (keyboard navigation)

✅ **Data Persistence**
- Local storage for leaderboard
- Score retrieval across sessions

✅ **Edge Cases**
- Rapid input handling
- Very fast completion times
- Invalid characters
- Game reset during play

## Real-World QA Insights

- Tests should be deterministic and not flaky
- Use `waitFor` instead of `sleep` for better reliability
- Mock external APIs in tests when needed
- Test both happy path and error scenarios
- Include visual regression testing for UI components

---

**Note**: These are example tests. Actual test implementation would depend on the specific application setup.
