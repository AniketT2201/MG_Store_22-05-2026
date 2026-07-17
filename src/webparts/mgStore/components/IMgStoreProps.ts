export interface IMgStoreProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  /** Logged-in user's email, sourced from WebPartContext.pageContext.user.email. */
  userEmail: string;
  /** Logged-in user's SharePoint login name (claims identity string). */
  userLoginName: string;
}
