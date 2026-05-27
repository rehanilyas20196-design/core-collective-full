import sharp from 'sharp';
import { readFile, writeFile } from 'fs/promises';
import { extname, join, relative } from 'path';

const extensions = new Set(['.png', '.jpg', '.jpeg']);

export default function webpPlugin() {
  return {
    name: 'vite-webp',
    enforce: 'post',
    async generateBundle(_options, bundle) {
      const promises = [];
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'asset' && extensions.has(extname(fileName).toLowerCase())) {
          const src = chunk.source;
          if (Buffer.isBuffer(src) || typeof src === 'string') {
            promises.push(
              (async () => {
                const webpName = fileName.replace(/\.(png|jpe?g)$/i, '.webp');
                const webpBuffer = await sharp(src).webp({ quality: 80 }).toBuffer();
                this.emitFile({
                  type: 'asset',
                  fileName: webpName,
                  source: webpBuffer,
                });
              })()
            );
          }
        }
      }
      await Promise.all(promises);
    },
  };
}
