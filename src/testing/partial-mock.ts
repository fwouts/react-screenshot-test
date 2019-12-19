export function partialMock<T>(
  partial: Partial<jest.Mocked<T>>
): jest.Mocked<T> {
  return partial as jest.Mocked<T>;
}
