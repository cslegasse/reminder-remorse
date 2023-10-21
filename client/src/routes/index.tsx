import {
  SignIn,
  SignedIn,
  SignedOut,
  SignUp,
  RedirectToSignIn,
  UserButton,
} from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import { UserProps } from "@/types/user";
import {
  Home,
  TaskDetails,
  AddTask,
  UserSettings,
  ImportExport,
  Categories,
  NotFound,
} from "@/pages";

function ProtectedPage() {
  return (
    <>
      <h1>Protected page</h1>
      <UserButton />
    </>
  );
}

export const AppRouter = ({ user, setUser }: UserProps): JSX.Element => {
  const userProps = { user, setUser };

  return (
    <Routes>
      <Route path="/" element={<Home {...userProps} />} />
      <Route path="/task/:id" element={<TaskDetails {...userProps} />} />
      <Route path="/add" element={<AddTask {...userProps} />} />
      <Route path="/user" element={<UserSettings {...userProps} />} />
      <Route path="/import-export" element={<ImportExport {...userProps} />} />
      <Route path="/categories" element={<Categories {...userProps} />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
      <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
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
    </Routes>
  );
};
