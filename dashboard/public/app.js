/**
 * Dashboard App
 * Hash-routed, no framework: "#/" shows run history, "#/run/<id>" shows
 * a single run's suite/test breakdown.
 */
const app = document.getElementById('app');

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = String(value);
  return div.innerHTML;
}

function formatDate(ts) {
  return new Date(ts).toLocaleString();
}

function formatDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function statusBadge(success) {
  return success
    ? '<span class="badge badge-pass">PASS</span>'
    : '<span class="badge badge-fail">FAIL</span>';
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.json();
}

async function renderHistory() {
  app.innerHTML = '<p class="loading">Loading run history…</p>';

  let manifest;
  try {
    manifest = await fetchJson('/reports/manifest.json');
  } catch (err) {
    app.innerHTML = `<p class="empty">No test runs yet. Run <code>npm test</code> first.</p>`;
    return;
  }

  if (!manifest.length) {
    app.innerHTML = `<p class="empty">No test runs yet. Run <code>npm test</code> first.</p>`;
    return;
  }

  const rows = manifest.map((run) => `
    <a class="run-row" href="#/run/${run.id}">
      <div class="run-status">${statusBadge(run.success)}</div>
      <div class="run-date">${formatDate(run.startTime)}</div>
      <div class="run-counts">
        <span class="count-pass">${run.numPassedTests} passed</span>
        <span class="count-fail">${run.numFailedTests} failed</span>
        <span class="count-total">${run.numTotalTests} total</span>
      </div>
      <div class="run-duration">${formatDuration(run.duration)}</div>
    </a>
  `).join('');

  app.innerHTML = `
    <h1>Run History</h1>
    <div class="run-list">${rows}</div>
  `;
}

async function renderRunDetail(runId) {
  app.innerHTML = '<p class="loading">Loading run…</p>';

  let manifest;
  try {
    manifest = await fetchJson('/reports/manifest.json');
  } catch {
    app.innerHTML = `<p class="empty">No test runs yet.</p>`;
    return;
  }

  const entry = manifest.find((r) => r.id === runId);
  if (!entry) {
    app.innerHTML = `<p class="empty">Run "${escapeHtml(runId)}" not found.</p>`;
    return;
  }

  const run = await fetchJson(`/reports/${entry.file}`);

  const suites = run.testSuites.map((suite) => {
    const tests = suite.tests.map((test) => {
      const failureBlock = test.status === 'failed'
        ? `<pre class="failure">${escapeHtml((test.failureMessages || []).join('\n\n'))}</pre>`
        : '';
      const screenshotBlock = test.screenshot
        ? `<img class="screenshot" src="/screenshots/${encodeURIComponent(test.screenshot)}" alt="Failure screenshot" />`
        : '';
      return `
        <li class="test-row test-${test.status}">
          <div class="test-title">
            <span class="badge badge-${test.status === 'passed' ? 'pass' : 'fail'}">${test.status.toUpperCase()}</span>
            <span>${escapeHtml(test.title)}</span>
            <span class="test-duration">${formatDuration(test.duration || 0)}</span>
          </div>
          ${failureBlock}
          ${screenshotBlock}
        </li>
      `;
    }).join('');

    return `
      <section class="suite">
        <h2>${escapeHtml(suite.testFilePath)} ${statusBadge(suite.status === 'passed')}</h2>
        <ul class="test-list">${tests}</ul>
      </section>
    `;
  }).join('');

  app.innerHTML = `
    <a class="back-link" href="#/">&larr; Back to history</a>
    <h1>Run ${escapeHtml(run.id)} ${statusBadge(run.success)}</h1>
    <p class="run-summary">${run.numPassedTests} passed, ${run.numFailedTests} failed, ${run.numTotalTests} total &middot; ${formatDuration(run.duration)}</p>
    ${suites}
  `;
}

function route() {
  const hash = window.location.hash || '#/';
  const runMatch = hash.match(/^#\/run\/(.+)$/);
  if (runMatch) {
    renderRunDetail(decodeURIComponent(runMatch[1]));
  } else {
    renderHistory();
  }
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
