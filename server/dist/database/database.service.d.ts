import { OnModuleDestroy } from '@nestjs/common';
import { PoolClient, QueryResultRow } from 'pg';
export declare class DatabaseService implements OnModuleDestroy {
    private readonly pool;
    constructor();
    query<T extends QueryResultRow>(text: string, params?: unknown[]): Promise<import("pg").QueryResult<T>>;
    getClient(): Promise<PoolClient>;
    onModuleDestroy(): Promise<void>;
}
