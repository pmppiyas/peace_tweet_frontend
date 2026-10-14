const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const svgPath = path.join(__dirname, '..', 'public', 'p-logo.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'icon-192x192.png'));

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'icon-512x512.png'));

  // Apple touch icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'));

  // Maskable icon 512x512 with safe padding
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 24, g: 119, b: 242, alpha: 1 } // #1877f2 background
    })
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'maskable-icon-512x512.png'));

  console.log('All PWA icons generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
