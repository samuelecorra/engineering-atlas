export const sensitiveName = p => /(^|\/)\.env(?:\..*)?$/.test(p) && !p.endsWith('/.env.example') && p !== '.env.example'
  || /\.(?:pem|key|p12|pfx|crt|cer)$/i.test(p) || /(^|\/)(?:credentials(?:\.json)?|id_rsa|id_ed25519|\.npmrc|\.pypirc|\.netrc)$/i.test(p);
export function secretLooking(text) {
  return /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)
    || /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{35,}|AKIA[A-Z0-9]{16}|sk-(?:proj-)?[A-Za-z0-9_-]{24,})\b/.test(text)
    || /(?:password|api[_-]?key|access[_-]?token|secret)\s*[=:]\s*["'][A-Za-z0-9+/=_-]{24,}["']/i.test(text);
}
