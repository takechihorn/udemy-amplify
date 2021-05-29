export interface userInfo {
  id: string,
  username: string,
  attributes: {
    sub: string,
    email: string,
    email_verified:boolean
  }
}
