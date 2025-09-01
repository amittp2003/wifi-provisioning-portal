const redis = require('redis');

async function testRedis() {
  const client = redis.createClient({
    socket: {
      host: 'localhost',
      port: 6379
    }
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  try {
    await client.connect();
    console.log('Connected to Redis');

    // Test basic operations
    await client.set('test_key', 'test_value');
    const value = await client.get('test_key');
    console.log('Test value:', value);

    // Test hash operations
    await client.hSet('test_hash', 'field1', 'value1');
    const hashValue = await client.hGet('test_hash', 'field1');
    console.log('Hash value:', hashValue);

    // Clean up
    await client.del('test_key');
    await client.del('test_hash');

    console.log('Redis test completed successfully');
  } catch (error) {
    console.error('Redis test failed:', error);
  } finally {
    await client.disconnect();
    console.log('Disconnected from Redis');
  }
}

testRedis();
