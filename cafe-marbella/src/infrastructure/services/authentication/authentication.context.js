import React, { useState, createContext, useEffect } from "react";

import { user_authenticated } from "../../local_data/authentication";

export const AuthenticationContext = createContext();

export const Authentication_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(user_authenticated);
  console.log("USER AT AUTH CONTEXT: ", JSON.stringify(user, null, 2));

  useEffect(() => {}, []);

  return (
    <AuthenticationContext.Provider
      value={{
        isLoading,
        user,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
