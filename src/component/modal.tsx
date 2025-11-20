import { createPortal } from 'react-dom';

export default function Modal({ children, onClose }: any) {
  return createPortal(
    <div
      role="button"
      onClick={onClose}
      className="fixed inset-0 w-screen h-[100dvh] bg-black/70 flex justify-center z-[9999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#d34e4e] w-96 h-24 mt-24 cursor-default rounded-md"
      >
        {children}{' '}
      </div>
    </div>,
    document.body,
  );
}
