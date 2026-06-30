import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

export default function PDFExportButton({ results, gpas }) {
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235);
      doc.text("WhatCollege?", 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("College Admission Prediction Report", 20, 33);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 39);

      // GPA Summary
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 45, pageWidth - 20, 45);

      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text("Your GPA Profile", 20, 55);

      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`Unweighted: ${gpas.unweighted.toFixed(2)}`, 20, 63);
      doc.text(`Weighted: ${gpas.weighted.toFixed(2)}`, 80, 63);
      doc.text(`Academic: ${gpas.academic.toFixed(2)}`, 140, 63);
      doc.text(`10-12 GPA: ${gpas.grade10to12.toFixed(2)}`, 20, 70);

      // AP Courses
      const apCourses = gpas.apCourses || [];
      if (apCourses.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const apText = `AP Courses (${apCourses.length}): ${apCourses.join(", ")}`;
        const splitAP = doc.splitTextToSize(apText, pageWidth - 40);
        doc.text(splitAP, 20, 77);
      }

      // Results table
      let y = apCourses.length > 0 ? 90 : 85;
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text("Results Summary", 20, y);
      y += 8;

      // Header
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("University", 20, y);
      doc.text("State", 120, y);
      doc.text("Chance", 140, y);
      doc.text("Rating", 160, y);
      y += 2;
      doc.line(20, y, pageWidth - 20, y);
      y += 5;

      doc.setTextColor(51, 65, 85);
      results.forEach((r) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(8);
        const name = r.college.name.length > 45 ? r.college.name.substring(0, 45) + "..." : r.college.name;
        doc.text(name, 20, y);
        doc.text(r.college.state, 120, y);
        doc.text(`${r.chance}%`, 140, y);

        const ratingColors = {
          "Safety": [16, 185, 129],
          "Match": [59, 130, 246],
          "Reach": [245, 158, 11],
          "Ultra Reach": [239, 68, 68],
        };
        const color = ratingColors[r.rating] || [100, 116, 139];
        doc.setTextColor(...color);
        doc.text(r.rating, 160, y);
        doc.setTextColor(51, 65, 85);

        y += 6;
      });

      // Footer
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("WhatCollege? — For informational purposes only. Not an official admissions tool.", 20, 285);

      doc.save("WhatCollege-Report.pdf");
    } catch {
      // silently fail
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={exportPDF}
      disabled={exporting}
      className="rounded-xl border-slate-200 gap-2 text-sm h-9"
      aria-label="Export results to PDF"
    >
      {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      Export PDF
    </Button>
  );
}