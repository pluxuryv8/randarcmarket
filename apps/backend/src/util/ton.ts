/**
 * Получает последний block hash из TON API
 * Fallback: если API недоступен, возвращает timestamp
 */
export async function getLatestBlockHash(): Promise<string> {
  try {
    const response = await fetch('https://tonapi.io/v2/blockchain/blocks?limit=1', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RandarMarket/1.0'
      },
      // Timeout 5 секунд
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`TON API responded with status: ${response.status}`);
    }

    const data = await response.json() as any;
    
    if (!data.blocks || !Array.isArray(data.blocks) || data.blocks.length === 0) {
      throw new Error('No blocks returned from TON API');
    }

    const latestBlock = data.blocks[0];
    
    // Используем hash если доступен, иначе seqno
    const blockHash = latestBlock.hash || latestBlock.seqno?.toString();
    
    if (!blockHash) {
      throw new Error('No hash or seqno found in block data');
    }

    console.log(`✅ TON block hash obtained: ${blockHash}`);
    return blockHash;

  } catch (error) {
    console.warn(`⚠️ Failed to get TON block hash: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.warn('⚠️ Falling back to timestamp');
    
    const fallbackHash = Date.now().toString();
    console.log(`✅ Using fallback hash: ${fallbackHash}`);
    return fallbackHash;
  }
}

/**
 * Проверяет доступность TON API
 */
export async function checkTonApiHealth(): Promise<boolean> {
  try {
    const response = await fetch('https://tonapi.io/v2/blockchain/blocks?limit=1', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(3000)
    });
    
    return response.ok;
  } catch {
    return false;
  }
}
