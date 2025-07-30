;; Ampora Energy Tokenization Contract
;; Converts verified renewable energy (kWh) into tradable tokens

(define-data-var admin principal tx-sender)

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-REGISTERED u101)
(define-constant ERR-NOT-REGISTERED u102)
(define-constant ERR-INVALID-AMOUNT u103)
(define-constant ERR-NO-BALANCE u104)

(define-map producers principal
  {
    name: (string-ascii 50),
    verified: bool
  }
)

(define-map balances principal uint)

;; Only admin can perform the action
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

;; Register a producer (only once)
(define-public (register-producer (producer-name (string-ascii 50)))
  (begin
    (asserts! (not (is-some (map-get? producers tx-sender))) (err ERR-ALREADY-REGISTERED))
    (map-set producers tx-sender { name: producer-name, verified: false })
    (ok true)
  )
)

;; Admin verifies a producer
(define-public (verify-producer (producer principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (let ((producer-info (map-get? producers producer)))
      (match producer-info
        none (err ERR-NOT-REGISTERED)
        some (data)
          (begin
            (map-set producers producer { name: (get name data), verified: true })
            (ok true)
          )
      )
    )
  )
)

;; Check producer status
(define-read-only (is-verified (producer principal))
  (match (map-get? producers producer)
    some info (get verified info)
    none false
  )
)

;; Mint tokens (1 token = 1 kWh)
(define-public (mint-energy (amount uint))
  (begin
    (asserts! (> amount u0) (err ERR-INVALID-AMOUNT))
    (let ((producer-info (map-get? producers tx-sender)))
      (match producer-info
        none (err ERR-NOT-REGISTERED)
        some info
          (begin
            (asserts! (get verified info) (err ERR-NOT-AUTHORIZED))
            (let ((prev-balance (default-to u0 (map-get? balances tx-sender))))
              (map-set balances tx-sender (+ prev-balance amount))
              (ok true)
            )
          )
      )
    )
  )
)

;; Burn energy tokens
(define-public (burn-energy (amount uint))
  (begin
    (asserts! (> amount u0) (err ERR-INVALID-AMOUNT))
    (let ((balance (default-to u0 (map-get? balances tx-sender))))
      (asserts! (>= balance amount) (err ERR-NO-BALANCE))
      (map-set balances tx-sender (- balance amount))
      (ok true)
    )
  )
)

;; Transfer tokens
(define-public (transfer-energy (to principal) (amount uint))
  (begin
    (asserts! (> amount u0) (err ERR-INVALID-AMOUNT))
    (let ((sender-balance (default-to u0 (map-get? balances tx-sender))))
      (asserts! (>= sender-balance amount) (err ERR-NO-BALANCE))
      (let ((recipient-balance (default-to u0 (map-get? balances to))))
        (map-set balances tx-sender (- sender-balance amount))
        (map-set balances to (+ recipient-balance amount))
        (ok true)
      )
    )
  )
)

;; Read-only function to get balance
(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? balances user))
)

;; Admin can transfer role
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)
