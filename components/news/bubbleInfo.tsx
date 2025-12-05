import { XIcon } from 'lucide-react';

export default function BubbleInfo({
  content,
  onClose,
}: {
  content: string;
  onClose: () => void;
}) {
  return (
    <div className="hover:border-accent-foreground flex items-center rounded-full border-2 py-2 pl-4 hover:brightness-125">
      <h2 className="hover:cursor-default">{content}</h2>
      <button
        type="button"
        className="pr-4 pl-2 hover:cursor-pointer"
        onClick={onClose}
      >
        <XIcon size={20} />
      </button>
    </div>
  );
}
