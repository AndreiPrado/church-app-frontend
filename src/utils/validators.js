/**
 * Validadores para formulários
 */

/**
 * Valida CPF usando algoritmo de dígitos verificadores
 * @param {string} cpf - CPF no formato XXX.XXX.XXX-XX ou apenas números
 * @returns {boolean} - True se o CPF é válido
 */
export function validateCPF(cpf) {
  // Remove caracteres não numéricos
  const cleanCpf = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CPFs inválidos conhecidos)
  if (/^(\d)\1{10}$/.test(cleanCpf)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;

  if (parseInt(cleanCpf.charAt(9)) !== firstDigit) {
    return false;
  }

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;

  if (parseInt(cleanCpf.charAt(10)) !== secondDigit) {
    return false;
  }

  return true;
}

/**
 * Valida se o campo não está vazio
 * @param {string} value - Valor do campo
 * @returns {boolean} - True se o campo não está vazio
 */
export function validateRequired(value) {
  return value !== null && value !== undefined && value.trim() !== '';
}

/**
 * Valida e-mail
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} - True se o e-mail é válido
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone no formato (XX) XXXXX-XXXX
 * @returns {boolean} - True se o telefone é válido
 */
export function validatePhone(phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 11;
}

/**
 * Valida CEP
 * @param {string} cep - CEP no formato XXXXX-XXX
 * @returns {boolean} - True se o CEP é válido
 */
export function validateCEP(cep) {
  const cleanCep = cep.replace(/\D/g, '');
  return cleanCep.length === 8;
}

/**
 * Valida data no formato DD/MM/YYYY
 * @param {string} date - Data no formato DD/MM/YYYY
 * @returns {boolean} - True se a data é válida
 */
export function validateDate(date) {
  if (!date || date.length !== 10) return false;
  
  const [day, month, year] = date.split('/').map(Number);
  
  if (!day || !month || !year) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  // Verifica dias válidos por mês
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Verifica ano bissexto
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29;
  }
  
  return day <= daysInMonth[month - 1];
}
