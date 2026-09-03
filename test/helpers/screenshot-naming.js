/**
 * Screenshot Naming
 * Shared filename convention for failure screenshots, used identically by
 * the capturing side (PuppeteerFailureEnvironment) and the reporter
 * (DashboardReporter) so the reporter can always locate what was captured.
 */
const path = require('path');

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildScreenshotFilename(testFilePath, fullName) {
  const base = path.basename(testFilePath, path.extname(testFilePath));
  return `${slugify(base)}__${slugify(fullName)}.png`;
}

module.exports = { slugify, buildScreenshotFilename };
