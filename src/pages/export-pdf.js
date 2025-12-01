// src/pages/api/export-pdf.js
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { ids = [] } = req.body;
  const { data: assets } = await supabase.from('assets').select('*').in('id', ids);
  const doc = new PDFDocument();
  res.setHeader('Content-Disposition', 'attachment; filename=assets.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  assets.forEach(a => {
    doc.fontSize(16).text(a.name || 'Unnamed', { underline: true });
    doc.fontSize(12).text(a.description || '');
    doc.moveDown();
  });
  doc.end();
}
