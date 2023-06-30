import { useState, useEffect, useMemo } from 'react'
import BTPayPalCheckout from 'braintree-web/paypal-checkout'
import { useGetAppState } from '../states/App/AppHooks'
import { useSetAlert } from '../states/Alert/AlertHooks'
import PayPalButtons from '../features/PayPalButtons'

const cart = {
    flow: 'checkout',
    amount: '100.00',
    currency: 'USD',
    intent: 'capture',

    enableShippingAddress: false,
    shippingAddressEditable: false,
    shippingAddressOverride: {
        recipientName: 'Scruff McGruff',
        line1: '1234 Main St.',
        line2: 'Unit 1',
        city: 'Chicago',
        countryCode: 'US',
        postalCode: '60652',
        state: 'IL',
        phone: '123.456.7890',
    },
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
                    'disable-funding': 'card',
                    'enable-funding': 'venmo',
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
    }, [appState, success, warning, danger])

    // PayPal Buttons Configuration
    const ppConfig = useMemo(() => {
        return !ppInstance
            ? undefined
            : {
                  createOrder: async () => {
                      try {
                          warning('Redirecting to PayPal for approval...')
                          console.log('PayPalButtons: createOrder', cart)
                          return await ppInstance.createPayment(cart)
                      } catch (error) {
                          console.error(error)
                          danger('Error!')
                      }
                  },
                  onApprove: async (data) => {
                      try {
                          console.log('PayPalButtons: onApprove', data)
                          const response = await ppInstance.tokenizePayment(data)
                          console.log('PayPalButtons: tokenizePayment', response)
                          success('Ready!')
                      } catch (error) {
                          console.error(error)
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
                    <div className="col-4">{ppConfig && <PayPalButtons ppConfig={ppConfig} />}</div>
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
