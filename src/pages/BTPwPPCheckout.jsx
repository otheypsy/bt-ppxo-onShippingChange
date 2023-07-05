import { useState, useEffect, useMemo } from 'react'
import BTPayPalCheckout from 'braintree-web/paypal-checkout'
import { useGetAppState } from '../states/App/AppHooks'
import { useSetAlert } from '../states/Alert/AlertHooks'
import PayPalButtons from '../features/PayPalButtons'

const fundingSources = ['paypal']

const shippingOptions = [
    {
        id: 's-1',
        label: 'Free Shipping',
        selected: true,
        type: 'SHIPPING',
        amount: {
            value: 0.0,
            currency: 'USD',
        },
    },
    {
        id: 's-2',
        label: 'Priority Shipping',
        selected: false,
        type: 'SHIPPING',
        amount: {
            value: 5.0,
            currency: 'USD',
        },
    },
    {
        id: 's-3',
        label: 'Next Day Shipping',
        selected: false,
        type: 'SHIPPING',
        amount: {
            value: 10.0,
            currency: 'USD',
        },
    },
]

const cart = {
    flow: 'checkout',
    amount: 100.0,
    currency: 'USD',
    intent: 'capture',

    enableShippingAddress: true,
    shippingAddressEditable: true,
}

const calculateUpdateOptions = (data) => {
    /*
        The code here is purely for demonstration
        There are a few use cases that are not handled correctly
    */

    const options = {
        paymentId: data.paymentId,
        amount: parseFloat(cart.amount) + parseFloat(data.selected_shipping_option?.amount?.value || 0),
        currency: cart.currency,
    }

    const finalShippingOptions = [
        shippingOptions[0],
        shippingOptions[1],
        // Mocked business logic
        ...(data.shipping_address.postal_code === '85254' ? [shippingOptions[2]] : []),
    ]

    options.shippingOptions = finalShippingOptions.map((shippingOption) => {
        return {
            ...shippingOption,
            // Identify selected option
            selected:
                (!data.selected_shipping_option && shippingOption.id === 's-1') ||
                data.selected_shipping_option?.id === shippingOption.id,
        }
    })

    return options
}

const BTPwPPCheckoutCore = () => {
    const appState = useGetAppState()
    const [ppInstance, setPPInstance] = useState(undefined)
    const { success, warning, danger } = useSetAlert()

    // PayPal Checkout Instance
    useEffect(() => {
        let paypalInstance = undefined
        const initialize = async () => {
            try {
                warning('Initializing BTPwPPCheckout...')

                // Create PayPal Instance
                paypalInstance = await BTPayPalCheckout.create({
                    client: appState.clientInstance,
                })
                console.log('BTPwPPCheckout: paypalInstance', paypalInstance)

                // Load PayPal JS SDK
                await paypalInstance.loadPayPalSDK({
                    components: 'buttons,funding-eligibility',
                    currency: cart.currency,
                    intent: cart.intent,
                    commit: false,
                })
                console.log('BTPwPPCheckout: paypalSDK', window.paypal)

                setPPInstance(paypalInstance)
                success('Ready!')
            } catch (error) {
                console.error(error)
                danger('Error!')
            }
        }
        appState.clientInstance && initialize()

        return () => {
            paypalInstance && paypalInstance.teardown()
        }
    }, [appState.clientInstance, success, warning, danger])

    // PayPal Buttons Configuration
    const ppConfig = useMemo(() => {
        return !ppInstance
            ? undefined
            : {
                  createOrder: async () => {
                      try {
                          warning('Redirecting to PayPal for approval...')
                          console.log('PPXOCheckout: createOrder', cart)
                          return await ppInstance.createPayment(cart)
                      } catch (error) {
                          console.error(error)
                          danger('Error!')
                      }
                  },
                  onApprove: async (data) => {
                      try {
                          console.log('PPXOCheckout: onApprove', data)
                          const response = await ppInstance.tokenizePayment(data)
                          console.log('PPXOCheckout: tokenizePayment', response)
                          success('Ready!')
                      } catch (error) {
                          console.error(error)
                          danger('Error!')
                      }
                  },
                  onShippingChange: async (data, actions) => {
                      try {
                          console.log('PPXOCheckout: onShippingChange', data)
                          const options = calculateUpdateOptions(data)
                          console.log('PPXOCheckout: options', options)
                          const response = await ppInstance.updatePayment(options)
                          console.log('PPXOCheckout: updatePayment', response)
                          return actions.resolve()
                      } catch (e) {
                          console.error(e)
                          danger('Error!')
                      }
                  },
              }
    }, [ppInstance, success, warning, danger])

    return (
        <div className="row">
            <div className="col">
                <h4 className="p-2">Checkout</h4>
                <br />
                <pre className="bg-light p-2">
                    <code>{JSON.stringify(cart, null, 2)}</code>
                </pre>
                <br />
                <div className="row">
                    <div className="col-4">
                        {ppConfig && <PayPalButtons ppConfig={ppConfig} fundingSources={fundingSources} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

const BTPwPPCheckout = () => {
    const appState = useGetAppState()
    const { danger } = useSetAlert()

    useEffect(() => {
        if (!appState?.clientInstance) danger('Braintree client instance is required')
    }, [appState, danger])

    if (!appState?.clientInstance) return null
    return <BTPwPPCheckoutCore />
}

export default BTPwPPCheckout
