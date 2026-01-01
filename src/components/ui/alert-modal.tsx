import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertModal } from "@/store/alert-modal";

export default function AlertModal() {
  const store = useAlertModal();
  if (!store.isOpen) return;

  const handleCancelClick = () => {
    store.onCancel?.();
    store.actions.close();
  };

  const handleActionClick = () => {
    store.onAction?.();
    store.actions.close();
  };

  return (
    <AlertDialog open={store.isOpen}>
      <AlertDialogContent className="top-8 w-md translate-y-0 sm:w-md">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>{store.title}</AlertDialogTitle>
          <AlertDialogDescription>{store.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row justify-end">
          <AlertDialogCancel onClick={handleCancelClick}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleActionClick}>
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
