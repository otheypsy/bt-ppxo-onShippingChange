const title = 'Braintree  ~  PwPP  ~  onShippingChange'

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
        isDep: false,
    },
    {
        label: 'Checkout',
        path: 'checkout',
        element: () => import('./pages/BTPwPPCheckout'),
        isDep: true,
    },
]

export { title, credentials, routes }
