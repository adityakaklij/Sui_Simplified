import { bcs } from '@mysten/sui/bcs';
import { fromBase64 } from '@mysten/bcs';
import type { SuiMoveNormalizedType } from '@mysten/sui/client';
import { formatMoveType } from './contractUtils';

type BcsParseable = { parse: (bytes: Uint8Array) => unknown };

/** Get BCS schema for a SuiMoveNormalizedType (primitives and common types only) */
function getBcsSchema(type: SuiMoveNormalizedType): BcsParseable | null {
  if (typeof type === 'string') {
    switch (type) {
      case 'Bool':
        return bcs.Bool;
      case 'U8':
        return bcs.U8;
      case 'U16':
        return bcs.U16;
      case 'U32':
        return bcs.U32;
      case 'U64':
        return bcs.U64;
      case 'U128':
        return bcs.U128;
      case 'U256':
        return bcs.U256;
      case 'Address':
        return bcs.Address;
      default:
        return null;
    }
  }

  if ('Vector' in type) {
    if (typeof type.Vector === 'string' && type.Vector === 'U8') {
      return bcs.vector(bcs.U8);
    }
    return null;
  }

  if ('Struct' in type) {
    const s = type.Struct;
    const full = `${s.address}::${s.module}::${s.name}`;
    if (full.includes('object::ID') || full.includes('id::ID') || s.name === 'ID') {
      return bcs.Address;
    }
    if (s.address === '0x1' && s.module === 'ascii' && s.name === 'String') {
      return bcs.String;
    }
    if (s.address === '0x1' && s.module === 'string' && s.name === 'String') {
      return bcs.String;
    }
  }

  return null;
}

/** Decode BCS bytes to a human-readable string */
export function decodeReturnValueFromBytes(
  bytes: Uint8Array,
  returnType: SuiMoveNormalizedType
): string {
  try {
    const schema = getBcsSchema(returnType);

    if (!schema) {
      return `(raw bytes: [${Array.from(bytes.slice(0, 8)).join(', ')}${bytes.length > 8 ? '...' : ''}])`;
    }

    const parsed = schema.parse(bytes);

    if (parsed === null || parsed === undefined) {
      return String(parsed);
    }

    if (typeof parsed === 'bigint') {
      return parsed.toString();
    }

    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'number')) {
      try {
        return new TextDecoder().decode(new Uint8Array(parsed));
      } catch {
        return parsed.join(', ');
      }
    }

    return String(parsed);
  } catch {
    return `(decode failed)`;
  }
}

/** Known BCS type names from API (second element in tuple) */
const API_TYPE_NAMES: Record<string, SuiMoveNormalizedType> = {
  u8: 'U8',
  u16: 'U16',
  u32: 'U32',
  u64: 'U64',
  u128: 'U128',
  u256: 'U256',
  bool: 'Bool',
  address: 'Address',
  'vector<u8>': { Vector: 'U8' },
  'vector ': { Vector: 'U8' },
  vector: { Vector: 'U8' },
};

/** Get normalized type from API type string */
function getTypeFromApiString(typeName: string, fallback: SuiMoveNormalizedType): SuiMoveNormalizedType {
  const normalized = typeName.trim().toLowerCase();
  return API_TYPE_NAMES[normalized] ?? fallback;
}

/** Parse return value tuple and extract bytes.
 * SDK type: [number[], string] = [byteArray, typeName]
 * Some docs show [base64String, typeName] but SDK returns byte array */
function parseReturnValueTuple(
  tuple: unknown,
  fallbackType: SuiMoveNormalizedType
): { bytes: Uint8Array | null; type: SuiMoveNormalizedType } {
  if (!Array.isArray(tuple) || tuple.length < 2) {
    return { bytes: null, type: fallbackType };
  }

  const [first, second] = tuple;
  const typeName = typeof second === 'string' ? second : '';
  const type = getTypeFromApiString(typeName, fallbackType);

  // Format 1: [number[], string] - byte array (SDK type)
  if (Array.isArray(first) && first.every((x) => typeof x === 'number')) {
    return { bytes: new Uint8Array(first), type };
  }

  // Format 2: [string, string] - base64 string (some docs show this)
  if (typeof first === 'string') {
    try {
      const bytes = fromBase64(first);
      return { bytes, type };
    } catch {
      return { bytes: null, type };
    }
  }

  return { bytes: null, type: fallbackType };
}

/** Decode all return values from devInspect results.
 * API returns: [[byteArray, typeName], ...] e.g. [[[128,0,0,0,0,0,0,0], "u64"], ...]
 * The byteArray contains BCS-encoded data, typeName tells us how to decode. */
export function decodeDevInspectReturnValues(
  returnValues: [number[] | string, string][] | undefined,
  returnTypes: SuiMoveNormalizedType[]
): string[] {
  if (!returnValues || returnValues.length === 0) {
    return [];
  }

  const results: string[] = [];
  returnValues.forEach((tuple, idx) => {
    const fallbackType = returnTypes[idx] ?? 'U64';
    const { bytes, type } = parseReturnValueTuple(tuple, fallbackType);

    if (!bytes || bytes.length === 0) {
      results.push(`Return ${idx + 1}: (no data)`);
      return;
    }

    const decoded = decodeReturnValueFromBytes(bytes, type);
    const typeLabel = formatMoveType(type);
    results.push(`Return ${idx + 1} (${typeLabel}): ${decoded}`);
  });
  return results;
}
