import uuid from "uuid";

export const ASSET_SERVING_PREFIX = "/assets/";

/**
 * A map of generated asset path to actual filename.
 *
 * @example
 * {
 *   "abc-123": "/home/example/project/original.jpg"
 * }
 */
const recordedAssets: Record<string, string> = {};

/**
 * Record an imported asset.
 *
 * @returns its future URL on the component server.
 */
export function recordAsset(filePath: string) {
  const extensionIndex = filePath.lastIndexOf(".");
  if (extensionIndex === -1) {
    throw new Error(`Unsupported asset with no extension: ${filePath}`);
  }
  const extension = filePath.substr(extensionIndex + 1);
  const generatedName = `${uuid.v4()}.${extension}`;
  recordedAssets[generatedName] = filePath;
  return `${ASSET_SERVING_PREFIX}${generatedName}`;
}

/**
 * Returns the original asset file path from a served path.
 *
 * @param servedPath the component server path (e.g. `/assets/abc-123.jpg`)
 * @returns the original filename (e.g. `/home/example/project/original.jpg`)
 */
export function getAssetFilename(servedPath: string) {
  if (!servedPath.startsWith(ASSET_SERVING_PREFIX)) {
    throw new Error(`Invalid asset path: ${servedPath} (wrong prefix)`);
  }
  const generatedName = servedPath.substr(ASSET_SERVING_PREFIX.length);
  const filePath = recordedAssets[generatedName];
  if (!filePath) {
    throw new Error(`Invalid asset path: ${servedPath} (never recorded)`);
  }
  return filePath;
}
