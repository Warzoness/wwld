export function fmtDate(d?: string | null) {
  return d
    ? new Date(d).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'2-digit' })
    : '-';
}
