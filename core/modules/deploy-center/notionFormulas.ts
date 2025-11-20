/**
 * Notion-style formula utilities for YONI Deploy Control Center
 * Implements: toNumber(format(round(prop("Subtasks Done"))))
 */

/**
 * Gets a property value from an object
 * Mimics Notion's prop() function
 */
export function prop(obj: Record<string, any>, propertyName: string): any {
  return obj[propertyName];
}

/**
 * Rounds a number to the nearest integer
 * Mimics Notion's round() function
 */
export function round(value: number): number {
  return Math.round(value);
}

/**
 * Formats a value as a string
 * Mimics Notion's format() function
 */
export function format(value: any): string {
  return String(value);
}

/**
 * Converts a value to a number
 * Mimics Notion's toNumber() function
 */
export function toNumber(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Complete formula: toNumber(format(round(prop("Subtasks Done"))))
 * Gets a property, rounds it, formats it, and converts back to number
 */
export function calculateSubtasksDone(
  obj: Record<string, any>,
  propertyName: string = "Subtasks Done",
): number {
  return toNumber(format(round(prop(obj, propertyName))));
}
