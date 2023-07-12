// Variable Definition

define
├── var
└── expression

// Function Definition

define
├── function
└── lambda
    ├── parameters
    └── body

// Function Call

function
└── arguments

// Conditional

if
├── test
└── cons
    ├── consequent
    └── alternative

// Lists

list
└── elements

// Recusion:

define
├── function
└── lambda
    ├── parameters
    └── if
        ├── test
        └── cons
            ├── base case
            └── recursion
                └── updated parameters





Create the AST for this interpreter:
(define eval-expr
  (lambda (expr env)
    (pmatch expr
      [`,x (guard (symbol? x))         (env x)]       [`(lambda (,x) ,body)
        (lambda (arg)
          (eval-expr body (lambda (y)
                            (if (eq? x y)
                                arg
                                (env y)))))]
      [`(,rator ,rand)
       ((eval-expr rator env)
        (eval-expr rand env))])))

where pmatch is a pattern match macro, and , is unquote, which works this way:
`(1 2 ,(+ 1 1 1)) ;; `(1 2 3))
'(1 2 ,(+ 1 1 1)) ;; '(1 2 (+ 1 1 1))

; A simple linear pattern matcher
; It is efficient (generates code at macro-expansion time) and simple:
; it should work on any R5RS (and R6RS) Scheme system.

; (pmatch exp `<clause>` ...{`<else-clause>`}) |
; (pmatch-who name exp `<clause>` ...{`<else-clause>`})
; `<clause>` ::= (``<pattern>` {`<guard>`} exp ...)
; `<else-clause>` ::= (else exp ...)
; `<guard>` ::= (guard boolean-exp ...)
; `<pattern>` :: =
;        ,var  -- matches always and binds the var
;                 pattern must be linear! No check is done
;         __    -- matches always, does not bind
;        exp   -- comparison with exp (using equal?)
;        (`<pattern1>` `<pattern2>` ...) -- matches the list of patterns
;        (`<pattern1>` . `<pattern2>`)  -- matches the pair of patterns

(define-syntax pmatch
  (syntax-rules ()
    ((_ v c ...) (pmatch-who #f v c ...))))

(define-syntax pmatch-who
  (syntax-rules (else guard)
    ((_ name (rator rand ...) c ...)
     (let ((v (rator rand ...)))
       (pmatch-aux '(rator rand ...) name v c ...)))
    ((_ name v c ...)
     (pmatch-aux 'v name v c ...))))

(define-syntax pmatch-aux
  (syntax-rules (else guard quasiquote)
    ((_ w name v)
     (begin
       (if 'name
           (printf "pmatch ~s failed\n" 'name)
           (printf "pmatch failed\n"))
       (printf "with input ~s evaluating to ~s\n" w v)
       (error 'pmatch "match failed")))
    ((_ w name v (else e0 e ...)) (begin e0 e ...))
    ((_ w name v ((quasiquote pat) (guard g ...) e0 e ...) cs ...)
     (let ((fk (lambda () (pmatch-aux w name v cs ...))))
       (ppat v pat (if (and g ...) (begin e0 e ...) (fk)) (fk))))
    ((_ w name v ((quasiquote pat) e0 e ...) cs ...)
     (let ((fk (lambda () (pmatch-aux w name v cs ...))))
       (ppat v pat (begin e0 e ...) (fk))))))

(define-syntax ppat
  (syntax-rules (unquote __)
    ((_ v __ kt kf) kt)
    ((_ v (unquote var) kt kf) (let ((var v)) kt))
    ((_ v (x . y) kt kf)
     (if (pair? v)
       (let ((vx (car v)) (vy (cdr v)))
	 (ppat vx x (ppat vy y kt kf) kf))
       kf))
    ((_ v lit kt kf) (if (equal? v (quote lit)) kt kf))))


define
├── eval-expr
└── lambda
    ├── parameters
    │   ├── expr
    │   └── env
    └── pmatch
        ├── expr
        ├── cons
        │   ├── unquote
        │   │   └── x
        │   ├── guard
        │   │   └── symbol?
        │   │       └── x
        │   └── env
        │       └── x
        ├── cons
        │   ├── cons
        │   │   ├── lambda
        │   │   ├── cons
        │   │   │   ├── unquote
        │   │   │   │   └── x
        │   │   │   └── body
        │   │   └── lambda
        │   │       ├── parameters
        │   │       │   └── arg
        │   │       └── eval-expr
        │   │           ├── body
        │   │           └── lambda
        │   │               ├── parameters
        │   │               │   └── y
        │   │               └── if
        │   │                   ├── test
        │   │                   │   └── eq?
        │   │                   │       ├── x
        │   │                   │       └── y
        │   │                   ├── cons
        │   │                   │   ├── arg
        │   │                   │   └── env
        │   │                   │       └── y
        ├── cons
        │   ├── cons
        │   │   ├── unquote
        │   │   │   └── rator
        │   │   └── unquote
        │   │       └── rand
        │   └── cons
        │       ├── function-call
        │       │   ├── eval-expr
        │       │   │   ├── rator
        │       │   │   └── env
        │       ├── eval-expr
        │       │   ├── rand
        │       │   └── env
