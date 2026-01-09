import { useBullseyeStore } from '@/stores/bullseyeStore';
import PDFMerger from 'pdf-merger-js/browser';

export const exportBullseyeToPDF = async () => {
  const { variantData, currentVariant } = useBullseyeStore.getState();
  const merger = new PDFMerger();

  const pages = variantData[currentVariant].cartItems.map((item) => item.pdfPage);

  const response = await fetch('/assets/2024_Lever_OnePager_WIP_v5 1.pdf');
  const pdfBlob = await response.blob();
  await merger.add(pdfBlob, pages);

  const mergedPdf = await merger.saveAsBlob();
  const url = URL.createObjectURL(mergedPdf);
  const link = document.createElement('a');
  const filename = `Bullseye_Export_${new Date().toISOString()}.pdf`;
  const fileType = 'application/pdf';

  link.href = url;
  link.download = filename;
  link.type = fileType;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}