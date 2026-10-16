
// import type {
//   Reporter,
//   FullConfig,
//   Suite,
//   TestCase,
//   TestResult,
//   FullResult
// } from '@playwright/test/reporter';

// import * as fs from 'node:fs';
// import * as path from 'node:path';

// type ReportTest = {
//   title: string;
//   file: string;
//   status: string;
//   duration: number;
//   error: string;
// };

// export default class CustomReporter implements Reporter {
//   private tests: ReportTest[] = [];
//   private startTime = new Date();

//   onBegin(_config: FullConfig, suite: Suite) {
//     this.startTime = new Date();
//     this.tests = [];

//     console.log(
//       `Starting custom report for ${suite.allTests().length} tests`
//     );
//   }

//   onTestEnd(test: TestCase, result: TestResult) {
//     this.tests.push({
//       title: test.titlePath().join(' › '),
//       file: path.relative(process.cwd(), test.location.file),
//       status: result.status ?? 'unknown',
//       duration: result.duration,
//       error: result.error?.message ?? ''
//     });
//   }

//   async onEnd(_result: FullResult) {
//     const outputDir = path.resolve('reports');

//     fs.mkdirSync(outputDir, { recursive: true });

//     const escapeHtml = (value: string) =>
//       value.replace(/[&<>"']/g, char => ({
//         '&': '&amp;',
//         '<': '&lt;',
//         '>': '&gt;',
//         '"': '&quot;',
//         "'": '&#39;'
//       })[char]!);

//     const count = (status: string) =>
//       this.tests.filter(test => test.status === status).length;

//     const passed = count('passed');
//     const failed = count('failed') + count('timedOut');
//     const skipped = count('skipped');
//     const interrupted = count('interrupted');
//     const total = this.tests.length;
//     const duration = this.tests.reduce(
//       (sum, test) => sum + test.duration, 0
//     );

//     const rows = this.tests.map(test => `
//       <tr data-status="${escapeHtml(test.status)}">
//         <td>${escapeHtml(test.title)}</td>
//         <td>${escapeHtml(test.file)}</td>
//         <td><span class="status ${escapeHtml(test.status)}">
//           ${escapeHtml(test.status)}
//         </span></td>
//         <td>${(test.duration / 1000).toFixed(2)} s</td>
//         <td class="error">${escapeHtml(test.error)}</td>
//       </tr>
//     `).join('');

//     const html = `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1">
// <title>ParaBank | QA Dashboard</title>
// <style>
// :root {
//   --accent: #F48031;
//   --glass: rgba(255, 255, 255, 0.09);
//   --border: rgba(255, 255, 255, 0.18);
//   --text: #f5f7fb;
//   --muted: #aebbd0;
// }

// * { box-sizing: border-box; }

// body {
//   margin: 0;
//   min-height: 100vh;
//   padding: 32px;
//   color: var(--text);
//   font-family: Inter, "Segoe UI", Arial, sans-serif;
//   background:
//     radial-gradient(ellipse at 10% 5%, #35466b, transparent 45%),
//     radial-gradient(ellipse at 90% 90%, #3b2746, transparent 40%),
//     #101626;
// }

// header {
//   color: var(--accent);
//   margin-bottom: 28px;
// }

// header h1 {
//   margin: 0 0 8px;
//   font-size: clamp(25px, 4vw, 38px);
// }

// header p, .muted { color: var(--muted); }

// .glass {
//   background: var(--glass);
//   border: 1px solid var(--border);
//   border-radius: 18px;
//   backdrop-filter: blur(18px);
//   -webkit-backdrop-filter: blur(18px);
//   box-shadow: 0 12px 36px rgba(0,0,0,.20);
// }

// .summary {
//   display: grid;
//   grid-template-columns: repeat(4, minmax(0, 1fr));
//   gap: 16px;
//   margin-bottom: 24px;
// }

// .card { padding: 22px; }

// .card h2 {
//   color: var(--accent);
//   font-size: 14px;
//   margin: 0 0 16px;
// }

// .number { font-size: 32px; font-weight: 750; }

// .tabs {
//   display: flex;
//   flex-wrap: wrap;
//   gap: 10px;
//   padding: 16px;
//   margin-bottom: 16px;
// }

// button {
//   background: transparent;
//   color: var(--text);
//   border: 1px solid var(--border);
//   border-radius: 10px;
//   padding: 10px 16px;
//   cursor: pointer;
// }

// button.active {
//   color: #171717;
//   background: var(--accent);
//   border-color: var(--accent);
//   font-weight: 700;
// }

// button:focus-visible, input:focus-visible {
//   outline: 2px solid var(--accent);
//   outline-offset: 3px;
// }

// input {
//   background: rgba(255,255,255,.08);
//   border: 1px solid var(--border);
//   border-radius: 10px;
//   color: white;
//   padding: 11px;
//   min-width: 220px;
// }

// .table-wrap { overflow-x: auto; }

// table {
//   width: 100%;
//   border-collapse: collapse;
//   text-align: left;
// }

// th {
//   color: var(--accent);
//   font-size: 12px;
//   text-transform: uppercase;
//   letter-spacing: .06em;
// }

// th, td {
//   padding: 15px;
//   border-bottom: 1px solid var(--border);
//   vertical-align: top;
// }

// td { overflow-wrap: anywhere; }

// .status {
//   display: inline-block;
//   padding: 5px 9px;
//   border-radius: 20px;
//   font-size: 12px;
//   font-weight: 700;
//   text-transform: uppercase;
// }

// .status.passed {
//   color: #171717;
//   background: var(--accent);
// }

// .status.failed, .status.timedOut {
//   color: #ffb4b4;
//   background: rgba(255,70,70,.13);
// }

// .status.skipped, .status.interrupted {
//   color: var(--muted);
//   background: rgba(255,255,255,.08);
// }

// .error { color: #ffb4b4; min-width: 180px; }

// @media (max-width: 800px) {
//   body { padding: 16px; }
//   .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
// }

// @media (max-width: 450px) {
//   .summary { grid-template-columns: 1fr; }
// }
// </style>
// </head>
// <body>
// <header>
//   <h1>ParaBank QA Dashboard</h1>
//   <p>Custom Playwright Automation Report</p>
//   <p>Started: ${escapeHtml(this.startTime.toLocaleString())}</p>
// </header>

// <section class="summary">
//   <article class="glass card">
//     <h2>Total Tests</h2>
//     <div class="number">${total}</div>
//   </article>
//   <article class="glass card">
//     <h2>Passed</h2>
//     <div class="number">${passed}</div>
//   </article>
//   <article class="glass card">
//     <h2>Failed</h2>
//     <div class="number">${failed}</div>
//   </article>
//   <article class="glass card">
//     <h2>Skipped / Other</h2>
//     <div class="number">${skipped + interrupted +
//       (total - passed - failed - skipped - interrupted)}</div>
//   </article>
// </section>

// <section class="glass tabs" aria-label="Test filters">
//   <button class="active" data-filter="all">All Tests</button>
//   <button data-filter="passed">Passed</button>
//   <button data-filter="failed">Failed</button>
//   <button data-filter="skipped">Skipped</button>
//   <input id="search" type="search"
//     placeholder="Search test or file..." aria-label="Search tests">
// </section>

// <section class="glass table-wrap">
// <table>
// <thead>
// <tr>
//   <th>Test</th><th>File</th><th>Status</th>
//   <th>Duration</th><th>Error details</th>
// </tr>
// </thead>
// <tbody id="test-results">
// ${rows || '<tr><td colspan="5">No test results available.</td></tr>'}
// </tbody>
// </table>
// </section>

// <p class="muted">
//   Run duration: ${(duration / 1000).toFixed(2)} seconds of
//   accumulated test execution time.
// </p>

// <script>
// const buttons = [...document.querySelectorAll('[data-filter]')];
// const search = document.querySelector('#search');
// const rows = [...document.querySelectorAll('#test-results tr')];
// let filter = 'all';

// function updateRows() {
//   const query = search.value.toLowerCase();

//   rows.forEach(row => {
//     const status = row.dataset.status;
//     const matchesStatus =
//       filter === 'all' ||
//       status === filter ||
//       (filter === 'failed' && status === 'timedOut');

//     const matchesSearch = row.textContent.toLowerCase().includes(query);
//     row.hidden = !(matchesStatus && matchesSearch);
//   });
// }

// buttons.forEach(button => {
//   button.addEventListener('click', () => {
//     filter = button.dataset.filter;
//     buttons.forEach(item =>
//       item.classList.toggle('active', item === button)
//     );
//     updateRows();
//   });
// });

// search.addEventListener('input', updateRows);
// </script>
// </body>
// </html>`;

//     fs.writeFileSync(
//       path.join(outputDir, 'dashboard.html'),
//       html,
//       'utf8'
//     );

//     console.log(`Custom report generated: ${path.join(
//       outputDir, 'dashboard.html'
//     )}`);
//   }

//   printsToStdio() {
//     return false;
//   }
// }
