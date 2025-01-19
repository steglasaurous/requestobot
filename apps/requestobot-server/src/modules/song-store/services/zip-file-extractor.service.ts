import * as yauzl from 'yauzl';
import * as streams from 'memory-streams';
import { Logger } from '@nestjs/common';

export class ZipFileExtractorService {
  private logger: Logger = new Logger(this.constructor.name);

  /**
   * Extracts one file from a zip file and returns its contents as a string.  Meant
   * for returning JSON or other text files, not so much for binary files.
   *
   */
  public getFileFromZip(
    zipPath: string,
    fileNameToExtract: string
  ): Promise<string | null> {
    return new Promise((resolve) => {
      yauzl.open(zipPath, { lazyEntries: true }, (err, zipFile) => {
        if (err) {
          this.logger.warn('Failed to process zip file', {
            zipPath: zipPath,
            error: err.message,
          });

          resolve(null);
          return;
        }

        zipFile.readEntry();
        zipFile.on('end', () => {
          resolve(null);
        });

        zipFile.on('entry', (entry) => {
          if (entry.fileName == fileNameToExtract) {
            // Read this into memory as it's small enough
            zipFile.openReadStream(entry, (err, readStream) => {
              if (err) {
                this.logger.warn('Failed to extract file from zipfile', {
                  zipPath: zipPath,
                  error: err.message,
                });

                resolve(null);
                return;
              }

              readStream.on('end', async () => {
                zipFile.close();
                resolve(dataStream.toString());
                return;
              });

              const dataStream = new streams.WritableStream();

              readStream.pipe(dataStream);
            });
          } else {
            zipFile.readEntry();
          }
        });
      });
    });
  }
}
