'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, FileSpreadsheet, BarChartBig } from 'lucide-react';
import { generateXmlReportAction, generateExcelReportAction } from '@/server/actions/report-actions';
import { useToast } from '@/hooks/use-toast';

// Mock data for display
const mockReportSummary = {
  totalTestCases: 150,
  passed: 120,
  failed: 20,
  skipped: 5,
  inProgress: 0,
  notStarted: 5,
};

const mockRecentReports = [
  { id: 'REP001', title: 'Sprint 2 - Regression Test', date: '2024-07-15', status: 'Completed' },
  { id: 'REP002', title: 'User Profile Module Tests', date: '2024-07-10', status: 'Completed' },
  { id: 'REP003', title: 'Payment Gateway Integration', date: '2024-07-05', status: 'Archived' },
];

export default function ReportsPage() {
  const { toast } = useToast();

  const handleDownload = async (format: 'xml' | 'excel') => {
    try {
      let fileContent: string;
      let fileName: string;
      let contentType: string;

      if (format === 'xml') {
        fileContent = await generateXmlReportAction();
        fileName = 'test_report.xml';
        contentType = 'application/xml';
      } else {
        fileContent = await generateExcelReportAction(); // This generates CSV
        fileName = 'test_report.csv';
        contentType = 'text/csv';
      }

      const blob = new Blob([fileContent], { type: contentType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({
        title: 'Download Started',
        description: `${fileName} is being downloaded.`,
      });
    } catch (error) {
      console.error(`Failed to download ${format} report:`, error);
      toast({
        title: 'Download Failed',
        description: `Could not generate the ${format} report. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Reports</h1>
        <div className="flex gap-2">
          <Button onClick={() => handleDownload('xml')} variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Download XML
          </Button>
          <Button onClick={() => handleDownload('excel')} variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Download Excel
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <BarChartBig className="mr-2 h-6 w-6 text-primary" />
            Test Execution Summary
          </CardTitle>
          <CardDescription>Overview of the latest test execution results.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            {Object.entries(mockReportSummary).map(([key, value]) => (
              <div key={key} className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-3xl font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Recent Reports</CardTitle>
          <CardDescription>List of recently generated or accessed reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentReports.length > 0 ? mockRecentReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.status}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" /> View/Download
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                   <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No recent reports available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Report Visualization (Placeholder)</CardTitle>
          <CardDescription>This section will display charts and graphs for test results.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 bg-muted/30 rounded-md">
          <div className="text-center text-muted-foreground">
            <BarChartBig className="h-16 w-16 mx-auto mb-2" />
            <p>Test result visualizations will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
