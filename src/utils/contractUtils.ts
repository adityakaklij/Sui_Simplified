import type { SuiMoveNormalizedType } from '@mysten/sui/client';

/** Shorten an address for display (0x1234...5678) */
function shortenAddress(addr: string, chars = 4): string {
  if (addr.length <= chars * 2 + 4) return addr;
  return `${addr.slice(0, chars + 2)}...${addr.slice(-chars)}`;
}

/** Format SuiMoveNormalizedType for display */
export function formatMoveType(type: SuiMoveNormalizedType): string {
  if (typeof type === 'string') {
    return type;
  }
  if ('Struct' in type) {
    const { address, module, name, typeArguments } = type.Struct;
    const args = typeArguments.length > 0
      ? `<${typeArguments.map(formatMoveType).join(', ')}>`
      : '';
    return `${address}::${module}::${name}${args}`;
  }
  if ('Vector' in type) {
    return `Vector<${formatMoveType(type.Vector)}>`;
  }
  if ('Reference' in type) {
    return `&${formatMoveType(type.Reference)}`;
  }
  if ('MutableReference' in type) {
    return `&mut ${formatMoveType(type.MutableReference)}`;
  }
  if ('TypeParameter' in type) {
    return `T${type.TypeParameter}`;
  }
  return 'Unknown';
}

/** Format SuiMoveNormalizedType for display (shortened addresses) */
export function formatMoveTypeShort(type: SuiMoveNormalizedType): string {
  if (typeof type === 'string') {
    return type;
  }
  if ('Struct' in type) {
    const { address, module, name, typeArguments } = type.Struct;
    const shortAddr = shortenAddress(address, 4);
    const args = typeArguments.length > 0
      ? `<${typeArguments.map(formatMoveTypeShort).join(', ')}>`
      : '';
    return `${shortAddr}::${module}::${name}${args}`;
  }
  if ('Vector' in type) {
    return `Vector<${formatMoveTypeShort(type.Vector)}>`;
  }
  if ('Reference' in type) {
    return `&${formatMoveTypeShort(type.Reference)}`;
  }
  if ('MutableReference' in type) {
    return `&mut ${formatMoveTypeShort(type.MutableReference)}`;
  }
  if ('TypeParameter' in type) {
    return `T${type.TypeParameter}`;
  }
  return 'Unknown';
}

/** Check if type is &Signer or TxContext (skip for dev-inspect) */
export function isSystemType(type: SuiMoveNormalizedType): boolean {
  const formatted = formatMoveType(type);
  return (
    formatted === 'Signer' ||
    formatted.includes('tx_context::TxContext')
  );
}

/** Check if type is an object reference (&T or &mut T) */
export function isObjectReference(type: SuiMoveNormalizedType): boolean {
  if (typeof type !== 'object' || type === null) return false;
  if ('Reference' in type) {
    const inner = type.Reference as SuiMoveNormalizedType;
    if (typeof inner === 'string') return inner === 'Address';
    if (typeof inner === 'object' && inner !== null && 'Struct' in inner) return true;
    return isObjectReference(inner);
  }
  if ('MutableReference' in type) {
    const inner = type.MutableReference as SuiMoveNormalizedType;
    if (typeof inner === 'string') return inner === 'Address';
    if (typeof inner === 'object' && inner !== null && 'Struct' in inner) return true;
    return isObjectReference(inner);
  }
  return false;
}

/** Infer input kind from type for form UX */
export function getInputKind(type: SuiMoveNormalizedType): 'address' | 'u64' | 'string' | 'bool' | 'object' {
  if (typeof type === 'string') {
    if (type === 'Address') return 'address';
    if (['U8', 'U16', 'U32', 'U64', 'U128', 'U256'].includes(type)) return 'u64';
    if (type === 'Bool') return 'bool';
  }
  if (typeof type === 'object' && type !== null && 'Struct' in type) {
    const s = type.Struct;
    const full = `${s.address}::${s.module}::${s.name}`;
    if (full.includes('object::ID') || full.includes('id::ID') || s.name === 'ID') return 'address';
    if (s.address === '0x2' && s.module === 'ascii' && s.name === 'String') return 'string';
  }
  if (typeof type === 'object' && type !== null && 'Vector' in type) {
    const inner = formatMoveType(type.Vector);
    if (inner === 'U8') return 'string'; // Vector<u8> = string
  }
  return 'object';
}
