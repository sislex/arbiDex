import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class FullDatabaseOptimization1771492000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // === 1. CHAINS ===
    await queryRunner.dropIndex("chains", "chains_pkey").catch(() => {});
    await queryRunner.createIndex("chains", new TableIndex({
      name: "unique_chain_name", columnNames: ["name"], isUnique: true
    }));
    await queryRunner.createIndex("chains", new TableIndex({
      name: "idx_chains_created_at", columnNames: ["created_at"]
    }));

    // === 2. DEXES ===
    await queryRunner.dropIndex("dexes", "dexes_pkey").catch(() => {});
    await queryRunner.createIndex("dexes", new TableIndex({
      name: "unique_dex_name", columnNames: ["name"], isUnique: true
    }));
    await queryRunner.createIndex("dexes", new TableIndex({
      name: "idx_dexes_created_at", columnNames: ["created_at"]
    }));

    // === 3. SERVERS ===
    await queryRunner.dropIndex("servers", "servers_pkey").catch(() => {});
    await queryRunner.createIndex("servers", new TableIndex({
      name: "unique_server_address", columnNames: ["ip", "port"], isUnique: true
    }));
    await queryRunner.createIndex("servers", new TableIndex({
      name: "idx_servers_name", columnNames: ["server_name"]
    }));
    await queryRunner.createIndex("servers", new TableIndex({
      name: "idx_servers_ip", columnNames: ["ip"]
    }));

    // === 4. RPC_URLS ===
    await queryRunner.dropIndex("rpc_urls", "rpc_urls_pkey").catch(() => {});
    await queryRunner.createIndex("rpc_urls", new TableIndex({
      name: "idx_rpc_urls_chain_id", columnNames: ["chain_id"]
    }));
    await queryRunner.createIndex("rpc_urls", new TableIndex({
      name: "unique_rpc_per_chain", columnNames: ["chain_id", "rpc_url"], isUnique: true
    }));

    // === 5. TOKENS ===
    await queryRunner.dropIndex("tokens", "unique_token_address").catch(() => {});
    await queryRunner.dropIndex("tokens", "tokens_pkey").catch(() => {});
    await queryRunner.createIndex("tokens", new TableIndex({
      name: "idx_tokens_address_chain", columnNames: ["address", "chain_id"], isUnique: true
    }));
    await queryRunner.createIndex("tokens", new TableIndex({
      name: "idx_tokens_chain_id", columnNames: ["chain_id"]
    }));
    await queryRunner.query(`CREATE INDEX "idx_tokens_address_lower" ON "tokens" (LOWER("address"))`);

    // === 6. POOLS ===
    await queryRunner.dropIndex("pools", "pools_pkey").catch(() => {});
    // await queryRunner.query(`DROP INDEX IF EXISTS "unique_pool_address"`);
    await queryRunner.createIndex("pools", new TableIndex({
      name: "idx_pools_chain_id", columnNames: ["chain_id"]
    }));
    await queryRunner.createIndex("pools", new TableIndex({
      name: "idx_pools_dex_id", columnNames: ["dex_id"]
    }));
    await queryRunner.createIndex("pools", new TableIndex({
      name: "idx_pools_token_pair", columnNames: ["token0", "token1"]
    }));
    // await queryRunner.createIndex("pools", new TableIndex({
    //   name: "unique_pool_address", columnNames: ["pool_address"], isUnique: true
    // }));

    // === 7. PAIRS ===
    await queryRunner.dropIndex("pairs", "pairs_pkey").catch(() => {});
    await queryRunner.createIndex("pairs", new TableIndex({
      name: "idx_pairs_pool_id", columnNames: ["pool_id"]
    }));
    await queryRunner.createIndex("pairs", new TableIndex({
      name: "idx_pairs_route", columnNames: ["token_in", "token_out"]
    }));
    await queryRunner.createIndex("pairs", new TableIndex({
      name: "idx_pairs_token_out", columnNames: ["token_out"]
    }));

    // === 8. QUOTES ===
    await queryRunner.dropIndex("quotes", "quotes_pkey").catch(() => {});
    await queryRunner.createIndex("quotes", new TableIndex({
      name: "idx_quotes_token_id", columnNames: ["token_id"]
    }));
    await queryRunner.createIndex("quotes", new TableIndex({
      name: "idx_quotes_token_side", columnNames: ["side", "token_id"]
    }));
    await queryRunner.createIndex("quotes", new TableIndex({
      name: "idx_quotes_source", columnNames: ["quote_source"]
    }));

    // === 9. JOBS ===
    await queryRunner.dropIndex("jobs", "jobs_pkey").catch(() => {});
    await queryRunner.createIndex("jobs", new TableIndex({
      name: "idx_jobs_type", columnNames: ["job_type"]
    }));
    await queryRunner.createIndex("jobs", new TableIndex({
      name: "idx_jobs_chain_id", columnNames: ["chain_id"]
    }));
    await queryRunner.createIndex("jobs", new TableIndex({
      name: "idx_jobs_rpc_url_id", columnNames: ["rpc_url_id"]
    }));

    // === 10. BOTS ===
    await queryRunner.dropIndex("bots", "bots_pkey").catch(() => {});
    await queryRunner.createIndex("bots", new TableIndex({
      name: "idx_bots_server_id", columnNames: ["server_id"]
    }));
    await queryRunner.createIndex("bots", new TableIndex({
      name: "idx_bots_job_id", columnNames: ["job_id"]
    }));
    await queryRunner.createIndex("bots", new TableIndex({
      name: "idx_bots_name", columnNames: ["bot_name"]
    }));
    await queryRunner.createIndex("bots", new TableIndex({
      name: "idx_bots_paused", columnNames: ["paused"]
    }));

    // === 11. QUOTE_JOB_RELATIONS ===
    await queryRunner.dropIndex("quote_job_relations", "quote_job_relations_pkey").catch(() => {});
    await queryRunner.createIndex("quote_job_relations", new TableIndex({
      name: "idx_quote_job_relations_job_id", columnNames: ["job_id"]
    }));
    await queryRunner.createIndex("quote_job_relations", new TableIndex({
      name: "idx_quote_job_relations_quote_rel_id", columnNames: ["quote_relation_id"]
    }));
    await queryRunner.createIndex("quote_job_relations", new TableIndex({
      name: "unique_quote_job_link", columnNames: ["job_id", "quote_relation_id"], isUnique: true
    }));

    // === 12. PAIR_QUOTE_RELATIONS ===
    await queryRunner.dropIndex("pair_quote_relations", "pair_quote_relations_pkey").catch(() => {});
    await queryRunner.createIndex("pair_quote_relations", new TableIndex({
      name: "idx_pair_quote_rel_pair_id", columnNames: ["pair_id"]
    }));
    await queryRunner.createIndex("pair_quote_relations", new TableIndex({
      name: "idx_pair_quote_rel_quote_id", columnNames: ["quote_id"]
    }));
    await queryRunner.createIndex("pair_quote_relations", new TableIndex({
      name: "unique_pair_quote_link", columnNames: ["pair_id", "quote_id"], isUnique: true
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Откат 12: PAIR_QUOTE_RELATIONS
    await queryRunner.dropIndex("pair_quote_relations", "unique_pair_quote_link");
    await queryRunner.dropIndex("pair_quote_relations", "idx_pair_quote_rel_quote_id");
    await queryRunner.dropIndex("pair_quote_relations", "idx_pair_quote_rel_pair_id");

    // Откат 11: QUOTE_JOB_RELATIONS
    await queryRunner.dropIndex("quote_job_relations", "unique_quote_job_link");
    await queryRunner.dropIndex("quote_job_relations", "idx_quote_job_relations_quote_rel_id");
    await queryRunner.dropIndex("quote_job_relations", "idx_quote_job_relations_job_id");

    // Откат 10: BOTS
    await queryRunner.dropIndex("bots", "idx_bots_paused");
    await queryRunner.dropIndex("bots", "idx_bots_name");
    await queryRunner.dropIndex("bots", "idx_bots_job_id");
    await queryRunner.dropIndex("bots", "idx_bots_server_id");

    // Откат 9: JOBS
    await queryRunner.dropIndex("jobs", "idx_jobs_rpc_url_id");
    await queryRunner.dropIndex("jobs", "idx_jobs_chain_id");
    await queryRunner.dropIndex("jobs", "idx_jobs_type");

    // Откат 8: QUOTES
    await queryRunner.dropIndex("quotes", "idx_quotes_source");
    await queryRunner.dropIndex("quotes", "idx_quotes_token_side");
    await queryRunner.dropIndex("quotes", "idx_quotes_token_id");

    // Откат 7: PAIRS
    await queryRunner.dropIndex("pairs", "idx_pairs_token_out");
    await queryRunner.dropIndex("pairs", "idx_pairs_route");
    await queryRunner.dropIndex("pairs", "idx_pairs_pool_id");

    // Откат 6: POOLS
    await queryRunner.dropIndex("pools", "unique_pool_address");
    await queryRunner.dropIndex("pools", "idx_pools_token_pair");
    await queryRunner.dropIndex("pools", "idx_pools_dex_id");
    await queryRunner.dropIndex("pools", "idx_pools_chain_id");

    // Откат 5: TOKENS
    await queryRunner.query(`DROP INDEX "idx_tokens_address_lower"`);
    await queryRunner.dropIndex("tokens", "idx_tokens_chain_id");
    await queryRunner.dropIndex("tokens", "idx_tokens_address_chain");

    // Откат 4: RPC_URLS
    await queryRunner.dropIndex("rpc_urls", "unique_rpc_per_chain");
    await queryRunner.dropIndex("rpc_urls", "idx_rpc_urls_chain_id");

    // Откат 3: SERVERS
    await queryRunner.dropIndex("servers", "idx_servers_ip");
    await queryRunner.dropIndex("servers", "idx_servers_name");
    await queryRunner.dropIndex("servers", "unique_server_address");

    // Откат 2: DEXES
    await queryRunner.dropIndex("dexes", "idx_dexes_created_at");
    await queryRunner.dropIndex("dexes", "unique_dex_name");

    // Откат 1: CHAINS
    await queryRunner.dropIndex("chains", "idx_chains_created_at");
    await queryRunner.dropIndex("chains", "unique_chain_name");
  }
}
