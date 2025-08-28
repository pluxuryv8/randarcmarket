import { generateSeed, hashSeed, makeRand, verifyCommitReveal, randToFloat } from '../util/commitReveal';

describe('Commit-Reveal Utilities', () => {
  describe('generateSeed', () => {
    it('should generate a 64-character hex string', () => {
      const seed = generateSeed();
      expect(seed).toHaveLength(64);
      expect(seed).toMatch(/^[0-9a-f]+$/);
    });

    it('should generate different seeds on each call', () => {
      const seed1 = generateSeed();
      const seed2 = generateSeed();
      expect(seed1).not.toBe(seed2);
    });
  });

  describe('hashSeed', () => {
    it('should generate consistent SHA256 hash', () => {
      const seed = 'test-seed-123';
      const hash1 = hashSeed(seed);
      const hash2 = hashSeed(seed);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
      expect(hash1).toMatch(/^[0-9a-f]+$/);
    });

    it('should generate different hashes for different seeds', () => {
      const hash1 = hashSeed('seed1');
      const hash2 = hashSeed('seed2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('makeRand', () => {
    it('should generate consistent HMAC', () => {
      const serverSeed = 'server-seed-123';
      const publicSalt = 'public-salt-456';
      
      const rand1 = makeRand(serverSeed, publicSalt);
      const rand2 = makeRand(serverSeed, publicSalt);
      
      expect(rand1).toBe(rand2);
      expect(rand1).toHaveLength(64);
      expect(rand1).toMatch(/^[0-9a-f]+$/);
    });

    it('should generate different rand for different inputs', () => {
      const serverSeed = 'server-seed-123';
      const publicSalt1 = 'salt1';
      const publicSalt2 = 'salt2';
      
      const rand1 = makeRand(serverSeed, publicSalt1);
      const rand2 = makeRand(serverSeed, publicSalt2);
      
      expect(rand1).not.toBe(rand2);
    });
  });

  describe('verifyCommitReveal', () => {
    it('should verify correct commit-reveal pair', () => {
      const serverSeed = 'test-server-seed';
      const seedHash = hashSeed(serverSeed);
      
      expect(verifyCommitReveal(seedHash, serverSeed)).toBe(true);
    });

    it('should reject incorrect commit-reveal pair', () => {
      const serverSeed = 'test-server-seed';
      const wrongSeed = 'wrong-seed';
      const seedHash = hashSeed(serverSeed);
      
      expect(verifyCommitReveal(seedHash, wrongSeed)).toBe(false);
    });
  });

  describe('randToFloat', () => {
    it('should generate float between 0 and 1', () => {
      const rand = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const float = randToFloat(rand);
      
      expect(float).toBeGreaterThanOrEqual(0);
      expect(float).toBeLessThan(1);
    });

    it('should generate consistent float for same rand', () => {
      const rand = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
      const float1 = randToFloat(rand);
      const float2 = randToFloat(rand);
      
      expect(float1).toBe(float2);
    });

    it('should generate different floats for different rand', () => {
      const rand1 = '1111111111111111111111111111111111111111111111111111111111111111';
      const rand2 = '2222222222222222222222222222222222222222222222222222222222222222';
      
      const float1 = randToFloat(rand1);
      const float2 = randToFloat(rand2);
      
      expect(float1).not.toBe(float2);
    });
  });

  describe('Integration test', () => {
    it('should work end-to-end for commit-reveal process', () => {
      // 1. Generate server seed
      const serverSeed = generateSeed();
      
      // 2. Create commit hash
      const seedHash = hashSeed(serverSeed);
      
      // 3. Verify commit-reveal
      expect(verifyCommitReveal(seedHash, serverSeed)).toBe(true);
      
      // 4. Generate public salt
      const publicSalt = Date.now().toString();
      
      // 5. Create final rand
      const rand = makeRand(serverSeed, publicSalt);
      
      // 6. Convert to float
      const float = randToFloat(rand);
      
      // 7. Verify all values are valid
      expect(serverSeed).toHaveLength(64);
      expect(seedHash).toHaveLength(64);
      expect(rand).toHaveLength(64);
      expect(float).toBeGreaterThanOrEqual(0);
      expect(float).toBeLessThan(1);
    });
  });
});
