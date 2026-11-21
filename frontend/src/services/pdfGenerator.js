import { jsPDF } from 'jspdf';
import { DAMAGE_CLASSES, PRIORITY_DISCLAIMER } from '../utils/constants';

/**
 * Generates an executive engineering road inspection report in PDF format.
 */
export async function generateInspectionPDF(inspectionResult) {
  if (!inspectionResult) {
    throw new Error("No inspection results to generate report.");
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Background Header Bar (NVIDIA-inspired dark styling)
  doc.setFillColor(8, 11, 10);
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Neon Accent Bar
  doc.setFillColor(118, 185, 0);
  doc.rect(0, 36, pageWidth, 2.5, 'F');

  // Title & Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(118, 185, 0); // Neon green
  doc.text('ROAD SENSE AI', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text('AUTOMATIC ROAD DAMAGE DETECTION & PAVEMENT TRIAGE REPORT', margin, 23);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('TAGLINE: Detect. Analyze. Prioritize. Repair.', margin, 29);

  // Status Badge in header
  const isDemo = inspectionResult.is_demo_mode;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  if (isDemo) {
    doc.setFillColor(30, 41, 59);
    doc.rect(pageWidth - margin - 55, 11, 55, 15, 'F');
    doc.setTextColor(56, 189, 248);
    doc.text('BENCHMARK DEMO', pageWidth - margin - 50, 18);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Ground Truth Reference', pageWidth - margin - 50, 23);
  } else {
    doc.setFillColor(20, 40, 15);
    doc.rect(pageWidth - margin - 55, 11, 55, 15, 'F');
    doc.setTextColor(118, 185, 0);
    doc.text('LIVE YOLO INFERENCE', pageWidth - margin - 50, 18);
    doc.setFontSize(7);
    doc.setTextColor(180, 220, 130);
    doc.text('Deep Neural Network', pageWidth - margin - 50, 23);
  }

  // Inspection Metadata Grid
  let yPos = 48;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. INSPECTION TELEMETRY & SYSTEM METADATA', margin, yPos);

  yPos += 4;
  doc.setDrawColor(220, 225, 230);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 80, 90);

  const col1 = margin + 2;
  const col2 = margin + 95;

  const timestamp = inspectionResult.timestamp || new Date().toISOString();
  const latency = inspectionResult.latency_ms ? `${inspectionResult.latency_ms} ms` : 'N/A';
  const device = inspectionResult.device_used || 'Local Device';
  const confThresh = inspectionResult.confidence_threshold ? `${Math.round(inspectionResult.confidence_threshold * 100)}%` : '25%';
  const totalDets = inspectionResult.total_detections || 0;

  doc.text(`Inspection Timestamp: ${timestamp}`, col1, yPos);
  doc.text(`Inference Device: ${device}`, col2, yPos);
  yPos += 6;
  doc.text(`Confidence Threshold: ${confThresh}`, col1, yPos);
  doc.text(`Processing Latency: ${latency}`, col2, yPos);
  yPos += 6;
  doc.text(`Total Defect Count: ${totalDets} detected distress region(s)`, col1, yPos);
  doc.text(`Model Architecture: Ultralytics YOLOv8 (PyTorch)`, col2, yPos);

  // Section 2: Defect Analysis Table
  yPos += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('2. QUANTITATIVE DEFECT DISTRIBUTION', margin, yPos);

  yPos += 4;
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;

  // Table header
  doc.setFillColor(240, 245, 240);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(40, 60, 40);
  doc.text('CLASS CODE', margin + 3, yPos + 4.8);
  doc.text('DAMAGE DESCRIPTION', margin + 30, yPos + 4.8);
  doc.text('CATEGORY TYPE', margin + 90, yPos + 4.8);
  doc.text('COUNT', margin + 140, yPos + 4.8);
  doc.text('CONFIDENCE (AVG)', margin + 158, yPos + 4.8);

  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const classCounts = inspectionResult.class_counts || {};
  const detections = inspectionResult.detections || [];

  const rows = [
    { code: 'D00', name: 'Longitudinal Crack', category: 'Linear Joint Fatigue' },
    { code: 'D10', name: 'Transverse Crack', category: 'Thermal Contraction' },
    { code: 'D20', name: 'Alligator Crack', category: 'Structural Base Fatigue' },
    { code: 'D40', name: 'Pothole', category: 'Surface Cavity / Hazard' },
  ];

  rows.forEach((row, i) => {
    const count = classCounts[row.code] || 0;
    const detsForClass = detections.filter(d => d.class_code === row.code);
    const avgConf = detsForClass.length > 0
      ? `${Math.round((detsForClass.reduce((a, b) => a + (b.confidence || 0), 0) / detsForClass.length) * 100)}%`
      : '—';

    if (i % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos, pageWidth - (margin * 2), 6.5, 'F');
    }

    doc.setTextColor(30, 40, 50);
    doc.text(row.code, margin + 3, yPos + 4.5);
    doc.text(row.name, margin + 30, yPos + 4.5);
    doc.text(row.category, margin + 90, yPos + 4.5);
    doc.text(count.toString(), margin + 144, yPos + 4.5);
    doc.text(avgConf, margin + 165, yPos + 4.5);

    yPos += 6.5;
  });

  // Section 3: Priority & Engineering Recommendation
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('3. EXPERIMENTAL REPAIR PRIORITY & MAINTENANCE TRIAGE', margin, yPos);

  yPos += 4;
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;

  const prio = inspectionResult.priority_evaluation || {};
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 26, 2, 2, 'F');
  doc.setDrawColor(200, 210, 220);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 26, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Triage Level: ${prio.priority_level || 'Normal Monitoring'}`, margin + 4, yPos + 6);
  doc.text(`Estimated Urgency Index: ${prio.urgency_score || 0}/100`, pageWidth - margin - 60, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const actionText = prio.recommended_action || 'Routine maintenance monitoring.';
  const splitAction = doc.splitTextToSize(`Recommended Maintenance: ${actionText}`, pageWidth - (margin * 2) - 8);
  doc.text(splitAction, margin + 4, yPos + 12);

  doc.text(`Target Response Window: ${prio.estimated_timeframe || 'Scheduled cycle'}`, margin + 4, yPos + 22);

  yPos += 30;

  // Disclaimer block
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  doc.setTextColor(120, 130, 140);
  const splitDisclaimer = doc.splitTextToSize(PRIORITY_DISCLAIMER, pageWidth - (margin * 2));
  doc.text(splitDisclaimer, margin, yPos);

  // Section 4: Imagery Comparison (if present)
  yPos += 14;
  if (inspectionResult.annotated_image && yPos < pageHeight - 65) {
    try {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text('4. COMPUTER VISION DETECTION OVERLAY', margin, yPos);
      yPos += 4;

      const imgWidth = 85;
      const imgHeight = 60;
      if (inspectionResult.original_image) {
        doc.addImage(inspectionResult.original_image, 'JPEG', margin, yPos, imgWidth, imgHeight);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text('Source Road Image', margin + 25, yPos + imgHeight + 4);
      }
      doc.addImage(inspectionResult.annotated_image, 'JPEG', margin + 92, yPos, imgWidth, imgHeight);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text('AI Annotated Bounding Boxes', margin + 110, yPos + imgHeight + 4);
    } catch (e) {
      console.warn("Could not embed image into PDF:", e);
    }
  }

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text(
    `ROAD SENSE AI • Automatic Road Damage Detection System • Generated on ${new Date().toLocaleDateString()}`,
    margin,
    pageHeight - 8
  );
  doc.text(`Page 1 of 1`, pageWidth - margin - 15, pageHeight - 8);

  // Save the PDF
  const filename = `Road_Sense_Inspection_${Date.now()}.pdf`;
  doc.save(filename);
  return filename;
}
