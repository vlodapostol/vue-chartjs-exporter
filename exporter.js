import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default class Exporter {
  constructor(charts) {
    this.charts = charts;
    this.doc = new jsPDF("landscape", "px", "letter");
  }
  export_pdf() {
    return new Promise((resolve, reject) => {
      try {
        this.charts.forEach(async (chart, index, charts) => {
          this.doc = await this.create_page(chart, this.doc);
          if (index === charts.length - 1) resolve(this.doc); // this.doc.save("charts.pdf"); // <-- at the end of the loop; return PDF
          this.doc.addPage("letter");
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async create_page(chart, doc) {
    const canvas = await html2canvas(chart, {
      scrollY: -window.scrollY,
      scale: 5 // <-- this is to increase the quality. don't raise this past 5 as it doesn't get much better and just takes longer to process
    });
    const image = canvas.toDataURL("image/jpeg", 1.0),
      pageWidth = doc.internal.pageSize.getWidth(),
      pageHeight = doc.internal.pageSize.getHeight(),
      ratio = (pageWidth - 50) / canvas.width,
      canvasWidth = canvas.width * ratio,
      canvasHeight = canvas.height * ratio,
      marginX = (pageWidth - canvasWidth) / 2,
      marginY = (pageHeight - canvasHeight) / 2;

    doc.addImage(image, "JPEG", marginX, marginY, canvasWidth, canvasHeight);

    return doc;
  }
}
