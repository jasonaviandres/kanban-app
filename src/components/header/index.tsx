import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button/Index";

export const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="fixed inset-x-0 top-0 flex items-center justify-between px-6 py-4">
      <h1 className="text-xl">Kanban</h1>
      {session ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outlined-primary"
            className="!border-primary-500/20 rounded-full"
          >
            {session.user.email}
          </Button>
          <Button variant="borderless" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      ) : (
        <Button onClick={() => void signIn()} variant="primary">
          Sign in
        </Button>
      )}
    </header>
  );
};
