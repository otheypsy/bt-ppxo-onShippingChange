import { useRef, useMemo, useEffect } from 'react'
import { useSetAlert } from '../states/Alert/AlertHooks'

const PayPalButtons = (props) => {
    const { danger } = useSetAlert()
    const ppContainer = useRef()

    // Final PayPal Buttons Configuration
    const finalPPConfig = useMemo(() => {
        return !props.ppConfig
            ? undefined
            : {
                  style: {
                      color: 'black',
                      layout: 'vertical',
                      shape: 'rect',
                      label: 'paypal',
                      tagline: false,
                  },
                  onClick: (data, actions) => console.log('PayPalButtons: onClick', { data, actions }),
                  onInit: (data, actions) => console.log('PayPalButtons: onInit', { data, actions }),
                  onCancel: (error) => {
                      console.error('PayPalButtons: onCancel', error)
                      danger('Error!')
                  },
                  onError: (error) => {
                      console.error('PayPalButtons: onError', error)
                      danger('Error!')
                  },
                  ...props.ppConfig,
              }
    }, [props.ppConfig, danger])

    // Render PayPal Buttons
    useEffect(() => {
        const container = ppContainer.current
        const initialize = async () => {
            if (!window?.paypal?.Buttons) throw Error('PayPal JS SDK not found')
            window.paypal.getFundingSources().forEach(async (fundingSource) => {
                const button = window.paypal.Buttons({
                    ...finalPPConfig,
                    fundingSource: fundingSource,
                })
                try {
                    if (button.isEligible() && container) await button.render(container)
                } catch (error) {
                    // CRTICIAL: Catch error when render fails when DOM is closed or destroyed.
                    console.warn('PayPalButtons', error.message)
                }
            })
        }
        finalPPConfig && initialize()

        return () => {
            // window.paypal.Buttons.instances.forEach((button) => button.close())
            container.innerHTML = null
        }
    }, [finalPPConfig])

    return <div ref={ppContainer} />
}

export default PayPalButtons
