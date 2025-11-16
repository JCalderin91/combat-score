import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const iconSvg = path.join(publicDir, 'icon.svg');

async function generateIcons() {
  try {
    // Leer el SVG
    const svgBuffer = fs.readFileSync(iconSvg);
    
    // Generar icono 192x192
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'pwa-192x192.png'));
    
    console.log('✓ Generado pwa-192x192.png');
    
    // Generar icono 512x512
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'pwa-512x512.png'));
    
    console.log('✓ Generado pwa-512x512.png');
    
    console.log('✓ Iconos generados exitosamente');
  } catch (error) {
    console.error('Error generando iconos:', error);
    process.exit(1);
  }
}

generateIcons();