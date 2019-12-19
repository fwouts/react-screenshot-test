export function mocked<T extends (...args: any[]) => any>(
  f: T
): jest.MockedFunction<T> {
  if (!jest.isMockFunction(f)) {
    throw new Error("Expected a mock, but found a real function.");
  }
  return f;
}
