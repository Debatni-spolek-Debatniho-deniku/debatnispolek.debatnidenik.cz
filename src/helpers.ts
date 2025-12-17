export function assert(
  value: unknown,
  message?: string | Error
): asserts value {
  if (value) return;

  if (message instanceof Error) throw message;

  throw new Error(message ?? "Condition was not met!");
}
