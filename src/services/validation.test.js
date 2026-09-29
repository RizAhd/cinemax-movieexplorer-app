import {
  validateFirstName,
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirm,
  validateSignUp,
  passwordChecks,
  passwordStrength,
} from './validation';

describe('validateFirstName', () => {
  test('accepts normal names', () => {
    ['Riflan', 'Anne-Marie', "D'Souza", 'José', 'Mary Jane', '  Ali  '].forEach((name) => {
      expect(validateFirstName(name)).toBe('');
    });
  });

  test('rejects empty, short, long and non letter names', () => {
    expect(validateFirstName('')).toMatch(/required/i);
    expect(validateFirstName('   ')).toMatch(/required/i);
    expect(validateFirstName('A')).toMatch(/at least 2/i);
    expect(validateFirstName('a'.repeat(31))).toMatch(/30/);
    expect(validateFirstName('R2D2')).toMatch(/letters/i);
    expect(validateFirstName('<b>x</b>')).toMatch(/letters/i);
    expect(validateFirstName(undefined)).toMatch(/required/i);
  });
});

describe('validateUsername', () => {
  test('accepts letters, numbers and underscore', () => {
    ['riflan', 'riflan_m', 'User123', 'abc', 'a'.repeat(20)].forEach((name) => {
      expect(validateUsername(name)).toBe('');
    });
  });

  test('rejects empty, short, long and other characters', () => {
    expect(validateUsername('')).toMatch(/required/i);
    expect(validateUsername('ab')).toMatch(/at least 3/i);
    expect(validateUsername('a'.repeat(21))).toMatch(/20/);
    expect(validateUsername('has space')).toMatch(/letters, numbers/i);
    expect(validateUsername('name@site')).toMatch(/letters, numbers/i);
    expect(validateUsername('émile')).toMatch(/letters, numbers/i);
  });
});

describe('validateEmail', () => {
  test('accepts normal emails', () => {
    ['name@example.com', 'first.last@mail.co.uk', 'a+tag@site.io', '  spaced@example.com  '].forEach((email) => {
      expect(validateEmail(email)).toBe('');
    });
  });

  test('rejects empty and badly shaped emails', () => {
    expect(validateEmail('')).toMatch(/required/i);
    ['plainaddress', '@example.com', 'name@', 'name@example', 'name@@example.com', 'na me@example.com', 'name@example.c'].forEach(
      (email) => {
        expect(validateEmail(email)).toMatch(/valid email/i);
      }
    );
    expect(validateEmail('a'.repeat(250) + '@x.com')).toMatch(/too long/i);
  });
});

describe('validatePassword', () => {
  test('accepts a password that follows every rule', () => {
    expect(validatePassword('Str0ng!Pass')).toBe('');
  });

  test('names the first missing rule', () => {
    expect(validatePassword('')).toMatch(/required/i);
    expect(validatePassword('Ab1!')).toMatch(/at least 8/i);
    expect(validatePassword('lowercase1!')).toMatch(/uppercase/i);
    expect(validatePassword('UPPERCASE1!')).toMatch(/lowercase/i);
    expect(validatePassword('NoNumbers!!')).toMatch(/number/i);
    expect(validatePassword('NoSymbols123')).toMatch(/symbol/i);
    expect(validatePassword('Aa1!' + 'x'.repeat(61))).toMatch(/64/);
  });

  test('passwordChecks lists every rule', () => {
    const checks = passwordChecks('abc');
    expect(checks).toHaveLength(5);
    expect(checks.find((c) => /lowercase/i.test(c.label)).ok).toBe(true);
    expect(checks.find((c) => /uppercase/i.test(c.label)).ok).toBe(false);
    expect(checks.find((c) => /8 characters/i.test(c.label)).ok).toBe(false);
  });
});

describe('passwordStrength', () => {
  test('empty password has no score', () => {
    expect(passwordStrength('')).toEqual({ score: 0, label: '' });
  });

  test('gets stronger with a better password', () => {
    expect(passwordStrength('abc').label).toBe('Weak');
    expect(passwordStrength('abcdefgh').label).toBe('Weak');
    expect(passwordStrength('Abcdefgh1').label).toBe('Fair');
    expect(passwordStrength('Abcdef1!').label).toBe('Good');
    expect(passwordStrength('Abcdef1!Abcdef1!').label).toBe('Strong');
  });

  test('the score never goes down when characters are added', () => {
    const passwords = ['a', 'ab', 'abcdefgh', 'Abcdefgh', 'Abcdefg1', 'Abcdef1!', 'Abcdef1!Abcdef1!'];
    const scores = passwords.map((p) => passwordStrength(p).score);
    const wentDown = scores.some((score, i) => i > 0 && score < scores[i - 1]);
    expect(wentDown).toBe(false);
  });
});

describe('validateConfirm', () => {
  test('needs a matching value', () => {
    expect(validateConfirm('Str0ng!Pass', '')).toMatch(/confirm/i);
    expect(validateConfirm('Str0ng!Pass', 'Str0ng!Pasx')).toMatch(/do not match/i);
    expect(validateConfirm('Str0ng!Pass', 'Str0ng!Pass')).toBe('');
  });
});

describe('validateSignUp', () => {
  const good = {
    firstName: 'Riflan',
    username: 'riflan_m',
    email: 'riflan@example.com',
    password: 'Str0ng!Pass',
    confirm: 'Str0ng!Pass',
  };

  test('a good form has no errors', () => {
    expect(validateSignUp(good)).toEqual({});
  });

  test('only the wrong fields have errors', () => {
    const errors = validateSignUp({ ...good, firstName: '', email: 'nope', confirm: 'different' });
    expect(Object.keys(errors).sort()).toEqual(['confirm', 'email', 'firstName']);
  });

  test('an empty form has an error for every field', () => {
    expect(Object.keys(validateSignUp({})).sort()).toEqual(['confirm', 'email', 'firstName', 'password', 'username']);
  });
});
