import BTClient from 'braintree-web/client'
import CredentialsForm from '../features/CredentialsForm'
import { useSetAppState } from '../states/App/AppHooks'
import { useSetAlert } from '../states/Alert/AlertHooks'
import { setup, createClientToken } from '../services/ApiService'

const BTClientInstance = () => {
    const setAppState = useSetAppState()
    const { success, warning, danger } = useSetAlert()

    const initialize = async (credentials) => {
        try {
            warning('Initializing BTClientInstance...')

            // Setup GQL Client
            setup({
                merchantId: credentials.merchantId,
                publicKey: credentials.publicKey,
                privateKey: credentials.privateKey,
            })

            // Create Client Token
            const tokenResponse = await createClientToken({
                merchantAccountId: credentials.merchantAccountId,
            })
            console.log('BTClientInstance: clientTokenResponse', tokenResponse)

            // Create Client Instance
            const clientInstance = await BTClient.create({
                authorization: tokenResponse.createClientToken.clientToken,
            })
            console.log('BTClientInstance: clientInstance', clientInstance)

            setAppState({ clientInstance: clientInstance })
            success('Ready!')
        } catch (error) {
            console.error(error)
            danger('Error!')
        }
    }

    return <CredentialsForm initialize={initialize} />
}

export default BTClientInstance
