type YamlValue = string | number | boolean | null | YamlObject | YamlValue[];
interface YamlObject {
  [key: string]: YamlValue;
}

interface YamlLine {
  indent: number;
  text: string;
  lineNumber: number;
}

export function parseYaml(input: string): YamlValue {
  const lines = input
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((raw, index): YamlLine | null => {
      if (!raw.trim() || raw.trimStart().startsWith("#")) {
        return null;
      }
      const indent = raw.match(/^ */)?.[0].length ?? 0;
      return {
        indent,
        text: raw.trim(),
        lineNumber: index + 1,
      };
    })
    .filter((line): line is YamlLine => line !== null);

  if (lines.length === 0) {
    return null;
  }

  const [value] = parseBlock(lines, 0, lines[0].indent);
  return value;
}

function parseBlock(lines: YamlLine[], index: number, indent: number): [YamlValue, number] {
  const line = lines[index];
  if (!line || line.indent < indent) {
    return [null, index];
  }

  if (line.text.startsWith("- ")) {
    return parseSequence(lines, index, indent);
  }

  return parseMapping(lines, index, indent);
}

function parseSequence(lines: YamlLine[], index: number, indent: number): [YamlValue[], number] {
  const result: YamlValue[] = [];
  let cursor = index;

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line.indent !== indent || !line.text.startsWith("- ")) {
      break;
    }

    const rest = line.text.slice(2).trim();
    if (!rest) {
      const nextIndent = lines[cursor + 1]?.indent;
      if (nextIndent === undefined || nextIndent <= indent) {
        result.push(null);
        cursor += 1;
      } else {
        const [child, next] = parseBlock(lines, cursor + 1, nextIndent);
        result.push(child);
        cursor = next;
      }
      continue;
    }

    const keyValue = splitKeyValue(rest);
    if (keyValue) {
      const [key, rawValue] = keyValue;
      const item: YamlObject = {};
      if (rawValue === "") {
        const nextIndent = lines[cursor + 1]?.indent;
        if (nextIndent !== undefined && nextIndent > indent) {
          const [child, next] = parseBlock(lines, cursor + 1, nextIndent);
          item[key] = child;
          cursor = next;
        } else {
          item[key] = null;
          cursor += 1;
        }
      } else {
        item[key] = parseScalar(rawValue);
        cursor += 1;
      }

      while (cursor < lines.length && lines[cursor].indent > indent) {
        const [child, next] = parseBlock(lines, cursor, lines[cursor].indent);
        if (isPlainObject(child)) {
          Object.assign(item, child);
        }
        cursor = next;
      }

      result.push(item);
      continue;
    }

    result.push(parseScalar(rest));
    cursor += 1;
  }

  return [result, cursor];
}

function parseMapping(lines: YamlLine[], index: number, indent: number): [YamlObject, number] {
  const result: YamlObject = {};
  let cursor = index;

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line.indent < indent) {
      break;
    }
    if (line.indent > indent) {
      throw new Error(`Unexpected indentation at line ${line.lineNumber}`);
    }
    if (line.text.startsWith("- ")) {
      break;
    }

    const keyValue = splitKeyValue(line.text);
    if (!keyValue) {
      throw new Error(`Invalid mapping entry at line ${line.lineNumber}: ${line.text}`);
    }

    const [key, rawValue] = keyValue;
    if (rawValue === "") {
      const nextIndent = lines[cursor + 1]?.indent;
      if (nextIndent !== undefined && nextIndent > indent) {
        const [child, next] = parseBlock(lines, cursor + 1, nextIndent);
        result[key] = child;
        cursor = next;
      } else {
        result[key] = null;
        cursor += 1;
      }
      continue;
    }

    result[key] = parseScalar(rawValue);
    cursor += 1;
  }

  return [result, cursor];
}

function splitKeyValue(text: string): [string, string] | null {
  let quote: string | null = null;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if ((char === "'" || char === '"') && text[index - 1] !== "\\") {
      quote = quote === char ? null : quote ?? char;
      continue;
    }
    if (char === ":" && quote === null) {
      const key = text.slice(0, index).trim();
      const value = text.slice(index + 1).trim();
      if (!key) {
        return null;
      }
      return [key, value];
    }
  }
  return null;
}

function parseScalar(rawValue: string): string | number | boolean | null {
  const value = rawValue.trim();
  if (value === "null" || value === "~") {
    return null;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1).replace(/\\"/g, '"');
  }
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  return value;
}

function isPlainObject(value: YamlValue): value is YamlObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
