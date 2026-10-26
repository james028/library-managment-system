// http-params.utils.ts
import { HttpParams } from '@angular/common/http';

export function buildHttpParams(
  source: Record<string, unknown>,
  options: { skipFalse?: boolean } = {},
): HttpParams {
  let params = new HttpParams();

  for (const [key, value] of Object.entries(source)) {
    if (options.skipFalse && value === false) {
      continue;
    }

    params = appendParam(params, key, value);
  }

  return params;
}

export function appendParam(params: HttpParams, key: string, value: unknown): HttpParams {
  if (value === null || value === undefined) {
    return params;
  }

  const normalized = typeof value === 'string' ? value.trim() : String(value);

  if (normalized === '') {
    return params;
  }

  return params.set(key, normalized);
}
