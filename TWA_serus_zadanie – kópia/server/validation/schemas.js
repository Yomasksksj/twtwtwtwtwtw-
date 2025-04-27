const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
require('ajv-formats')(ajv);

// Schéma pre vytvorenie zákazníka
const customerCreateSchema = {
  type: 'object',
  required: ['meno', 'priezvisko', 'email', 'heslo'],
  properties: {
    meno: { type: 'string', minLength: 2, maxLength: 50 },
    priezvisko: { type: 'string', minLength: 2, maxLength: 50 },
    email: { type: 'string', format: 'email' },
    telefon: { type: 'string', pattern: '^\\+?[0-9]{10,15}$' },
    ulica: { type: 'string', maxLength: 100 },
    mesto: { type: 'string', maxLength: 50 },
    psc: { type: 'string', pattern: '^[0-9]{5}$' },
    datum_registracie: { type: 'string', format: 'date' },
    heslo: { type: 'string', minLength: 6 }
  },
  additionalProperties: false
};

// Schéma pre aktualizáciu zákazníka
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

// Schéma pre vytvorenie skladby
const trackCreateSchema = {
  type: 'object',
  required: ['nazov', 'interpret_meno', 'interpret_priezvisko', 'rok_vydania', 'cena'],
  properties: {
    nazov: { type: 'string', minLength: 1, maxLength: 100, pattern: '^[A-Za-z0-9\\s\\-]+$' },
    interpret_meno: { type: 'string', minLength: 1, maxLength: 50, pattern: '^[A-Za-zÀ-ž\\s]+$' },
    interpret_priezvisko: { type: 'string', minLength: 1, maxLength: 50, pattern: '^[A-Za-zÀ-ž\\s]+$' },
    id_producent: { type: ['integer', 'null'] },
    rok_vydania: { type: 'integer', minimum: 1900, maximum: new Date().getFullYear() },
    cena: { type: 'number', minimum: 0 },
    dostupnost: { type: 'string', enum: ['Dostupná', 'Nedostupná'] },
    popis: { type: 'string', maxLength: 500 },
    zanr: { type: 'string', maxLength: 50 },
    dlzka_min: { type: 'integer', minimum: 1 }
  },
  additionalProperties: false
};

// Schéma pre aktualizáciu skladby
const trackUpdateSchema = {
  type: 'object',
  properties: {
    nazov: { type: 'string', minLength: 1, maxLength: 100, pattern: '^[A-Za-z0-9\\s\\-]+$' },
    interpret_meno: { type: 'string', minLength: 1, maxLength: 50, pattern: '^[A-Za-zÀ-ž\\s]+$' },
    interpret_priezvisko: { type: 'string', minLength: 1, maxLength: 50, pattern: '^[A-Za-zÀ-ž\\s]+$' },
    id_producent: { type: ['integer', 'null'] },
    rok_vydania: { type: 'integer', minimum: 1900, maximum: new Date().getFullYear() },
    cena: { type: 'number', minimum: 0 },
    dostupnost: { type: 'string', enum: ['Dostupná', 'Nedostupná'] },
    popis: { type: 'string', maxLength: 500 },
    zanr: { type: 'string', maxLength: 50 },
    dlzka_min: { type: 'integer', minimum: 1 }
  },
  additionalProperties: false
};

// Schéma pre vytvorenie producenta
const producerCreateSchema = {
  type: 'object',
  required: ['nazov_spolocnosti'],
  properties: {
    nazov_spolocnosti: { type: 'string', minLength: 1, maxLength: 100 },
    meno: { type: 'string', maxLength: 50 },
    priezvisko: { type: 'string', maxLength: 50 },
    email: { type: 'string', format: 'email', maxLength: 100 },
    telefon: { type: 'string', maxLength: 20, pattern: '^\\+?[0-9]{9,15}$' },
    web: { type: 'string', maxLength: 100 }
  },
  additionalProperties: false
};

// Schéma pre aktualizáciu producenta
const producerUpdateSchema = {
  type: 'object',
  properties: {
    nazov_spolocnosti: { type: 'string', minLength: 1, maxLength: 100 },
    meno: { type: 'string', maxLength: 50 },
    priezvisko: { type: 'string', maxLength: 50 },
    email: { type: 'string', format: 'email', maxLength: 100 },
    telefon: { type: 'string', maxLength: 20, pattern: '^\\+?[0-9]{9,15}$' },
    web: { type: 'string', maxLength: 100 }
  },
  additionalProperties: false
};

// Kompilácia schém
const validateCustomerCreate = ajv.compile(customerCreateSchema);
const validateCustomerUpdate = ajv.compile(customerUpdateSchema);
const validateLogin = ajv.compile(loginSchema);
const validateTrackCreate = ajv.compile(trackCreateSchema);
const validateTrackUpdate = ajv.compile(trackUpdateSchema);
const validateProducerCreate = ajv.compile(producerCreateSchema);
const validateProducerUpdate = ajv.compile(producerUpdateSchema);

// Exportovanie schém
module.exports = {
  validateCustomerCreate,
  validateCustomerUpdate,
  validateLogin,
  validateTrackCreate,
  validateTrackUpdate,
  validateProducerCreate,
  validateProducerUpdate
};