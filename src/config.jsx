const title = 'Braintree  ~  PwPP  ~  Checkout'

const credentials = {
    set: (credentials) => {
        try {
            window.localStorage.setItem('credentials', JSON.stringify(credentials))
        } catch (error) {
            console.error(error)
        }
    },
    get: () => {
        try {
            return JSON.parse(window.localStorage.getItem('credentials')) || {}
        } catch (error) {
            console.error(error)
            return {}
        }
    },
}

const routes = [
    {
        label: 'ClientInstance',
        path: 'client-instance',
        element: () => import('./pages/BTClientInstance'),
        isDep: true,
    },
    {
        label: 'Checkout',
        path: 'checkout',
        element: () => import('./pages/BTPwPPCheckout'),
        isDep: false,
    },
]

export { title, credentials, routes }
