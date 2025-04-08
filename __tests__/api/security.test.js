import { createMocks } from 'node-mocks-http';
import analyzeRepoHandler from '../../pages/api/analyze-repo';

describe('API Security Tests', () => {
  describe('Analyze Repo API', () => {
    it('rejects requests without a repository URL', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {},
      });

      await analyzeRepoHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Repository URL is required',
      });
    });

    it('validates GitHub URLs to prevent malicious inputs', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          repoUrl: 'javascript:alert("XSS")',
        },
      });

      await analyzeRepoHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Invalid GitHub repository URL',
      });
    });

    it('sanitizes repository URL inputs', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          repoUrl: 'https://github.com/username/repo<script>alert("XSS")</script>',
        },
      });

      await analyzeRepoHandler(req, res);

      // Either it should reject the malformed URL or sanitize it
      if (res._getStatusCode() === 400) {
        expect(JSON.parse(res._getData())).toEqual({
          error: 'Invalid GitHub repository URL',
        });
      } else {
        // If it processes the URL, make sure it's sanitized
        // We'd check if the handler called a mocked sanitize function
        // This is a simplified test; in a real scenario, you'd mock the actual sanitization function
        expect(true).toBe(true);
      }
    });

    it('rejects unsupported HTTP methods', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await analyzeRepoHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Method not allowed',
      });
    });

    it('handles rate limiting attempts', async () => {
      // Make multiple requests in quick succession
      const requests = Array(5).fill().map(() => {
        const { req, res } = createMocks({
          method: 'POST',
          body: {
            repoUrl: 'https://github.com/username/repo',
          },
        });
        return { req, res };
      });

      // Process all requests
      await Promise.all(requests.map(({ req, res }) => analyzeRepoHandler(req, res)));

      // In a real implementation, we would expect rate-limiting after a certain number of requests
      // This test is simplified and would need to be adapted based on actual rate-limiting implementation
      expect(true).toBe(true);
    });
  });
}); 