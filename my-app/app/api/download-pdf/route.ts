import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";

// Fonction qui gère les requêtes GET
export async function GET(req: NextRequest) {
  // Créer un nouveau document PDF
  const doc = new PDFDocument();
  const chunks: Uint8Array[] = [];

  // Utiliser des stream pour récupérer le flux PDF
  doc.on("data", (chunk: any) => {
    chunks.push(chunk);
  });

  doc.on("end", () => {
    console.log("PDF généré");
  });

  // Ajouter du contenu au PDF
  doc.text("Ceci est un fichier PDF généré dynamiquement avec pdfkit !");

  // Finaliser le fichier PDF
  doc.end();

  // Attendre que le PDF soit entièrement généré
  const pdfBuffer = Buffer.concat(chunks);

  // Retourner une réponse avec le PDF
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="file.pdf"',
    },
  });
}
