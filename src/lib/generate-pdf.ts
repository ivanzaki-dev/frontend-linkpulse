import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ReportData = {
  report?: {
    order_id: string;
    summary: {
      total: number;
      active: number;
      inactive: number;
      uncheckable: number;
    };
    videos: Array<{
      label: string;
      youtube_url?: string;
      links: Array<{
        index: number;
        display_url: string;
        final_status: string | null;
      }>;
    }>;
  };
};

export function downloadOrderReportPdf(data: ReportData, filename: string) {
  const report = data.report;
  if (!report) throw new Error('Report not ready');

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('LinkPulse — Laporan Pengecekan Link', 14, 18);
  doc.setFontSize(10);
  doc.text(`Order: ${report.order_id}`, 14, 26);
  doc.text(
    `Ringkasan: ${report.summary.active} aktif · ${report.summary.inactive} tidak aktif · ${report.summary.uncheckable} tidak bisa diperiksa · total ${report.summary.total}`,
    14,
    32
  );

  let y = 40;
  for (const video of report.videos) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(11);
    doc.text(video.label || 'Video', 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [['#', 'URL', 'Status']],
      body: video.links.map((l) => [
        String(l.index),
        l.display_url.length > 70 ? `${l.display_url.slice(0, 67)}…` : l.display_url,
        l.final_status || '—',
      ]),
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  doc.save(filename);
}
