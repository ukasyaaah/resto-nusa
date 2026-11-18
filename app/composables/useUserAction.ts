import ModalConfirm from "~/components/ModalConfirm.vue";

export const useUserAction = () => {
  const toast = useToast();
  const overlay = useOverlay();
  const modal = overlay.create(ModalConfirm);

  const createForm = reactive({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
  });

  const getErrorMessage = (error: any) =>
    error?.data?.statusMessage ?? "Something went wrong";

  const createUser = async () => {
    try {
      await $fetch("/api/users", {
        method: "post",
        body: createForm,
      });

      toast.add({
        title: "Success: User Created",
        color: "success",
        id: "modal-success",
      });
      await navigateTo("/admin/users");
    } catch (error: any) {
      toast.add({
        title: `Fail: ${getErrorMessage(error)}`,
        color: "error",
        id: "modal-dismiss",
      });
    }
  };

  const editUser = async ({
    id,
    updateForm,
  }: {
    id: string | undefined;
    updateForm: UpdateUserData;
  }) => {
    if (!id) return;

    try {
      await $fetch(`/api/users/${id}`, {
        method: "PUT",
        body: updateForm,
      });

      toast.add({
        title: "Success: User Updated",
        color: "success",
        id: "modal-success",
      });
      await navigateTo("/admin/users");
    } catch (error: any) {
      toast.add({
        title: `Fail: ${getErrorMessage(error)}`,
        color: "error",
        id: "modal-dismiss",
      });
    }
  };

  async function deleteUser({
    name,
    id,
    refreshAction,
  }: {
    name: string;
    id: string;
    refreshAction: () => void;
  }) {
    const instance = modal.open({
      title: `Delete ${name}'s User`,
      description: `Are you sure you want to delete ${name}'s user?`,
    });
    const isDeleteValid = await instance.result;

    if (!isDeleteValid) {
      toast.add({
        title: "Delete the user cancelled",
        color: "neutral",
        id: "modal-dismiss",
      });
      return;
    }

    try {
      await $fetch(`/api/users/${id}`, { method: "DELETE" });
      refreshAction();

      toast.add({
        title: "Successfully delete the user",
        color: "success",
        id: "modal-success",
      });
    } catch (error: any) {
      toast.add({
        title: `Fail: ${getErrorMessage(error)}`,
        color: "error",
        id: "modal-dismiss",
      });
    }
  }

  return { createForm,createUser ,editUser, deleteUser };
};
