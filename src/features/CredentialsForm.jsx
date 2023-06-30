import { useState } from 'react'
import { credentials } from '../config'

const initCredentials = credentials.get()

const CredentialsForm = (props) => {
    const [credentialsJSON, setCredentialsJSON] = useState(JSON.stringify(initCredentials, null, 4))
    const [merchantId, setMerchantId] = useState(initCredentials?.merchantId)
    const [publicKey, setPublicKey] = useState(initCredentials?.publicKey)
    const [privateKey, setPrivateKey] = useState(initCredentials?.privateKey)
    const [merchantAccountId, setMerchantAccountId] = useState(initCredentials?.merchantAccountId)

    const onChange = {
        merchantId: (event) => setMerchantId(event.target.value),
        publicKey: (event) => setPublicKey(event.target.value),
        privateKey: (event) => setPrivateKey(event.target.value),
        merchantAccountId: (event) => setMerchantAccountId(event.target.value),
        credentialsJSON: (event) => setCredentialsJSON(event.target.value),
    }

    const populate = () => {
        try {
            const newCredentials = JSON.parse(credentialsJSON)
            credentials.set(newCredentials)
            setMerchantId(newCredentials.merchantId)
            setPublicKey(newCredentials.publicKey)
            setPrivateKey(newCredentials.privateKey)
            setMerchantAccountId(newCredentials.merchantAccountId)
        } catch (error) {
            console.error('Invalid Credentials JSON:', error)
        }
    }

    const initialize = () =>
        props.initialize({
            merchantId,
            publicKey,
            privateKey,
            merchantAccountId,
        })

    return (
        <>
            <h4 className="p-2">Credentials</h4>
            <div className="bg-light p-2">
                <div className="mb-3 row">
                    <label htmlFor="credentialsJSON" className="col-sm-2 col-form-label">
                        Credentials JSON
                    </label>
                    <div className="col-sm-8">
                        <textarea
                            className="form-control"
                            rows="7"
                            value={credentialsJSON}
                            onChange={onChange.credentialsJSON}
                        />
                    </div>
                    <div className="col-sm-2">
                        <button className="btn btn-outline-primary" onClick={populate}>
                            Populate
                        </button>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="merchantId" className="col-sm-2 col-form-label">
                        Merchant Id
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="merchantId"
                            value={merchantId}
                            onChange={onChange.merchantId}
                        />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="publicKey" className="col-sm-2 col-form-label">
                        Public Key
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="publicKey"
                            value={publicKey}
                            onChange={onChange.publicKey}
                        />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="privateKey" className="col-sm-2 col-form-label">
                        Private Key
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="privateKey"
                            value={privateKey}
                            onChange={onChange.privateKey}
                        />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="merchantAccountId" className="col-sm-2 col-form-label">
                        Merchant Account Id
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="merchantAccountId"
                            value={merchantAccountId}
                            onChange={onChange.merchantAccountId}
                        />
                    </div>
                </div>
            </div>
            <br />
            <button className="btn btn-outline-primary" onClick={initialize}>
                Initialize Braintree Instance
            </button>
        </>
    )
}

export default CredentialsForm
