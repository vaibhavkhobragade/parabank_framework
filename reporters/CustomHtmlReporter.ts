
import type {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';
import { mkdir, writeFile } from 'node:fs/promises';

type TestRow = {
  title: string;
  status: string;
  duration: number;
  error: string;
};

export default class CustomHtmlReporter implements Reporter {
  private results: TestRow[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message ?? '',
    });
  }

  async onEnd(result: FullResult) {
    await mkdir('test-results', { recursive: true });

    const count = (status: string) =>
      this.results.filter((r) => r.status === status).length;

    const rows = this.results.map((r) => `
      <tr>
        <td>${escapeHtml(r.title)}</td>
        <td class="${r.status}">${escapeHtml(r.status)}</td>
        <td>${r.duration} ms</td>
        <td>${escapeHtml(r.error || '-')}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ParaBank QA Dashboard</title>
<style>
:root { --accent: #F48031; }
* { box-sizing: border-box; }
body {
  margin: 0; padding: 32px; color: #f8fafc;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg,#101827,#243b55,#141e30);
  min-height: 100vh;
}
h1, th { color: var(--accent); }
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(150px,1fr));
  gap: 18px; margin: 28px 0;
}
.card, .panel {
  background: rgba(255,255,255,.10);
  border: 1px solid rgba(255,255,255,.20);
  border-radius: 18px; padding: 22px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0,0,0,.18);
}
.metric { font-size: 32px; font-weight: bold; }
.label { color: #cbd5e1; margin-top: 8px; }
.tabs { display: flex; gap: 10px; margin-bottom: 18px; }
.tab {
  color: white; background: transparent;
  border: 1px solid #64748b; border-radius: 10px;
  padding: 10px 16px; cursor: pointer;
}
.tab.active { background: var(--accent); border-color: var(--accent); }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ffffff20; }
.passed { color: var(--accent); font-weight: bold; }
.failed, .timedOut { color: #fb7185; font-weight: bold; }
.skipped, .interrupted { color: #cbd5e1; }
td { overflow-wrap: anywhere; }
@media(max-width:600px) { body { padding: 16px; } }
</style>
</head>
<body>
<h1>ParaBank QA Dashboard</h1>
<p>Automation execution summary</p>
<div class="cards">
  <div class="card"><div class="metric">${this.results.length}</div>
    <div class="label">Total tests</div></div>
  <div class="card"><div class="metric">${count('passed')}</div>
    <div class="label">Passed</div></div>
  <div class="card"><div class="metric">${count('failed') + count('timedOut')}</div>
    <div class="label">Failed / Timed out</div></div>
  <div class="card"><div class="metric">${count('skipped')}</div>
    <div class="label">Skipped</div></div>
</div>
<div class="panel">
  <div class="tabs">
    <button class="tab active" onclick="filterRows('all',this)">All</button>
    <button class="tab" onclick="filterRows('passed',this)">Passed</button>
    <button class="tab" onclick="filterRows('failed',this)">Failed</button>
  </div>
  <table>
    <thead><tr><th>Test</th><th>Status</th><th>Duration</th><th>Error</th></tr></thead>
    <tbody id="results">${rows}</tbody>
  </table>
</div>
<script>
function filterRows(status, button) {
  document.querySelectorAll('.tab').forEach(
    tab => tab.classList.remove('active')
  );
  button.classList.add('active');
  document.querySelectorAll('#results tr').forEach(row => {
    const actual = row.children[1].textContent.trim();
    row.hidden = status !== 'all' &&
      (status === 'failed'
        ? !['failed','timedOut','interrupted'].includes(actual)
        : actual !== status);
  });
}
</script>
</body>
</html>`;

    await writeFile('test-results/dashboard.html', html, 'utf8');
    console.log(`Dashboard generated. Run status: ${result.status}`);
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[ch]!);
}
