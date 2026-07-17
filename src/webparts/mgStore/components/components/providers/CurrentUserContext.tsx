import * as React from "react";

export interface CurrentUser {
  displayName: string;
  email: string;
  loginName?: string;
}

const CurrentUserContext = React.createContext<CurrentUser | null>(null);

interface CurrentUserProviderProps {
  user: CurrentUser;
  children: React.ReactNode;
}

/**
 * Provides the logged-in SharePoint/Entra user's identity (from
 * WebPartContext.pageContext.user, passed down through IMgStoreProps) to
 * any component that needs to attribute an action to "me" — writing a
 * review, editing/deleting your own review, submitting feedback, etc.
 *
 * Deliberately NOT sourced from a form field: review/feedback authorship
 * must come from the real logged-in identity, not user-editable input,
 * or anyone could submit content that appears to come from someone else.
 */
export function CurrentUserProvider({ user, children }: CurrentUserProviderProps) {
  return (
    <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUser {
  const ctx = React.useContext(CurrentUserContext);
  if (!ctx) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return ctx;
}
