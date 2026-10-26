import { HttpParams } from '@angular/common/http';

export function buildHttpParams(
  source: Record<string, unknown>,
): HttpParams {
  let params = new HttpParams();

  for (const [key, value] of Object.entries(source)) {
    params = appendParam(params, key, value);
  }

  return params;
}

export function appendParam(
  params: HttpParams,
  key: string,
  value: unknown,
): HttpParams {
  if (value === null || value === undefined) {
    return params;
  }

  // boolean: wysyłaj tylko true
  if (typeof value === 'boolean') {
    return value ? params.set(key, value) : params;
  }

  const normalized =
    typeof value === 'string' ? value.trim() : String(value);

  // pusty string: np. niewybrany select albo pusty input
  if (normalized === '') {
    return params;
  }

  return params.set(key, normalized);
}
