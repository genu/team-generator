import { useModal, type UseModalOptions } from 'vue-final-modal'
import { defu } from 'defu'

type CallbackFn = () => void | Promise<void>
type CallbackWithPayloadFn = (payload?: any) => void | Promise<void>

export const useOverlay = () => {
  const createOverlay = <T extends Component>(
    component: UseModalOptions<T>['component'],
    options?: Omit<UseModalOptions<T>, 'component'>
  ) => {
    let dismissCallback: CallbackFn = () => {}
    let closeCallback: CallbackWithPayloadFn = () => {}

    const defaultOptions = defu(options, {})

    const modal = useModal({
      component,
    })

    const patchModal = (options?: UseModalOptions<T>) => {
      const mergedOptions = defu<UseModalOptions<T>, UseModalOptions<T>[]>(options, defaultOptions, {
        component,
        attrs: {
          onDismiss: () => {
            dismissCallback()
            modal.close()
          },
          onClose: (payload: any) => {
            closeCallback(payload)
            modal.close()
          },
        } as any,
      })

      modal.patchOptions(mergedOptions)
    }

    const dialogInstance = {
      onClose: (fn: CallbackWithPayloadFn) => {
        closeCallback = fn
        patchModal()
        return dialogInstance
      },
      onDismiss: (fn: CallbackFn) => {
        dismissCallback = fn
        patchModal()

        return dialogInstance
      },
      open: (options?: UseModalOptions<T>) => {
        patchModal(options)

        modal.open()

        return dialogInstance
      },
    }

    return dialogInstance
  }

  return { createOverlay }
}
