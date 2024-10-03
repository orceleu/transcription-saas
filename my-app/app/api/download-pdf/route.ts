import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
//import blobStream from "blobStream"

export async function GET(req: NextRequest, res: NextResponse) {
  // Create a document
  const doc = new PDFDocument();
  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  doc.pipe(fs.createWriteStream("output.pdf"));

  // Embed a font, set the font size, and render some text
  doc.fontSize(25).text("Some text with an embedded font!", 100, 100);
  // pipe the document to a blob
  //const stream = doc.pipe(blobStream());

  // add your content to the document here, as usual

  // get a blob when you are done
  doc.end();
  /* stream.on("finish", function () {
    // get a blob you can do whatever you like with
    const blob = stream.toBlob("application/pdf");

    // or get a blob URL for display in the browser
    const url = stream.toBlobURL("application/pdf");
    iframe.src = url;
  });
*/
  /*try {
      // Path to the file that should be downloaded
      const filePath = path.join(process.cwd(), "output.pdf");

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Set headers to force the download
      res.setHeader("Content-Disposition", 'attachment; filename="output.pdf"');
      res.setHeader("Content-Type", "application/pdf");

      // Create a read stream and pipe it to the response
      const fileStream = fs.createReadStream(filePath);

      // Pipe the file stream directly into the HTTP response
      fileStream.pipe(res);

      // Handle errors in the file stream
      fileStream.on("error", (err) => {
        console.error("Error reading the file:", err);
        res.status(500).json({ message: "Error while downloading the file" });
      });

      // End the response when the file has been completely sent
      fileStream.on("end", () => {
        res.end(); // Important to close the connection when done
      });
    } catch (error) {
      // Catch any unexpected errors and return a 500 error
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    // Return a 405 error if the method is not GET
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }*/
  return NextResponse.json({ data: "received" });
}
