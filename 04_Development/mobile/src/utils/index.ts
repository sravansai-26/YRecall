export const noop = (): void => undefined;

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}
