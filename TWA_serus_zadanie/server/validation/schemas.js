// Tento súbor obsahuje schémy pre validáciu vstupných údajov pomocou knižnice Ajv
// a formátov pre e-mail a dátum. Schémy sú definované pre vytvorenie zákazníka a prihlásenie.
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
require('ajv-formats')(ajv); 


const customerCreateSchema = {
    type: 'object',
    required: ['meno', 'priezvisko', 'email', 'heslo'],
    properties: {
        meno: { type: 'string', minLength: 2, maxLength: 50 },
        priezvisko: { type: 'string', minLength: 2, maxLength: 50 },
        email: { type: 'string', format: 'email' },
        telefon: { 
            type: 'string', 
            pattern: '^\\+?[0-9]{10,15}$'
        },
        ulica: { 
            type: 'string', 
            maxLength: 100 
        },
        mesto: { 
            type: 'string', 
            maxLength: 50 
        },
        psc: { 
            type: 'string', 
            pattern: '^[0-9]{5}$' 
        },
        datum_registracie: { 
            type: 'string', 
            format: 'date'
        },
        heslo: { 
            type: 'string', 
            minLength: 6 
        }
    },
    additionalProperties: false
};

const customerUpdateSchema = {
    type: 'object',
    properties: {
      meno: { type: 'string', minLength: 2, maxLength: 50 },
      priezvisko: { type: 'string', minLength: 2, maxLength: 50 },
      email: { type: 'string', format: 'email' },
      telefon: { type: 'string', pattern: '^\\+?[0-9]{9,15}$' },
      ulica: { type: 'string', maxLength: 100 },
      mesto: { type: 'string', maxLength: 50 },
      psc: { type: 'string', pattern: '^[0-9]{5}$' },
      heslo: { type: 'string', minLength: 6 }
    },
    additionalProperties: false
  };

// Login schéma
const loginSchema = {
  type: 'object',
  required: ['email', 'heslo'],
  properties: {
    email: { type: 'string', format: 'email' },
    heslo: { type: 'string' }
  },
  additionalProperties: false
};

// Compile schéma
const validateCustomerCreate = ajv.compile(customerCreateSchema);
const validateCustomerUpdate = ajv.compile(customerUpdateSchema);
const validateLogin = ajv.compile(loginSchema);

module.exports = {
  validateCustomerCreate,
  validateCustomerUpdate,
  validateLogin
};


// Schéma pre vytvorenie skladby
const trackCreateSchema = {
    type: 'object',
    required: ['nazov', 'interpret_meno', 'interpret_priezvisko', 'rok_vydania', 'cena'],
    properties: {
      nazov: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '^[A-Za-z0-9\\s\\-]+$' // písmená, čísla, medzery a pomlčky
      },
      interpret_meno: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        pattern: '^[A-Za-zÀ-ž\\s]+$' 
      },
      interpret_priezvisko: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        pattern: '^[A-Za-zÀ-ž\\s]+$' 
      },
      rok_vydania: {
        type: 'integer',
        minimum: 1900,
        maximum: new Date().getFullYear() 
      },
      cena: {
        type: 'number',
        minimum: 0
      },
      dostupnost: {
        type: 'string',
        enum: ['Dostupná', 'Nedostupná']
      },
      popis: {
        type: 'string',
        maxLength: 500 
      }
    },
    additionalProperties: false
  };
  
  // Schéma pre aktualizáciu skladby
  const trackUpdateSchema = {
    type: 'object',
    properties: {
      nazov: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '^[A-Za-z0-9\\s\\-]+$'
      },
      interpret_meno: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        pattern: '^[A-Za-zÀ-ž\\s]+$'
      },
      interpret_priezvisko: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        pattern: '^[A-Za-zÀ-ž\\s]+$'
      },
      rok_vydania: {
        type: 'integer',
        minimum: 1900,
        maximum: new Date().getFullYear()
      },
      cena: {
        type: 'number',
        minimum: 0
      },
      dostupnost: {
        type: 'string',
        enum: ['Dostupná', 'Nedostupná']
      },
      popis: {
        type: 'string',
        maxLength: 500
      }
    },
    additionalProperties: false
  };
  
  // Kompilácia schém
  const validateTrackCreate = ajv.compile(trackCreateSchema);
  const validateTrackUpdate = ajv.compile(trackUpdateSchema);
  
  // Exportovanie schém
  module.exports = {
    validateCustomerCreate,
    validateCustomerUpdate,
    validateLogin,
    validateTrackCreate,
    validateTrackUpdate
  };