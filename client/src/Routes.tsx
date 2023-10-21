import {
  SignIn,
  SignedIn,
  SignUp,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/clerk-react";
import { Route, Routes as RouterRoutes } from "react-router-dom";
import PageHeader from "./components/PageHeader";
function PublicPage() {
  return (
    <>
      <h1>Public page</h1>
      <a href="/protected">Go to protected page</a>
    </>
  );
}

function ProtectedPage() {
  return (
    <>
      <PageHeader />

      <h1>Protected page</h1>
      <UserButton />
    </>
  );
}

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<PublicPage />} />
      <Route
        path="/sign-in/*"
        element={<SignIn routing="path" path="/sign-in" />}
      />
      <Route
        path="/sign-up/*"
        element={<SignUp routing="path" path="/sign-up" />}
      />
      <Route
        path="/protected"
        element={
          <>
            <SignedIn>
              <ProtectedPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </RouterRoutes>
  );
};
