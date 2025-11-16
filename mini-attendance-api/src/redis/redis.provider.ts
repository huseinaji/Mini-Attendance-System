import { Logger, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIST_CLIENT } from 'src/constant/constant';

export const RedisProvider: Provider = {
  provide: REDIST_CLIENT,
  useFactory: async () => {
    const redis = new Redis({
      host: '192.168.1.41',
      port: 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });
    
    redis.on('connect', () => Logger.log('✅ Redis connected'));
    redis.on('ready', () => Logger.log('Redis ready to accept commands'));
    redis.on('error', (err) => Logger.error('❌ Redis error', err));
    redis.on('close', () => Logger.log('Redis connection closed'));
    redis.on('reconnecting', () => Logger.log('Redis reconnecting...'));
    return redis;
  },
};