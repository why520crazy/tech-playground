import { connect } from 'https://denopkg.com/keroxp/deno-redis/redis.ts';
import { info, getLogger } from 'https://deno.land/std@v0.24.0/log/mod.ts';
import { ConsoleHandler } from 'https://deno.land/std@v0.24.0/log/handlers.ts';

const redis = await connect({
    hostname: '127.0.0.1',
    port: 6379
});
const ok = await redis.set('hoge', 'fuga');
const fuga = await redis.get('hoge');
const logger = getLogger('my');
logger.handlers.push(new ConsoleHandler('info'));
logger.info(fuga);
info(fuga, 'xxx', 'xxxx');
