import { useModal } from 'vue-final-modal'
import { DialogConfirm } from '#components'

type CallbackFn = () => void | Promise<void>
interface DialogInstance {
  onConfirm: (fn: CallbackFn) => DialogInstance
  onDismiss: (fn: CallbackFn) => DialogInstance
  open: () => DialogInstance
}
export const useDialog = () => {
  const confirm = (
    options: Omit<InstanceType<typeof DialogConfirm>['$props'], 'onClose' | 'onDismiss' | 'onConfirm' | 'class'>
  ) => {
    let confirmCallback: CallbackFn = () => {}
    let dismissCallback: CallbackFn = () => {}

    const modal = useModal({
      component: DialogConfirm,
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

    modal.patchOptions({
      attrs: {
        ...options,
        onConfirm: () => confirmCallback(),
        onDismiss: () => dismissCallback(),
        onClose: () => {
          modal.close()
        },
      },
    })

    return dialogInstance
  }

  return { confirm }
}
