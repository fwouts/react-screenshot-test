export function partialMock<T>(
  partialMock: Partial<jest.Mocked<T>>
): jest.Mocked<T> {
  return partialMock as jest.Mocked<T>;
}
