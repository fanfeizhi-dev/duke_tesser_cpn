> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CPN Integration Concepts

This page discusses key concepts for integrating with CPN. Understanding these
concepts can help you integrate with CPN more effectively.

## Authentication

CPN authenticates your API requests using a unique key associated with your
account. All authentication is performed in the HTTP header of requests to the
API. If a key is not provided, or an incorrect key is provided, the API returns
a `401 - Invalid Credentials` error. All requests must use HTTPS; the API
rejects any requests using plain HTTP.

Circle provides API keys for authentication with the CPN API. These keys are
provided manually during onboarding. The following is an example of how to set
up the authentication header:

```shell Shell theme={null}
curl --location --request GET 'https://api.circle.com/v1/cpn/payments' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {YOUR_API_KEY}'
```

### Security notes

* Your API key provides full access to the CPN API, so make sure they are stored
  securely. They should never be exposed in public repositories and they should
  only be shared within your organization using secure methods. As a best
  practice, you should rotate your API keys periodically.
* When setting up your API key with Circle, you can request that only certain IP
  addresses be allowed to make API calls using the key. Talk to your Circle
  representative about establishing an IP allowlist for your API key.
* You should ensure that API requests are always made over TLS/encrypted
  connections to prevent the exposure of your key.
* For webhook subscriptions, you must provide an HTTPS endpoint, and validate
  the signature with Circle-provided public keys.

## Idempotency

For endpoints that create transactions and payments, CPN requires an idempotency
key to be included in the request body. The idempotency key must be in the UUID
∂v4 format. This allows the API to identify if a repeated request is unique or
duplicate, and prevent unintended duplicate transactions.

To generate an idempotency key, use a UUID generator in your selected
programming language. Generated UUIDs can then be passed to the API as
idempotency keys.


> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# JSON Schema

CPN uses [JSON Schema](https://json-schema.org/) to define and validate the
structure of JSON data used to pass RFI data. A JSON Schema is a blueprint for
the compliance data that OFIs must provide. CPN uses the
[Draft 2020-12](https://json-schema.org/draft/2020-12) version of the JSON
Schema standard.

Using JSON Schema to define the structure of this data has the following
benefits:

* **Clarity:** the schema defines every requirement programmatically, including
  required fields, data types, formats, and structures. This eliminates
  guesswork.
* **Client-side validation:** OFIs can validate their response against the
  schema before making the API call, providing instant feedback for developers
  and preventing common integration errors.
* **Rich data structures:** schemas support complex requirements like nested
  address objects and conditional logic.

## Interpreting JSON Schema

When you call the
[get details for an RFI endpoint](/api-reference/cpn/cpn-platform/get-rfi), the
API returns the JSON Schema for the required response data. The following are
key parts of the schemas to understand when reading them:

* `properties`: defines the fields you can provide in your JSON response
* `required`: contains a list of field names that must be present in the
  response
* `$defs` and `$ref`: usable complex objects (defined in `$defs` and referenced
  using the `$ref` directive)

## Client-side validation

JSON Schema allows you to validate your response before sending it to the API.
CPN expects that OFIs perform client-side validation against the provided schema
before submitting a response to CPN. Doing so provides a first line of defense
to reduce API errors and failed payments.

Common libraries for JSON Schema validation are:

* **Java:**
  [`networknt/json-schema-validator`](https://github.com/networknt/json-schema-validator)
* **Python:**
  [`jsonschema`](https://python-jsonschema.readthedocs.io/en/stable/)
* **Node.js:** [`ajv`](https://ajv.js.org/)

### Additional validation

JSON Schema validates structure and format only. You are still responsible for
ensuring the data is contextually correct. The schema ensures that you send the
data in the correct shape; you ensure the data is accurate. For example, you can
[validate CNPJ and CPF numbers using their check digits](/cpn/references/compliance/validating-brazil-tax-account-id).

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CPN Component States and Workflows

This page contains information about the states that high-level components of
the CPN system can be in. Your integration should be able to handle and respond
to each of the various states that a given component may present. In some cases,
the state of a component requires immediate or rapid action from an OFI.
Reference these states as a way to confirm your integration is comprehensive.

## Payments

A payment represents the end-to-end CPN payment flow, including the onchain
transaction and RFI check. It is initiated by locking in a quote and providing
the required recipient details.

Payments have the following workflow:

<Frame>
  <img src="https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/payment-workflow.png?fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=9d370a830698ea4bc97791df46a4aefa" data-og-width="1208" width="1208" data-og-height="862" height="862" data-path="cpn/images/payment-workflow.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/payment-workflow.png?w=280&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=a0c089985885938f8336ee9fb09b9d95 280w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/payment-workflow.png?w=560&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=0e58edb66e586cf515aee882fb54800a 560w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/payment-workflow.png?w=840&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=0e5ff8b54d11715fadb2e3397d637679 840w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/payment-workflow.png?w=1100&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=17c8693be7ed8670c7e24241b78524d8 1100w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/payment-workflow.png?w=1650&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=6e2cbdb5dbbb4bb41fc87c93271c4f1f 1650w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/payment-workflow.png?w=2500&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=d1db1398cc4e21de9532478b2e064ae2 2500w" />
</Frame>

### Payment States

| State                    | Description                                                                                                                                                                                                                                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CREATED`                | A quote has been accepted and the payment is initialized.<br /><br />When a payment requires an RFI in the created state the RFI must be resolved before the payment can proceed.<br /><br />A payment can be in the created state without an associated RFI while the BFI completes its compliance check. This can take up to 1 business day to complete. |
| `CRYPTO_FUNDS_PENDING`   | The payment has passed a compliance check and is waiting for the onchain transaction of crypto.<br /><br />The OFI is required to complete the onchain transaction in order to proceed.                                                                                                                                                                    |
| `FIAT_PAYMENT_INITIATED` | The BFI has received and validated the crypto transfer and has initiated the fiat payment.                                                                                                                                                                                                                                                                 |
| `COMPLETED`              | The BFI has completed the fiat transfer. Depending on the transfer method, the receiver may or may not have received the transfer.                                                                                                                                                                                                                         |
| `FAILED`                 | The payment can't be completed.                                                                                                                                                                                                                                                                                                                            |

When a payment is initiated, the BFI performs an initial payment review, which
affects the state that the payment is created in:

* If the BFI approves the initial payment review outright, the payment is
  created in the `CRYPTO_FUNDS_PENDING` state.
* If the BFI rejects the initial payment review outright, the payment is created
  in the `FAILED` state.
* If the BFI needs to take additional steps to review the payment, the payment
  is created in the `CREATED` state. Final approval or rejection of the payment
  is sent asynchronously.

## RFIs

Requests for information (RFI) is a process that is initiated by the BFI when
more detailed information about the sender is required to meet regulatory or
risk compliance checks.

RFIs have the following workflow:

<Frame>
  <img src="https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/rfi-workflow.png?fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=01d7eeef83d46f46ef44c9751d92022d" data-og-width="1144" width="1144" data-og-height="706" height="706" data-path="cpn/images/rfi-workflow.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/rfi-workflow.png?w=280&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=82ea5282d2b703e09a28f1c1845c30fd 280w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/rfi-workflow.png?w=560&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=ff82aedaf8102918530b33cf6377634e 560w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/rfi-workflow.png?w=840&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=bfb09af165931881a63462d6fa4b6f9a 840w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/rfi-workflow.png?w=1100&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=2d935e1713831903e07fab4a908d19ae 1100w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/rfi-workflow.png?w=1650&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=8b3ce8832d67ba5034edc8224485ab3f 1650w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/rfi-workflow.png?w=2500&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=e29114f81aac026606d6a1121f722753 2500w" />
</Frame>

### RFI states

| State                  | Description                                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `INFORMATION_REQUIRED` | Initial status. OFI is required to submit the requested data to resolve the RFI.                                                 |
| `IN_REVIEW`            | OFI has submitted the requested data and BFI is reviewing.                                                                       |
| `APPROVED`             | BFI approves the additional information.                                                                                         |
| `FAILED`               | BFI rejects the additional information. This is a resolved state where the OFI can't resubmit additional information to the BFI. |

## Refunds

Refunds occur when the BFI can't complete the transfer of fiat to the receiver.
The BFI creates an onchain transaction to transfer the cryptocurrency back to
the OFI.

Refunds have the following workflow:

<Frame>
  <img src="https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/refund-workflow.png?fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=af087aaa5e8c4f95dff01c58f437c980" data-og-width="1162" width="1162" data-og-height="660" height="660" data-path="cpn/images/refund-workflow.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/refund-workflow.png?w=280&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=e997e725c59ca9f4ef7ef43b72657207 280w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/refund-workflow.png?w=560&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=6c3c56f6514ae09fd1379bc0f5650030 560w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/refund-workflow.png?w=840&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=6b13ea1b33b8236457d82293406c86b9 840w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/refund-workflow.png?w=1100&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=c612786216b6a292955df6c97d069e08 1100w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/refund-workflow.png?w=1650&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=bd891c72b271712d9ac2f038dc617671 1650w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/refund-workflow.png?w=2500&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=2b071d82758f78edde6104dbb4fc502b 2500w" />
</Frame>

### Refund states

| State       | Description                                                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CREATED`   | The refund is initialized but the onchain transaction has not been created yet. Some BFIs may skip this status and create the refund directly into the `COMPLETED` or `FAILED` state. |
| `FAILED`    | The onchain transaction failed.                                                                                                                                                       |
| `COMPLETED` | The onchain transaction was successfully broadcast and confirmed by the BFI. The transaction hash is available.                                                                       |

## Transactions

A transaction on CPN is a data object that represents a funds transfer
transaction on the blockchain. When the payment is in the `CRYPTO_FUNDS_PENDING`
state, the OFI should initiate the onchain transaction with CPN as soon as
possible.

Transactions have the following workflow:

<Frame>
  <img src="https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/transaction-workflow.png?fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=4d033279baa312690566f3020fde2463" data-og-width="1060" width="1060" data-og-height="712" height="712" data-path="cpn/images/transaction-workflow.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/transaction-workflow.png?w=280&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=c5086e18685625397cb6ce3aa9b605f0 280w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/transaction-workflow.png?w=560&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=0482258ba5100e8a599e74dd97756244 560w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/transaction-workflow.png?w=840&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=b380aa274e4431fbdb4868dbfb2141b1 840w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/transaction-workflow.png?w=1100&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=19a664ad8b68bc53761249e54f80f616 1100w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/transaction-workflow.png?w=1650&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=4e72312bdd5f2b3b540240e066ff90cb 1650w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/transaction-workflow.png?w=2500&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=1799acf9566e151fe01fede3c2043b69 2500w" />
</Frame>

### Transaction states

| State         | Description                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `CREATED`     | Transaction has been created and the payload returned to the caller, awaiting signature.          |
| `PENDING`     | OFI has submitted the signed transaction. The transaction is pending broadcast to the blockchain. |
| `BROADCASTED` | The signed transaction has been broadcast to the blockchain.                                      |
| `COMPLETED`   | The transaction is confirmed onchain.                                                             |
| `FAILED`      | The transaction can't be completed.                                                               |

## Support tickets

The CPN support tickets API allows you to raise and manage transaction-related
issues such as settlement delays, missing information, or refunds. These tickets
are stored in the CPN platform and routed to the appropriate party for
resolution.

<Frame>
  <img src="https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/support-ticket-workflow.png?fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=389e2d91fcdcbadfbf418aebc2f7621d" data-og-width="1394" width="1394" data-og-height="392" height="392" data-path="cpn/images/support-ticket-workflow.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/support-ticket-workflow.png?w=280&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=6bcf7169d2fd6b0523d0dbf80a9ceb57 280w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/support-ticket-workflow.png?w=560&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=222e6baef683b634546e94c95b7e246f 560w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/support-ticket-workflow.png?w=840&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=eede28efe8bff6cbf252af9372e9f395 840w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/support-ticket-workflow.png?w=1100&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=afb8c1c3f57f6136c08fa3945fec8c01 1100w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/support-ticket-workflow.png?w=1650&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=357a0efa01b61cb19f11d831f82cfc29 1650w, https://mintcdn.com/circle-167b8d39/18D1O5_C359Zz2z5/cpn/images/support-ticket-workflow.png?w=2500&fit=max&auto=format&n=18D1O5_C359Zz2z5&q=85&s=9442df803b8c8c3870540ff39f8203e0 2500w" />
</Frame>

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Quotes

Quotes are real-time exchange rates and settlement costs for a specific payment
corridor. A quote includes the following key elements:

* **Exchange rate lock**: The quote locks in an exchange rate for a specified
  time window, protecting both the OFI and the sender from market volatility
  during the payment process. When the time window expires, a new quote must be
  requested.
* **Two-way quotes**: You may query the quote based on the source amount and the
  destination amount. For instance, if a customer holding USDC wants to pay a
  recipient in BRL and the recipient needs an accurate amount of BRL, you can
  query using the destination amount. If a quote is for a remittance use case,
  where the customer needs an accurate amount of USDC to send, you can query
  using the source amount.
* **Cost breakdown**: The quote response includes details of all applicable
  fees, including fee and any additional charges at the transaction level,
  ensuring transparent cost estimation.
* **Competitive aggregation**: By providing multiple quotes, CPN ensures that
  OFIs can choose the most competitive option based on price, speed, and
  compliance.

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Payment

A payment represents the end-to-end CPN payment flow, including the onchain
transaction and RFI check. It is initiated by locking in a quote and providing
the required recipient details.

The payment process begins when an OFI locks in a quote and submits sender and
beneficiary details. The transaction undergoes compliance checks, including the
RFI process if required. Once all necessary compliance checks are completed, the
payment enters the onchain transaction phase, where it awaits the transfer of
USDC. After the crypto transfer is received, the BFI initiates a fiat transfer
to the final recipient.

During the fiat transfer, the CPN sends webhook notifications to the OFI
indicating that the transfer has been confirmed or canceled. If the fiat
transfer is canceled or fails for any reason, the BFI issues a refund of crypto
to the OFI.

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Payment Reference

When you
[create a payment with the CPN API](/api-reference/cpn/cpn-platform/create-payment),
you should provide the `refCode` field to carry a meaningful reference for the
transaction. This field can be either an invoice ID or a customer reference. How
this reference appears on the beneficiary's bank statement depends on the
capabilities of the payment rail, which is handled as follows:

* **Metadata support by rail and BFI:** The sender's name (OFI's customer name)
  from the travel rule data appears directly on the recipient's bank statement
  as the ultimate remitter, and the `refCode` appears in the memo field. This
  provides the highest level of transparency for the recipient to recognize and
  reconcile the payments.
* **Partial metadata support:** If the payment rail doesn't support displaying
  the sender's name separately but allows a memo/reference field, the BFI
  populates this memo with a concatenated string in the format
  `{refCode} + {Sender Name}`
* **Minimal metadata support:** If neither the sender name or reference field is
  supported on the rail, Circle returns a `fiatNetworkPaymentRef`, which is a
  rail-specific transaction reference. This ID is visible to the beneficiary on
  their bank statement, and is returned to the OFI by webhook and in the
  [get payment endpoint](/api-reference/cpn/cpn-platform/get-payment).

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Supported Payment Methods

CPN supports multiple payment methods for transferring funds to recipients in
different countries. The available payment methods depend on the destination
country and are determined by the payment rails available in that region.

You can discover available payment methods for specific routes using the
[configurations overview endpoint](/api-reference/cpn/cpn-platform/get-payment-configurations-overview)
or the [list routes endpoint](/api-reference/cpn/cpn-platform/list-routes).

<Note>
  **Note:** Payment method availability may vary based on your account
  configuration and the specific payment route. Always use the [list routes
  endpoint](/api-reference/cpn/cpn-platform/list-routes) to verify available
  payment methods for your specific use case.
</Note>

## Settlement times

Payment methods have different settlement characteristics:

* **Instant payments** (for example `PIX`, `SPEI`, `IMPS`): Typically settle in
  seconds to minutes
* **Batched payments** (for example `WIRE`, `CHATS`): May take 1-2 business days
  depending on the route

Actual settlement times are provided in the quote response via the
`fiatSettlementTime` field.

## Payment methods by region

The following sections detail payment methods available for specific destination
countries and regions.

### Argentina

| Payment Method | Currency | Description                              | Approximate Processing Time |
| -------------- | -------- | ---------------------------------------- | --------------------------- |
| `WIRE`         | USD      | Wire transfer for international payments | 1-2 business days           |

### Brazil

| Payment Method | Currency | Description                                                           | Approximate Processing Time |
| -------------- | -------- | --------------------------------------------------------------------- | --------------------------- |
| `PIX`          | BRL      | Brazil's instant payment system that enables real-time transfers 24/7 | 5 minutes                   |
| `WIRE`         | USD      | Wire transfer for international payments                              | 1-2 business days           |

### Chile

| Payment Method | Currency | Description                              | Approximate Processing Time |
| -------------- | -------- | ---------------------------------------- | --------------------------- |
| `WIRE`         | USD      | Wire transfer for international payments | 1-2 business days           |

### China

| Payment Method | Currency | Description                                                                   | Approximate Processing Time |
| -------------- | -------- | ----------------------------------------------------------------------------- | --------------------------- |
| `CIPS`         | CNY      | China's Cross-Border Interbank Payment System for international RMB transfers | 1-2 business days           |
| `WIRE`         | CNY, USD | Wire transfer for international payments                                      | 1-2 business days           |

### Colombia

| Payment Method  | Currency | Description                                                                        | Approximate Processing Time |
| --------------- | -------- | ---------------------------------------------------------------------------------- | --------------------------- |
| `BANK-TRANSFER` | COP      | Bank transfer for domestic payments in Colombia, processed through the ACH network | 1-2 business days           |
| `NEQUI`         | COP      | Colombia's digital wallet and instant payment system                               | 5 minutes                   |
| `WIRE`          | USD      | Wire transfer for international payments                                           | 1-2 business days           |

### European Union

| Payment Method | Currency | Description                                                    | Approximate Processing Time |
| -------------- | -------- | -------------------------------------------------------------- | --------------------------- |
| `WIRE`         | USD      | Wire transfer for international payments to European countries | 1-2 business days           |

<Note>
  **Note:** SEPA payments will attempt instant SEPA first, which delivers in
  minutes. If instant SEPA is not available for the transaction, it will fall
  back to regular SEPA, which takes 1 business day.
</Note>

<Note>
  **Note:** WIRE is available for the following countries: Andorra, Austria,
  Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Estonia, Finland,
  France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Liechtenstein,
  Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Romania,
  Slovakia, Slovenia, Spain, Sweden, Switzerland, and United Kingdom.
</Note>

### Hong Kong

| Payment Method | Currency | Description                                                                  | Approximate Processing Time |
| -------------- | -------- | ---------------------------------------------------------------------------- | --------------------------- |
| `CHATS`        | HKD, USD | Hong Kong's Clearing House Automated Transfer System for interbank transfers | Same day                    |
| `FPS`          | HKD      | Hong Kong's Faster Payment System for real-time payments                     | 5 minutes                   |
| `WIRE`         | HKD, USD | Wire transfer for international payments                                     | 1-2 business days           |

### India

| Payment Method | Currency | Description                                                              | Approximate Processing Time |
| -------------- | -------- | ------------------------------------------------------------------------ | --------------------------- |
| `IMPS`         | INR      | India's Immediate Payment Service for instant interbank transfers        | 5 minutes                   |
| `NEFT`         | INR      | India's National Electronic Funds Transfer for scheduled batch transfers | Same day                    |
| `RTGS`         | INR      | India's Real Time Gross Settlement for high-value transfers              | 5 minutes                   |

### Japan

| Payment Method | Currency | Description                              | Approximate Processing Time |
| -------------- | -------- | ---------------------------------------- | --------------------------- |
| `WIRE`         | USD      | Wire transfer for international payments | 1-2 business days           |

### Kenya

| Payment Method | Currency | Description                              | Approximate Processing Time |
| -------------- | -------- | ---------------------------------------- | --------------------------- |
| `WIRE`         | USD      | Wire transfer for international payments | 1-2 business days           |

### Mexico

| Payment Method | Currency | Description                                                              | Approximate Processing Time |
| -------------- | -------- | ------------------------------------------------------------------------ | --------------------------- |
| `SPEI`         | MXN      | Mexico's electronic interbank payment system operated by Banco de México | 5 minutes                   |
| `WIRE`         | USD      | Wire transfer for international payments                                 | 1-2 business days           |

### Nigeria

| Payment Method  | Currency | Description                                                                                                     | Approximate Processing Time |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `BANK-TRANSFER` | NGN      | Nigeria's NIBSS (Nigeria Inter-Bank Settlement System) instant payment system for real-time interbank transfers | 5 minutes                   |
| `WIRE`          | USD      | Wire transfer for international payments                                                                        | 1-2 business days           |

### Singapore

| Payment Method  | Currency | Description                                                                                                                                           | Approximate Processing Time |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `BANK-TRANSFER` | SGD      | Bank transfer for domestic payments in Singapore, may be processed through FAST (Fast And Secure Transfers) or MEPS RTGS (Real-Time Gross Settlement) | 30 minutes                  |
| `WIRE`          | USD      | Wire transfer for international payments                                                                                                              | 1-2 business days           |

### South Africa

| Payment Method | Currency | Description                              | Approximate Processing Time |
| -------------- | -------- | ---------------------------------------- | --------------------------- |
| `WIRE`         | USD      | Wire transfer for international payments | 1-2 business days           |

### South Korea

| Payment Method | Currency | Description                              | Approximate Processing Time |
| -------------- | -------- | ---------------------------------------- | --------------------------- |
| `WIRE`         | USD      | Wire transfer for international payments | 1-2 business days           |

### Taiwan

| Payment Method | Currency | Description                              | Approximate Processing Time |
| -------------- | -------- | ---------------------------------------- | --------------------------- |
| `WIRE`         | USD      | Wire transfer for international payments | 1-2 business days           |

### United States

| Payment Method | Currency | Description                                                       | Approximate Processing Time |
| -------------- | -------- | ----------------------------------------------------------------- | --------------------------- |
| `FEDWIRE`      | USD      | US Federal Reserve's wire transfer system for same-day settlement | Same day                    |

## Payment method characteristics

### Limits

Each payment method has minimum and maximum transfer limits that vary by:

* Destination country
* Destination currency
* Payment method type

Use the [list routes endpoint](/api-reference/cpn/cpn-platform/list-routes) to
retrieve specific limits for your payment route. When using V2 transactions,
pass `transactionVersion=VERSION_2` so returned crypto min limits include a
chain-specific buffer for fees (for example, gas fee), paid in USDC from the
source amount.

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CPN Supported Countries

> Countries supported by the Circle Payments Network

The following table shows countries where Circle Payments Network is allowed to
operate. The country code is used in the
[`senderCountry` parameter](/api-reference/cpn/cpn-platform/create-quotes#body-sender-country)
in the CPN API. Note that the not all countries are currently supported by CPN.
Consult the preceding link for the full list of supported countries in the API
reference.

| Country                                      | Country Code | Supported? |
| -------------------------------------------- | ------------ | ---------- |
| Afghanistan                                  | AF           | ❌          |
| Albania                                      | AL           | ✅          |
| Algeria                                      | DZ           | ✅          |
| American Samoa                               | AS           | ✅          |
| Andorra                                      | AD           | ✅          |
| Angola                                       | AO           | ✅          |
| Anguilla                                     | AI           | ✅          |
| Antigua and Barbuda                          | AG           | ✅          |
| Argentina                                    | AR           | ✅          |
| Armenia                                      | AM           | ✅          |
| Aruba                                        | AW           | ✅          |
| Australia                                    | AU           | ✅          |
| Austria                                      | AT           | ✅          |
| Azerbaijan                                   | AZ           | ✅          |
| Bahamas                                      | BS           | ✅          |
| Bahrain                                      | BH           | ✅          |
| Bangladesh                                   | BD           | ✅          |
| Barbados                                     | BB           | ✅          |
| Belarus                                      | BY           | ❌          |
| Belgium                                      | BE           | ✅          |
| Belize                                       | BZ           | ✅          |
| Benin                                        | BJ           | ✅          |
| Bermuda                                      | BM           | ✅          |
| Bhutan                                       | BT           | ✅          |
| Bolivia                                      | BO           | ✅          |
| Bonaire                                      | BQ           | ✅          |
| Bosnia and Herzegovina                       | BA           | ✅          |
| Botswana                                     | BW           | ✅          |
| Bouvet Island                                | BV           | ✅          |
| Brazil                                       | BR           | ✅          |
| British Indian Ocean Territory               | IO           | ✅          |
| Brunei Darussalam                            | BN           | ✅          |
| Bulgaria                                     | BG           | ✅          |
| Burkina Faso                                 | BF           | ✅          |
| Burundi                                      | BI           | ✅          |
| Cabo Verde                                   | CV           | ✅          |
| Cambodia                                     | KH           | ✅          |
| Cameroon                                     | CM           | ✅          |
| Canada                                       | CA           | ✅          |
| Cayman Islands                               | KY           | ✅          |
| Central African Republic                     | CF           | ❌          |
| Chad                                         | TD           | ✅          |
| Chile                                        | CL           | ✅          |
| China                                        | CN           | ✅          |
| Christmas Island                             | CX           | ✅          |
| Cocos (Keeling) Islands                      | CC           | ✅          |
| Colombia                                     | CO           | ✅          |
| Comoros                                      | KM           | ✅          |
| Congo                                        | CG           | ✅          |
| Congo, Democratic Republic of the            | CD           | ❌          |
| Cook Islands                                 | CK           | ✅          |
| Costa Rica                                   | CR           | ✅          |
| Croatia                                      | HR           | ✅          |
| Cuba                                         | CU           | ❌          |
| Curacao                                      | CW           | ✅          |
| Cyprus                                       | CY           | ✅          |
| Czechia                                      | CZ           | ✅          |
| Cote d'Ivoire                                | CI           | ✅          |
| Denmark                                      | DK           | ✅          |
| Djibouti                                     | DJ           | ✅          |
| Dominica                                     | DM           | ✅          |
| Dominican Republic                           | DO           | ✅          |
| Ecuador                                      | EC           | ✅          |
| Egypt                                        | EG           | ✅          |
| El Salvador                                  | SV           | ✅          |
| Equatorial Guinea                            | GQ           | ✅          |
| Eritrea                                      | ER           | ✅          |
| Estonia                                      | EE           | ✅          |
| Eswatini                                     | SZ           | ✅          |
| Ethiopia                                     | ET           | ✅          |
| Falkland Islands (Malvinas)                  | FK           | ✅          |
| Faroe Islands                                | FO           | ✅          |
| Fiji                                         | FJ           | ✅          |
| Finland                                      | FI           | ✅          |
| France                                       | FR           | ✅          |
| French Guiana                                | GF           | ✅          |
| French Polynesia                             | PF           | ✅          |
| French Southern Territories                  | TF           | ✅          |
| Gabon                                        | GA           | ✅          |
| Gambia                                       | GM           | ✅          |
| Georgia                                      | GE           | ✅          |
| Germany                                      | DE           | ✅          |
| Ghana                                        | GH           | ✅          |
| Gibraltar                                    | GI           | ✅          |
| Greece                                       | GR           | ✅          |
| Greenland                                    | GL           | ✅          |
| Grenada                                      | GD           | ✅          |
| Guadeloupe                                   | GP           | ✅          |
| Guam                                         | GU           | ✅          |
| Guatemala                                    | GT           | ✅          |
| Guernsey                                     | GG           | ✅          |
| Guinea                                       | GN           | ✅          |
| Guinea-Bissau                                | GW           | ❌          |
| Guyana                                       | GY           | ✅          |
| Haiti                                        | HT           | ✅          |
| Heard Island and McDonald Islands            | HM           | ✅          |
| Honduras                                     | HN           | ✅          |
| Hong Kong                                    | HK           | ✅          |
| Hungary                                      | HU           | ✅          |
| Iceland                                      | IS           | ✅          |
| India                                        | IN           | ✅          |
| Indonesia                                    | ID           | ✅          |
| Iran                                         | IR           | ❌          |
| Iraq                                         | IQ           | ❌          |
| Ireland                                      | IE           | ✅          |
| Isle of Man                                  | IM           | ✅          |
| Israel                                       | IL           | ✅          |
| Italy                                        | IT           | ✅          |
| Jamaica                                      | JM           | ✅          |
| Japan                                        | JP           | ✅          |
| Jersey                                       | JE           | ✅          |
| Jordan                                       | JO           | ✅          |
| Kazakhstan                                   | KZ           | ✅          |
| Kenya                                        | KE           | ✅          |
| Kiribati                                     | KI           | ✅          |
| Korea, Democratic People's Republic of       | KP           | ❌          |
| Korea, Republic of                           | KR           | ✅          |
| Kuwait                                       | KW           | ✅          |
| Kyrgyzstan                                   | KG           | ✅          |
| Laos                                         | LA           | ❌          |
| Latvia                                       | LV           | ✅          |
| Lebanon                                      | LB           | ✅          |
| Lesotho                                      | LS           | ✅          |
| Liberia                                      | LR           | ✅          |
| Libya                                        | LY           | ❌          |
| Liechtenstein                                | LI           | ✅          |
| Lithuania                                    | LT           | ✅          |
| Luxembourg                                   | LU           | ✅          |
| Macao                                        | MO           | ✅          |
| Madagascar                                   | MG           | ✅          |
| Malawi                                       | MW           | ✅          |
| Malaysia                                     | MY           | ✅          |
| Maldives                                     | MV           | ✅          |
| Mali                                         | ML           | ❌          |
| Malta                                        | MT           | ✅          |
| Marshall Islands                             | MH           | ✅          |
| Martinique                                   | MQ           | ✅          |
| Mauritania                                   | MR           | ✅          |
| Mauritius                                    | MU           | ✅          |
| Mayotte                                      | YT           | ✅          |
| Mexico                                       | MX           | ✅          |
| Micronesia                                   | FM           | ✅          |
| Moldova                                      | MD           | ✅          |
| Monaco                                       | MC           | ✅          |
| Mongolia                                     | MN           | ✅          |
| Montenegro                                   | ME           | ✅          |
| Montserrat                                   | MS           | ✅          |
| Morocco                                      | MA           | ✅          |
| Mozambique                                   | MZ           | ✅          |
| Myanmar                                      | MM           | ❌          |
| Namibia                                      | NA           | ✅          |
| Nauru                                        | NR           | ✅          |
| Nepal                                        | NP           | ✅          |
| Netherlands                                  | NL           | ✅          |
| New Caledonia                                | NC           | ✅          |
| New Zealand                                  | NZ           | ✅          |
| Nicaragua                                    | NI           | ✅          |
| Niger                                        | NE           | ✅          |
| Nigeria                                      | NG           | ✅          |
| Niue                                         | NU           | ✅          |
| Norfolk Island                               | NF           | ✅          |
| Northern Mariana Islands                     | MP           | ✅          |
| Norway                                       | NO           | ✅          |
| Oman                                         | OM           | ✅          |
| Pakistan                                     | PK           | ✅          |
| Palau                                        | PW           | ✅          |
| Palestine, State of                          | PS           | ✅          |
| Panama                                       | PA           | ✅          |
| Papua New Guinea                             | PG           | ✅          |
| Paraguay                                     | PY           | ✅          |
| Peru                                         | PE           | ✅          |
| Philippines                                  | PH           | ✅          |
| Pitcairn                                     | PN           | ✅          |
| Poland                                       | PL           | ✅          |
| Portugal                                     | PT           | ✅          |
| Puerto Rico                                  | PR           | ✅          |
| Qatar                                        | QA           | ✅          |
| Republic of North Macedonia                  | MK           | ✅          |
| Romania                                      | RO           | ✅          |
| Russia                                       | RU           | ❌          |
| Rwanda                                       | RW           | ✅          |
| Reunion                                      | RE           | ✅          |
| Saint Barthélemy                             | BL           | ✅          |
| Saint Helena, Ascension and Tristan da Cunha | SH           | ✅          |
| Saint Kitts and Nevis                        | KN           | ✅          |
| Saint Lucia                                  | LC           | ✅          |
| Saint Martin (French part)                   | MF           | ✅          |
| Saint Pierre and Miquelon                    | PM           | ✅          |
| Saint Vincent and the Grenadines             | VC           | ✅          |
| Samoa                                        | WS           | ✅          |
| San Marino                                   | SM           | ✅          |
| Sao Tome and Principe                        | ST           | ✅          |
| Saudi Arabia                                 | SA           | ✅          |
| Senegal                                      | SN           | ✅          |
| Serbia                                       | RS           | ✅          |
| Seychelles                                   | SC           | ✅          |
| Sierra Leone                                 | SL           | ✅          |
| Singapore                                    | SG           | ✅          |
| Sint Maarten (Dutch part)                    | SX           | ✅          |
| Slovakia                                     | SK           | ✅          |
| Slovenia                                     | SI           | ✅          |
| Solomon Islands                              | SB           | ✅          |
| Somalia                                      | SO           | ❌          |
| South Africa                                 | ZA           | ✅          |
| South Georgia and the South Sandwich Islands | GS           | ✅          |
| South Sudan                                  | SS           | ❌          |
| Spain                                        | ES           | ✅          |
| Sri Lanka                                    | LK           | ✅          |
| Sudan                                        | SD           | ❌          |
| Suriname                                     | SR           | ✅          |
| Svalbard and Jan Mayen                       | SJ           | ✅          |
| Sweden                                       | SE           | ✅          |
| Switzerland                                  | CH           | ✅          |
| Syrian Arab Republic                         | SY           | ❌          |
| Taiwan                                       | TW           | ✅          |
| Tajikistan                                   | TJ           | ✅          |
| Tanzania, United Republic of                 | TZ           | ✅          |
| Thailand                                     | TH           | ✅          |
| Timor-Leste                                  | TL           | ✅          |
| Togo                                         | TG           | ✅          |
| Tokelau                                      | TK           | ✅          |
| Tonga                                        | TO           | ✅          |
| Trinidad and Tobago                          | TT           | ✅          |
| Tunisia                                      | TN           | ✅          |
| Turkey                                       | TR           | ✅          |
| Turkmenistan                                 | TM           | ✅          |
| Turks and Caicos Islands                     | TC           | ✅          |
| Tuvalu                                       | TV           | ✅          |
| Uganda                                       | UG           | ✅          |
| Ukraine                                      | UA           | ❌          |
| United Arab Emirates                         | AE           | ✅          |
| United Kingdom                               | GB           | ✅          |
| United States of America                     | US           | ✅          |
| United States Minor Outlying Islands         | UM           | ✅          |
| Uruguay                                      | UY           | ✅          |
| Uzbekistan                                   | UZ           | ✅          |
| Vanuatu                                      | VU           | ✅          |
| Venezuela                                    | VE           | ❌          |
| Vietnam                                      | VN           | ✅          |
| Virgin Islands, British                      | VG           | ✅          |
| Virgin Islands, U.S.                         | VI           | ✅          |
| Wallis and Futuna                            | WF           | ✅          |
| Western Sahara                               | EH           | ✅          |
| Yemen                                        | YE           | ❌          |
| Zambia                                       | ZM           | ✅          |
| Zimbabwe                                     | ZW           | ✅          |
| Aland Islands                                | AX           | ✅          |

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Requests for Information

When a BFI needs more information about a sender or an
OFI, they create a Request for Information (RFI). This
additional information is required to meet regulatory or risk compliance checks.
The OFI is required to gather the appropriate information and respond to the
request in a set period of time. If the OFI does not respond in time, the
payment associated with the RFI is cancelled.

CPN defines [3 levels of RFI requests](/cpn/references/compliance/rfi-levels),
each with a specific set of fields. The OFI is expected to include all fields
specified by the level when responding to the RFI. Failure to provide the
appropriate fields can lead to payment failure.

The BFI can initiate an RFI at the following points of the payment process:

1. At payment creation
2. After the onchain transaction is complete, but before fiat payout
3. After the payment is complete

Depending on the point in the process where the RFI is created, the OFI may be
notified synchronously in an API response, or asynchronously by webhook. RFIs
are typically resolved by returning the relevant information through the API.
RFIs can also be raised and resolved through direct support tickets with CPN.

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# RFI Levels

Requests for information (RFI) can have one of three levels, which indicate the
required information that must be passed to satisfy the RFI. The levels vary
depending on if the sender is an individual or a business.

## Individual

The following sections outline the requirements for each level if the sender is
an individual (natural person).

### Level 1

Level 1 requires the following information:

| Field                            | Description                                                    |
| -------------------------------- | -------------------------------------------------------------- |
| `ADDRESS`                        | Individual's full address                                      |
| `NAME`                           | Individual's full name                                         |
| `DATE_OF_BIRTH`                  | Individual's date of birth                                     |
| `NATIONAL_IDENTIFICATION_NUMBER` | Unique government-issued ID (tax ID, national ID, or other)    |
| `SOURCE_OF_FUNDS`                | Source of funds for transactions                               |
| `METHOD_OF_VERIFICATION`         | The method of verification (electronic, by document, or other) |

### Level 2

Level 2 requires all of the information required for level 1, plus the following
information:

| Field         | Description                         |
| ------------- | ----------------------------------- |
| `NATIONALITY` | Nationality of the individual       |
| `EMAIL`       | Contact email address               |
| `PHONE`       | Primary phone number                |
| `OCCUPATION`  | Employment or professional activity |

### Level 3

Level 3 requires all the information required for levels 1 and 2, plus the
following information:

| Field              | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `ID_DOC_TYPE`      | Type of ID provided (passport, national ID, or others) |
| `ID_DOCUMENT`      | Copy of the provided ID                                |
| `PROOF_OF_ADDRESS` | Utility bill, bank statement, or lease agreement       |
| `ADDITIONAL_DOCS`  | Any additional documents for enhanced due diligence    |

## Business

The following sections outline the requirements for each level if the sender is
a business.

### Level 1

Level 1 requires the following information:

| Field                            | Description                                                |
| -------------------------------- | ---------------------------------------------------------- |
| `NAME`                           | Legal registered name of the business                      |
| `TRADE_NAME`                     | Doing Business As (DBA) or trade name                      |
| `NATIONAL_IDENTIFICATION_NUMBER` | Business identification number (tax ID)                    |
| `DATE_OF_FORMATION`              | Date of company formation                                  |
| `COUNTRY_OF_FORMATION`           | Country where the entity was formed                        |
| `ENTITY_TYPE`                    | Business structure (LLC, corporation, partnership, others) |
| `INDUSTRY_TYPE`                  | Classification of business activity                        |
| `ADDRESS`                        | Registered place of business                               |
| `METHOD_OF_VERIFICATION`         | The method of verification                                 |
| `SOURCE_OF_FUNDS`                | Business funding sources                                   |

### Level 2

Level 2 requires all of the information required for level 1, plus the following
information:

| Field                             | Description                                                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `AUTHORIZED_SIGNATORIES`          | List of individuals with signature authorization                                                                      |
| `BENEFICIARY_OWNERSHIP`           | Whether any individuals or entities have significant ownership (directly or indirectly own >= 25%) of the company     |
| `BENEFICIARY_OWNERS`              | List of individuals with significant ownership (directly or indirectly owning >= 25%) of the company                  |
| `INTERMEDIARY_BENEFICIARY_OWNERS` | List of intermediary beneficiary owners with significant ownership (directly or indirectly own >= 25%) of the company |
| `WEBSITE`                         | Business website URL                                                                                                  |
| `EMAIL`                           | Business contact email                                                                                                |
| `PHONE`                           | Business contact phone number                                                                                         |

### Level 3

Level 3 requires all the information required for levels 1 and 2, plus the
following information:

| Field                                  | Description                                            |
| -------------------------------------- | ------------------------------------------------------ |
| `FORMATION_DOCUMENT`                   | Articles of incorporation or certificate of formation  |
| `PROOF_OF_ADDRESS`                     | Utility bill, lease agreement, or bank statement       |
| `ORG_STRUCTURE`                        | Document of the organization structure of the business |
| `INVOICE`                              | Underlying invoice for the payment                     |
| `BENEFICIAL_OWNERS_IDENTITY_DOCUMENTS` | Beneficial owners ID documents                         |

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Travel Rule Requirements

Travel rule information is required during payment creation to provide
appropriate regulatory information to the BFI. The following sections outline
the required data that must be securely transmitted to the BFI when a payment is
created. See [JSON Schema](/cpn/concepts/api/json-schema) for more information
on how to validate your API response to the travel rule requirements.

<Note>
  **Note:** Depending on the geography of the payment route, additional travel
  rule information may be required to initiate the payment. This additional data
  are specified in the data object returned by the [payment creation
  endpoint](/api-reference/cpn/cpn-platform/create-payment).
</Note>

## OFI

| Field                                      | Description            |
| ------------------------------------------ | ---------------------- |
| `ORIGINATOR_FINANCIAL_INSTITUTION_NAME`    | OFI's business name    |
| `ORIGINATOR_FINANCIAL_INSTITUTION_ADDRESS` | OFI's business address |

## Individual

| Field                                        | Description                                                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ORIGINATOR_NAME`                            | Sender's full name                                                                                                      |
| `ORIGINATOR_ACCOUNT_NUMBER`                  | Sender's account number reference (originator's wallet address or account number for an OFI virtual or funding account) |
| `ORIGINATOR_ADDRESS`                         | Sender's address                                                                                                        |
| `ORIGINATOR_DATE_OF_BIRTH`                   | Sender's date of birth                                                                                                  |
| `ORIGINATOR_NATIONALITY`                     | Sender's nationality                                                                                                    |
| `ORIGINATOR_NATIONAL_IDENTIFICATION_NUMBER`  | Sender's national ID or passport number                                                                                 |
| `BENEFICIARY_NAME`                           | Recipient's full name                                                                                                   |
| `BENEFICIARY_ADDRESS`                        | Recipient's address                                                                                                     |
| `BENEFICIARY_DATE_OF_BIRTH`                  | Recipient's date of birth                                                                                               |
| `BENEFICIARY_NATIONALITY`                    | Recipient's nationality                                                                                                 |
| `BENEFICIARY_NATIONAL_IDENTIFICATION_NUMBER` | Recipient's national ID or passport number                                                                              |

## Business

| Field                                        | Description                                                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ORIGINATOR_NAME`                            | Sender's legal registered business name                                                                                 |
| `ORIGINATOR_ACCOUNT_NUMBER`                  | Sender's account number reference (originator's wallet address or account number for an OFI virtual or funding account) |
| `ORIGINATOR_ADDRESS`                         | Sender's registered place of business                                                                                   |
| `ORIGINATOR_DATE_OF_FORMATION`               | Sender's date of company formation                                                                                      |
| `ORIGINATOR_COUNTRY_OF_FORMATION`            | Sender's country where the entity was formed                                                                            |
| `ORIGINATOR_NATIONAL_IDENTIFICATION_NUMBER`  | Sender's business registration or tax ID                                                                                |
| `BENEFICIARY_NAME`                           | Recipient's legal registered business name                                                                              |
| `BENEFICIARY_ADDRESS`                        | Recipient's registered place of business                                                                                |
| `BENEFICIARY_DATE_OF_FORMATION`              | Recipient's date of company formation                                                                                   |
| `BENEFICIARY_COUNTRY_OF_FORMATION`           | Recipient's country where the entity was formed                                                                         |
| `BENEFICIARY_NATIONAL_IDENTIFICATION_NUMBER` | Recipient's business registration or tax ID                                                                             |

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Validating Brazilian Tax ID and Bank Account Numbers

When providing beneficiary account data during payment creation or during RFIs,
OFIs may need to submit tax IDs or bank account numbers that follow a specific
format. You can often validate these numbers by calculating their check digits.
This topic describes how to checksum various account and tax ID numbers.

## CNPJ

The CNPJ number is a 14 digit number in the following format:

* First 8 digits: base number
* Digits 9-12: branch number
* Last 2 digits: check digits

CNPJ numbers are never all the same digit.

The check digits are calculated in a specific way that you can replicate to
validate the number.

### First check digit

You can calculate the first check digit (digit 13) of a CNPJ number as follows:

1. Multiply the first 12 digits by the following weights, according to their
   position: `5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2`
2. Sum the products
3. Calculate the remainder of the sum divided by `11`
4. If the remainder is less than `2`, the check digit is `0`
5. Otherwise, the check digit is `11 - {remainder}`

### Second check digit

You can calculate the second check digit (digit 14) of a CNPJ number as follows:

1. Multiply the first 13 digits by the following weights, according to their
   position: `6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2`
2. Sum the products
3. Calculate the remainder of the sum divided by `11`
4. If the remainder is less than `2`, the check digit is `0`
5. Otherwise, the check digit is `11 - {remainder}`

### Example

The following is an example of validating the CNPJ number `11.444.777/0001-61`:

**First digit**

* Weighting and sum:
  `((1*5 + 1*4 + 4*3 + 4*2 + 4*9 + 7*8 + 7*7 + 7*6 + 0*5 + 0*4 + 0*3 + 1*2) = 162)`
* Remainder and check digit: `(11 - (184 % 11) = 1)` (matches 13th digit)

**Second digit**

* Weighting and sum:
  `((1*6 + 1*5 + 4*4 + 4*3 + 4*2 + 7*9 + 7*8 + 7*7 + 0*6 + 0*5 + 0*4 + 1*3 + 6*2) = 184)`
* Remainder and check digit: `(11 - (184 % 11) = 1)` (matches 14th digit)

## CPF

The CPF number is an 11 digit number that is not all the same digit. The 10th
and 11th digits are check digits. The check digits are calculated in a specific
way that you can replicate to validate the number.

### First check digit

You can calculate the first check digit (digit 10) of a CPF number as follows:

1. Multiply the first 9 digits by the following weights, according to their
   position: `10, 9, 8, 7, 6, 5, 4, 3, 2`
2. Sum the products
3. Calculate the remainder of the sum divided by `11`
4. If the remainder is less than `2`, the check digit is `0`
5. Otherwise, the check digit is `11 - {remainder}`

### Second check digit

You can calculate the second check digit (digit 11) of a CPF number as follows:

1. Multiply the first 10 digits by the following weights, according to their
   position: `11, 10, 9, 8, 7, 6, 5, 4, 3, 2`
2. Sum the products
3. Calculate the remainder of the sum divided by `11`
4. If the remainder is less than 2, the check digit is `0`
5. Otherwise, the check digit is `11 - {remainder}`

### Example

The following is an example of validating the CPF number `529.982.247-25`:

**First digit**

* Weighting and sum:
  `((5*10 + 2*9 + 9*8 + 9*7 + 8*6 + 2*5 + 2*4 + 4*3 + 7*2) = 295)`
* Remainder and check digit: `(11 - (295 % 11) = 2)` (matches 10th digit)

**Second digit**

* Weighting and sum:
  `((5*11 + 2*10 + 9*9 + 9*8 + 8*7 + 2*6 + 2*5 + 4*4 + 7*3 + 2*2) = 347)`
* Remainder and check digit: `(11 - (347 % 11) = 5)` (matches 11th digit)

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Transaction

A transaction in the CPN API represents a transfer of funds onchain to fund the
payment. Once payment is in the `CRYPTO_FUNDS_PENDING` status, the OFI should
create the onchain transaction using CPN's transaction endpoints. Through these
endpoints, the OFI can initiate and broadcast the transaction. The OFI uses its
own wallet integration to sign transactions before sending them to the API. CPN
provides transaction updates through webhooks. Transactions follow these steps:

1. The OFI initiates a transaction request, and Circle returns the raw
   transaction data
2. The OFI validates the response and signs the transaction
3. The OFI submits the signed transaction to the CPN API
4. CPN verifies the transaction content and broadcasts it to the blockchain
5. CPN notifies the OFI and the BFI of the transaction status



> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Transactions V2

CPN supports two versions of onchain transactions: V1 and an optional upgrade,
V2, which enables secure and compliant stablecoin settlement across all
blockchains that
[CPN supports](/cpn/references/blockchains/supported-blockchains). Both deliver
the same core payment capabilities but differ in how gas fees, signing, and
orchestration are managed.

## Gas abstraction

Transactions V2 provides gas abstraction which removes the requirement for you
to pay native tokens for gas fees during transaction broadcast. This provides a
lower-complexity operational model for you by eliminating the need to acquire
and maintain a native token balance in your wallet.

When a Transaction V2 quote is created, the `fees` field includes a fixed gas
fee denoted in USDC. This gas fee is valid as long as the payment remains
active. During transaction settlement, the payment settlement smart contract
withdraws the fee amount from your wallet and distributes it to the beneficiary.

The transaction fee you pay is fixed regardless of fluctuations of the native
blockchain gas fee levels. CPN ensures that the transaction gets broadcast
accurately and on time. This removes the need for manual acceleration and
monitoring by delegating it to CPN.

## EVM payment settlement contract and `Permit2`

In EVM blockchains, Transactions V2 uses a payment settlement smart contract
that allows you to send verified payments to the BFI that are authorized by you,
an attester (CPN), and (optionally) the BFI. The contract ensures that the
transaction is accurate and correct, and can serve as proof of payment after the
transaction has settled.

Unlike Transactions V1, which uses EIP-3009 for token approvals, the payment
settlement contract uses the `Permit2` contract, Uniswap's universal token
approval system. `Permit2` makes integrations more straightforward by using
gasless, offchain signatures for token transfers. `Permit2` permits are
signature-based, time-bound, and single-use.

The payment settlement smart contract uses `Permit2` to execute funds transfer
from your wallet to the recipient wallet in a single contract execution. In
practice, this means that you sign an EIP-712 typed-data message of the
`PermitWitnessTransferFrom` method call to allow the payment settlement smart
contract to transfer USDC out of your wallet and into the recipient wallet.

```json JSON theme={null}
{
  "types": {
    "EIP712Domain": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "chainId",
        "type": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address"
      }
    ],
    "PermitWitnessTransferFrom": [
      { "name": "permitted", "type": "TokenPermissions" },
      { "name": "spender", "type": "address" },
      { "name": "nonce", "type": "uint256" },
      { "name": "deadline", "type": "uint256" },
      { "name": "witness", "type": "PaymentIntent" }
    ],
    "TokenPermissions": [
      { "name": "token", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "PaymentIntent": [
      { "name": "from", "type": "address" },
      { "name": "to", "type": "address" },
      { "name": "value", "type": "uint256" },
      { "name": "validAfter", "type": "uint256" },
      { "name": "validBefore", "type": "uint256" },
      { "name": "nonce", "type": "bytes32" },
      { "name": "beneficiary", "type": "address" },
      { "name": "maxFee", "type": "uint256" },
      { "name": "requirePayeeSign", "type": "bool" },
      { "name": "attester", "type": "address" }
    ]
  },
  "domain": {
    "name": "Permit2",
    "chainId": 11155111,
    "verifyingContract": "PERMIT2_ADDRESS"
  },
  "message": {
    "permitted": {
      "token": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      "amount": "100050000"
    },
    "spender": "CPN_SMART_CONTRACT_ADDRESS",
    "nonce": "0",
    "deadline": "1234567890",
    "witness": {
      "from": "OFI_PAYER_ADDRESS",
      "to": "BFI_PAYEE_ADDRESS",
      "value": "100000000",
      "validAfter": "0",
      "validBefore": "1234567890",
      "nonce": "ONCHAIN_PAYMENT_REF",
      "beneficiary": "CIRCLE_BENEFICIARY_ADDRESS",
      "maxFee": "50000",
      "requirePayeeSign": false,
      "attester": "CPN_WALLET_ADDRESS"
    }
  },
  "primaryType": "PermitWitnessTransferFrom"
}
```

### `Permit2` allowance

The use of `Permit2` requires you to grant an allowance of USDC to the `Permit2`
contract ahead of the payment. This allowance grants the `Permit2` contract
permission to transfer USDC from your wallet in a CPN settlement. When you sign
a CPN transaction, that transaction allows the payment settlement contract to
consume the USDC allowance previously granted to `Permit2`.

The allowance amount can be set to a specific value based on the expected
payment volume or to the maximum `uint256` value for unlimited transfers. The
allowance is the foundational authorization that makes the entire CPN payment
settlement system possible through `Permit2`'s signature-based transfer
mechanism.



> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Wallet Nonce Management

<Note>
  **Note:** This topic applies to EVM blockchains only, and is only a
  requirement for Transactions V1. For [Transactions
  V2](/cpn/concepts/transactions/transactions-v2), nonces are managed by CPN so
  you don't need to actively manage them.
</Note>

This topic explains how nonces work in Ethereum Virtual Machine (EVM)
transactions. It also gives you tips for managing nonces when you handle many
transactions at once.

Before you read this, you should know the basics about EVM wallets and how
transactions are signed.

## What is a nonce?

In EVM-based blockchains, a wallet nonce is a counter. It tracks how many
transactions you sent from a specific wallet address. Each transaction must use
a different nonce. You must use nonces in order, one after another.

Key points:

* New wallets start with nonce 0
* Each successful transaction adds 1 to the nonce
* You must use nonces in order (no gaps)
* Each wallet address has its own nonce count

## Nonce conflicts in concurrent transactions

Problems can happen when you create many transactions at the same time from one
wallet address.

This problem often happens when many users create transactions at once, and your
system uses the same EVM wallet for all these requests.

When signing transactions, multiple threads in your system might try to get the
wallet's current nonce at the same time. If this race condition occurs, multiple
transactions might get assigned the same nonce number. When this occurs, only
the first transaction works. The others fail.

Another common problem happens when transactions get stuck in the blockchain's
mempool and block later transactions. Here's an example:

* Your CPN integration signs two transactions from the same wallet in the right
  order:
  * Transaction A with nonce 5
  * Transaction B with nonce 6
* Transaction A gets rejected by CPN because it has the wrong parameters
* Transaction B goes to the blockchain but gets stuck in the mempool because the
  blockchain needs nonce 5 first
* All future transactions from this wallet get blocked until you fix the gap

## Best practices for managing nonces

Your integration may vary based on your systems. Here are some general tips for
managing nonces:

**Set up one central system to track nonces for each wallet.** This system
should safely handle nonce assignment when multiple threads request to sign
transactions at once. Make sure each nonce gets assigned only once to prevent
duplicates. You can use a locking system or a queue system to manage nonce
assignment when handling multiple operations.

**Keep your system in sync with the blockchain to track the latest nonce
numbers.** Your local nonce tracking should reset its counter if it gets out of
sync with the blockchain's nonce state. Set up regular health checks to find
nonce gaps.

You should sync with the blockchain:

* Before starting new transaction batches
* After transactions fail or get rejected
* When your systems restart after downtime


> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Supported Blockchains

CPN is chain-agnostic and built for multichain flexibility. OFIs can select the
blockchains they operate on, based on their internal risk, compliance,
operational, and security requirements.

The following sections list the blockchains that CPN supports.

## Testnet

| Blockchain       | Transactions V1 | Transactions V2 |
| ---------------- | --------------- | --------------- |
| Ethereum Sepolia | ✅               | ✅               |
| Polygon Amoy     | ✅               | ✅               |
| Solana Devnet    | ✅               | ✅               |

## Mainnet

| Blockchain | Transactions V1 | Transactions V2 |
| ---------- | --------------- | --------------- |
| Ethereum   | ✅               | ✅               |
| Polygon    | ✅               | ✅               |
| Solana     | ✅               | ✅               |


> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Wallet Provider Compatibility

CPN allows you to bring your own wallet provider when integrating with the
network. Circle Wallets is an option for your integration, but not a
requirement. When bringing your own wallet provider, you should make sure that
they support the features and signing methods that are required to interact with
CPN.

## Requirements

The following features and signing methods are required for a wallet provider to
be able to integrate with CPN:

* **Custodial wallet support:** The provider must be able to sign transactions
  for wallets without requiring user interaction.
* **Ethereum virtual machine (EVM) raw transaction signing:** For Transactions
  V1, the provider must be able to sign raw EVM transactions without
  broadcasting them to the blockchain. This is not required for Transactions V2.
* **EIP-712 signing:** The provider must support EIP-712 typed data. This is a
  requirement for both Transactions V1 and V2. The resulting signature can be
  used in one of the following ways:
  * The signature can be verified by recovering the signer's address with the
    hash of the typed data (on behalf of an EOA).
  * The signature can be validated by the `isValidSignature` method defined in
    EIP-1271 with the hash of the typed data (on behalf of an SCA).

<Note>
  **Note:** USDC implements EIP-3009 with the EIP-7598 extension, enabling both
  EOAs and SCAs to authorize transfers via the EIP-3009 mechanism.
</Note>

* SCA wallet interface: When using an SCA wallet as the sender wallet, the
  wallet contract must implement the following two interfaces:
  * EIP-165 Standard Interface Detection: The SCA wallet must correctly
    implement the EIP-165 interface detection standard. The `supportsInterface`
    function must return `true` for the EIP-1271 interface ID.
  * EIP-1271 Standard Signature Validation for Contracts: The SCA wallet must
    correctly implement the EIP-1271 interface, which defines the
    `isValidSignature` function.

* **Solana signing:** The provider must support signing raw Solana transaction
  using `Ed25519`, without broadcasting them to the blockchain. For Transactions
  V2, the provider must support
  [partial signing](https://solana.com/developers/cookbook/transactions/offline-transactions#partial-sign-transaction)
  of the transaction.

* **Solana memo field:** The provider must support a memo field for Solana
  transactions.

| Blockchain | Transactions V1                                                   | Transactions V2                              |
| ---------- | ----------------------------------------------------------------- | -------------------------------------------- |
| EVM        | EIP-712 typed data signing<br /><br />Raw EVM transaction signing | EIP-712 typed data signing                   |
| Solana     | Solana transaction signing                                        | Solana transaction signing (partial signing) |


> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Block Confirmation and Transaction Finality

When you submit a transaction to CPN, it is initially in the `pending` state and
waiting to be broadcast to the blockchain. Once the transaction is broadcast to
the blockchain, it transitions to the `broadcasted` state, and the transaction
is waiting to be included in a block.

CPN monitors each block of supported blockchains and the status of CPN
transactions on those chains, updating the status as necessary.

## Block confirmation

Block confirmation is the process of validating and adding transactions to a
block on a blockchain. Each time a new block is added to a blockchain, it
confirms the previous blocks.

Without a sufficient number of confirmations, transactions are vulnerable to
alteration through blockchain reorganization. Blockchain reorganization occurs
when validators discard one or more blocks that were previously part of the
canonical chain and replace them with a different set of blocks, rewriting part
of the chain.

<Note>
  **Note:** Blockchain reorganizations can happen for a variety of reasons. It's
  an engineering best practice to expect reorganizations and make your system
  resilient to them.
</Note>

Each additional block confirmation added after a block makes that block less
likely to be removed in a reorganization. Each block confirmation adds
confidence that the transaction is permanently included in the blockchain.

## Confirmation number

For a given block, the confirmation number is the number of subsequent blocks
added to the blockchain.

For a given transaction included in a block, CPN waits for a set number of
blocks (in addition to the original) to be added to the chain before it
considers the transaction final. This number varies across supported
blockchains. When a sufficient number of blocks are appended after the original
block, CPN updates the status of the transaction to `completed` and notifies
both the OFI and BFI of the status change.

<Note>
  **Note:** Even if a transaction is visible on a block explorer, it doesn't
  necessarily mean that the transaction is considered `completed` by CPN,
  because it's possible that it hasn't reached the number of block confirmations
  for finality.
</Note>

## Reorganization risk

Although Circle may broadcast transactions initiated through CPN to the
blockchain network, Circle cannot guarantee that the transaction is recorded or
permanently confirmed by the network. Transactions over CPN may be dependent on
underlying blockchain networks that Circle does not control, and CPN
Participants assume all risks associated with the blockchain network operations
and any operating changes, including in the unlikely event of a deep
reorganization or other invalidation of previously confirmed transactions.

Circle shall not be liable for any loss or damage arising from issues with, or
any delays, reversals, or failures of transactions caused by such operations and
operating changes.


> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Payment Smart Contract Addresses

> Payment smart contract addresses for CPN

The following sections provide the addresses for the CPN payment smart contracts
on supported blockchains.

## Mainnet

| Blockchain  | Settlement Contract Address                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| Ethereum    | [`0x355e0a2a4B7563e0E00C90deD9Aa914c119Ee868`](https://etherscan.io/address/0x355e0a2a4B7563e0E00C90deD9Aa914c119Ee868)    |
| Polygon PoS | [`0x355e0a2a4B7563e0E00C90deD9Aa914c119Ee868`](https://polygonscan.com/address/0x355e0a2a4B7563e0E00C90deD9Aa914c119Ee868) |

## Testnet

| Blockchain       | Settlement Contract Address                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Arc Testnet      | [`0x355e0a2a4B7563e0E00C90deD9Aa914c119Ee868`](https://testnet.arcscan.app/address/0x355e0a2a4B7563e0E00C90deD9Aa914c119Ee868)  |
| Ethereum Sepolia | [`0x355e0a2a4B7563e0E00C90deD9Aa914c119Ee868`](https://sepolia.etherscan.io/address/0x355e0a2a4B7563e0E00C90deD9Aa914c119Ee868) |
| Polygon PoS Amoy | [`0x355e0a2a4B7563e0E00C90deD9Aa914c119Ee868`](https://amoy.polygonscan.com/address/0x355e0a2a4B7563e0E00C90deD9Aa914c119Ee868) |


> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Webhook Retries

When a webhook can't be delivered successfully (2xx status code returned), CPN
continues to try to deliver the webhook. To avoid encountering the same
transient error too many times, the retries are sent with a delay between them.
The number of retries varies between testing and production:

* **Testing:** 6 retries
* **Production:** 11 retries

The following table outlines the schedule for webhook retries:

| Retry attempt | Delay      |
| ------------- | ---------- |
| 1             | 1 second   |
| 2             | 10 seconds |
| 3             | 30 seconds |
| 4             | 1 minute   |
| 5             | 15 minutes |
| 6             | 1 hour     |
| 7             | 3 hours    |
| 8             | 5 hours    |
| 9             | 6 hours    |
| 10            | 10 hours   |
| 11            | 11 hours   |



> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Webhook Events

Components of CPN send webhook notifications when events occur, typically for a
change in state. These webhook notifications are sent to the OFI so that they
can track and manage payments in CPN. The webhooks described in this topic are
specific to OFIs only.

All webhook notifications follow the same payload structure. The
`notificationType` field indicates the event type, and the `notification` field
contains the event-specific data object. The `notification` object schema
matches the `data` field returned by the corresponding API endpoint (see the
[API reference](/api-reference/cpn/cpn-platform/) for details).

```json JSON theme={null}
{
  "subscriptionId": "cd198ca6-9fc4-41d6-b6b1-8e2a9c975352",
  "notificationId": "0761b030-0c75-472a-b471-74d90a7e796c",
  // Event type, determines the structure of the notification object
  "notificationType": "cpn.payment.cryptoFundsPending",
  // Event-specific data object, structure varies by notificationType
  // See corresponding section below for the object schema (Payment, RFI, Transaction, or Refund)
  "notification": {
    // Object matching the event type
  },
  "timestamp": "2024-09-30T17:48:05.420577158Z",
  "version": 2
}
```

The following sections describe the webhook events by component.

## Payment events

The `notification` object has the same schema as the `data` field returned by
[Get Payment](/api-reference/cpn/cpn-platform/get-payment).

| Event name                         | Description                                                                                                                                  | Trigger when                                                                                                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cpn.payment.cryptoFundsPending`   | The payment has been created and is waiting for funds to be deposited                                                                        | The payment is ready to accept crypto funds                                                                                                                                     |
| `cpn.payment.fiatPaymentInitiated` | The BFI has initiated the fiat payment to the receiver's bank account                                                                        | The onchain transaction is confirmed by the BFI and the BFI initiated the fiat payment                                                                                          |
| `cpn.payment.completed`            | The payment is fully processed                                                                                                               | The fiat payment has been sent.<br /><br />Depending on the payment method, the receiver may or may not have received the transfer. At this point, the CPN payment is complete. |
| `cpn.payment.failed`               | The payment failed due to errors in processing, insufficient funds, or compliance rejection                                                  | The payment can't proceed due to an issue                                                                                                                                       |
| `cpn.payment.delayed`              | There is a delay to the estimate of payment settlement time. No status has changed but an updated settlement time is included in the payload | The BFI has an internal issue such that fiat settlement takes longer to process than originally stated                                                                          |
| `cpn.payment.inManualReview`       | A manual review has been placed on the payment. The payment status itself remains `CREATED`.                                                 | A payment is created but placed under manual review                                                                                                                             |

## RFI events

The `notification` object has the same schema as the `data` field returned by
[Get RFI](/api-reference/cpn/cpn-platform/get-rfi).

| Event name                    | Description                                                                | Trigger when                                                      |
| ----------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `cpn.rfi.informationRequired` | Additional compliance information is needed before the payment can proceed | The BFI requests more information to proceed with the payment     |
| `cpn.rfi.inReview`            | The submitted RFI response is under review by the BFI                      | The OFI submits the required information through the API endpoint |
| `cpn.rfi.approved`            | The RFI has been reviewed and approved, the payment can proceed            | The BFI approves the submitted information                        |
| `cpn.rfi.rejected`            | The RFI has been reviewed and rejected, the payment is failed              | The BFI rejects the submitted information                         |

## Transaction events

The `notification` object has the same schema as the `data` field returned by
[Get Transaction](/api-reference/cpn/cpn-platform/get-transaction).

| Event name                    | Description                                                                                | Trigger when                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `cpn.transaction.broadcasted` | The signed transaction is sent to the blockchain for confirmation                          | The signed transaction has been broadcast        |
| `cpn.transaction.completed`   | The transaction was successfully included in a block                                       | The blockchain confirms the transaction          |
| `cpn.transaction.failed`      | The transaction failed due to issues such as incorrect parameters or insufficient gas fees | The blockchain failed to confirm the transaction |

## Refund events

The `notification` object has the same schema as the `data` field returned by
[Get Refund](/api-reference/cpn/cpn-platform/get-refund).

| Event name             | Description                                         | Trigger when                                                                     |
| ---------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| `cpn.refund.created`   | The BFI created a refund for the associated payment | The BFI initiated the refund.<br /><br />**Note:** Not all BFIs send this event. |
| `cpn.refund.failed`    | The refund failed                                   | The refund failed                                                                |
| `cpn.refund.completed` | The refund is complete                              | The BFI confirms that the refund was successfully returned to the refund address |

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Error Codes

When an error is encountered, CPN returns an error code and a message. The
sections below show an explanation of each error code returned by the API, and
steps to resolve (where possible).

## Common

| Status code | Error code | Detail                  | Description                                                                                                                                                                                                         |
| ----------- | ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `500`       | `-1`       | `UNKNOWN_ERROR`         | A generic response for errors that aren't properly handled.                                                                                                                                                         |
| `400`       | `2`        | `API_PARAMETER_INVALID` | API request was missing parameters or had incorrect parameter types.                                                                                                                                                |
| `403`       | `3`        | `FORBIDDEN`             | The client is recognized but does not have permission to access the resource.<br /><br />**Resolution:** Verify the IP allowlist for the API key has the correct permissions through your Circle representative.    |
| `401`       | `4`        | `UNAUTHORIZED`          | The client did not provide valid authentication credentials to access the resource.<br /><br />**Resolution:** Verify your API key was passed as a `Bearer` token in the `Authorization` header of the API request. |
| `404`       | `2`        | `RESOURCE_NOT_FOUND`    | The requested resource could not be found.                                                                                                                                                                          |
| `400`       | `2900000`  | `INVALID_TENANCY_ENV`   | The parameter and the environment of the API call doesn't match (for example, a testnet chain in the production environment).<br /><br />**Resolution:** Update the request body to use the correct parameters.     |

## Quote

| Status code | Error code | Detail                 | Description                                                                                                                                                                                                                                                                                                                                            |
| ----------- | ---------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `400`       | `290100`   | `AMOUNT_OUTSIDE_LIMIT` | The provided amount does not fall in the supported range. It either exceeds the `cryptoLimit` or `fiatLimit`.<br /><br />**Resolution:** Make a request to the [configuration endpoint](/api-reference/cpn/cpn-platform/get-payment-configurations-overview) to determine supported combinations and try your request again with different parameters. |
| `400`       | `290101`   | `BFI_NOT_AVAILABLE`    | Only one BFI services the requested route and that service is unavailable.<br /><br />**Resolution:** Retry your request at a later time.                                                                                                                                                                                                              |
| `400`       | `290102`   | `ROUTE_NOT_SUPPORTED`  | The route includes unsupported countries.<br /><br />**Resolution:** Make a request to the [configuration endpoint](/api-reference/cpn/cpn-platform/get-payment-configurations-overview) to determine supported combinations and try your request again with different parameters.                                                                     |

## Payment

| Status code | Error code | Detail                              | Description                                                                                                                                                                                                   |
| ----------- | ---------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400`       | `290200`   | `QUOTE_NOT_FOUND`                   | The provided quote ID can't be found.<br /><br />**Resolution:** Verify the quote ID is correct and make a new API request.                                                                                   |
| `400`       | `290201`   | `QUOTE_ALREADY_IN_USE`              | The provide quote ID has been used to create another payment.<br /><br />**Resolution:** Request a new quote and use it to create your payment.                                                               |
| `400`       | `290202`   | `QUOTE_EXPIRED`                     | The quote used to request payment creation is expired.<br /><br />**Resolution:** Request a new quote and use it to create your payment.                                                                      |
| `400`       | `290203`   | `INVALID_SENDER_ADDRESS_BLOCKCHAIN` | The blockchain associated with `senderAddress` does not match the requested blockchain from the quote.<br /><br />**Resolution:** Use the same blockchain in the payment request body as the `senderAddress`. |
| `400`       | `290204`   | `SANCTIONED_SENDER_WALLET_ADDRESS`  | The provided wallet address is on sanctioned lists.                                                                                                                                                           |
| `400`       | `290205`   | `PENDING_RFI_VERIFICATION`          | An RFI was requested for the sender or recipient so the payment can't be created.<br /><br />**Resolution:** Complete the RFI for the requested information before creating another payment.                  |
| `400`       | `290206`   | `RFI_REJECTED`                      | The given sender or receiver has a rejected RFI with the given BFI and the payment can't be completed.                                                                                                        |
| `400`       | `290207`   | `REQUIRED_PARAMETER_MISSING`        | A required parameter is missing in the request data.<br /><br />**Resolution:** Check the error in the response and make a new request with the missing parameter.                                            |
| `400`       | `290208`   | `COMPLIANCE_INFORMATION_REJECTED`   | The compliance information provided was rejected.                                                                                                                                                             |

## Transaction

| Status code | Error code | Detail                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------- | ---------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400`       | `290300`   | `ACTIVE_TRANSACTION_ALREADY_EXISTS`                 | The payment already has an associated active or complete transaction.<br /><br />**Resolution:** For payments with an existing active transaction, sign and submit the transaction instead of attempting to create a new one.                                                                                                                                                                                                                      |
| `400`       | `290301`   | `BLOCKCHAIN_UNSUPPORTED`                            | The sender address blockchain is not supported by CPN for creating transactions.<br /><br />**Resolution:** Use the blockchain indicated in the quote.                                                                                                                                                                                                                                                                                             |
| `400`       | `290302`   | `BLOCKCHAIN_UNSUPPORTED_FOR_V2`                     | The blockchain is not support for Transactions V2.<br /><br />**Resolution:** See [supported blockchains](/cpn/references/blockchains/supported-blockchains) for the complete list of supported blockchains.                                                                                                                                                                                                                                       |
| `400`       | `290303`   | `INVALID_TRANSACTION_STATUS_FOR_SUBMISSION`         | The transaction provided is not in a submittable status.<br /><br />**Resolution:** Only submit a transaction when it is in the `CREATED` state.                                                                                                                                                                                                                                                                                                   |
| `400`       | `290304`   | `INVALID_PAYMENT_STATUS`                            | The transaction can't be submitted due to an invalid payment state.<br /><br />**Resolution:** Only submit a transaction when the payment is in the `CRYPTO_FUNDS_PENDING` state.                                                                                                                                                                                                                                                                  |
| `400`       | `290305`   | `PAYMENT_NOT_FOUND`                                 | The payment ID provided in the request was not found.                                                                                                                                                                                                                                                                                                                                                                                              |
| `400`       | `290306`   | `TRANSACTION_NOT_FOUND`                             | The transaction provided by the resource ID in the path was not found.                                                                                                                                                                                                                                                                                                                                                                             |
| `400`       | `290307`   | `SIGNED_TRANSACTION_SUBMITTED`                      | A signed transaction for the payment has already been submitted.<br /><br />**Resolution:** Wait for the transaction to reach a terminal state.                                                                                                                                                                                                                                                                                                    |
| `400`       | `290308`   | `PAYMENT_EXPIRED`                                   | The payment is expired.<br /><br />**Resolution:** Request a new quote, then create a new payment and submit the transaction in the appropriate time frame.                                                                                                                                                                                                                                                                                        |
| `400`       | `290309`   | `SIGNED_TRANSACTION_EXPIRED`                        | The signed transaction is expired. Solana requires that you submit signed transactions in 150 blocks (\~1 min) of signing them.<br /><br />**Resolution:** Create a new transaction for the same payment and sign and submit it in the appropriate time frame.                                                                                                                                                                                     |
| `400`       | `290310`   | `NONCE_TOO_LOW`                                     | The nonce for the signed transaction is lower than the current wallet nonce.<br /><br />**Resolution:** Resubmit the signed transaction with the current wallet nonce.                                                                                                                                                                                                                                                                             |
| `400`       | `290311`   | `SIGNED_TRANSACTION_PAYLOAD_MISMATCH`               | The signed transaction payload does not match the CPN payment. For EVM chains, the EIP-3009 typed data must match the value in the `messageToBeSigned` field returned from the [create transaction endpoint](/api-reference/cpn/cpn-platform/create-transaction). For Solana, the signed transaction object must match the value from the `messageToBeSigned` field.<br /><br />**Resolution:** Resubmit the transaction with the correct payload. |
| `400`       | `290312`   | `INSUFFICIENT_TOKEN_BALANCE`                        | The sender's wallet does not have enough USDC to complete the transfer.<br /><br />**Resolution:** Add USDC to the wallet and resubmit the signed transaction.                                                                                                                                                                                                                                                                                     |
| `400`       | `290313`   | `INSUFFICIENT_GAS_BALANCE`                          | The sender's wallet does not have enough native tokens to cover the gas cost of the transaction.<br /><br />**Resolution:** Add native tokens to the wallet and resubmit the signed transaction.                                                                                                                                                                                                                                                   |
| `400`       | `290314`   | `PAYMENT_ID_MISMATCH`                               | The payment ID provided in the signed data does not match the expected value.                                                                                                                                                                                                                                                                                                                                                                      |
| `400`       | `290315`   | `GAS_PRICE_TOO_LOW`                                 | The gas price in the signed transaction is below network thresholds. The fee must exceed the estimated high fee to ensure prompt confirmation.<br /><br />**Resolution:** Sign the transaction with a higher gas price and resubmit.                                                                                                                                                                                                               |
| `400`       | `290316`   | `NONCE_MISMATCH`                                    | When resubmitting the transaction, the wallet address or nonce does not match the original submission.<br /><br />Sign the transaction with the same wallet and nonce as the previous transaction and resubmit.                                                                                                                                                                                                                                    |
| `500`       | `290317`   | `FULL_NODE_SERVICE_UNAVAILABLE`                     | The full node used by CPN is unavailable or returning an unexpected error during transaction validation.<br /><br />**Resolution:** Submit the signed transaction at a later time.                                                                                                                                                                                                                                                                 |
| `400`       | `290318`   | `PAYMENT_REF_ID_ONCHAIN`                            | The payment ref ID has already been used onchain. The signed transaction may have been rebroadcast prior to submission to CPN.<br /><br />**Resolution:** Contact Circle customer support to reconcile the transaction.                                                                                                                                                                                                                            |
| `400`       | `290319`   | `OUT_OF_GAS`                                        | For EVM chains, the gas limit in the signed transaction is insufficient to cover the execution costs. For Solana, the allocated compute budget falls short of the transaction's requirements, preventing execution.<br /><br />**Resolution:** For EVM chains, increase the gas limit. For Solana, increase the compute budget. Create a new transaction for the same payment and sign and submit it.                                              |
| `400`       | `290320`   | `NONCE_ALREADY_USED`                                | The nonce has already been used by the same sender in another signed transaction submission.<br /><br />**Resolution:** Resubmit the signed transaction using the next available nonce.                                                                                                                                                                                                                                                            |
| `400`       | `290321`   | `INVALID_TRANSACTION_SIGNATURE`                     | The transaction signature is invalid.<br /><br />**Resolution:** Review the guidelines for signing a transaction and try again with updated signing functions.                                                                                                                                                                                                                                                                                     |
| `400`       | `290322`   | `SANCTIONED_WALLET_ADDRESS`                         | The wallet address used is on a sanction list.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `400`       | `290324`   | `CROSS_CHAIN_UNSUPPORTED`                           | The crosschain transfer is not supported by CPN.<br /><br />**Resolution:** Make a request to the [configuration endpoint](/api-reference/cpn/cpn-platform/get-payment-configurations-overview) to determine supported combinations and try your request again with different parameters.                                                                                                                                                          |
| `400`       | `290325`   | `COMPLETED_TRANSACTION_EXISTS`                      | A completed transaction already exists. No need to accelerate.                                                                                                                                                                                                                                                                                                                                                                                     |
| `400`       | `290327`   | `INVALID_SIGNED_TX`                                 | The signed transaction can't be decoded or is otherwise invalid.<br /><br />**Resolution:** Review the guidelines for signing a transaction and try again with updated signing functions.                                                                                                                                                                                                                                                          |
| `400`       | `290328`   | `ONCHAIN_ACCOUNT_NOT_FOUND`                         | The Solana account specified in the transaction is not found.<br /><br />**Resolution:** Ensure the Solana account has been initialized before using it as the sender address for the transaction.                                                                                                                                                                                                                                                 |
| `400`       | `290329`   | `TRANSACTION_EXPIRED`                               | The transaction is expired.<br /><br />**Resolution:** Create a new transaction and submit it in the appropriate time frame.                                                                                                                                                                                                                                                                                                                       |
| `400`       | `290330`   | `CREATED_PENDING_TRANSACTION_EXIST_AT_ACCELERATION` | The existing transaction is not signed or submitted yet before the current attempt to accelerate it.<br /><br />**Resolution:** Sign the existing transaction or wait for the signed transaction to be broadcast.                                                                                                                                                                                                                                  |
| `400`       | `290331`   | `NO_TRANSACTION_TO_ACCELERATE`                      | No broadcast transaction to be accelerated.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `400`       | `290332`   | `ONCHAIN_ACCOUNT_INVALID`                           | An invalid Solana address was used to create the transaction.<br /><br />**Resolution:** Verify the sender account provided in the request is a valid Solana address capable of signing and sending transactions. Don't use system accounts or program accounts. Resubmit the request using a valid Solana account.                                                                                                                                |
| `400`       | `290333`   | `BROADCASTING_IN_PROGRESS`                          | A submitted transaction is already in a non-terminal state.<br /><br />**Resolution:** Wait for the result.                                                                                                                                                                                                                                                                                                                                        |
| `400`       | `290334`   | `NONCE_TOO_HIGH`                                    | The transaction nonce exceeds the permitted range relative to the current nonce.<br /><br />**Resolution:** Check your wallets latest nonce and make sure the nonce selected for your transaction does not exceed that value by more than 32. If you are sending multiple concurrent transactions for multiple payments, try waiting for the previous few transactions to settle.                                                                  |
| `400`       | `290336`   | `INCOMPATIBLE_QUOTE`                                | The quote is incompatible with the specified transaction. Quotes created with V1 transactions must proceed with V1 transaction endpoints, similarly with quotes created with V2 transactions.<br /><br />**Resolution:** Make sure the `transactionVersion` specified in the [endpoint response](/api-reference/cpn/cpn-platform/create-quotes) is consistent with the transaction flow you are using.                                             |
| `400`       | `290337`   | `PAYMENT_MISSING_BLOCKCHAIN_ADDRESS`                | The payment is missing the sender blockchain address.<br /><br />**Resolution:** Make sure you [create the payment](/api-reference/cpn/cpn-platform/create-payment) with `blockchain` and `senderAddress`.                                                                                                                                                                                                                                         |
| `400`       | `290340`   | `INSUFFICIENT_ALLOWANCE_TO_PERMIT2`                 | The ERC-20 allowance granted to the `Permit2` contract is insufficient to cover the total required token amount for the payment, including both the payment amount and associated fees.<br /><br />**Resolution:** With your sender wallet, approve the `Permit2` contract to spend the required amount of USDC for the payment.                                                                                                                   |
| `400`       | `290341`   | `PERMIT2_NONCE_ALREADY_USED`                        | The `Permit2` nonce included in the typed data for the sender has already been used.<br /><br />**Resolution:** Create a new transaction for the same payment with the same sender address, then sign and submit it.                                                                                                                                                                                                                               |

## RFI

| Status code | Error code | Detail                       | Description                                                                                                                                                                                                                           |
| ----------- | ---------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400`       | `290400`   | `RFI_EXPIRED`                | The RFI has expired; you can't submit data to an expired resource.<br /><br />**Resolution:** Create a new payment for the user and complete a new RFI.                                                                               |
| `400`       | `290401`   | `RFI_NOT_SUBMITTABLE`        | Requirement data submissions are limited to RFIs with the `INFORMATION_REQUIRED` status. Submission for an RFI in any other status results in this error code.                                                                        |
| `400`       | `290402`   | `RFI_FILE_NOT_FOUND`         | The uploaded filename does not match the file input name specified in the request for information.<br /><br />**Resolution:** Ensure the correct files are uploaded and that the file names exactly match those specified in the RFI. |
| `400`       | `290403`   | `RFI_FILE_INVALID_CONTENT`   | The server was unable to read the content of the uploaded file.<br /><br />**Resolution:** Ensure the uploaded file contains content in a compatible format that can be processed by the CPN server.                                  |
| `400`       | `290404`   | `RFI_FILE_CONTENT_TOO_LARGE` | The size of the uploaded file exceeds the maximum allowed size. <br /><br />**Resolution:** Ensure that the uploaded file does not exceed the 10 MB.                                                                                  |
| `400`       | `290405`   | `RFI_UNSUPPORTED_FILE_TYPE`  | The MIME type of the uploaded file is not supported.<br /><br />**Resolution:** Ensure that the uploaded file has a MIME type accepted by the file upload endpoint.                                                                   |

## Encryption

| Status code | Error code | Detail                             | Description                                                                                                                                                                                                               |
| ----------- | ---------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400`       | `290500`   | `ENCRYPTED_BLOB_DECRYPTION_ERROR`  | The decryption process failed.<br /><br />**Resolution:** Ensure the correct public key was used to encrypt the payload.                                                                                                  |
| `400`       | `290502`   | `INVALID_JWE_FORMAT`               | The JWE compact payload is not formatted correctly or is missing required components.<br /><br />**Resolution:** Ensure you're using a standard library for encrypting the payload and sending in the JWE compact format. |
| `400`       | `290503`   | `UNSUPPORTED_ENCRYPTION_ALGORITHM` | The JWE compact payload was not encrypted with a supported algorithm.<br /><br />**Resolution:** Ensure your encryption function is correctly implementing the appropriate algorithms and resubmit.                       |

## Support ticket

| Status code | Error code | Detail                                      | Description                                                                                                      |
| ----------- | ---------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `400`       | `290600`   | `TICKET_REFERENCE_REQUIRED`                 | Ticket reference ID is required for escalation.                                                                  |
| `404`       | `290601`   | `ORIGINAL_TICKET_NOT_FOUND`                 | The original ticket was not found with the provided reference ID.                                                |
| `400`       | `290602`   | `INVALID_SUPPORT_TICKET_ISSUE_TYPE`         | Issue type is not allowed for this origin.<br /><br />**Resolution:** Ensure the correct issue type is provided. |
| `404`       | `290603`   | `PAYMENT_NOT_FOUND_FOR_TICKET`              | The payment ID provided was not found.                                                                           |
| `500`       | `290604`   | `SUPPORT_TICKET_SALESFORCE_CREATION_FAILED` | Failed to create a ticket in Circle Salesforce.<br /><br />**Resolution:** Try again at a later time.            |
| `500`       | `290605`   | `SUPPORT_TICKET_BFI_CREATION_FAILED`        | Failed to create a BFI support ticket.<br /><br />**Resolution:** Try again at a later time.                     |

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Payment and Transaction Failure Reasons

When payments or transactions fail, you'll receive an object containing the
failure reason. Depending on when the failure occurs, this information is
returned in the synchronous (API) or asynchronous (webhook) response. The
following sections outline the reasons that each of these components might fail.

## Payments

When a payment fails in CPN there are no further actions you can take with that
payment ID. You should restart the payment workflow by requesting a new quote
and accepting it to create a new payment.

The payment failure notification includes a failure reason (listed below) and a
[failure code](/cpn/references/errors/payment-failure-codes) containing more
specific information about the failure. The failure code provides information
about how to resolve the issue and create a new payment.

| Failure reason              | Description                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| `TRAVEL_RULE_FAILED`        | The travel rule information included with the payment was rejected            |
| `BANK_VERIFICATION_FAILED`  | The bank information included with the payment was rejected                   |
| `RFI_VERIFICATION_FAILED`   | The payment failed due to issues related to RFI handling or verification      |
| `EXISTING_RFI_PENDING`      | An RFI exists on the customer in a non-terminal state                         |
| `ONCHAIN_SETTLEMENT_FAILED` | The payment couldn't be processed due to an issue with the onchain settlement |
| `FIAT_SETTLEMENT_FAILED`    | The payment couldn't be completed due to routing or bank settlement issues    |
| `COMPLIANCE_CHECK_FAILED`   | The payment was rejected due a compliance check failure                       |
| `CANCELLED`                 | The payment is canceled by the originator                                     |
| `PAYMENT_EXPIRED`           | The payment is expired and not able to provide further action.                |
| `OTHER`                     | General payment failure not covered by other reasons                          |

## Transactions

If an onchain transaction fails or becomes stuck, you can create a new
transaction or attempt to replace or accelerate the transaction. You may
continue to troubleshoot onchain transactions until the payment expires. Note
that only one transaction can be associated with a given payment, so you must
wait until the current transaction fails or attempt to replace it if you need to
update the transaction.

| Failure reason               | Description                                                                                                                                                                                                                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CPN_PAYMENT_EXPIRED`        | The payment corresponding to this transaction is expired.<br /><br />**Resolution**: Create a new payment and ensure the onchain transaction is completed in its valid time frame.                                                                                                                          |
| `SIGNED_TRANSACTION_EXPIRED` | (Solana only) The signed transaction is expired. Solana requires you to submit a signed transaction in 150 blocks (\~1 min).<br /><br />**Resolution:** Initiate a new transaction and submit it in the appropriate time frame.                                                                             |
| `NONCE_TOO_LOW`              | The nonce of the signed transaction is lower than the current wallet nonce.<br /><br />**Resolution:** Submit a new transaction using the latest nonce value for the wallet.                                                                                                                                |
| `INSUFFICIENT_GAS_BALANCE`   | Not enough native tokens were available in the wallet to cover the gas fee for the transaction.<br /><br />**Resolution:** Fund the wallet with the appropriate amount of native tokens and initiate a new transaction.                                                                                     |
| `GAS_PRICE_TOO_LOW`          | The specified gas fee is too low, which may prevent the transaction from being included in a block.<br /><br />**Resolution:** Create a new transaction with a higher gas fee.                                                                                                                              |
| `INSUFFICIENT_TOKEN_BALANCE` | The wallet does not have enough USDC in it for the transfer amount.<br /><br />**Resolution:** Fund the wallet with the appropriate amount of USDC for the payment, then initiate a new transaction.                                                                                                        |
| `OUT_OF_GAS`                 | For EVM chains, the gas limit for the signed transaction is insufficient to cover the execution cost. For Solana, the allocated compute budget falls short of the transaction's requirements, preventing successful execution.<br /><br />**Resolution:** Create a new transaction with a higher gas limit. |
| `TX_REPLACEMENT_FAILED`      | The transaction replacement failed because another transaction with the same nonce (and higher fee) is already the mempool or was mined first.<br /><br />If the replacement fails, the original transaction submitted to the blockchain is still executed.                                                 |
| `SOL_TX_ALREADY_IN_CACHE`    | (Solana only) The transaction has already been broadcast and is present in the network's cache.<br /><br />**Resolution:** Wait for the current transaction's confirmation or failure before proceeding.                                                                                                    |
| `TX_ALREADY_CONFIRMED`       | The transaction was confirmed onchain before the current broadcast attempt.<br /><br />**Resolution:** If this was unexpected, open a support ticket for further investigation.                                                                                                                             |
| `FAILED_ONCHAIN`             | The transaction failed execution on the blockchain.<br /><br />**Resolution:** Review the onchain error, correct any issues, and submit a new transaction.                                                                                                                                                  |
| `SOL_BLOCKHASH_EXPIRED`      | (Solana only) The Solana blockhash assigned to the transaction has expired.<br /><br />**Resolution:** Initiate a new transaction.                                                                                                                                                                          |
| `TRANSACTION_EXPIRED`        | The transaction is expired and you aren't able to perform any further actions.<br /><br />**Resolution:** Initiate a new transaction.                                                                                                                                                                       |
> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Payment Failure Codes

When a payment fails, CPN provides a
[failure reason](/cpn/references/errors/payment-and-transaction-failure-reasons)
and a failure code. Depending on when the failure occurs, this information is
returned in the synchronous (API) or asynchronous (webhook) response. This
failure code can help you understand why the payment failed, and take
appropriate steps to resolve the issue. The following sections outline the
specific failure codes for failed payments.

## General

These codes apply when the failure reason is `OTHER`.

| Failure code | Description   |
| ------------ | ------------- |
| `PM00001`    | General error |

## Travel rule

These codes apply when the failure reason is `TRAVEL_RULE_FAILED`.

| Failure code | Description                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| `PM01000`    | A general travel rule failure occurred during travel rule verification                                     |
| `PM01001`    | The originator address is missing data or doesn't meet required formatting or jurisdictional standards     |
| `PM01002`    | The beneficiary address is missing data or doesn't meet required formatting or jurisdictional standards    |
| `PM01003`    | The national ID or passport number provided for the originator is invalid, missing, or fails verification  |
| `PM01004`    | The national ID or passport number provided for the beneficiary is invalid, missing, or fails verification |

## Bank verification

These codes apply when the failure reason is `BANK_VERIFICATION_FAILED`.

| Failure code | Description                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PM02000`    | General bank detail validation failure                                                                                                           |
| `PM02001`    | The beneficiary bank account details (SWIFT BIC, account alias, account number) are invalid, malformed, or not recognized by the bank or network |
| `PM02002`    | The beneficiary bank account details provided don't match the registered beneficiary in the bank's records                                       |
| `PM02003`    | The receiving bank isn't supported                                                                                                               |
| `PM02004`    | The specified account type (checking, savings) isn't supported                                                                                   |

## RFI verification

These codes apply when the failure reason is `RFI_VERIFICATION_FAILED`.

| Failure code | Description                                          |
| ------------ | ---------------------------------------------------- |
| `PM03000`    | General RFI verification failure                     |
| `PM03001`    | Missing or improperly formatted RFI documents        |
| `PM03002`    | Conflicting data in the RFI submission               |
| `PM03003`    | Expired or outdated RFI documents                    |
| `PM03004`    | Rejected after manual compliance review              |
| `PM03005`    | RFI response or review not completed in allowed time |

## Existing RFI pending

These codes apply when the failure reason is `EXISTING_RFI_PENDING`.

| Failure code | Description                                           |
| ------------ | ----------------------------------------------------- |
| `PM04000`    | An RFI exists on the customer in a non-terminal state |

## Onchain settlement

These codes apply when the failure reason is `ONCHAIN_SETTLEMENT_FAILED`.

| Failure code | Description                                                                     |
| ------------ | ------------------------------------------------------------------------------- |
| `PM05000`    | General onchain settlement failure                                              |
| `PM05001`    | Received funds are invalid (wrong asset, insufficient amount, wrong blockchain) |

## Fiat settlement

These codes apply when the failure reason is `FIAT_SETTLEMENT_FAILED`.

| Failure code | Description                                 |
| ------------ | ------------------------------------------- |
| `PM06000`    | General fiat settlement or payout failure   |
| `PM06001`    | Rejected by the receiving bank              |
| `PM06002`    | Rejected by the sending bank                |
| `PM06003`    | Destination account invalid or unregistered |
| `PM06004`    | Destination account blocked                 |

## Compliance check

These codes apply when the failure reason is `COMPLIANCE_CHECK_FAILED`.

| Failure code | Description                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `PM07000`    | General compliance check failure                                                                             |
| `PM07001`    | Originator blocked or ineligible                                                                             |
| `PM07002`    | Beneficiary blocked or ineligible                                                                            |
| `PM07003`    | OFI compliance check failed.<br /><br />You may need to complete KYB before proceeding with further payments |
| `PM07004`    | The beneficiary bank account failed compliance checks                                                        |

## Canceled

These codes apply when the failure reason is `CANCELLED`.

| Failure code | Description                           |
| ------------ | ------------------------------------- |
| `PM08000`    | Funds were canceled by the originator |

## Payment expired

These codes apply when the failure reason is `PAYMENT_EXPIRED`.

| Failure code | Description                                           |
| ------------ | ----------------------------------------------------- |
| `PM09000`    | Crypto funds not received in the expected time window |

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Payment Reason Codes

When you
[create a payment with the CPN API](/api-reference/cpn/cpn-platform/create-payment),
you should include a `reasonForPayment` code in the API request. Each code
provides a specific payment reason.

The following table outlines each code and the reason it represents.

| Reason code | Description                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| `PMT001`    | Invoice payment                                                                                        |
| `PMT002`    | Payment for services                                                                                   |
| `PMT003`    | Payment for software                                                                                   |
| `PMT004`    | Payment for imported goods                                                                             |
| `PMT005`    | Travel services                                                                                        |
| `PMT006`    | Transfer to own account                                                                                |
| `PMT007`    | Repayment of loans                                                                                     |
| `PMT008`    | Payroll                                                                                                |
| `PMT009`    | Payment of property rental                                                                             |
| `PMT010`    | Information service charges                                                                            |
| `PMT011`    | Advertising and public relations related expenses                                                      |
| `PMT012`    | Royalty fees, trademark fees, patent fees, and copyright fees                                          |
| `PMT013`    | Fees for brokers, front end fee, commitment fee, guarantee fee, and custodian fee                      |
| `PMT014`    | Fees for advisors, technical assistance, and academic knowledge including remuneration for specialists |
| `PMT015`    | Representative office expenses                                                                         |
| `PMT016`    | Tax payment                                                                                            |
| `PMT017`    | Transportation fees for goods                                                                          |
| `PMT018`    | Construction costs/expenses                                                                            |
| `PMT019`    | Insurance premium                                                                                      |
| `PMT020`    | General goods trades (offline)                                                                         |
| `PMT021`    | Insurance claims payment                                                                               |
| `PMT022`    | Remittance payments to friends or family                                                               |
| `PMT023`    | Education-related student expenses                                                                     |
| `PMT024`    | Medical treatment                                                                                      |
| `PMT025`    | Donations                                                                                              |
| `PMT026`    | Mutual fund investment                                                                                 |
| `PMT027`    | Currency exchange                                                                                      |
| `PMT028`    | Advance payments for goods                                                                             |
| `PMT029`    | Merchant settlement                                                                                    |
| `PMT030`    | Repatriation fund settlement                                                                           |

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Magic Values for Testing

You can use specific values when you create a payment on testnet to get the CPN
API to return certain statuses. These magic values can be useful to test how
your integration handles specific states and situations of payments. Magic
values can be used in the sandbox environment.

The following sections outline the magic values you can pass to the sandbox API
and the effect that they have on the response from the API.

<Note>
  **Note:** All of the magic values listed in the following sections are case
  sensitive. The specified field must be set to the exact value in the table in
  order for them to work.
</Note>

## Create payment

You can test payments by providing magic values on the `ORIGINATOR_NAME` field
when making requests to the
[create a payment endpoint](/api-reference/cpn/cpn-platform/create-payment). The
following table outlines the magic values and their effects on the payment
response:

| Magic value                          | Response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Failed`                             | Synchronous payment failure. Payment is returned with the `FAILED` status in the synchronous response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `AsyncFailed`                        | Asynchronous payment failure. Payment is returned with the `CREATED` status in the synchronous response, followed by a webhook that updates the payment to the `FAILED` status.                                                                                                                                                                                                                                                                                                                                                                                               |
| `AsyncSuccess`                       | Asynchronous payment success. Payment is returned with the `CREATED` status in the synchronous response, followed by a webhook that updates the payment to the `CRYPTO_FUNDS_PENDING` status.                                                                                                                                                                                                                                                                                                                                                                                 |
| `CreateRfi`                          | Payment is returned with an active level 1 RFI in the synchronous response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `CreateRfiL2`                        | Payment is returned with an active level 2 RFI in the synchronous response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `CreateRfiL3`                        | Payment is returned with an active level 3 RFI in the synchronous response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `AsyncRfi`                           | Payment is returned with the `CREATED` status in the synchronous response, followed by a webhook that creates an RFI on the payment.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `Delayed`                            | Payment is returned with the `CRYPTO_FUNDS_PENDING` status in the synchronous response. After an onchain transaction is received and after the `FIAT_PAYMENT_INITIATED` notification occurs, the fiat settlement time on the payment increases and a payment delayed webhook notifications is sent. The `COMPLETED` webhook is delayed by a few seconds.                                                                                                                                                                                                                      |
| `Expired`                            | Payment is returned with the `CRYPTO_FUNDS_PENDING` status in the synchronous response. After a few seconds the payment status is updated to `FAILED` with the reason `PAYMENT_EXPIRED`.                                                                                                                                                                                                                                                                                                                                                                                      |
| `FailThenRefundWithCompleted`        | Payment is returned with the `CRYPTO_FUNDS_PENDING` status in the synchronous response. After an onchain transaction is received and after the `FIAT_PAYMENT_INITATED` notification occurs, the payment is moved to a `FAILED` state and a refund with the `COMPLETED` status is added to the payment.<br /><br />Using this magic value just fails the payment and sends the refund notification. It does not send the funds from the onchain transaction back. The `txHash` returned in the sandbox environment is a randomly generated transaction hash.                   |
| `FailThenRefundCreatedThenFailed`    | Payment is returned with the `CRYPTO_FUNDS_PENDING` status in the synchronous response. After an onchain transaction is received, a `FIAT_PAYMENT_INITIATED` notification occurs, and the payment is moved to a `FAILED` state. A refund with the `CREATED` status is added to the payment, followed by a webhook that updates the refund to the `FAILED` state.<br /><br />This magic value simulates a scenario where the payment fails and an attempt to issue a refund is made, but the refund also fails, for example due to a downstream system error.                  |
| `FailThenRefundCreatedThenCompleted` | Payment is returned with the `CRYPTO_FUNDS_PENDING` status in the synchronous response. After an onchain transaction is received, a `FIAT_PAYMENT_INITIATED` notification occurs, and the payment is moved to a `FAILED` state. A refund with the `CREATED` status is added to the payment, followed by a webhook that updates the refund to the `COMPLETED` state.<br /><br />This value simulates a successful refund process after a failed payment. The original onchain funds are still not returned to the sender. The `txHash` used for testnet is randomly generated. |

## Submit RFI

You can test RFIs by providing magic values on the `NAME` field when making
requests to the [submit RFI data](/api-reference/cpn/cpn-platform/submit-rfi)
endpoint. The following table outlines the magic values and their effects on the
RFI response:

| Magic value | Response                                        |
| ----------- | ----------------------------------------------- |
| `InReview`  | Stuck RFI. RFI stays in the `IN_REVIEW` status. |
| `Rejected`  | RFI is rejected.                                |

<Note>
  **Note:** Any value in the `NAME` field besides the values in the table
  results in an approved RFI.
</Note>

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Postman API Suite

> Use Circle's Postman collection to send API requests and try CPN APIs.

Circle's Postman collection provides template requests to help you learn about
the Circle Payments Network APIs. These requests run on Postman, an API platform
for learning, building, and using APIs. The Postman CPN workspace includes a
collection that matches the organization of the
[API References](/api-reference/cpn/cpn-platform/get-payment-configurations-overview).

## Run in Postman

To use the Postman collection, click the **Run in Postman** link below. You can
fork the collection to your workspace, view the collection in the public
workspace, or import the collection into Postman.

* **Fork**: Creates a copy of the collection while maintaining a link to the
  parent.
* **View**: Allows you to quickly try out the API without importing anything
  into your Postman suite.
* **Import**: Creates a copy of the collection but does not maintain a link to
  Circle's copy.

| Collection | Link                                                                                                                                                                                                                                                                                                             |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPN        | [Run in Postman](https://app.getpostman.com/run-collection/18225688-f1682adb-ab23-4e2d-b21d-a3562d879e5f?action=collection%2Ffork\&source=rip_markdown\&collection-url=entityId%3D18225688-f1682adb-ab23-4e2d-b21d-a3562d879e5f%26entityType%3Dcollection%26workspaceId%3D5d277774-3b09-4e2b-91f5-4253c25a48d0k) |

<Info>
  **Authorization**

  To authorize your session, use Circle's Postman variable `apiKey` and add your
  API key to the `environment` or `collection` variables. See Postman's
  [using variables](https://learning.postman.com/docs/sending-requests/variables/)
  for details.

  You can get an API key for CPN from the
  [CPN Console](https://cpn.circle.com/signin). Contact your Circle representative
  to get access to CPN.
</Info>


> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# How-to: Respond to an RFI

This guide explains how to respond to an RFI request that is system-initiated.
In a system-initiated RFI, you are notified either synchronously when a payment
is created, or asynchronously by an RFI webhook.

This guide doesn't cover how to respond to an RFI when it is initiated by a
support ticket. For RFIs initiated this way, you must follow the support ticket
workflow.

## Steps

When a system-initiated RFI is created by a BFI, you are notified in one of two
ways:

1. In the synchronous response to the payment creation endpoint. When you create
   a payment, the endpoint responds with the created payment record containing a
   non-null `activeRfi` field.
2. Asynchronously by an RFI webhook. This can occur at any time in the payment
   flow after the payment is created. The RFI webhook doesn't contain the entire
   RFI object.

Once you have the full RFI object, you can use the following steps to respond to
the RFI.

### Step 1: Get the RFI requirements and certificate

Before you respond to an RFI, you need to get the requirements and the
certificate used for encrypting RFI responses.

The RFI requirements are available in the RFI object. If the RFI was created
synchronously, the full object is included in the `activeRfi` field of the
payment object. If the RFI was created asynchronously, you must retrieve the
full object using the
[get details for an RFI endpoint](/api-reference/cpn/cpn-platform/get-rfi). The
following is an example RFI object:

```json JSON theme={null}
{
  "id": "48dfd36c-cf6c-4d9d-b065-69bdbe9bfea1",
  "paymentId": "90dfd86c-cf6c-4d9d-b065-69bdbe9bfec8",
  "status": "INFORMATION_REQUIRED",
  "level": "LEVEL_1",
  "expireDate": "2025-01-28T19:41:33.076Z",
  "fieldRequirements": {
    "version": 1,
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "RFI Requirements",
      "type": "object",
      "description": "RFI Requirements",
      "properties": {
        "DATE_OF_BIRTH": {
          "description": "Individual's date of birth (YYYY-MM-DD)",
          "type": "string"
        },
        "NAME": {
          "description": "Individual's full name",
          "type": "string"
        }
      },
      "required": ["NAME", "DATE_OF_BIRTH"]
    }
  },
  "fileRequirements": [
    {
      "fileName": "PROOF_OF_ADDRESS",
      "required": false
    },
    {
      "fileName": "ORG_STRUCTURE",
      "required": false
    }
  ],
  "certificate": {
    "id": "0cc3c5fe-fa88-4e79-b5eb-1c5194a19b08",
    "certPem": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tTUlJQmpUQ0NBVE9nQXdJQkFnSVVMaWk2Mk5KME0rdTZOTDZWV0hWRkhIZmJCWUl3Q2dZSUtvWkl6ajBFQXdJd0tqRVhNQlVHQTFVRUF3d09ZWEJwTG1OcGNtTnNaUzVqYjIweER6QU5CZ05WQkFvTUJrTnBjbU5zWlRBZUZ3MHlOVEF6TVRjeU1EQXdNVFJhRncweU5qQXpNVGN5TURBd01UUmFNQ294RnpBVkJnTlZCQU1NRG1Gd2FTNWphWEpqYkdVdVkyOXRNUTh3RFFZRFZRUUtEQVpEYVhKamJHVXdXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBUmgyTTU0Q2FVMTlaWFRFaXZJVUNLOXluMmgvYld6Uno0bUhJWVE0ZzFYWnArdHRiM3Z6bGY2ZDQzYUhNYlRaQUpPTG1pbkdFZGwxbUZMdFRUTXdYb3ZvemN3TlRBekJnTlZIUkVFTERBcWdnNWhjR2t1WTJseVkyeGxMbU52YllJU2QzZDNMbUZ3YVM1amFYSmpiR1V1WTI5dGh3UUtBQUFCTUFvR0NDcUdTTTQ5QkFNQ0EwZ0FNRVVDSUExbksrNUxBUC9ueUlxRFlUaVVLYmlHNWYwTjVPUmFMb2Y1VXpXU0dsUEJBaUVBaEVOcDFxakRydG41aGFpMHdKeTNORzJKZ2xra084Y1QzellhN21mRTBiST0tLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0t",
    "domain": "api.circle.com",
    "jwk": {
      "kty": "EC",
      "crv": "P-256",
      "kid": "263521881931753643998528753619816524468853605762",
      "x": "YdjOeAmlNfWV0xIryFAivcp9of21s0c-JhyGEOINV2Y",
      "y": "n621ve_OV_p3jdocxtNkAk4uaKcYR2XWYUu1NMzBei8"
    }
  }
}
```

### Step 2: Create the RFI response

You must provide all of the fields that are marked as required. Circle
recommends providing the fields marked as optional for the highest likelihood of
an approved RFI. If you do not have the requested information about the sender,
you should request it.

Once you have all of the required information, you can create the RFI response.
Format it into the appropriate JSON format, based on the schema provided in the
`fieldRequirements` parameter.

Before encrypting and sending the response, you should validate the JSON
response object against the JSON schema. See
[How-to: Integrate with JSON Schema](/cpn/guides/payments/integrate-with-json-schema)
for more information.

The following is an example RFI response:

```json JSON theme={null}
{
  "ADDRESS": {
    "city": "San Francisco",
    "country": "US",
    "postalCode": "94105",
    "stateProvince": "CA",
    "street": "123 Market Street"
  },
  "NAME": "Alice Johnson",
  "DATE_OF_BIRTH": "1990-10-10",
  "NATIONAL_IDENTIFICATION_NUMBER": "12-9483432",
  "SOURCE_OF_FUNDS": "Company revenue",
  "METHOD_OF_VERIFICATION": "Electronic"
}
```

### Step 3: Encrypt the RFI response

The RFI response must be encrypted before it is sent to the BFI. It is encrypted
in the same manner as the travel rule and beneficiary account data. For a full
guide on the encryption process, see
[How-to: Encrypt Travel Rule and Beneficiary Account Data](/cpn/guides/payments/encrypt-travel-rule-beneficiary-data).

### Step 4: Submit the RFI response

Submit the encrypted RFI response with the
[submit RFI data endpoint](/api-reference/cpn/cpn-platform/submit-rfi) . The
request should include the encrypted data and the version of the RFI JSON
Schema. The version should match the version in the `fieldRequirements`
parameter of the RFI object. An example request body is shown below:

```json JSON theme={null}
{
  "rfi": {
    "version": 1,
    "data": "eyJhbGciOiJFQ0RILUVTK0ExMjhLVyIsImVuYyI6IkExMjhHQ00iLCJlcGsiOnsiY3J2IjoiUC0yNTYiLCJrdHkiOiJFQyIsIngiOiJ4ZzFRelVtaFRGdWV0Ti1Qd0N5dzdfRXd4SldKdk9ZTTFRLTNBRXFxZHdzIiwieSI6IjA0Z0dFMEsyT2ttVVZTMlhFUXZvR2hBUkJLWHQyWGRDRnRDNXpRMjQ3ajQifX0.Zaev1iHNNwG9_x0l3nwBcYlWBmlW9fP3.fmd2QQL_xKswDntW.1lYKjSoBZ_j7SKH4Q-kV8Zajcurh_zow1_e07zegfDNNEQ3DhsURPrjhDhyngtBe86T-WmDBM20j_1aChh1xwOS2vgKc-Kcv_4cNUzz0398ngYf2_xkEfvVckEexpX84omj5lmfqa0aleIQGldUVSuVV8fBl4YnH2oik5kDgvvQ4ap4MYhSTRqYJsi0bm6col7buPhnQJpojAjpp3ttoCYuOxbuDs5V_eNLIGuHPxF9KK7hS-l0qjLnNPcTnCbLL_fIveButXOzU54qB6lLssrE86O4xCH_d47_PAtaxJ296qtjGIB02dLSlrnORbVnvjrn17dhf8DmhkMy5GmFgtTs.TcOP8NKlgtgEaakORE1lXQ"
  }
}
```

### Step 5: Upload required files

If the RFI includes a `fileRequirements` field, you must upload documentation
about the sender in addition to submitting the RFI response. Files must be
encrypted and uploaded one at a time to the
[upload RFI file endpoint](/api-reference/cpn/cpn-platform/upload-rfi-file). You
can upload files before or after submitting the RFI response, as long as it is
before the RFI decision is made.

See
[How-to: Encrypt Files for RFI Transmission](/cpn/guides/payments/encrypt-files)
for more information on how to encrypt files.

The [upload RFI file endpoint](/api-reference/cpn/cpn-platform/upload-rfi-file)
accepts a `multipart/form-data` request body in three parts. The request body
should include the encrypted file, the encryption details, and the file
metadata. The file metadata should include the filename, file type, and file
key. The file key should match the `fileKey` in the `fileRequirements` field of
the RFI object.

The following is an example request body:

```text Text theme={null}
------WebKitFormBoundary
Content-Disposition: form-data; name="fileMetadata"
Content-Type: application/json

{
 "fileName": "example.pdf",
 "fileType": "application/pdf",
 "fileKey": "PROOF_OF_ADDRESS"
}

------WebKitFormBoundary
Content-Disposition: form-data; name="encryption"
Content-Type: application/json

{
 "encryptedAesKey": "<base64-encoded-encrypted-aes-key>",
 "iv": "<base64-encoded-iv-for-file-encryption>"}

------WebKitFormBoundary
Content-Disposition: form-data; name="encryptedFile"; filename="encrypted_data.bin"
Content-Type: application/octet-stream

[BINARY FILE DATA]
```

Once you submit the RFI response, you receive the decision on the RFI via
webhook. If the BFI approves the RFI, you can continue with the payment, or
create a new payment for the sender if the existing payment has expired.

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Request Payment Configurations and Routes

You can use the API to discover which corridors, currencies, and payment methods
are available. Retrieving this information and handling it in your integration
allows you to show your users the available sources and destinations for funds
in CPN.

## Steps

Use the following steps to request CPN configuration overview, and get the
available routes from country to country.

### Step 1: Request configuration overview

Make a request to the
[configurations overview endpoint](/api-reference/cpn/cpn-platform/get-payment-configurations-overview)
to receive a list of supported currencies, countries, payment methods, and
blockchains.

```shell Shell theme={null}
curl -H "Authorization: Bearer ${YOUR_API_KEY}" \
  -X GET https://api.circle.com/v1/cpn/v1/ofi/configurations/overview
```

**Response**

```json JSON theme={null}
{
  "data": {
    "sourceCurrencies": ["USDC"],
    "destinationCountries": ["BR", "HK", "MX", "NG", "US"],
    "destinationCurrencies": ["BRL", "HKD", "MXN", "NGN", "USD"],
    "paymentMethodTypes": [
      "ACH-BANK-TRANSFER",
      "BANK-TRANSFER",
      "CHATS",
      "FPS",
      "PIX",
      "SPEI",
      "WIRE"
    ],
    "blockchains": ["ETH-SEPOLIA", "MATIC-AMOY", "SOL-DEVNET"]
  }
}
```

### Step 2: Request available route details

Evaluate the available route details for a specific transfer by making a request
to the
[supported payment routes endpoint](/api-reference/cpn/cpn-platform/list-routes).
This example evaluates a route from the US to Mexico, but other routes can be
evaluated by changing the query parameters. The endpoint accepts an optional
`transactionVersion` query param (`VERSION_1`, `VERSION_2`); with `VERSION_2`, a
chain-specific buffer is added to the crypto min limit to cover fees (for
example, gas fee), paid in USDC from the source amount.

```shell Shell theme={null}
curl -H "Authorization: Bearer ${YOUR_API_KEY}" \
  -X GET https://api.circle.com/v1/cpn/v1/ofi/configurations/routes?sourceCurrency=USDC&destinationCountry=MX
```

**Response**

```json JSON theme={null}
{
  "data": [
    {
      "destinationCurrency": "MXN",
      "paymentMethodType": "SPEI",
      "blockchain": "ETH-SEPOLIA",
      "fiatLimit": {
        "min": "168",
        "max": "837500",
        "currency": "MXN"
      },
      "cryptoLimit": {
        "min": "8.34",
        "max": "41552.14",
        "currency": "USDC"
      }
    }
  ]
}
```
> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Integrate with JSON Schema

To facilitate the effective passing of RFI data, CPN provides
[JSON Schema](/cpn/concepts/api/json-schema) that gives a clear,
machine-readable contract you can validate your response against. This guide
provides information about how to integrate with the JSON Schema returned by the
[get details for an RFI endpoint](/api-reference/cpn/cpn-platform/get-rfi).

## Steps

Use the following steps to retrieve JSON Schema for a given quote and respond
with the required information.

### Step 1: Get the JSON Schema

Call the [get details for an RFI](/api-reference/cpn/cpn-platform/get-rfi)
endpoint. The API returns a JSON Schema object that defines the fields that must
be transmitted in the RFI response.

### Step 2: Build a JSON response

Using the schema as a blueprint, construct your RFI data as a JSON object. For
example, if the schema requires the `address` field, you should create a nested
JSON object for the address, as defined by the `properties` and `$defs` in the
schema.

### Step 3: Validate the response

Before encrypting the response for transit, CPN expects that you perform
client-side validation on the data. Using a JSON Schema validation library,
check your constructed JSON objects against the schemas from Step 1. This should
catch any structural or formatting errors before you interact with the CPN API.

### Step 4: Encrypt the response

Once validated, convert your JSON objects to strings and encrypt them. The steps
outlined in
[How-to: Encrypt Travel Rule and Beneficiary Account Data](/cpn/guides/payments/encrypt-travel-rule-beneficiary-data)
also apply to encrypting RFI data for transit.

### Step 5: Transmit the payload

Send the encrypted payload to the
[submit RFI data endpoint](/api-reference/cpn/cpn-platform/submit-rfi).

The following is an example payload:

```json JSON theme={null}
{
  "rfi": {
    "version": 1,
    "data": "eyJhbGciOiJFQ0RILUVTK0ExMjhLVyIsImVuYyI6IkExMjhHQ00iLCJlcGsiOnsiY3J2IjoiUC0yNTYiLCJrdHkiOiJFQyIsIngiOiI1TEtTbUtsNmVYV0dQNHlGb2tVaks4RGppU0l5YWpQdzJ6UUp1YVhFbEZzIiwieSI6IlRVT29MTV8wc294b0UzYVFmSExlUzRlRkZ3RU9tZ1VDRUh1eDVRMXdVYTQifX0.kVGnfB8eIqxq3bMvhedxUmZvkCrRfQOy.bTUOc_ilvZjb9VYP.pOS6Ul8Jnp_pijWtaQYC0b1NLN1Nc-t_MTsfj5EZy6s62ijQWGtAoo3enwx3gOpXIQDIIF7c-F3KSrVO33a5RIF8a4tvU7pRk_JDKVgHFVpSzvOaUHNHsMUvvctAncx1SneVE_gnm5ATkWO4_1i7irTkb-cjWLmvJ1vVEyJiC9ZgsEdK_eBAewpZTyyKxvoxBpo8IZ3g7qax712TvMsNpIJ_faQmsyRKwt2kBxDPyrWILcIvS1qij6uVOsEP2R6LXbWfBqVbklsgNPWjndXSmOJmsTdBjFzublMLSHmLxkfaD9gt3DxgD16rqDlKO9KmaRF3r322VumP4hrlfOsZUHHcVGeTpgjZwI9jrj76PiYtyCOeR7-kz97PamqrOQAfWRE8Rcp8QdCO6yFHFe3N2pI5kWakH783DVDAsm_x2VY_V8vCDe-xkIoJOabx3LqaxHq8_x_ATXZ01NX-5F9VqgtE73FOIGhinxt8G-Kfxvdlx6gv-QSfBvigVuoR1OCSPNB3OHirEKXY3IjWnjZuENNnXl9CqrCsHQZS1eb1KcaIkg_2NF6gi54htX6ijpUtyXS03IGZW6Bn6CSWqmmvMStIAIYO-8ZJrrleeCfU6WY5KjFlIvN6th-tE41JNJWS9mVqhjzwPC7GQ5bGkqq2zJKhALOuN_0oG4jXOYo1s3YAn-xw3kpq46fYyUrX4nLSocaKDeKOMMqh57_jcMDmHrXdmjlHGPMrBPdU_deub121c3ofTKgJg4KRC8mcTYcXe71uflARAr24msd9A_IPPVbhfvs06HOVKL2-jK6r_WL_9vWU3q-OPQHU3eWUOhI18vZ0CkGqJjtEKyBBmc4inWEbrsO02P2Zd5VTBCIoAaNrpY6n5mNyKPo6-PyrxNy27d6u2yoZvjG6QSuUO9DaX4AyGsE87agh_XgLW9RPXfcZQ7F5aUCQwEA0cF9YSEaYYBGziS7oQ99D1th1MQqEPcFxD5YPdyaPykU3Zbf5T8HSZz1risMbgQu97eXoarxm801pdw5cuKijqj39BVrgdLUfaQ9P-iGWcVJk8ZVXfHK3JHGaBuIjYNIy5lHF3TsKgV2x-wWxqER9vPdgejAGirkxHQaKPt2rg0rmbk3R7YTibT7yTKwO1PRiewi0lxKWvZqDbCoedyuYZCR0vup4S1ZVYX6uGBn-F5ODrnLoAZTbnV1tjDJgxFpA8EKsXWTrc78XH0715lY2OnbDtBOLMbxFJjK1_YDRU2UMkZTEx5BrhR4YibBd4-BCZT-dWTxanOHMxTKl823tyggY5lBQ8DlsLj1qZpOxKWYTM8WrLCZa7vZo9FmXw38FxYrqbwespe7xdS7onfmlI4Ug92eTtZ31FbZfcqOiAGgH9Etkj1M9scP0is6zVC6cIUQzC3NmHNxNtPv6XjMUWigijosvs7x9-qyVCqzJZlEGck2BJ6Uk7ug9QKcxHtaWgtuHPnA77KVE3Vi_dikYaXzxIdgjrGtqqUhXEhrAFkesvJ0UeH1ac94e-R8UrJX75w4DDoRyaFxQhDFdHVtD0ceVN7ekYJkmoS2eSAzWDwsKUvUrmafcfpQ922tZGq0RvnMh39SWy6I6xRFyYHarra24Gbawa5_THjB8TkHJ180giPC3KQAa_6Vz8CP-fks6_-MdGXPW0SYhNghNi_14ZXQ3rZYHaTICgeHhBfhJ4MQ6OlRkiRCrIkM5WSOTS_H715aeyUCL-dlZ0TiG2DpAIXkN1KMRp0jL_W12pg5SjKFAlOGnQgkgj9rO_C7pLxMyIhgEUKPHXMGN6Q7tpVhAAyTl0tabd7cvyWnf5L4UiyIpvb1qrt1bY6-VNA4KXz6Y5uiiBYFF_FIN3K6YZCT4l0zuh_gxmP9eba7zM5kgas1tr1IxYWI-mQiE9Rb8rX0hqXpMj27h9Mf_Sn56TJeEmW8d8x2Xy2Nb7KU9vQO-6uc_taXP0Lv5LFcSwZkdVe7FOeZD-GoaNDly9MdhXI4ELP4MOZXZFJeN7aCJvJeLRBPWnoM2aazDwtlA_KfhZVFtCsKKjJazv6J9h6CDHAm7NuexVJiPdtS1yknQDWrIBfneaLJasmtuhuAbRPtiTvvhQOXt51q0G7sjCSmmeNMwb5fFphe4wLJNmsbdgMFDcUVzb0ImIArCxqBEEK8uuRGcYaRifaLv0zkk29NAT99Ux580zaeN_x7aIMpJTt7jLP0-HZ-QU3MAGg3PLJ3_Oly6ABoULkEkmRhF0TtpU8z-kmmN6FtmzZK74kYEC75smgVTnnJK1kBdsZw9cxHeUx8aDJGrS3OK-uYN0dPJls2LC7X1rHD7ES179nPVBeJA2REm-jSlhVlV_I7JrVzlcXs0Fhx0hX-OgMKz_yQNHnM6RbgGnSLDcvND7vXqkEMgHeDRomhU1hMeu0DymctTKawtzIkV7MYwoibLDUeMvaXN8MicMs64D8I3Ld7BLtFf9o8rMeeNJ0Om7xdl9SGD2RYAep0cxw2rEIIr859e1vutBuvrrMz09dZKd05t1lu0jRztkQzUW9N-VZh9muTAoh_s3NrF2ZTFnRAfzxohwNLxxmX-Ov94FXBhuRHBQXb931I5m2URglrYcoAZ8RFoiAWW2AkHcyb5PRoQIt-LQhOM-bcn1VB44Okh10jqWpGbLno6AvE5FcoRVcspb0tor9EbksW2cipoypcaat5NhQgvo2rAPmkHGi8iB-z_xWORvUkaA2xknNW59myO6qTvjYQ_1P1ESbRO30nUeqgP3VoZrC1-bi9IbgSi-na31xEhdr-ZGuvtRSzyhWwqfviJgSMZ6_kkGW3gUI4ldurTwss6gDHWYmdV-lHtPMfYuD2KMQk1EyJ-3vZx0syLKDACL37HqAYvkW5GiOxrK9cNrSInQ8rZMDkXsaCZMEtvs03Qw2DyCBdoFeXPvFHJ6Vetou-7Oo6rdlmSkt5KdA-w9KKVIAt9WtYxNc-wjFm-vOMcOHb_xxzacDzYFJj8NxdW8GaVdrCvh3j5Yakr_3vSvRM5rpzQKMqw-B53SWV3oOHYu29qso5zSTz-dvAlZUL8Z1a3s13qdwhUkkRexIi6oTU0Da21pT-gCan2jSY_VKR8JdirKTLocn74JZ3InF8iH8XhOD0X7ySIbB69HqMLYRd9r13q2odfJ3cN1CWSF71zgIuZoYSbkO9DeFvCImA-WEIWrP1kJiYlpJi8VnFNQs8XWIxdCydft-8zvoXZbi0MoNt3kJExbKx7dReHx6B-6iwjuW8-o5RbeMvdTIYTp-y6YPsFhcVCvTlS7IefXqG4G3OrnNc5JIVnvdYXWCWUdWguiKdqB6FL_LSWOtsWrB6nIv69WP1WJJSa0Oa_EkxEwXK1BGH9-QpMqkP6rATSvsbaTywfCxqUqm7SzYH81lSCIvI5J7bWX5blk9rNZbp3aSeEpVRm03vwLrgUHLv9vMAopNnw5fZGKfcg3I5ZWYHNQo5BZk9LVpebMBYGijwNDnuFu08eF7ShlEzy50NsvgeDxZtfUVx8cviYn0MoTJBPlz1mXRSIr3zDIpefxDGnsQ1KK8LTi0Gbnt_ybeiT4yTmajrPLE4566D6AQIdDmCg_RsBtB_lAw.S2qu0MNMu2WNiEYoHh25ww"
  }
}
```
> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# How-to: Encrypt Travel Rule and Beneficiary Data

This guide explains how to set up encryption and decryption between an OFI and a
BFI so that messages can be passed securely during payment flow. CPN uses
[JSON Web Encryption](https://datatracker.ietf.org/doc/html/rfc7516) (JWE) for
encrypting data in a secure and compact manner. This encryption is implemented
after a quote is accepted: the JWK data and public key for encryption are shared
in the quote response. The encryption is also used when communicating RFI data.

Both OFI and BFI can implement this encryption system in any programming
language that supports the required primitives. This encryption scheme is
required when performing the following tasks in CPN:

* **Creating a payment**: for encrypting the travel rule and beneficiary account
  data
* **Submitting an RFI**: for encrypting the RFI JSON response

<Note>
  **Note:** If your RFI response includes a file, that file is
  [encrypted in a different manner](/cpn/guides/payments/encrypt-files).
</Note>

Regardless of the language used to implement the encryption, the following
parameters must be followed:

* Key agreement: ECDH-ES+A128KW
* Encryption method: A128-GCM

## Steps

The following sections describe the steps necessary to encrypt a message sent
from an OFI to a BFI. Note that this example uses beneficiary account data and
travel rule data, but the same encryption scheme applies for RFI data as well.

### Step 1: Retrieve the certificate from the quote response

Quote responses include a certificate field with required parameters to
establish encryption with the BFI. A sample (truncated) quote response is below:

```json JSON theme={null}
{
  "data": [
    {
      "id": "6e4c7e85-39eb-4411-8c4a-683ff73846d6",
      "paymentMethodType": "FPS",
      "blockchain": "MATIC-AMOY",
      "senderCountry": "US",
      "destinationCountry": "HK",
      "certificate": {
        "id": "0cc3c5fe-fa88-4e79-b5eb-1c5194a19b08",
        "certPem": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tTUlJQmpUQ0NBVE9nQXdJQkFnSVVMaWk2Mk5KME0rdTZOTDZWV0hWRkhIZmJCWUl3Q2dZSUtvWkl6ajBFQXdJd0tqRVhNQlVHQTFVRUF3d09ZWEJwTG1OcGNtTnNaUzVqYjIweER6QU5CZ05WQkFvTUJrTnBjbU5zWlRBZUZ3MHlOVEF6TVRjeU1EQXdNVFJhRncweU5qQXpNVGN5TURBd01UUmFNQ294RnpBVkJnTlZCQU1NRG1Gd2FTNWphWEpqYkdVdVkyOXRNUTh3RFFZRFZRUUtEQVpEYVhKamJHVXdXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBUmgyTTU0Q2FVMTlaWFRFaXZJVUNLOXluMmgvYld6Uno0bUhJWVE0ZzFYWnArdHRiM3Z6bGY2ZDQzYUhNYlRaQUpPTG1pbkdFZGwxbUZMdFRUTXdYb3ZvemN3TlRBekJnTlZIUkVFTERBcWdnNWhjR2t1WTJseVkyeGxMbU52YllJU2QzZDNMbUZ3YVM1amFYSmpiR1V1WTI5dGh3UUtBQUFCTUFvR0NDcUdTTTQ5QkFNQ0EwZ0FNRVVDSUExbksrNUxBUC9ueUlxRFlUaVVLYmlHNWYwTjVPUmFMb2Y1VXpXU0dsUEJBaUVBaEVOcDFxakRydG41aGFpMHdKeTNORzJKZ2xra084Y1QzellhN21mRTBiST0tLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0t",
        "domain": "api.circle.com",
        "jwk": {
          "kty": "EC",
          "crv": "P-256",
          "kid": "263521881931753643998528753619816524468853605762",
          "x": "YdjOeAmlNfWV0xIryFAivcp9of21s0c-JhyGEOINV2Y",
          "y": "n621ve_OV_p3jdocxtNkAk4uaKcYR2XWYUu1NMzBei8"
        }
      }
    }
  ]
}
```

### Step 2: Verify the certificate

<Note>
  **This step is only possible in the production environment. It will fail in the
  sandbox environment.**

  This step is strictly optional, however it is recommended as a best practice to
  verify that the certificate is valid.
</Note>

From the `certificate` object in the quote response, extract the `base64`
encoded format of the certificate from the `certPem` field, decode it, and
verify the following:

* The certificate is not expired
* The certificate is signed by a Circle-approved Certificate Authority listed in
  the Circle-provided CA bundle file
* The common name of the certificate is for a CPN BFI and matches the `domain`
  field in the response
* The verifiable public key of the certificate matches the `jwk` field in the
  response

```java Java theme={null}
public static void verify() throws Exception {
    // Assume the API response is stored in a file "response.json"
    String responseStr = new String(Files.readAllBytes(Paths.get("response.json")));
    JSONObject response = new JSONObject(responseStr);
    JSONObject certObj = response.getJSONArray("data").getJSONObject(0).getJSONObject("certificate");

    String caBundlePath = "ca_bundle.pem"; // CA bundle file provided by Circle

    // ---------- 1. Check certificate expiration ----------
    String certPemB64 = certObj.getString("certPem");
    byte[] pemData = Base64.getDecoder().decode(certPemB64);
    CertificateFactory cf = CertificateFactory.getInstance("X.509");
    InputStream in = new ByteArrayInputStream(pemData);
    X509Certificate certificate = (X509Certificate) cf.generateCertificate(in);
    Date expirationDate = certificate.getNotAfter();
    Date currentDate = new Date();
    if (currentDate.after(expirationDate)) {
        System.out.println("❌ Certificate has expired on " + expirationDate);
        System.exit(1);
    } else {
        System.out.println("✅ Certificate is valid until " + expirationDate);
    }

    // ---------- 2. Verify that the certificate was signed by a Circle approved CA ----------
    List<X509Certificate> caCerts = loadCABundle(caBundlePath);
    boolean trusted = false;
    for (X509Certificate caCert : caCerts) {
        if (certificate.getIssuerX500Principal().equals(caCert.getSubjectX500Principal())) {
            trusted = true;
            System.out.println("✅ Certificate is signed by trusted CA: " + caCert.getSubjectX500Principal());
            break;
        }
    }
    if (!trusted) {
        System.out.println("❌ Certificate verification failed. CA is not trusted.");
        System.exit(1);
    }

    // ---------- 3. Verify that the certificate's common name (CN) matches the expected domain ----------
    String certCN = getCommonName(certificate);
    String expectedDomain = certObj.getString("domain");
    if (certCN != null && certCN.equals(expectedDomain)) {
        System.out.println("✅ Certificate common name matches expected domain.");
    } else {
        System.out.println("❌ Certificate common name does not match expected domain.");
        System.exit(1);
    }

    // ---------- 4. Verify that the verifiable public key of the certificate is the same as the provided JWK ----------
    JSONObject providedJWK = certObj.getJSONObject("jwk");
    String xProvided = providedJWK.getString("x");
    String yProvided = providedJWK.getString("y");
    PublicKey pubKey = certificate.getPublicKey();
    if (pubKey instanceof ECPublicKey) {
        ECPublicKey ecPub = (ECPublicKey) pubKey;
        ECPoint point = ecPub.getW();
        String xCert = toBase64URL(point.getAffineX(), 32);
        String yCert = toBase64URL(point.getAffineY(), 32);
        if (xCert.equals(xProvided) && yCert.equals(yProvided)) {
            System.out.println("✅ Certificate public key matches provided JWK.");
        } else {
            System.out.println("❌ Certificate public key does not match provided JWK.");
            System.exit(1);
        }
    } else {
        System.out.println("❌ Certificate public key is not EC type.");
        System.exit(1);
    }
}
```

### Step 3: Extract and create the JWK

From the `certificate` field, extract the JWK parameters: `kty`, `crv`, `kid`,
`x`, `y` and create the JWK object in your code using a suitable library (for
example, Nimbus JOSE+JWT in Java).

```java Java theme={null}
import com.nimbusds.jose.jwk.JWK;

public static JWK parseJwkFromJson() throws ParseException {
    String jwkJson = """
        {
            "kty": "EC",
            "crv": "P-256",
            "kid": "263521881931753643998528753619816524468853605762",
            "x": "YdjOeAmlNfWV0xIryFAivcp9of21s0c-JhyGEOINV2Y",
            "y": "n621ve_OV_p3jdocxtNkAk4uaKcYR2XWYUu1NMzBei8"
        }
        """;

    JWK jwk = JWK.parse(jwkJson);

    return jwk;
}
```

### Step 4: Prepare the payload

Create the payload for travel rule data and beneficiary account data. Get the
required fields from the
[requirements endpoint](/api-reference/cpn/cpn-platform/get-payment-requirements)
and construct them to the correct format.

The correct format for travel rule data and beneficiary account data is a JSON
array of objects where each object contains two properties: `name` and `value`.
Whether an object is required to be present is defined by the `optional` field
in the object returned by the requirements endpoint.

An example of each is shown below:

**travelRuleData**

```json JSON theme={null}
[[
  {
    "name": "BENEFICIARY_ADDRESS",
    "value": {
      "city": "San Francisco",
      "country": "US",
      "postalCode": "94105",
      "stateProvince": "CA",
      "street": "123 Market Street"
    }
  },
  {
    "name": "BENEFICIARY_NAME",
    "value": "Alice Johnson"
  },
  {
    "name": "ORIGINATOR_ACCOUNT_NUMBER",
    "value": "9876543210"
  },
  {
    "name": "ORIGINATOR_ADDRESS",
    "value": {
      "city": "New York",
      "country": "US",
      "postalCode": "10001",
      "stateProvince": "NY",
      "street": "456 Madison Avenue"
    }
  },
  {
    "name": "ORIGINATOR_FINANCIAL_INSTITUTION_ADDRESS",
    "value": {
      "city": "Chicago",
      "country": "US",
      "postalCode": "60603",
      "stateProvince": "IL",
      "street": "789 Apple Drive"
    }
  },
  {
    "name": "ORIGINATOR_FINANCIAL_INSTITUTION_NAME",
    "value": "First National Bank"
  },
  {
    "name": "ORIGINATOR_NAME",
    "value": "Robert Smith"
  }
]
```

**beneficiaryAccountData**

```json JSON theme={null}
[
  {
    "name": "BANK_NAME",
    "value": "Test Bank"
  },
  {
    "name": "RECIPIENT_ADDRESS",
    "value": {
      "street": "123 Test St",
      "city": "Sacramento",
      "state": "CA"
    }
  },
  {
    "name": "RECIPIENT_CITY",
    "value": "Sacramento"
  }
]
```

### Step 5: Encrypt the payload

Convert the data from the previous step into a JSON string, then use the JWK to
encrypt it. Ensure that the following parameters are used:

* Algorithm: ECDH-ES+A128KW
* Encryption method: A128GCM

```java Java theme={null}
import com.nimbusds.jose.EncryptionMethod;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWEAlgorithm;
import com.nimbusds.jose.JWEEncrypter;
import com.nimbusds.jose.JWEHeader;
import com.nimbusds.jose.JWEObject;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.ECDHEncrypter;
import com.nimbusds.jose.jwk.JWK;


   /**
     * Encrypts a payload using JWE (JSON Web Encryption) with ECDH-ES key agreement.
     *
     * This method creates a JWE compact string with the provided payload and encrypts it using
     * the recipient's public key. The encryption algorithm used is ECDH-ES with AES-128 key wrap,
     * and the content encryption method is AES GCM with 128-bit key.
     *
     * @param <T> the type of the payload to encrypt
     * @param payload the data to be encrypted
     * @param recipientJwk the recipient's JWK (JSON Web Key) containing the public key for encryption
     * @return the serialized JWE in compact form
     * @throws JOSEException if an error occurs during the encryption process
     */
public static <T> String encrypt(T payload, JWK recipientJwk) throws JOSEException {
  String plainText = JsonUtils.toJson(payload);

  // Create the JWEHeader using ECDH_ES+AS128KW and AES-128-GCM
  JWEHeader header = new JWEHeader(
      JWEAlgorithm.ECDH_ES_A128KW,
      EncryptionMethod.A128GCM
  );

  // Create the JWE object with the payload to encrypt
  JWEObject jweObject = new JWEObject(
      header,
      new Payload(plainText)
  );

  // Create an encrypter with the recipient's public key
  JWEEncrypter encrypter = new ECDHEncrypter(recipientJwk.toECKey());

  // Encrypt the JWE
  jweObject.encrypt(encrypter);

// Return the serialized JWE string in compact form
  return new jweObject.serialize();
}
```

### Step 6: Send and verify the encrypted payload

Send the encrypted payload in the API request to
[create a payment](/api-reference/cpn/cpn-platform/create-payment). The
preceding example uses version 1 for `beneficiaryAccountData` and
`travelRuleData` fields.

The API returns a `200` response if the data is properly encrypted and can be
decrypted by the BFI, otherwise an
[encryption-related error code](/cpn/references/errors/error-codes#encryption)
is returned.

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Encrypt Files for RFI Transmission

This guide explains how to set up encryption and decryption between an OFI and a
BFI during the RFI process so that a file can be passed securely. This
encryption varies from the method used to encrypt JSON communications between
OFI and BFI, but shares some features. For compactness, files are encrypted
using AES, and then the key is encrypted using JWE. Both are then transmitted to
the BFI for a two-stage decryption process.

In the CPN system, the OFI encrypts a payload with a randomly generated AES key.
This key is then encrypted with the BFI's public key using
[JSON Web Encryption](https://datatracker.ietf.org/doc/html/rfc7516). The
encrypted AES key and encrypted file payload are transmitted to the BFI. The BFI
decrypts the AES key using their private JWK and uses it to decrypt the file
contents.

## Steps

The following sections describe the steps necessary to encrypt a file sent from
an OFI to a BFI through the RFI endpoint.

### Step 1: Generate a random 128-bit AES key

Using your chosen implementation language, generate a random 128-bit AES key for
AES-128-GCM encryption.

```java Java theme={null}
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;


/**
 * @return A SecretKey for AES encryption.
 * @throws GeneralSecurityException if the AES algorithm is not available.
 */
public static SecretKey generateAesKey() throws GeneralSecurityException {
  KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
  keyGenerator.init(128, new SecureRandom());
  return keyGenerator.generateKey();
}
```

### Step 2: Generate a 12-byte IV

Using your chosen implementation language, generate a 12-byte IV.

```java Java theme={null}
import java.security.SecureRandom;

/**
 * @return A 12-byte array containing the IV.
 */
public static byte[] generateIv() {
  byte[] iv = new byte[12];
  new SecureRandom().nextBytes(iv);
  return iv;
}
```

### Step 3: Encrypt the file contents

Encrypt the file contents using AES-128-GCM using the key and IV from the
previous steps.

```java Java theme={null}
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.security.GeneralSecurityException;


/**
 * @param plaintextPayload The raw data to encrypt.
 * @param aesKey The AES key to use for encryption.
 * @param iv The 12-byte Initialization Vector.
 * @return The encrypted data, including the GCM authentication tag.
 * @throws GeneralSecurityException if a cryptographic error occurs.
 */
public static byte[] encryptPayload(byte[] plaintextPayload, SecretKey aesKey, byte[] iv) throws GeneralSecurityException {
  Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
  GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(128, iv);
  cipher.init(Cipher.ENCRYPT_MODE, aesKey, gcmParameterSpec);
  return cipher.doFinal(plaintextPayload);
}
```

### Step 4: Encrypt the AES key

Using the JWK data from the quote response, encrypt the AES key that was used to
encrypt the file contents with the following parameters using JWE:

* Algorithm: ECDH-ES+A128KW
* Encryption method: A128GCM

```java Java theme={null}
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.EncryptionMethod;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWEAlgorithm;
import com.nimbusds.jose.JWEEncrypter;
import com.nimbusds.jose.JWEHeader;
import com.nimbusds.jose.JWEObject;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.ECDHEncrypter;
import java.util.Base64;
import javax.crypto.SecretKey;
import java.security.interfaces.ECPublicKey;

   /**
    * @param aesKey The AES key to wrap.
    * @param bfiPublicKey The recipient's Elliptic Curve public key.
    * @return A compact, serialized JWE string representing the encrypted key.
    * @throws JOSEException if an error occurs during JWE creation or encryption.
    */
   public static String wrapAesKey(SecretKey aesKey, ECPublicKey bfiPublicKey) throws JOSEException {
  // Create the JWEHeader using ECDH_ES+AS128KW and AES-128-GCM
        JWEHeader header = new JWEHeader(
            JWEAlgorithm.ECDH_ES_A128KW,
            EncryptionMethod.A128GCM
        );

    // Base64 encode the AES key and wrap in JSON string
       String base64AesKey = Base64.getEncoder().encodeToString(aesKey.getEncoded());
       ObjectMapper objectMapper = new ObjectMapper();
       String jsonPayload = objectMapper.writeValueAsString(base64AesKey);

       Payload jwePayload = new Payload(jsonPayload);
       JWEObject jweObject = new JWEObject(header, jwePayload);
       JWEEncrypter encrypter = new ECDHEncrypter(bfiPublicKey);
       jweObject.encrypt(encrypter);
       return jweObject.serialize();
   }
```

### Step 5: Transmit the encrypted payload

After performing the encryption steps from the previous steps, you should have
three components:

* The AES-encrypted file content
* The JWE string containing the encrypted AES key
* The base64-encoded 12-byte IV

Use these components to create a `multipart/form-data` request to the
[upload RFI file endpoint](/api-reference/cpn/cpn-platform/upload-rfi-file). A
`200` response from the API indicates that the encryption was performed
correctly and the BFI can decrypt the file's contents.

<Warning>
  **Important:** Don't manually set the `Content-Type` header. Let your HTTP
  client library set it automatically. The header must include a boundary
  parameter like:

  ```text Text theme={null}
  Content-Type: multipart/form-data; boundary=----WebKitFormBoundary
  ```

  If you manually set `Content-Type: multipart/form-data`, the request will fail.
</Warning>

```java Java theme={null}
import okhttp3.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

/**
* Upload an encrypted RFI file using multipart/form-data.
*
* @param paymentId The payment UUID.
* @param rfiId The RFI UUID.
* @param encryptedFile The encrypted file to upload.
* @param fileName The original file name.
* @param fileType The file type (e.g., "PDF", "JPEG").
* @param fileKey The file key (e.g., "ID_DOCUMENT", "PROOF_OF_ADDRESS_DOCUMENT").
* @param encryptedAesKey The JWE-wrapped AES key.
* @param iv The Base64-encoded initialization vector.
* @param accessToken The Bearer token for authentication.
* @throws IOException if the HTTP request fails.
*/
public static void uploadRfiFile(UUID paymentId, UUID rfiId, File encryptedFile,
                               String fileName, String fileType, String fileKey,
                               String encryptedAesKey, byte[] iv, String accessToken) throws IOException {

   OkHttpClient client = new OkHttpClient();
   ObjectMapper objectMapper = new ObjectMapper();

   // Create data objects
   FileMetadata fileMetadata = new FileMetadata(fileName, fileType, fileKey);
   FileEncryption encryption = new FileEncryption(encryptedAesKey, Base64.getEncoder().encodeToString(iv));

   // Build multipart request
   RequestBody requestBody = new MultipartBody.Builder()
       .setType(MultipartBody.FORM)
       .addFormDataPart("fileMetadata", objectMapper.writeValueAsString(fileMetadata))
       .addFormDataPart("encryption", objectMapper.writeValueAsString(encryption))
       .addFormDataPart("encryptedFile", fileName,
           RequestBody.create(encryptedFile, MediaType.parse("application/octet-stream")))
       .build();

   Request request = new Request.Builder()
       .url(String.format("https://api.circle.com/v1/payments/%s/rfis/%s/files", paymentId, rfiId))
       .header("Authorization", "Bearer " + accessToken)
       .post(requestBody)
       .build();

   try (Response response = client.newCall(request).execute()) {
       if (!response.isSuccessful()) {
           throw new IOException("Upload failed: " + response.code());
       }
   }
}

public static class FileMetadata {
   public final String fileName;
   public final String fileType;
   public final String fileKey;

   public FileMetadata(String fileName, String fileType, String fileKey) {
       this.fileName = fileName;
       this.fileType = fileType;
       this.fileKey = fileKey;
   }
}

public static class FileEncryption {
   public final String encryptedAesKey;
   public final String iv;

   public FileEncryption(String encryptedAesKey, String iv) {
       this.encryptedAesKey = encryptedAesKey;
       this.iv = iv;
   }
}
```

An example request body is shown below:

```text Text theme={null}
------WebKitFormBoundary
Content-Disposition: form-data; name="fileMetadata"
Content-Type: application/json

{
  "fileName": "example.pdf",
  "fileType": "application/pdf",
  "fileKey": "PROOF_OF_ADDRESS"
}
------WebKitFormBoundary
Content-Disposition: form-data; name="encryption"
Content-Type: application/json

{
  "encryptedAesKey": "<base64-encoded-encrypted-aes-key>",
  "iv": "<base64-encoded-iv-for-file-encryption>",
}
------WebKitFormBoundary
Content-Disposition: form-data; name="encryptedFile"; filename="encrypted_data.bin"
Content-Type: application/octet-stream

[AES ENCRYPTED BINARY FILE DATA]
```

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Create an Onchain Transaction

When a payment is in the `CRYPTO_FUNDS_PENDING` state, the OFI must initiate an
onchain transaction to fulfill the payment in USDC. CPN provides an API to help
prepare and validate the onchain transaction call data, and to broadcast the
transaction and monitor its state.

There are two versions of the Transactions API: V1 and V2. This guide provides
information on both versions. Note that your quote must match the version of the
API that you are using.

## Prerequisites

Before you begin, ensure that you have:

* Created a quote through the CPN API. If you are following the Transactions V2
  example, your quote should be created with the `transactionVersion` parameter
  set to `VERSION_2`.
* USDC in your sender wallet
* (Transactions V1 only) Native tokens in your sender wallet
* (Transactions V2 on EVM chains only) Granted a USDC allowance to the `Permit2`
  contract. See
  [How-to: Grant USDC Allowance to Permit2](/cpn/guides/transactions/grant-usdc-allowance-to-permit2)
  for more information.
* (Solana only) Ensure your Solana account has been initialized and funded.

<Note>
  **Note:** For Transactions V2, gas fees are not charged in native tokens, but in
  USDC. They are determined at quote creation instead of transaction creation in
  the quote `fees` field. The gas fee is collected by Circle's payment settlement
  smart contract during onchain transaction processing.
</Note>

## Steps

Use the following steps to create and broadcast a USDC transfer to the
blockchain:

### Step 1: Prepare the call data

Call the
[create transaction](/api-reference/cpn/cpn-platform/create-transaction)
endpoint to get an unsigned message object. Note that transaction objects differ
between EVM blockchains and Solana.

For Transactions V2, call the
[create transaction V2](/api-reference/cpn/cpn-platform/create-transaction-v2)
endpoint to get an unsigned message object. Transactions V2 supports EVM chains
only.

The API call must include the sender wallet information (which must be an EOA
wallet). The rest of the transaction data such as amount, chain, destination
address, and other information is populated automatically by CPN using the
payment record.

### Step 2: Create and sign the transaction

Review the unsigned message object and ensure that it matches your expectations
for the crypto transaction. Depending on the blockchain, the signing process
varies.

#### EVM

<Tabs>
  <Tab title="Transactions V1">
    When the unsigned data has been confirmed, you must sign it in accordance with
    [EIP-712](https://eips.ethereum.org/EIPS/eip-712). Next, you construct an
    [EIP-3009](https://eips.ethereum.org/EIPS/eip-3009) transaction from the signed
    data:

    1. **Extract the signature**. Extract the signature components (`v`, `r`, `s`)
       from the signed typed data.
    2. **Encode the function call**. Using the ERC-20 smart contract's ABI for the
       `TransferWithAuthorization` function, encode the function call with the
       required parameters: sender address (`from`), recipient address (`to`),
       `validAfter`, `validBefore`, `nonce`, and the signature components, `v`, `r`,
       `s`. This encoding creates the data field for the raw transaction.
    3. **Construct the transaction object**. Build a raw transaction object that
       includes the target contract address (USDC), the encoded function call data,
       and other necessary parameters such as nonce, gas limit, max fee per gas, max
       priority fee per gas, and chain ID.
    4. **Serialize the transaction**. Serialize the transaction object into the
       proper RLP-encoded format so that it can be signed.

    The following is an example of the transaction object in
    [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) format, for EIP-3009
    `TransferWithAuthorization` contract execution.

    ```json JSON theme={null}
    {
      "to": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      "value": "0x0",
      "gasLimit": "0x5208",
      "maxPriorityFeePerGas": "0x59682f00",
      "maxFeePerGas": "0x59682f00",
      "nonce": "0x8",
      "chainId": 1,
      "type": "0x2",
      "data": "0xe3ee160e000000000000000000000000a9d56270e9fd76be802ac4d45ef4be4322fdadbc0000000000000000000000006840c9f894b6b8264292e22b8abb2c57ae3946a700000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000067ca8f131e790e4b5e8d2f801f12bdd8e8a9fcab490305f17a59a1620549791985617c36000000000000000000000000000000000000000000000000000000000000001cc8973666e8460a153a5a073a7a2878a4e6f42be09ffe012a04d342f2a729019b769e46ab7fefb0dadf8a6d0dd83a687d6dfcdfaf1c56af190eaaff8252e5929e"
    }
    ```

    Sign this transaction data and move on to the next step.
  </Tab>

  <Tab title="Transactions V2">
    When the unsigned data has been confirmed, you must sign the transaction payload
    from the API endpoint using [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
    typed data signing from your sender wallet. The following is an example payload:

    ```json  theme={null}
    {
      "type": "PAYMENT_SETTLEMENT_CONTRACT_V1_0_PAYMENT_INTENT",
      "types": {
        "EIP712Domain": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "chainId",
            "type": "uint256"
          },
          {
            "name": "verifyingContract",
            "type": "address"
          }
        ],
        "PaymentIntent": [
          {
            "name": "from",
            "type": "address"
          },
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "value",
            "type": "uint256"
          },
          {
            "name": "validAfter",
            "type": "uint256"
          },
          {
            "name": "validBefore",
            "type": "uint256"
          },
          {
            "name": "nonce",
            "type": "bytes32"
          },
          {
            "name": "beneficiary",
            "type": "address"
          },
          {
            "name": "maxFee",
            "type": "uint256"
          },
          {
            "name": "requirePayeeSign",
            "type": "bool"
          },
          {
            "name": "attester",
            "type": "address"
          }
        ],
        "TokenPermissions": [
          {
            "name": "token",
            "type": "address"
          },
          {
            "name": "amount",
            "type": "uint256"
          }
        ],
        "PermitWitnessTransferFrom": [
          {
            "name": "permitted",
            "type": "TokenPermissions"
          },
          {
            "name": "spender",
            "type": "address"
          },
          {
            "name": "nonce",
            "type": "uint256"
          },
          {
            "name": "deadline",
            "type": "uint256"
          },
          {
            "name": "witness",
            "type": "PaymentIntent"
          }
        ]
      },
      "domain": {
        "name": "Permit2",
        "chainId": "11155111",
        "verifyingContract": "0x000000000022D473030F116dDEE9F6B43aC78BA3"
      },
      "message": {
        "nonce": "25668617285137697861288274946631174355105919960416755114569514179393151588120",
        "spender": "0xe2B17D0C1736dc7C462ABc4233C91BDb9F27DD1d",
        "witness": {
          "to": "0xc75c3e371d617b3e60db1b6f3fa2f0689562e5a7",
          "fee": "0",
          "from": "0x57414adbBbc4BBA36f1dE26b2dc1648b28ae7799",
          "nonce": "0x38bfec2b230187932870d575132e8ae1f83b34c10e3bf6d64c377f0c13245718",
          "value": 14174474,
          "attester": "0x768919ef04853b5fd444ccff48cea154768a0291",
          "validAfter": "1757358106",
          "beneficiary": "0x4f1c3a0359A7fAd8Fa8E9E872F7C06dAd97C91Fd",
          "validBefore": "1757361726",
          "requirePayeeSign": false
        },
        "deadline": "1757362866",
        "permitted": {
          "token": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
          "amount": "14174474"
        }
      },
      "primaryType": "PermitWitnessTransferFrom"
    }
    ```

    After signing the payload, you should have an EIP-712 data signature in hex
    string format.
  </Tab>
</Tabs>

#### Solana

<Tabs>
  <Tab title="Transactions V1">
    For V1, the transfer data for Solana follows Solana's `Ed2559` transaction
    format. After confirming the unsigned data, a transaction object is constructed
    with the transfer data. You sign the transaction object and submit it to the
    API.

    To sign the transaction object, you can deserialize the `messageToBeSigned`
    field from the
    [POST /v1/cpn/payments/:paymentId/transactions](/api-reference/cpn/cpn-platform/create-transaction)
    endpoint, and sign it using a Solana library with your wallet key pair.

    ```typescript  theme={null}
    import {
      Keypair,
      Transaction,
      PublicKey,
      TransactionInstruction,
    } from "@solana/web3.js";
    import bs58 from "bs58";

    function signTransaction(messageToBeSigned: any, keypair: Keypair): string {
      // 1. Create a new Transaction
      const transaction = new Transaction();

      // 2. Set recentBlockhash and feePayer
      transaction.recentBlockhash = messageToBeSigned.recentBlockhash;
      transaction.feePayer = new PublicKey(messageToBeSigned.feePayer);

      // 3. Add all instructions
      for (const instruction of messageToBeSigned.instructions) {
        const keys = instruction.keys.map((key: any) => ({
          pubkey: new PublicKey(key.pubkey),
          isSigner: key.isSigner,
          isWritable: key.isWritable,
        }));

        const programId = new PublicKey(instruction.programId);

        // Handle instruction data - can be array of numbers or base64 string
        let data: Buffer;
        if (Array.isArray(instruction.data)) {
          data = Buffer.from(instruction.data);
        } else if (typeof instruction.data === "string") {
          data = Buffer.from(instruction.data, "base64");
        } else {
          throw new Error(`Unexpected data format: ${typeof instruction.data}`);
        }

        transaction.add(
          new TransactionInstruction({
            keys,
            programId,
            data,
          }),
        );
      }

      // 4. Sign with keypair
      transaction.sign(keypair);

      // 5. Serialize signed transaction, which you can then submit to the
      // POST /v1/cpn/payments/:paymentId/transactions/:transactionId/submit endpoint
      const signedTransaction = transaction
        .serialize({ requireAllSignatures: false })
        .toString("base64");

      return signedTransaction;
    }
    ```

    If you are using the Circle Wallets, you can use the
    [sign transaction](/api-reference/wallets/developer-controlled-wallets/sign-transaction)
    endpoint to sign the transaction object.

    <Note>
      **Note:** Once signed, Solana transaction objects expire after one minute, so
      you should submit it immediately.
    </Note>
  </Tab>

  <Tab title="Transactions V2">
    For V2, the transfer data to be signed is encoded in the
    `encodedMessageToBeSigned` field from the
    [POST /v2/cpn/payments/:paymentId/transactions](/api-reference/cpn/cpn-platform/create-transaction-v2)
    endpoint. You would need to first decode it using the `base64` library and then
    sign it using a Solana library with your wallet key pair.

    ```typescript  theme={null}
    import { Keypair, Transaction, Message } from "@solana/web3.js";
    import bs58 from "bs58";

    function signTransaction(
      encodedMessageToBeSigned: string,
      keypair: Keypair,
    ): string {
      // 1. Decode base64 message
      const messageBytes = Buffer.from(encodedMessageToBeSigned, "base64");

      // 2. Deserialize as Solana Message
      const message = Message.from(messageBytes);

      // 3. Create transaction with empty signatures
      const SIGNATURE_LENGTH = 64;
      const EMPTY_SIGNATURE_BASE58 = bs58.encode(
        Buffer.alloc(SIGNATURE_LENGTH).fill(0),
      );
      const numSignatures = message.header.numRequiredSignatures;

      const transaction = Transaction.populate(
        message,
        Array(numSignatures).fill(EMPTY_SIGNATURE_BASE58),
      );

      // 4. Sign with keypair
      transaction.partialSign(keypair);

      // 5. Serialize signed transaction, which you can then submit to the
      // POST /v2/cpn/payments/:paymentId/transactions/:transactionId/submit endpoint
      const signedTransaction = transaction
        .serialize({ requireAllSignatures: false })
        .toString("base64");

      return signedTransaction;
    }
    ```

    If you are using the Circle Wallets, you can use the
    [sign transaction](/api-reference/wallets/developer-controlled-wallets/sign-transaction)
    endpoint to sign the transaction object.

    ```typescript  theme={null}
    import { Keypair, Transaction, Message } from "@solana/web3.js";
    import bs58 from "bs58";
    import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

    async function signTransactionWithCircleWallet(
      encodedMessageToBeSigned: string,
      walletId: string,
      apiKey: string,
      entitySecret: string,
    ): Promise<string> {
      // 1. Decode base64 message
      const messageBytes = Buffer.from(encodedMessageToBeSigned, "base64");

      // 2. Deserialize as Solana Message
      const message = Message.from(messageBytes);

      // 3. Create transaction with empty signatures
      const SIGNATURE_LENGTH = 64;
      const EMPTY_SIGNATURE_BASE58 = bs58.encode(
        Buffer.alloc(SIGNATURE_LENGTH).fill(0),
      );
      const numSignatures = message.header.numRequiredSignatures;

      const transaction = Transaction.populate(
        message,
        Array(numSignatures).fill(EMPTY_SIGNATURE_BASE58),
      );

      // 4. Serialize transaction
      const rawTransaction = transaction
        .serialize({ requireAllSignatures: false })
        .toString("base64");

      // 5. Initialize Circle client
      const circleClient = initiateDeveloperControlledWalletsClient({
        apiKey: apiKey,
        entitySecret: entitySecret,
      });

      // 6. Sign transaction, which you can then submit to the
      // POST /v2/cpn/payments/:paymentId/transactions/:transactionId/submit endpoint
      const signedTransaction = (
        await circleClient.signTransaction({
          walletId: walletId,
          rawTransaction: rawTransaction,
        })
      ).data.signedTransaction;

      return signedTransaction;
    }
    ```
  </Tab>
</Tabs>

### Step 3: Submit the signed transaction

Call the
[submit transaction](/api-reference/cpn/cpn-platform/submit-transaction)
endpoint to submit the signed transaction data to CPN. For Transactions V2, use
the
[submit transaction V2](/api-reference/cpn/cpn-platform/submit-transaction-v2)
endpoint. CPN broadcasts the transaction and provides a webhook to notify you of
the transaction status. This webhook is also provided to the BFI.

Once the BFI confirms that they have received the desired amount for the
payment, the BFI initiates the fiat payment.

#### Handling failures

If a transaction fails and the payment is still valid (for example, it has not
expired), you can address the issues with the transaction and initiate a new
transaction. For example, in a V1 transaction,if there was not enough gas to
cover the transaction, you could deposit additional gas tokens to the wallet,
and try again. In a V2 transaction, this is less likely to be an issue as gas
fees in native tokens are paid from a Circle-controlled wallet. You can use a
similar approach to address other onchain failures.

Only one active transaction is allowed at a time per payment, so you can only
initiate a new transaction once the previous one has failed.

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# How-to: Grant USDC Allowance to Permit2

> Grant a USDC token allowance to the Permit2 contract using a Circle Wallets developer-controlled wallet or an EIP-1193 Ethereum wallet

For Transactions V2 on EVM blockchains, there is a dependency on the `Permit2`
contract to enable allowance management. To get the benefits of Transactions V2,
you must grant a USDC token allowance to the `Permit2` contract.

This guide shows two examples of how to grant a USDC token allowance to the
`Permit2` contract. The
[`Permit2` documentation](https://docs.uniswap.org/contracts/permit2/overview)
provides additional examples of how to grant this allowance.

## Prerequisites

The examples on this page show how to grant a USDC token allowance to the
`Permit2` contract using a
[Circle Wallets developer-controlled wallet](/wallets/dev-controlled) or a
generic EIP-1193 Ethereum wallet. Before you begin, ensure you have:

* If you are following the Circle Wallets example:
  * A Circle Developer Account
  * A
    [developer-controlled wallet](/wallets/dev-controlled/create-your-first-wallet)

* **Node.js** and **npm** installed on your development machine

* A project set up as described in the below section

### Set up your project

1. Initialize a new Node.js project and install dependencies:

   ```shell  theme={null}
   npm init -y
   npm pkg set type=module
   npm install viem dotenv
   ```

2. In the project root, create a `.env` file and add the following variables:

   ```shell  theme={null}
   USDC_CONTRACT_ADDRESS=<USDC_CONTRACT_ADDRESS>
   PERMIT2_CONTRACT_ADDRESS=<PERMIT2_CONTRACT_ADDRESS>
   APPROVAL_AMOUNT=<APPROVAL_AMOUNT>
   WALLET_ADDRESS=<WALLET_ADDRESS>
   ```

   The `PERMIT2_CONTRACT_ADDRESS` is the same across all EVM blockchains
   (`0x000000000022D473030F116dDEE9F6B43aC78BA3`), but you should verify it with
   the blockchain explorer on the chain you are using. You can find the
   `USDC_CONTRACT_ADDRESS` on the
   [USDC contract address page](/stablecoins/usdc-contract-addresses).

   <Note>
     The USDC token has 6 decimals. To approve \$100 USDC, set `APPROVAL_AMOUNT` to
     `100000000` (100 \* 10<sup>6</sup>).
   </Note>

   If you are following the Circle Wallets example, you will also need to add
   the following variables:

   ```shell  theme={null}
   CIRCLE_WALLET_ID=<CIRCLE_WALLET_ID>
   CIRCLE_WALLETS_API_KEY=<CIRCLE_WALLETS_API_KEY>
   ENTITY_SECRET=<ENTITY_SECRET>
   ```

   If you are following the EIP-1193 Ethereum wallet example, or your Circle
   Wallet is on the generic `EVM` / `EVM-TESTNET` chain, you will also need to
   add the following variable:

   ```shell  theme={null}
   RPC_URL=<RPC_URL>
   ```

3. Create an `index.js` file. You'll add code step by step in the following
   sections.

### Grant a USDC token allowance to the `Permit2` contract

The following example code shows the process for granting a USDC token allowance
to the
[`Permit2` contract](https://etherscan.io/address/0x000000000022D473030F116dDEE9F6B43aC78BA3)
using a Circle Wallets developer-controlled wallet or an EIP-1193 Ethereum
wallet.

<Tabs>
  <Tab title="Circle Wallets">
    <Note>
      **Note:** This example is for a Circle Wallets developer-controlled wallet on
      specific EVM blockchains (for example, `ETH`, `ETH-SEPOLIA`, `MATIC`,
      `MATIC-AMOY`, etc.). If your Circle Wallet is on the generic `EVM` /
      `EVM-TESTNET` chain, which is likely the case if you are migrating from
      Transactions V1 to V2, you can use the example in the "Circle Wallets (generic
      EVM)" tab.
    </Note>

    ```javascript  theme={null}
    import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
    import { randomUUID } from "crypto";
    import dotenv from "dotenv";

    dotenv.config();

    /**
     * Approves a specified amount of USDC for the Permit2 contract using
     * a developer-controlled wallet managed by Circle.
     *
     * This function sends an on-chain transaction to call the ERC-20 `approve`
     * method on the USDC contract, allowing the Permit2 contract to spend
     * the specified amount on behalf of the wallet.
     *
     * @async
     * @function approveUSDCWithCircleWallets
     * @returns {Promise<object>} The transaction response data returned by Circle's API.
     */
    export async function approveUSDCWithCircleWallets() {
      const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_WALLETS_API_KEY,
        entitySecret: process.env.ENTITY_SECRET,
      });

      const response = await client.createContractExecutionTransaction({
        walletId: process.env.CIRCLE_WALLET_ID,
        contractAddress: process.env.USDC_CONTRACT_ADDRESS,
        abiFunctionSignature: "approve(address,uint256)",
        abiParameters: [
          process.env.PERMIT2_CONTRACT_ADDRESS,
          process.env.APPROVAL_AMOUNT,
        ],
        idempotencyKey: randomUUID(),
        fee: { type: "level", config: { feeLevel: "MEDIUM" } },
      });

      return response.data;
    }

    /* -------- Example usage with Circle ---------

    // For auth and wallet creation, see: https://developers.circle.com/interactive-quickstarts/dev-controlled-wallets
    const response = await approveUSDCWithCircleWallets();
    console.log('Response:', response);

    ---------------------------------- */
    ```
  </Tab>

  <Tab title="Circle Wallets (generic EVM)">
    <Note>
      **Note:** This example is for a Circle Wallets developer-controlled wallet on
      generic EVM blockchains (for example, `EVM`, `EVM-TESTNET`). If you are getting
      started with Transactions V2 instead of migrating from Transactions V1, Circle
      recommends that you use create chain-specific Circle Wallets (for example,
      `ETH`, `ETH-SEPOLIA`, `MATIC`, `MATIC-AMOY`) instead of a generic EVM wallet and
      follow the example in the "Circle Wallets" tab instead.
    </Note>

    ```javascript  theme={null}
    import { createPublicClient, http, encodeFunctionData, erc20Abi } from "viem";
    import { sepolia } from "viem/chains";
    import dotenv from "dotenv";

    dotenv.config();

    /**
     * Signs a transaction using a developer-controlled wallet managed by Circle.
     *
     * For EVM chains, accepts a transaction object in JSON format.
     * The transaction object will be automatically stringified if needed.
     *
     * @async
     * @function signTransaction
     * @param {object} transaction - Transaction object for EVM chains
     * @returns {Promise<object>} The signature response data returned by Circle's API
     *
     * @example
     * const signature = await signTransaction({
     *   to: '0x...',
     *   value: '0x0',
     *   data: '0x...',
     *   nonce: 1,
     *   gasLimit: '0x5208',
     *   maxFeePerGas: '0x...',
     *   maxPriorityFeePerGas: '0x...',
     *   chainId: 1
     * });
     */
    export async function signTransaction(transaction) {
      const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_WALLETS_API_KEY,
        entitySecret: process.env.ENTITY_SECRET,
      });

      const transactionJson = JSON.stringify(
        transaction,
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
        2,
      );

      const response = await client.signTransaction({
        walletId: process.env.CIRCLE_WALLET_ID,
        transaction: transactionJson,
      });

      return response.data;
    }

    /**
     * Composes a raw unsigned EIP-1559 transaction for approving USDC for the Permit2 contract.
     * This transaction can then be signed using Circle Wallets' raw transaction signing API.
     *
     * @async
     * @function composeUSDCApprovalTransaction
     * @returns {Promise<object>} The unsigned EIP-1559 transaction object.
     */
    export async function composeUSDCApprovalTransaction() {
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(process.env.RPC_URL),
      });

      // Step 1: Encode the function call data
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [
          process.env.PERMIT2_CONTRACT_ADDRESS,
          BigInt(process.env.APPROVAL_AMOUNT),
        ],
      });

      // Step 2: Estimate gas fees (viem handles the calculation)
      const fees = await publicClient.estimateFeesPerGas();

      // Step 3: Prepare the transaction request (viem auto-fills nonce, gas, etc.)
      const transaction = await publicClient.prepareTransactionRequest({
        account: process.env.SENDER_WALLET_ADDRESS,
        to: process.env.USDC_CONTRACT_ADDRESS,
        value: 0n,
        data,
        ...fees,
      });

      return transaction;
    }

    /**
     * Broadcasts an signed transaction to the network.
     *
     * @async
     * @function broadcastSignedTransaction
     * @param {string} signedTransaction - The signed transaction as a hex string (with 0x prefix)
     * @returns {Promise<string>} The transaction hash
     */
    export async function broadcastSignedTransaction(signedTransaction) {
      const publicClient = createPublicClient({
        chain: sepolia, // use the correct chain for your wallet
        transport: http(process.env.RPC_URL),
      });

      // Send the raw signed transaction
      const txHash = await publicClient.sendRawTransaction({
        serializedTransaction: signedTransaction,
      });

      return txHash;
    }

    /* -------- Example usage with Circle ---------

    // For auth and wallet creation, see: https://developers.circle.com/interactive-quickstarts/dev-controlled-wallets
    const tx = await composeUSDCApprovalTransaction();
    const signature = await signTransaction(tx);
    const txHash = await broadcastSignedTransaction(signature.signedTransaction);

    ---------------------------------- */
    ```
  </Tab>

  <Tab title="EIP-1193 Ethereum Wallet">
    ```javascript  theme={null}
    import {
      createWalletClient,
      createPublicClient,
      http,
      custom,
      erc20Abi,
    } from "viem";
    import { sepolia } from "viem/chains";
    import dotenv from "dotenv";

    dotenv.config();

    /**
     * Approves a specified amount of USDC for the Permit2 contract using
     * a custom wallet with an EIP-1193 provider (like MetaMask).
     *
     * This function sends an on-chain transaction to call the ERC-20 `approve`
     * method on the USDC contract, allowing the Permit2 contract to spend
     * the specified amount on behalf of the wallet.
     *
     * @async
     * @function approveUSDCWithEIP1193Wallet
     * @param {any} [provider] - EIP-1193 provider.
     * @returns {Promise<object>} The transaction hash and receipt.
     */
    export async function approveUSDCWithEIP1193Wallet(provider) {
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(process.env.RPC_URL),
      });

      const walletClient = createWalletClient({
        account: process.env.WALLET_ADDRESS,
        chain: sepolia,
        transport: custom(provider),
      });

      const hash = await walletClient.writeContract({
        address: process.env.USDC_CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [
          process.env.PERMIT2_CONTRACT_ADDRESS,
          BigInt(process.env.APPROVAL_AMOUNT),
        ],
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      return { hash, receipt };
    }

    /* -------- Example usage with EIP-1193 wallet ---------

    // Refer to https://viem.sh/docs/clients/transports/custom and your wallet provider's documentation for the provider object. 
    const {hash, receipt} = await approveUSDCWithEIP1193Wallet({provider: window.ethereum});
    console.log('Hash:', hash);
    console.log('Receipt:', receipt);

    ---------------------------------- */
    ```
  </Tab>
</Tabs>

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# How-to: Migrate from Transactions V1 to V2

> Update your CPN integration from Transactions V1 to V2

Transactions V2 allows for a more straightforward integration with CPN compared
to Transactions V1. It also provides more powerful onchain settlement
primitives, such as auto-acceleration and gas fees that are fixed at quote time.
If you have previously integrated with CPN using the Transactions V1 API, you
can migrate to Transactions V2 without changes to your wallet infrastructure.

Compared to Transactions V1, Transactions V2 has the following differences:

* When creating the CPN quote, you must set the `transactionVersion` parameter
  to `VERSION_2`.
* Gas fees are not charged in native tokens, but in USDC. They are determined at
  quote creation instead of transaction creation in the quote `fees` field. The
  gas fee is collected by Circle's payment settlement smart contract during
  onchain transaction processing.
* There are separate API endpoints for creating and submitting transactions.

Depending on the blockchain, there are additional differences:

<Tabs>
  <Tab title="EVM chains">
    * Before initiating a transaction, the sender wallet must grant the
      [`Permit2` contract](https://docs.uniswap.org/contracts/permit2/overview) a
      USDC allowance.
    * When signing the transaction, you no longer need to compose and sign the raw
      EVM transaction; you only need to sign the EIP-712 typed data provided to you
      in the `messageToBeSigned` field and submit the signature.
    * CPN handles the auto-acceleration of the transaction. You no longer need to
      monitor transaction broadcast status or submit acceleration transactions.
  </Tab>

  <Tab title="Solana">
    * In the signing process, instead of deserializing and signing the
      `messageToBeSigned` field, you would need to use the
      `encodedMessageToBeSigned` field. Please refer to [How-to: Create an Onchain
      Transaction](/cpn/guides/transactions/create-an-onchain-txn) for more
      information on how to sign the transaction in V2.
  </Tab>
</Tabs>

This guide provides information on how to migrate your existing integration from
Transactions V1 to V2 on EVM. On Solana, you would follow a similar process with
some differences in the signing process.

## Prerequisites

Before you begin, ensure that you have:

* Obtained an API key for CPN from Circle
* USDC in your sender wallet
* cURL installed on your development machine
* (EVM chains only) Granted a USDC allowance to the `Permit2` contract. See
  [How-to: Grant USDC Allowance to Permit2](/cpn/guides/transactions/grant-usdc-allowance-to-permit2)
  for more information.

> **Note:** This guide provides API requests in cURL format, along with example
> responses.

## Steps

Use the following steps to create an onchain transaction using Transactions V2.

### Step 1. Create a quote

Use the [create a quote](/api-reference/cpn/cpn-platform/create-quotes) endpoint
to create a quote with the `transactionVersion` parameter set to `VERSION_2`.
When checking limits beforehand, call the
[list routes](/api-reference/cpn/cpn-platform/list-routes) endpoint with
`transactionVersion=VERSION_2` so returned crypto min limits include the
chain-specific fee buffer.

```shell  theme={null}
curl --request POST \
  --url https://api.circle.com/v1/cpn/quotes \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer ${YOUR_API_KEY}' \
  --header 'Content-Type: application/json' \
  --data '
{
    "paymentMethodType": "SPEI",
    "senderCountry": "US",
    "destinationCountry": "MX",
    "sourceAmount": {
        "currency": "USDC"
    },
    "destinationAmount": {
        "amount": "200",
        "currency": "MXN"
    },
    "blockchain": "ETH-SEPOLIA",
    "senderType": "INDIVIDUAL",
    "recipientType": "INDIVIDUAL",
    "transactionVersion": "VERSION_2"
}
'
```

**Response**

```json  theme={null}
{
  "data": [
    {
      "id": "2792f4a6-f1bd-4435-b681-1da309122159",
      "paymentMethodType": "SPEI",
      "blockchain": "ETH-SEPOLIA",
      "senderCountry": "US",
      "destinationCountry": "MX",
      "createDate": "2025-09-24T00:01:13.532073875Z",
      "quoteExpireDate": "2025-09-24T00:01:42.502094Z",
      "cryptoFundsSettlementExpireDate": "2025-09-24T01:01:12.502097Z",
      "sourceAmount": {
        "amount": "15.000000",
        "currency": "USDC"
      },
      "destinationAmount": {
        "amount": "252.91",
        "currency": "MXN"
      },
      "fiatSettlementTime": {
        "min": "0",
        "max": "5",
        "unit": "MINUTES"
      },
      "exchangeRate": {
        "rate": "16.860667",
        "pair": "USDC/MXN"
      },
      "fees": {
        "totalAmount": {
          "amount": "1.568971",
          "currency": "USDC"
        },
        "breakdown": [
          {
            "type": "TAX_FEE",
            "amount": {
              "amount": "0.234663",
              "currency": "USDC"
            }
          },
          {
            "type": "BFI_TRANSACTION_FEE",
            "amount": {
              "amount": "0.138037",
              "currency": "USDC"
            }
          },
          {
            "type": "CIRCLE_SERVICE_FEE",
            "amount": {
              "amount": "0.000000",
              "currency": "USDC"
            }
          },
          {
            "type": "BLOCKCHAIN_GAS_FEE",
            "amount": {
              "amount": "1.196271",
              "currency": "USDC"
            }
          }
        ]
      },
      "senderType": "INDIVIDUAL",
      "recipientType": "INDIVIDUAL",
      "certificate": {
        // certificate object
      },
      "quoteOptions": {
        "isFirstParty": false
      },
      "transactionVersion": "VERSION_2"
    }
  ]
}
```

> **Note:** The quote returned from this step must follow the Transactions V2
> workflow, you can't switch from V2 back to V1 without first recreating the
> quote.

### Step 2. Create a V2 transaction

You would then follow the same payment API workflow as before, create a payment
from the [create a payment](/api-reference/cpn/cpn-platform/create-payment)
endpoint. After your payment is in the `CRYPTO_FUNDS_PENDING` state, initiate
the transaction using the
[create a transaction V2](/api-reference/cpn/cpn-platform/create-transaction-v2)
endpoint.

```shell  theme={null}
curl --request POST \
  --url https://api.circle.com/v2/cpn/payments/:paymentId/transactions \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer ${YOUR_API_KEY}' \
  --header 'Content-Type: application/json' \
  --data '
{
  "idempotencyKey" : "${RANDOM_UUID}"
}
'
```

**Response**

```json  theme={null}
{
  "data": {
    "id": "dbc27d23-cd4f-447e-855e-349cb2853d23",
    "status": "CREATED",
    "paymentId": "49d4231e-6c4f-319e-946d-ed8c8bab5abc",
    "expireDate": "2025-09-08T20:02:06.651391Z",
    "blockchain": "ETH-SEPOLIA",
    "senderAddress": "0x1234567890123456789012345678901234567890",
    "destinationAddress": "0x0000000000000000000000000000000000000001",
    "amount": {
      "amount": "15.000000",
      "currency": "USDC"
    },
    "messageType": "PAYMENT_SETTLEMENT_CONTRACT_V1_0_PAYMENT_INTENT",
    "messageToBeSigned": {
      "domain": {
        "name": "Permit2",
        "chainId": "11155111",
        "verifyingContract": "0x000000000022D473030F116dDEE9F6B43aC78BA3"
      },
      "message": {
        "permitted": {
          "token": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
          "amount": "14174474"
        },
        "spender": "0xe2B17D0C1736dc7C462ABc4233C91BDb9F27DD1d",
        "nonce": "25668617285137697861288274946631174355105919960416755114569514179393151588120",
        "deadline": "1757362866",
        "witness": {
          "from": "0x1234567890123456789012345678901234567890",
          "to": "0x0000000000000000000000000000000000000001",
          "value": 14174474,
          "validAfter": "1757358106",
          "validBefore": "1757361726",
          "nonce": "0x38bfec2b230187932870d575132e8ae1f83b34c10e3bf6d64c377f0c13245718",
          "beneficiary": "0x4f1c3a0359A7fAd8Fa8E9E872F7C06dAd97C91Fd",
          "maxFee": "0",
          "attester": "0x768919ef04853b5fd444ccff48cea154768a0291",
          "requirePayeeSign": false
        }
      },
      "primaryType": "PermitWitnessTransferFrom",
      "types": {
        "EIP712Domain": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "chainId",
            "type": "uint256"
          },
          {
            "name": "verifyingContract",
            "type": "address"
          }
        ],
        "PermitWitnessTransferFrom": [
          {
            "name": "permitted",
            "type": "TokenPermissions"
          },
          {
            "name": "spender",
            "type": "address"
          },
          {
            "name": "nonce",
            "type": "uint256"
          },
          {
            "name": "deadline",
            "type": "uint256"
          },
          {
            "name": "witness",
            "type": "PaymentIntent"
          }
        ],
        "TokenPermissions": [
          {
            "name": "token",
            "type": "address"
          },
          {
            "name": "amount",
            "type": "uint256"
          }
        ],
        "PaymentIntent": [
          {
            "name": "from",
            "type": "address"
          },
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "value",
            "type": "uint256"
          },
          {
            "name": "validAfter",
            "type": "uint256"
          },
          {
            "name": "validBefore",
            "type": "uint256"
          },
          {
            "name": "nonce",
            "type": "bytes32"
          },
          {
            "name": "beneficiary",
            "type": "address"
          },
          {
            "name": "maxFee",
            "type": "uint256"
          },
          {
            "name": "requirePayeeSign",
            "type": "bool"
          },
          {
            "name": "attester",
            "type": "address"
          }
        ]
      }
    },
    "metadata": {}
  }
}
```

### Step 3. Sign and submit the transaction

From the response in the previous step, extract the `messageToBeSigned` field.
You must sign this data using [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
typed data signing from your sender wallet. Once signed, you should submit it to
the
[submit transaction V2](/api-reference/cpn/cpn-platform/submit-transaction-v2)
endpoint. The following is an example request:

```shell  theme={null}
curl --request POST \
  --url https://api.circle.com/v2/cpn/payments/:paymentId/transactions/:transactionId/submit \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer ${YOUR_API_KEY}' \
  --header 'Content-type: application/json' \
  --data '
{
  "signedTransaction": "0x12b5fb72e99f9bb0300d2eb66a6d89dd5a667f43669893cf14bfcc390754dcb61b69f92cba598ec83a184e11c97e3bb9964a2bfd7a09688eee63f586ad9ccae21c"
}
'
```

<Note>
  **Note:** For Solana, follow the steps in [How-to: Create an Onchain
  Transaction](/cpn/guides/transactions/create-an-onchain-txn) to sign the
  transaction. You would submit the signed transaction in the same way as for
  EVM.
</Note>

After the transaction is submitted, CPN is responsible for broadcasting the
transaction to the blockchain. You will be notified by webhooks when events
related to the transaction occur. Unlike Transaction V1, you don't need to
actively monitor the transaction or manually accelerate it. CPN monitors the
transaction and automatically accelerates it if necessary.

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Set up Webhook Notifications

During the payment process, CPN sends notifications using webhooks. These
asynchronous notifications inform the entities on the progress of the payment
and any required actions they must take.

This guide demonstrates how to subscribe to CPN notifications as an OFI
integrator. See [Webhook Events](/cpn/references/webhooks/webhook-events) for a
complete list of the notifications that are sent over webhooks.

## Steps

Use the following steps to set up a webhook endpoint and subscribe to
notifications using the CPN API.

### Step 1: Set up a subscriber endpoint

To receive webhook notifications, you must expose a publicly accessible
subscriber endpoint. The endpoint must be able to handle both `HEAD` and `POST`
requests over HTTPS.

<Note>
  **Note:** During OFI integration, Circle works directly with you to configure
  this endpoint.
</Note>

For testing purposes, you can create an endpoint using
[webhook.site](https://webhook.site).

### Step 2: Subscribe to notifications

Set up an endpoint to receive notifications instead of polling for event updates
using the `/v2/subscriptions` endpoint.

```shell Shell theme={null}
curl --request POST \
  --url https://api.circle.com/v2/cpn/notifications/subscriptions \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer ${YOUR_API_KEY}:' \
  --header 'Content-type: application/json' \
  --data '
{
    "endpoint": "${YOUR_WEBHOOK_ENDPOINT}",
    "name": "Test OFI",
    "enabled": true,
    "notificationTypes": ["*"]
}
'
```

**Response**

```json JSON theme={null}
{
  "data": {
    "id": "1609aa1c-510a-448d-b9b9-3a13566ff922",
    "name": "Test OFI",
    "endpoint": "https://webhook.site/1fde07a9-8974-42bd-a273-943ffdf0e7d6",
    "enabled": true,
    "createDate": "2025-05-08T16:20:02.825689Z",
    "updateDate": "2025-05-08T16:20:02.825689Z",
    "notificationTypes": ["*"],
    "restricted": false
  }
}
```

Webhook notifications are digitally signed with an asymmetric key. You can use
information in the webhook header to verify that the content of the webhook is
legitimate. For more information, see
[How-to: Verify Webhook Signatures](/cpn/guides/webhooks/verify-webhook-signatures).

> ## Documentation Index
> Fetch the complete documentation index at: https://developers.circle.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Set up Webhook Notifications

During the payment process, CPN sends notifications using webhooks. These
asynchronous notifications inform the entities on the progress of the payment
and any required actions they must take.

This guide demonstrates how to subscribe to CPN notifications as an OFI
integrator. See [Webhook Events](/cpn/references/webhooks/webhook-events) for a
complete list of the notifications that are sent over webhooks.

## Steps

Use the following steps to set up a webhook endpoint and subscribe to
notifications using the CPN API.

### Step 1: Set up a subscriber endpoint

To receive webhook notifications, you must expose a publicly accessible
subscriber endpoint. The endpoint must be able to handle both `HEAD` and `POST`
requests over HTTPS.

<Note>
  **Note:** During OFI integration, Circle works directly with you to configure
  this endpoint.
</Note>

For testing purposes, you can create an endpoint using
[webhook.site](https://webhook.site).

### Step 2: Subscribe to notifications

Set up an endpoint to receive notifications instead of polling for event updates
using the `/v2/subscriptions` endpoint.

```shell Shell theme={null}
curl --request POST \
  --url https://api.circle.com/v2/cpn/notifications/subscriptions \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer ${YOUR_API_KEY}:' \
  --header 'Content-type: application/json' \
  --data '
{
    "endpoint": "${YOUR_WEBHOOK_ENDPOINT}",
    "name": "Test OFI",
    "enabled": true,
    "notificationTypes": ["*"]
}
'
```

**Response**

```json JSON theme={null}
{
  "data": {
    "id": "1609aa1c-510a-448d-b9b9-3a13566ff922",
    "name": "Test OFI",
    "endpoint": "https://webhook.site/1fde07a9-8974-42bd-a273-943ffdf0e7d6",
    "enabled": true,
    "createDate": "2025-05-08T16:20:02.825689Z",
    "updateDate": "2025-05-08T16:20:02.825689Z",
    "notificationTypes": ["*"],
    "restricted": false
  }
}
```

Webhook notifications are digitally signed with an asymmetric key. You can use
information in the webhook header to verify that the content of the webhook is
legitimate. For more information, see
[How-to: Verify Webhook Signatures](/cpn/guides/webhooks/verify-webhook-signatures).
