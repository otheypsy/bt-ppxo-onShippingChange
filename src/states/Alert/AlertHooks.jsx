import { useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import AlertState from './AlertState'

const useGetAlert = () => {
    const alert = useRecoilValue(AlertState)
    return alert
}

const useSetAlert = () => {
    const setAlert = useSetRecoilState(AlertState)

    const success = useCallback(
        (message = 'Ready!') => {
            setAlert({
                message: message,
                type: 'success',
            })
        },
        [setAlert],
    )

    const warning = useCallback(
        (message) => {
            setAlert({
                message: message,
                type: 'warning',
            })
        },
        [setAlert],
    )

    const danger = useCallback(
        (message) => {
            setAlert({
                message: message,
                type: 'danger',
            })
        },
        [setAlert],
    )

    return { success, warning, danger }
}

export { useGetAlert, useSetAlert }
