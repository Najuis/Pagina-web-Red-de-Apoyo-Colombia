"use client";

import { deleteUserAction } from "@/app/actions/user-actions";
import { DeleteButton } from "@/components/admin/delete-button";

type Props = {
  userId: string;
  userName: string;
};

export function UserDeleteButton({ userId, userName }: Props) {
  return (
    <DeleteButton
      action={deleteUserAction}
      id={userId}
      label={`¿Eliminar a ${userName}?`}
      description="Esta acción eliminará permanentemente al usuario y no se puede deshacer."
    />
  );
}