import { useRecoilValue, useSetRecoilState } from 'recoil'
import AppState from './AppState'

const useGetAppState = () => {
    const appState = useRecoilValue(AppState)
    return appState
}

const useSetAppState = () => {
    const setAppState = useSetRecoilState(AppState)
    return setAppState
}

export { useGetAppState, useSetAppState }
