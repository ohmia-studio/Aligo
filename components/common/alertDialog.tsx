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
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="hover:cursor-pointer">
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction className="hover:cursor-pointer" onClick={onConfirm}>
          {actionVerb}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
