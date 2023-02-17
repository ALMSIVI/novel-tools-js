import dedent from 'dedent'

// noinspection NonAsciiCharacters
const numDict: Record<string, number> = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
  廿: 20,
  卅: 30,
  卌: 40,
  百: 100,
  千: 1000,
}

const invalidChars = new Set(['\\', '/', '*', '?', ':', '"', '<', '>', '|', '\n'])

/** Translate a Chinese number string to a number. */
export function parseNumber(num: string): number {
  num = num.trim()

  let value = 0
  let digit = 1

  for (let i = 0; i < num.length; i++) {
    const v = numDict[num.charAt(i)]
    // Fallback: parse as a plain number
    if (v === undefined) {
      const parsed = Number(num)
      if (!isFinite(parsed)) {
        throw new SyntaxError(`Cannot parse '${num}' to a number.`)
      }

      return parsed
    }

    if (v >= 10) {
      digit *= v
      value += digit
    } else if (i == num.length - 1) {
      value += v
    } else {
      digit = v
    }
  }

  return value
}

export function purifyName(filename: string): string {
  return Array.from(filename)
    .filter((c) => !invalidChars.has(c))
    .join('')
    .trim()
}

export function formatText(text: string): string {
  return dedent(text).trim()
}
