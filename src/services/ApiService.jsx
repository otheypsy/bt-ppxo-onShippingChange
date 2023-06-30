import { GraphQLClient } from 'graphql-request'
let client = null

const setup = (credentials) => {
    const endpoint = 'https://payments.sandbox.braintree-api.com/graphql'
    client = new GraphQLClient(endpoint, {
        headers: {
            authorization: 'Bearer ' + window.btoa(credentials.publicKey + ':' + credentials.privateKey),
            'Braintree-Version': '2020-10-01',
        },
    })
}

const createClientToken = (params) => {
    const query = `
        mutation CreateClientTokenRequest($input: CreateClientTokenInput!) {
            createClientToken(input: $input) {
                clientMutationId
                clientToken
            }
        }
    `
    const variables = {
        input: {
            clientMutationId: Date.now(),
            clientToken: {
                merchantAccountId: params.merchantAccountId,
            },
        },
    }
    return client.request(query, variables)
}

const chargePayPalAccount = (params) => {
    const query = `
        mutation ChargePayPalAccount($input: ChargePayPalAccountInput!) {
            chargePayPalAccount(input: $input) {
            clientMutationId
            transaction {
                id
                legacyId
                merchantId
                merchantAccountId
                orderId
                status
                amount {
                value
                currencyCode
                }
                createdAt
                paymentMethodSnapshot {
                ... on PayPalTransactionDetails {
                    authorizationId
                    captureId
                    payee {
                    email
                    }
                    payer {
                    email
                    }
                }
                }
            }
            }
        }
    `
    const variables = {
        input: {
            clientMutationId: Date.now(),
            paymentMethodId: params.nonce,
            transaction: {
                orderId: params.orderId,
                amount: params.amount,
                merchantAccountId: params.merchantAccountId,
            },
        },
    }
    return client.request(query, variables)
}

export { setup, createClientToken, chargePayPalAccount }
