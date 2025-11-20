# Notion Formula Implementation

This module implements Notion-style formulas for the YONI Deploy Control Center.

## Problem Statement

Implement: `toNumber(format(round(prop("Subtasks Done"))))`

## Implementation

The formula is broken down into individual utility functions:

### 1. `prop(obj, propertyName)`

Gets a property value from an object.

```typescript
const data = { "Subtasks Done": 5.7 };
prop(data, "Subtasks Done"); // Returns: 5.7
```

### 2. `round(value)`

Rounds a number to the nearest integer.

```typescript
round(5.7); // Returns: 6
round(5.4); // Returns: 5
```

### 3. `format(value)`

Formats a value as a string.

```typescript
format(6); // Returns: "6"
```

### 4. `toNumber(value)`

Converts a value to a number.

```typescript
toNumber("6"); // Returns: 6
```

### Complete Formula: `calculateSubtasksDone(obj, propertyName)`

Combines all functions to replicate the complete Notion formula:

```typescript
const data = { "Subtasks Done": 62.5 };
calculateSubtasksDone(data); // Returns: 63
```

**Step-by-step execution:**

1. `prop(data, "Subtasks Done")` → 62.5
2. `round(62.5)` → 63
3. `format(63)` → "63"
4. `toNumber("63")` → 63

## Usage in YoniDeployControlCenter

The formula is used to calculate progress percentage:

```typescript
const done = 5; // Completed tasks
const total = 8; // Total tasks
const percentage = (done / total) * 100; // 62.5

const subtasksData = { "Subtasks Done": percentage };
const progress = calculateSubtasksDone(subtasksData); // 63
```

## Why This Formula?

The formula ensures that:

1. Decimal progress values are properly rounded
2. The value goes through a format-toNumber cycle (mimicking Notion's type conversion)
3. The final result is always a clean integer suitable for display

## Testing

Run the test file to verify all functions work correctly:

```bash
node core/modules/deploy-center/notionFormulas.test.ts
```

All test cases should pass with ✅.
