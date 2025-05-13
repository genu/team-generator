import { DialogConfirm } from '#components'

type CallbackFn = () => void | Promise<void>
interface DialogInstance {
  onConfirm: (fn: CallbackFn) => DialogInstance
  onDismiss: (fn: CallbackFn) => DialogInstance
  open: () => DialogInstance
}
export const useDialog = () => {
  const overlay = useOverlay()

  const confirm = (options: Omit<InstanceType<typeof DialogConfirm>['$props'], 'onDismiss' | 'onConfirm' | 'class'>) => {
    let confirmCallback: CallbackFn = () => {}
    let dismissCallback: CallbackFn = () => {}

    const modal = overlay.create(DialogConfirm, {
      props: options,
    })

    const dialogInstance: DialogInstance = {
      onConfirm: (fn: CallbackFn) => {
        confirmCallback = fn
        return dialogInstance
      },
      onDismiss: (fn: CallbackFn) => {
        dismissCallback = fn
        return dialogInstance
      },
      open: () => {
        modal.open()

        return dialogInstance
      },
    }

    modal.patch({
      onConfirm: async () => {
        await confirmCallback()
        modal.close()
      },
      onDismiss: async () => {
        await dismissCallback()
        modal.close()
      },
    })

    return dialogInstance
  }

  const confirmNavigate = (path: string) => {
    confirm({
      title: 'Leave this page?',
      description: 'Are you sure you want to navigate away? Unsaved changes will be lost.',
    }).onConfirm(() => {
      navigateTo(path)
    })
  }

  return { confirm, confirmNavigate }
}
