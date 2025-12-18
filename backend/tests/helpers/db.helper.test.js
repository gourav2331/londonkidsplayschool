const { query } = require('../../src/helpers/db.helper');
const pool = require('../../src/db/pool');

jest.mock('../../src/db/pool');

describe('DB Helper', () => {
  let mockClient, mockRelease;

  beforeEach(() => {
    mockRelease = jest.fn();
    mockClient = {
      query: jest.fn(),
      release: mockRelease,
    };

    pool.connect = jest.fn().mockResolvedValue(mockClient);
    jest.clearAllMocks();
  });

  it('should execute query and return result', async () => {
    const mockResult = { rows: [{ id: 1, name: 'Test' }] };
    mockClient.query.mockResolvedValue(mockResult);

    const result = await query('SELECT * FROM test', ['param1']);

    expect(pool.connect).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM test', ['param1']);
    expect(result).toEqual(mockResult);
    expect(mockRelease).toHaveBeenCalled();
  });

  it('should release client even if query fails', async () => {
    const error = new Error('Query failed');
    mockClient.query.mockRejectedValue(error);

    await expect(query('SELECT * FROM test', [])).rejects.toThrow('Query failed');

    expect(mockRelease).toHaveBeenCalled();
  });

  it('should handle empty params', async () => {
    const mockResult = { rows: [] };
    mockClient.query.mockResolvedValue(mockResult);

    const result = await query('SELECT * FROM test');

    expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM test', undefined);
    expect(result).toEqual(mockResult);
  });
});

