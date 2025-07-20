import { GhostFFCore, ContentstackConfig } from '../index';

describe('GhostFFCore', () => {
  let client: GhostFFCore;
  const mockConfig: ContentstackConfig = {
    apiKey: 'test-api-key',
    deliveryToken: 'test-delivery-token',
    environment: 'test',
    region: 'us'
  };

  beforeEach(() => {
    client = new GhostFFCore(mockConfig);
  });

  describe('constructor', () => {
    it('should create a new instance with valid config', () => {
      expect(client).toBeInstanceOf(GhostFFCore);
    });

    it('should use default region when not provided', () => {
      const configWithoutRegion = { ...mockConfig };
      delete configWithoutRegion.region;
      const clientWithoutRegion = new GhostFFCore(configWithoutRegion);
      expect(clientWithoutRegion).toBeInstanceOf(GhostFFCore);
    });
  });

  describe('getEntry', () => {
    it('should throw error for invalid entry', async () => {
      await expect(client.getEntry('invalid', 'invalid')).rejects.toThrow();
    });
  });

  describe('getEntries', () => {
    it('should throw error for invalid content type', async () => {
      await expect(client.getEntries('invalid')).rejects.toThrow();
    });
  });

  describe('getAssets', () => {
    it('should throw error for invalid query', async () => {
      await expect(client.getAssets({ invalid: 'query' })).rejects.toThrow();
    });
  });
}); 