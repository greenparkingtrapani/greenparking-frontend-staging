# Green Parking – Frontend STAGING

Pacchetto di prova separato dalla produzione. Nessun dato cliente o segreto incluso.

## Configurazione Railway
- NEXT_PUBLIC_API_URL: https://backend-staging-staging-9a64.up.railway.app
- NEXT_PUBLIC_STRIPE_PUBLIC_KEY: la tua pk_test_ corrispondente alla sk_test_ sul backend.
- Impostare FRONTEND_URL sul backend con l'URL HTTPS del frontend staging.
- Il backend richiede anche STRIPE_SECRET_KEY, JWT_SECRET, schema PostgreSQL e test del webhook.
- NON abilitare l'accettazione di prenotazioni reali prima della verifica end-to-end.

La modifica a createReservation.ts mostra il messaggio restituito dall'API, anziche' il solo HTTP 409.
Il frontend usa gli asset e il codice forniti dall'utente.
