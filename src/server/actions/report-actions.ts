'use server';

import { db, testCases } from '@/lib/db';

export async function generateXmlReportAction(): Promise<string> {
  const testResults = await db.select().from(testCases);
  const summary = {
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'Passed').length,
    failed: testResults.filter(r => r.status === 'Failed').length,
    skipped: testResults.filter(r => r.status === 'Skipped').length,
  };

  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xmlContent += `<TestReport generatedAt="${new Date().toISOString()}">\n`;
  xmlContent += `  <Summary>\n`;
  xmlContent += `    <TotalTests>${summary.total}</TotalTests>\n`;
  xmlContent += `    <PassedTests>${summary.passed}</PassedTests>\n`;
  xmlContent += `    <FailedTests>${summary.failed}</FailedTests>\n`;
  xmlContent += `    <SkippedTests>${summary.skipped}</SkippedTests>\n`;
  xmlContent += `  </Summary>\n`;
  xmlContent += `  <TestResults>\n`;
  testResults.forEach(result => {
    xmlContent += `    <TestCase id="${result.id}">\n`;
    xmlContent += `      <Title>${result.title}</Title>\n`;
    xmlContent += `      <Status>${result.status}</Status>\n`;
    xmlContent += `      <CreatedAt>${result.createdAt}</CreatedAt>\n`;
    xmlContent += `      <UpdatedAt>${result.updatedAt}</UpdatedAt>\n`;
    xmlContent += `    </TestCase>\n`;
  });
  xmlContent += `  </TestResults>\n`;
  xmlContent += `</TestReport>`;

  return xmlContent;
}

export async function generateExcelReportAction(): Promise<string> {
  const testResults = await db.select().from(testCases);
  const headers = ['ID', 'Title', 'Status', 'Created At', 'Updated At'];
  let csvContent = headers.join(',') + '\n';

  testResults.forEach(result => {
    const row = [
      result.id,
      `"${result.title.replace(/"/g, '""')}"`,
      result.status,
      result.createdAt,
      result.updatedAt,
    ];
    csvContent += row.join(',') + '\n';
  });

  return csvContent;
}
