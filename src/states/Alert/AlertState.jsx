import { atom } from 'recoil'

const _default = {
    message: 'Ready!',
    type: 'success',
}

const AlertState = atom({
    key: 'AlertState',
    default: _default,
})

export default AlertState
