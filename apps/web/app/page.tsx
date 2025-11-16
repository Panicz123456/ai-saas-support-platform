"use client";

import {SignInButton, UserButton} from '@clerk/nextjs'
import {
  useMutation,
  useQuery,
  Authenticated,
  Unauthenticated,
} from "convex/react";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.addUser);

  return (
    <>
      <Authenticated>
        <div className="flex flex-col items-center justify-center min-h-svh">
          <p>apps/web</p>
          <UserButton />
          <Button onClick={() => addUser()}>Add User</Button>
          <div className="max-w-md w-full mx-auto">
            <pre>{JSON.stringify(users, null, 2)}</pre>
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <p>Must be Sign in</p>
        <SignInButton>
          Sign in
        </SignInButton>
      </Unauthenticated>
    </>
  );
}
