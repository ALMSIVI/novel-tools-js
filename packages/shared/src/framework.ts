import { NovelData } from './data'

export interface Reader {
    read(): Generator<NovelData>
}

export interface Processor {
    process(novelData: NovelData): NovelData
}

export interface Writer {
    write(novelData: NovelData): void
}

export function transform(readers: Reader[], processors: Processor[], writers: Writer[]) {
    for (const reader of readers) {
        for (let data of reader.read()) {
            for (const processor of processors) {
                data = processor.process(data)
            }

            for (const writer of writers) {
                writer.write(data)
            }
        }
    }
}
