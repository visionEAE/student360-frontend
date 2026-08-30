/** Where each role lands after login. */
export function homeFor(roles: string[]): string {
  if (roles.includes('ADVISOR') || roles.includes('ADMIN')) {
    return '/inbox'
  }
  return '/me'
}
