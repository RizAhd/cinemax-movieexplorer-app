import { registerUser, loginUser, hashPassword, getAccount, updateProfile, changePassword } from './auth';

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
    test('creates an account and returns the public user', async () => {
      const result = await registerUser(form);
      expect(result.ok).toBe(true);
      expect(result.user).toEqual({ firstName: 'Riflan', username: 'riflan_m', email: 'riflan@example.com' });
    });

    test('never saves the password as plain text', async () => {
      await registerUser(form);
      expect(localStorage.getItem('users')).not.toContain('Str0ng!Pass');
      const [account] = savedUsers();
      expect(account.passwordHash).toMatch(/^[0-9a-f]{64}$/);
      expect(account.salt).toMatch(/^[0-9a-f]{32}$/);
    });

    test('the same password gets a different salt and hash for each account', async () => {
      await registerUser(form);
      await registerUser({ ...form, username: 'second_user', email: 'second@example.com' });
      const [first, second] = savedUsers();
      expect(first.salt).not.toBe(second.salt);
      expect(first.passwordHash).not.toBe(second.passwordHash);
    });

    test('rejects a bad form and saves nothing', async () => {
      const result = await registerUser({ ...form, email: 'nope', password: 'weak', confirm: 'weak' });
      expect(result.ok).toBe(false);
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.password).toBeTruthy();
      expect(savedUsers()).toHaveLength(0);
    });

    test('rejects a used email, whatever the capitals', async () => {
      await registerUser(form);
      const result = await registerUser({ ...form, username: 'other_name', email: 'RIFLAN@example.COM' });
      expect(result.ok).toBe(false);
      expect(result.errors.email).toMatch(/already exists/i);
      expect(savedUsers()).toHaveLength(1);
    });

    test('rejects a used username, whatever the capitals', async () => {
      await registerUser(form);
      const result = await registerUser({ ...form, username: 'RIFLAN_M', email: 'other@example.com' });
      expect(result.ok).toBe(false);
      expect(result.errors.username).toMatch(/already taken/i);
    });

    test('reports a used email and a used username together', async () => {
      await registerUser(form);
      const result = await registerUser(form);
      expect(Object.keys(result.errors).sort()).toEqual(['email', 'username']);
    });

    test('gives an error when storage cannot be written', async () => {
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

    test('logs in with the email', async () => {
      const result = await loginUser('riflan@example.com', 'Str0ng!Pass');
      expect(result.ok).toBe(true);
      expect(result.user.username).toBe('riflan_m');
    });

    test('logs in with the username, capitals and spaces do not matter', async () => {
      expect((await loginUser('riflan_m', 'Str0ng!Pass')).ok).toBe(true);
      expect((await loginUser('  RIFLAN_M  ', 'Str0ng!Pass')).ok).toBe(true);
      expect((await loginUser('RIFLAN@EXAMPLE.COM', 'Str0ng!Pass')).ok).toBe(true);
    });

    test('the password is case sensitive', async () => {
      expect((await loginUser('riflan_m', 'str0ng!pass')).ok).toBe(false);
    });

    test('wrong password and unknown account give the same message', async () => {
      const wrongPassword = await loginUser('riflan_m', 'Wrong!Pass1');
      const noAccount = await loginUser('nobody@example.com', 'Str0ng!Pass');
      expect(wrongPassword.ok).toBe(false);
      expect(noAccount.ok).toBe(false);
      expect(wrongPassword.error).toBe(noAccount.error);
    });

    test('needs both fields', async () => {
      expect((await loginUser('', 'Str0ng!Pass')).ok).toBe(false);
      expect((await loginUser('riflan_m', '')).ok).toBe(false);
      expect((await loginUser(undefined, undefined)).ok).toBe(false);
    });

    test('broken saved accounts do not crash it', async () => {
      localStorage.setItem('users', '{oops');
      expect((await loginUser('riflan_m', 'Str0ng!Pass')).ok).toBe(false);
      localStorage.setItem('users', JSON.stringify([{ username: 'riflan_m' }, null, 5]));
      expect((await loginUser('riflan_m', 'Str0ng!Pass')).ok).toBe(false);
    });
  });

  describe('getAccount', () => {
    test('gives the public details, or null', async () => {
      await registerUser(form);
      expect(getAccount('RIFLAN_M')).toEqual({ firstName: 'Riflan', username: 'riflan_m', email: 'riflan@example.com' });
      expect(getAccount('nobody')).toBeNull();
    });
  });

  describe('updateProfile', () => {
    beforeEach(async () => {
      await registerUser(form);
      await registerUser({ ...form, username: 'second_user', email: 'second@example.com', firstName: 'Second' });
    });

    test('changes the first name without a password', async () => {
      const result = await updateProfile('riflan_m', { firstName: 'Riflan Ahmed', email: 'riflan@example.com' });
      expect(result.ok).toBe(true);
      expect(result.user).toEqual({ firstName: 'Riflan Ahmed', username: 'riflan_m', email: 'riflan@example.com' });
      expect(getAccount('riflan_m').firstName).toBe('Riflan Ahmed');
    });

    test('changes the email with the right password, and login works with it', async () => {
      const result = await updateProfile('riflan_m', {
        firstName: 'Riflan',
        email: 'New.Email@Example.com',
        currentPassword: 'Str0ng!Pass',
      });
      expect(result.ok).toBe(true);
      expect(result.user.email).toBe('new.email@example.com');
      expect((await loginUser('new.email@example.com', 'Str0ng!Pass')).ok).toBe(true);
      expect((await loginUser('riflan@example.com', 'Str0ng!Pass')).ok).toBe(false);
    });

    test('does not change the email without the password', async () => {
      const result = await updateProfile('riflan_m', { firstName: 'Riflan', email: 'other@example.com' });
      expect(result.ok).toBe(false);
      expect(result.errors.currentPassword).toMatch(/current password/i);
      expect(getAccount('riflan_m').email).toBe('riflan@example.com');
    });

    test('does not change the email with a wrong password', async () => {
      const result = await updateProfile('riflan_m', {
        firstName: 'Riflan',
        email: 'other@example.com',
        currentPassword: 'Wrong!Pass1',
      });
      expect(result.ok).toBe(false);
      expect(result.errors.currentPassword).toMatch(/not correct/i);
      expect(getAccount('riflan_m').email).toBe('riflan@example.com');
    });

    test('does not allow the email of another account', async () => {
      const result = await updateProfile('riflan_m', {
        firstName: 'Riflan',
        email: 'SECOND@example.com',
        currentPassword: 'Str0ng!Pass',
      });
      expect(result.ok).toBe(false);
      expect(result.errors.email).toMatch(/already exists/i);
    });

    test('rejects a bad first name and a bad email', async () => {
      const result = await updateProfile('riflan_m', { firstName: 'R2', email: 'nope' });
      expect(result.ok).toBe(false);
      expect(Object.keys(result.errors).sort()).toEqual(['email', 'firstName']);
    });

    test('never changes the username or the password', async () => {
      const before = JSON.parse(localStorage.getItem('users'))[0];
      const result = await updateProfile('riflan_m', {
        firstName: 'Riflan',
        email: 'riflan@example.com',
        username: 'hacker',
        password: 'Hack3r!Pass',
        passwordHash: 'x',
      });
      expect(result.ok).toBe(true);
      const after = JSON.parse(localStorage.getItem('users'))[0];
      expect(after.username).toBe('riflan_m');
      expect(after.passwordHash).toBe(before.passwordHash);
      expect(after.salt).toBe(before.salt);
    });

    test('leaves the other accounts alone', async () => {
      await updateProfile('riflan_m', { firstName: 'Changed', email: 'riflan@example.com' });
      expect(getAccount('second_user').firstName).toBe('Second');
    });

    test('gives an error when there is no saved account', async () => {
      const result = await updateProfile('ghost', { firstName: 'Ghost', email: 'ghost@example.com' });
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/could not find your account/i);
    });
  });

  describe('changePassword', () => {
    const change = (values) => changePassword('riflan_m', values);
    const good = { currentPassword: 'Str0ng!Pass', newPassword: 'N3w!Password', confirm: 'N3w!Password' };

    beforeEach(async () => {
      await registerUser(form);
    });

    test('the new password works and the old one stops working', async () => {
      expect((await change(good)).ok).toBe(true);
      expect((await loginUser('riflan_m', 'N3w!Password')).ok).toBe(true);
      expect((await loginUser('riflan_m', 'Str0ng!Pass')).ok).toBe(false);
    });

    test('uses a new salt and never saves plain text', async () => {
      const before = savedUsers()[0];
      await change(good);
      const after = savedUsers()[0];
      expect(after.salt).not.toBe(before.salt);
      expect(after.passwordHash).not.toBe(before.passwordHash);
      expect(localStorage.getItem('users')).not.toContain('N3w!Password');
    });

    test('needs the right current password', async () => {
      const empty = await change({ ...good, currentPassword: '' });
      expect(empty.errors.currentPassword).toMatch(/enter your current password/i);
      const wrong = await change({ ...good, currentPassword: 'Wrong!Pass1' });
      expect(wrong.errors.currentPassword).toMatch(/not correct/i);
      expect((await loginUser('riflan_m', 'Str0ng!Pass')).ok).toBe(true);
    });

    test('the new password must follow the rules and match the confirmation', async () => {
      const weak = await change({ ...good, newPassword: 'weak', confirm: 'weak' });
      expect(weak.errors.newPassword).toBeTruthy();
      const mismatch = await change({ ...good, confirm: 'N3w!Passwore' });
      expect(mismatch.errors.confirm).toMatch(/do not match/i);
    });

    test('the new password must be different from the current one', async () => {
      const same = await change({ currentPassword: 'Str0ng!Pass', newPassword: 'Str0ng!Pass', confirm: 'Str0ng!Pass' });
      expect(same.ok).toBe(false);
      expect(same.errors.newPassword).toMatch(/different/i);
    });

    test('gives an error when there is no saved account', async () => {
      const result = await changePassword('ghost', good);
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/could not find your account/i);
    });
  });

  test('hashPassword changes with the salt', async () => {
    const one = await hashPassword('Str0ng!Pass', 'salt-one');
    const two = await hashPassword('Str0ng!Pass', 'salt-two');
    expect(one).toMatch(/^[0-9a-f]{64}$/);
    expect(one).not.toBe(two);
  });
});
