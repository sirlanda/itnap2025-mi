'use server';

// Mock data for reports
const mockTestResults = [
  { id: 'TC001', title: 'User Login Valid', status: 'Passed', duration: '15s', executedBy: 'John Doe' },
  { id: 'TC002', title: 'User Login Invalid', status: 'Passed', duration: '10s', executedBy: 'John Doe' },
  { id: 'TC003', title: 'Create Profile', status: 'Failed', reason: 'Email validation failed', duration: '30s', executedBy: 'Jane Smith' },
  { id: 'TC004', title: 'Update Profile', status: 'Passed', duration: '25s', executedBy: 'Jane Smith' },
  { id: 'TC005', title: 'Password Reset', status: 'Skipped', duration: 'N/A', executedBy: 'System' },
];

const summary = {
  total: mockTestResults.length,
  passed: mockTestResults.filter(r => r.status === 'Passed').length,
  failed: mockTestResults.filter(r => r.status === 'Failed').length,
  skipped: mockTestResults.filter(r => r.status === 'Skipped').length,
};

export async function generateXmlReportAction(): Promise<string> {
  // Simulate report generation delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xmlContent += `<TestReport generatedAt="${new Date().toISOString()}">\n`;
  xmlContent += `  <Summary>\n`;
  xmlContent += `    <TotalTests>${summary.total}</TotalTests>\n`;
  xmlContent += `    <PassedTests>${summary.passed}</PassedTests>\n`;
  xmlContent += `    <FailedTests>${summary.failed}</FailedTests>\n`;
  xmlContent += `    <SkippedTests>${summary.skipped}</SkippedTests>\n`;
  xmlContent += `  </Summary>\n`;
  xmlContent += `  <TestResults>\n`;
  mockTestResults.forEach(result => {
    xmlContent += `    <TestCase id="${result.id}">\n`;
    xmlContent += `      <Title>${result.title}</Title>\n`;
    xmlContent += `      <Status>${result.status}</Status>\n`;
    xmlContent += `      <Duration>${result.duration}</Duration>\n`;
    xmlContent += `      <ExecutedBy>${result.executedBy}</ExecutedBy>\n`;
    if (result.status === 'Failed' && result.reason) {
      xmlContent += `      <Reason>${result.reason}</Reason>\n`;
    }
    xmlContent += `    </TestCase>\n`;
  });
  xmlContent += `  </TestResults>\n`;
  xmlContent += `</TestReport>`;

  return xmlContent;
}

export async function generateExcelReportAction(): Promise<string> {
  // Simulate report generation delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generating CSV content for simplicity
  const headers = ['ID', 'Title', 'Status', 'Duration', 'Executed By', 'Reason'];
  let csvContent = headers.join(',') + '\n';

  mockTestResults.forEach(result => {
    const row = [
      result.id,
      `"${result.title.replace(/"/g, '""')}"`, // Handle commas in title by quoting
      result.status,
      result.duration,
      result.executedBy,
      result.reason ? `"${result.reason.replace(/"/g, '""')}"` : ''
    ];
    csvContent += row.join(',') + '\n';
  });

  return csvContent;
}
