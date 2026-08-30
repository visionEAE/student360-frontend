/** Where each role lands after login. */
export function homeFor(roles: string[]): string {
  if (roles.includes('ADVISOR') || roles.includes('ADMIN')) {
    return '/advisor/students'
  }
  return '/me/overview'
}
