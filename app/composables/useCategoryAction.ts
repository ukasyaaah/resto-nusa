import ModalConfirm from "~/components/ModalConfirm.vue";
import type { StoreCategoryData, UpdateCategoryData } from "~~/shared/utils/categorySchema";

export const useCategoryAction = () => {
  const toast = useToast();
  const overlay = useOverlay();
  const modal = overlay.create(ModalConfirm);

  const createForm = reactive<StoreCategoryData>({
    name: "",
  });

  const getErrorMessage = (error: any) =>
    error?.data?.statusMessage ?? "Something went wrong";

  const createCategory = async () => {
    try {
      await $fetch("/api/categories", {
        method: "POST",
        body: createForm,
      });

      toast.add({
        title: "Success: Category Created",
        color: "success",
        id: "modal-success",
      });

      createForm.name = "";
      await navigateTo("/admin/categories");
    } catch (error: any) {
      toast.add({
        title: `Fail: ${getErrorMessage(error)}`,
        color: "error",
        id: "modal-dismiss",
      });
    }
  };

  const editCategory = async ({
    slug,
    updateForm,
  }: {
    slug: string | undefined; // slug SAAT INI (dari URL), bukan slug baru
    updateForm: UpdateCategoryData;
  }) => {
    if (!slug) return;

    try {
      await $fetch(`/api/categories/${encodeURIComponent(slug)}`, {
        method: "PUT",
        body: updateForm,
      });

      toast.add({
        title: "Success: Category Updated",
        color: "success",
        id: "modal-success",
      });
      await navigateTo("/admin/categories");
    } catch (error: any) {
      toast.add({
        title: `Fail: ${getErrorMessage(error)}`,
        color: "error",
        id: "modal-dismiss",
      });
    }
  };

  async function deleteCategory({
    name,
    slug,
    refreshAction,
  }: {
    name: string;
    slug: string;
    refreshAction: () => void;
  }) {
    const instance = modal.open({
      title: `Delete ${name} Category`,
      description: `Are you sure you want to delete the "${name}" category?`,
    });
    const isDeleteValid = await instance.result;

    if (!isDeleteValid) {
      toast.add({
        title: "Delete the category cancelled",
        color: "neutral",
        id: "modal-dismiss",
      });
      return;
    }

    try {
      await $fetch(`/api/categories/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      refreshAction();

      toast.add({
        title: "Successfully delete the category",
        color: "success",
        id: "modal-success",
      });
    } catch (error: any) {
      // 409 dari server: "Category still has products..." tampil apa adanya di toast
      toast.add({
        title: `Fail: ${getErrorMessage(error)}`,
        color: "error",
        id: "modal-dismiss",
      });
    }
  }

  return { createForm, createCategory, editCategory, deleteCategory };
};