import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const APP_CONFIG = {
    port: parseInt(process.env.PORT?.toString().replace(/[^0-9]/g, '') || '3000', 10),
    get resendApiKey() {
        return process.env.RESEND_API_KEY;
    },
};

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    useFactory: () => {
        const isSsl = process.env.DB_SSL === 'true' || process.env.DATABASE_URL?.includes('supabase');

        return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: isSsl ? { rejectUnauthorized: false } : false,
            autoLoadEntities: true,
            synchronize: true,

            extra: {
                max: 10,
                connectionTimeoutMillis: 10000,
                idleTimeoutMillis: 30000,
            },
        };
    },
};