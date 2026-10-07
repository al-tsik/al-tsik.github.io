import { useEffect, useRef, type ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  /** Accessible name for the dialog. */
  label: string
  children: ReactNode
}

/**
 * A centred modal on the native <dialog> element, which provides focus
 * trapping, Escape to close and a backdrop. Clicking the backdrop closes it.
 */
export function Modal({ open, onClose, label, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onClose={onClose}
      // A click on the dialog element itself (not its content) is a backdrop click.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="m-auto w-[min(92vw,72rem)] max-w-none bg-transparent p-0 backdrop:bg-ink/70 motion-safe:backdrop:animate-fade-in"
    >
      {open && children}
    </dialog>
  )
}
