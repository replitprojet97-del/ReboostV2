import sharp from 'sharp';
import * as pdfLib from 'pdf-lib';

/**
 * Compresse un document (image ou PDF) pour réduire son poids tout en restant lisible.
 */
export async function compressDocument(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<{ buffer: Buffer; mimeType: string }> {
  try {
    const originalSize = buffer.length / (1024 * 1024);
    console.log(`[Compression] Initial file size for ${fileName}: ${originalSize.toFixed(2)} MB`);

    // Si le fichier est déjà petit (< 500 KB), on ne touche à rien
    if (buffer.length < 500 * 1024) {
      return { buffer, mimeType };
    }

    // Traitement des images
    if (mimeType.startsWith('image/')) {
      let sharpInstance = sharp(buffer);
      const metadata = await sharpInstance.metadata();

      // Redimensionner si l'image est trop grande (> 1600px)
      if (metadata.width && metadata.width > 1600) {
        sharpInstance = sharpInstance.resize(1600, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      // Compression selon le format
      let compressedBuffer: Buffer;
      if (mimeType === 'image/png') {
        compressedBuffer = await sharpInstance
          .png({ quality: 70, compressionLevel: 9 })
          .toBuffer();
      } else {
        // Fallback JPEG pour les autres types d'images (plus efficace pour le poids)
        compressedBuffer = await sharpInstance
          .jpeg({ quality: 65, progressive: true, mozjpeg: true })
          .toBuffer();
        
        const newMimeType = 'image/jpeg';
        console.log(`[Compression] Image ${fileName} compressed to ${(compressedBuffer.length / (1024 * 1024)).toFixed(2)} MB`);
        return { buffer: compressedBuffer, mimeType: newMimeType };
      }

      console.log(`[Compression] Image ${fileName} compressed to ${(compressedBuffer.length / (1024 * 1024)).toFixed(2)} MB`);
      return { buffer: compressedBuffer, mimeType };
    }

    // Traitement des PDF
    if (mimeType === 'application/pdf') {
      try {
        const pdfDoc = await pdfLib.PDFDocument.load(buffer);
        
        // pdf-lib ne compresse pas nativement les images contenues dans le PDF de manière simple,
        // mais l'enregistrer avec l'option de compression des flux peut aider un peu.
        const compressedPdf = await pdfDoc.save({ useObjectStreams: true });
        const compressedBuffer = Buffer.from(compressedPdf);
        
        console.log(`[Compression] PDF ${fileName} "optimized" to ${(compressedBuffer.length / (1024 * 1024)).toFixed(2)} MB`);
        return { buffer: compressedBuffer, mimeType };
      } catch (pdfError) {
        console.error(`[Compression] PDF optimization failed for ${fileName}:`, pdfError);
        return { buffer, mimeType };
      }
    }

    return { buffer, mimeType };
  } catch (error) {
    console.error(`[Compression] Critical error during compression of ${fileName}:`, error);
    return { buffer, mimeType };
  }
}
