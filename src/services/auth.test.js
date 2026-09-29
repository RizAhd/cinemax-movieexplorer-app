import { registerUser, loginUser, hashPassword } from './auth';

const form = {
  firstName: 'Riflan',
  username: 'riflan_m',
  email: 'Riflan@Example.com',
  password: 'Str0ng!Pass',
  confirm: 'Str0ng!Pass',
};

const savedUsers = () => JSON.parse(localStorage.getItem('users') || '[]');

describe('auth service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('registerUser', () => {
    test('creates an account and returns the public user (no password, no hash)', async () => {
      const result = await registerUser(form);
      expect(result.ok).toBe(true);
      expect(result.user).toEqual({ firstName: 'Riflan', username: 'riflan_m', email: 'riflan@example.com' });
    });

    test('never saves the password as plain text', async () => {
      await registerUser(form);
      const raw = localStorage.getItem('users');
      expect(raw).not.toContain('Str0ng!Pass');
      const [account] = savedUsers();
      expect(account.passwordHash).toMatch(/^[0-9a-f]{64}$/);
      expect(account.salt).toMatch(/^[0-9a-f]{32}$/);
    });

    test('gives two accounts with the same password different salts and hashes', async () => {
      await registerUser(form);
      await registerUser({ ...form, username: 'second_user', email: 'second@example.com' });
      const [first, second] = savedUsers();
      expect(first.salt).not.toBe(second.salt);
      expect(first.passwordHash).not.toBe(second.passwordHash);
    });

    test('rejects a form with errors and saves nothing', async () => {
      const result = await registerUser({ ...form, email: 'nope', password: 'weak', confirm: 'weak' });
      expect(result.ok).toBe(false);
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.password).toBeTruthy();
      expect(savedUsers()).toHaveLength(0);
    });

    test('rejects an email that is already used, also with different upper and lower case', async () => {
      await registerUser(form);
      const result = await registerUser({ ...form, username: 'other_name', email: 'RIFLAN@example.COM' });
      expect(result.ok).toBe(false);
      expect(result.errors.email).toMatch(/already exists/i);
      expect(savedUsers()).toHaveLength(1);
    });

    test('rejects a username that is already used, also with different upper and lower case', async () => {
      await registerUser(form);
      const result = await registerUser({ ...form, username: 'RIFLAN_M', email: 'other@example.com' });
      expect(result.ok).toBe(false);
      expect(result.errors.username).toMatch(/already taken/i);
    });

    test('reports both a used email and a used username together', async () => {
      await registerUser(form);
      const result = await registerUser(form);
      expect(Object.keys(result.errors).sort()).toEqual(['email', 'username']);
    });

    test('gives a friendly error when the browser storage cannot be written', async () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('storage full');
      });
      try {
        const result = await registerUser(form);
        expect(result.ok).toBe(false);
        expect(result.error).toMatch(/could not save/i);
      } finally {
        spy.mockRestore();
      }
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
      await registerUser(form);
    });

    test('logs in with the email and the right password', async () => {
      const result = await loginUser('riflan@example.com', 'Str0ng!Pass');
      expect(result.ok).toBe(true);
      expect(result.user.username).toBe('riflan_m');
    });

    test('logs in with the username, and upper and lower case do not matter for the name', async () => {
      expect((await loginUser('riflan_m', 'Str0ng!Pass')).ok).toBe(true);
      expect((await loginUser('  RIFLAN_M  ', 'Str0ng!Pass')).ok).toBe(true);
      expect((await loginUser('RIFLAN@EXAMPLE.COM', 'Str0ng!Pass')).ok).toBe(true);
    });

    test('the password is case sensitive', async () => {
      expect((await loginUser('riflan_m', 'str0ng!pass')).ok).toBe(false);
    });

    test('gives the same message for a wrong password and for an account that does not exist', async () => {
      const wrongPassword = await loginUser('riflan_m', 'Wrong!Pass1');
      const noAccount = await loginUser('nobody@example.com', 'Str0ng!Pass');
      expect(wrongPassword.ok).toBe(false);
      expect(noAccount.ok).toBe(false);
      expect(wrongPassword.error).toBe(noAccount.error);
    });

    test('asks for both fields when one is empty', async () => {
      expect((await loginUser('', 'Str0ng!Pass')).ok).toBe(false);
      expect((await loginUser('riflan_m', '')).ok).toBe(false);
      expect((await loginUser(undefined, undefined)).ok).toBe(false);
    });

    test('does not crash when the saved accounts are broken', async () => {
      localStorage.setItem('users', '{oops');
      expect((await loginUser('riflan_m', 'Str0ng!Pass')).ok).toBe(false);
      localStorage.setItem('users', JSON.stringify([{ username: 'riflan_m' }, null, 5]));
      expect((await loginUser('riflan_m', 'Str0ng!Pass')).ok).toBe(false);
    });
  });

  test('hashPassword gives a different hash for a different salt', async () => {
    const one = await hashPassword('Str0ng!Pass', 'salt-one');
    const two = await hashPassword('Str0ng!Pass', 'salt-two');
    expect(one).toMatch(/^[0-9a-f]{64}$/);
    expect(one).not.toBe(two);
  });
});
