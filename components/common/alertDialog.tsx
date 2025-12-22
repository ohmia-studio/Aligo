import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AlertDialogEvent {
  title: string;
  actionVerb: string;
  onConfirm: () => void;
  description?: string;
}

export function Dialog({
  title,
  description,
  actionVerb,
  onConfirm,
}: AlertDialogEvent) {
  return (
    <AlertDialogContent className="bg-container flex flex-col">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-base-color">{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="text-base-color/70 font-normal hover:cursor-pointer">
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction
          className="hover:cursor-pointer"
          onClick={onConfirm}
          itemType="destructive"
        >
          {actionVerb}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
