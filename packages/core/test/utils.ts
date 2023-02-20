import fs from 'fs'

export function mockFile(content: string) {
  // @ts-expect-error Only need one method
  vi.spyOn(fs, 'statSync').mockReturnValue({ isFile: () => true })
  vi.spyOn(fs, 'readFileSync').mockReturnValue(content)
}

export function mockDirectory(content: string) {
  // @ts-expect-error Only need one method
  vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true })
  vi.spyOn(fs, 'readFileSync').mockReturnValue(content)
}
