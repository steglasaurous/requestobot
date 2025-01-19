import {promisify} from 'node:util';
import {Readable as ReadableStream, pipeline} from 'node:stream';
import process from 'node:process';
import {Buffer} from 'node:buffer';
import csvParser from 'csv-parser';
import getStream from 'get-stream';
import {Options} from 'csv-parser';

// TODO: Use `import {pipeline as pipelinePromise} from 'node:stream/promises';` when targeting Node.js 16.

const pipelinePromise = promisify(pipeline);

/**
 Fast CSV parser.

 Convenience wrapper around the super-fast streaming [`csv-parser`](https://github.com/mafintosh/csv-parser) module. Use that one if you want streamed parsing.

 @param data - The CSV data to parse.
 @param options - See the [`csv-parser` options](https://github.com/mafintosh/csv-parser#options).

 @example
 ```
 import neatCsv from 'neat-csv';

 const csv = 'type,part\nunicorn,horn\nrainbow,pink';

 console.log(await neatCsv(csv));
 //=> [{type: 'unicorn', part: 'horn'}, {type: 'rainbow', part: 'pink'}]
 ```
 */

export type Row = Record<string, string>;

export default async function neatCsv<RowType = Row>(data: string | Buffer | ReadableStream, options?: Options): Promise<RowType[]> {
  if (typeof data === 'string' || Buffer.isBuffer(data)) {
    data = ReadableStream.from(data);
  }

  const parserStream = csvParser(options);

  // Node.js 16 has a bug with `.pipeline` for large strings. It works fine in Node.js 14 and 12.
  if (Number(process.versions.node.split('.')[0]) >= 16) {
    return getStream.array(data.pipe(parserStream));
  }

  await pipelinePromise([data, parserStream]);
  return getStream.array(parserStream);
}
