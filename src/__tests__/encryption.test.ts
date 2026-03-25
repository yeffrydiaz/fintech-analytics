import { encrypt, decrypt } from '@/lib/encryption';

describe('Encryption utilities', () => {
  it('should encrypt and decrypt a string successfully', () => {
    const original = 'Hello, World!';
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it('should encrypt to a different value than the original', () => {
    const original = 'sensitive data';
    const encrypted = encrypt(original);
    expect(encrypted).not.toBe(original);
  });

  it('should produce different encrypted values for the same input', () => {
    const original = 'same input';
    const encrypted1 = encrypt(original);
    const encrypted2 = encrypt(original);
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should encrypt and decrypt complex strings', () => {
    const original = JSON.stringify({ account: '1234-5678', balance: 50000.00 });
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it('should produce output in iv:authTag:encrypted format', () => {
    const encrypted = encrypt('test');
    const parts = encrypted.split(':');
    expect(parts).toHaveLength(3);
    expect(parts[0]).toMatch(/^[0-9a-f]+$/);
    expect(parts[1]).toMatch(/^[0-9a-f]+$/);
    expect(parts[2]).toMatch(/^[0-9a-f]+$/);
  });

  it('should throw an error for invalid encrypted format', () => {
    expect(() => decrypt('invalid-format')).toThrow('Invalid encrypted text format');
  });
});
