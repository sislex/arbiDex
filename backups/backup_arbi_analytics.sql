--
-- PostgreSQL database dump
--

-- Dumped from database version 16.10 (Debian 16.10-1.pgdg13+1)
-- Dumped by pg_dump version 16.6

-- Started on 2025-10-07 20:37:45 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16564)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 888 (class 1247 OID 16602)
-- Name: dex_type; Type: TYPE; Schema: public; Owner: arbiuser
--

CREATE TYPE public.dex_type AS ENUM (
    'univ2',
    'univ3',
    'balancer',
    'solidly',
    'other'
);


ALTER TYPE public.dex_type OWNER TO arbiuser;

--
-- TOC entry 894 (class 1247 OID 16620)
-- Name: quote_kind; Type: TYPE; Schema: public; Owner: arbiuser
--

CREATE TYPE public.quote_kind AS ENUM (
    'EXACT_IN',
    'EXACT_OUT'
);


ALTER TYPE public.quote_kind OWNER TO arbiuser;

--
-- TOC entry 891 (class 1247 OID 16614)
-- Name: quote_side; Type: TYPE; Schema: public; Owner: arbiuser
--

CREATE TYPE public.quote_side AS ENUM (
    'SELL_BASE',
    'BUY_BASE'
);


ALTER TYPE public.quote_side OWNER TO arbiuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 24983)
-- Name: arb_evals; Type: TABLE; Schema: public; Owner: arbiuser
--

CREATE TABLE public.arb_evals (
    id bigint NOT NULL,
    quote_id bigint NOT NULL,
    best_buy numeric(38,0) NOT NULL,
    best_sell numeric(38,0) NOT NULL,
    dex_id_buy bigint NOT NULL,
    dex_id_sell bigint NOT NULL,
    gross_quote numeric(38,0) NOT NULL,
    gas_cost numeric(38,0) NOT NULL,
    net_profit numeric(38,0) NOT NULL,
    spread_pct numeric(12,6),
    should_trade boolean DEFAULT false,
    created_ts timestamp with time zone DEFAULT now()
);


ALTER TABLE public.arb_evals OWNER TO arbiuser;

--
-- TOC entry 226 (class 1259 OID 24982)
-- Name: arb_evals_id_seq; Type: SEQUENCE; Schema: public; Owner: arbiuser
--

CREATE SEQUENCE public.arb_evals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.arb_evals_id_seq OWNER TO arbiuser;

--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 226
-- Name: arb_evals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arbiuser
--

ALTER SEQUENCE public.arb_evals_id_seq OWNED BY public.arb_evals.id;


--
-- TOC entry 225 (class 1259 OID 16761)
-- Name: dex_pools; Type: TABLE; Schema: public; Owner: arbiuser
--

CREATE TABLE public.dex_pools (
    pool_id bigint NOT NULL,
    dex_id bigint NOT NULL,
    market_id bigint NOT NULL,
    pool_address text NOT NULL,
    fee_tier integer,
    tick_spacing integer,
    is_active boolean DEFAULT true,
    created_ts timestamp with time zone DEFAULT now(),
    last_seen_ts timestamp with time zone DEFAULT now(),
    liquidity_raw numeric(78,0),
    tvl_usd numeric(38,2),
    amount_base numeric DEFAULT 0
);


ALTER TABLE public.dex_pools OWNER TO arbiuser;

--
-- TOC entry 224 (class 1259 OID 16760)
-- Name: dex_pools_pool_id_seq; Type: SEQUENCE; Schema: public; Owner: arbiuser
--

CREATE SEQUENCE public.dex_pools_pool_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dex_pools_pool_id_seq OWNER TO arbiuser;

--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 224
-- Name: dex_pools_pool_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arbiuser
--

ALTER SEQUENCE public.dex_pools_pool_id_seq OWNED BY public.dex_pools.pool_id;


--
-- TOC entry 217 (class 1259 OID 16626)
-- Name: dexes; Type: TABLE; Schema: public; Owner: arbiuser
--

CREATE TABLE public.dexes (
    dex_id bigint NOT NULL,
    name text NOT NULL,
    type public.dex_type NOT NULL,
    chain_id integer NOT NULL,
    version text,
    router_addr text,
    quoter_addr text,
    factory_addr text
);


ALTER TABLE public.dexes OWNER TO arbiuser;

--
-- TOC entry 216 (class 1259 OID 16625)
-- Name: dexes_dex_id_seq; Type: SEQUENCE; Schema: public; Owner: arbiuser
--

CREATE SEQUENCE public.dexes_dex_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dexes_dex_id_seq OWNER TO arbiuser;

--
-- TOC entry 3556 (class 0 OID 0)
-- Dependencies: 216
-- Name: dexes_dex_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arbiuser
--

ALTER SEQUENCE public.dexes_dex_id_seq OWNED BY public.dexes.dex_id;


--
-- TOC entry 221 (class 1259 OID 16648)
-- Name: markets; Type: TABLE; Schema: public; Owner: arbiuser
--

CREATE TABLE public.markets (
    market_id bigint NOT NULL,
    chain_id integer NOT NULL,
    base_token_id bigint NOT NULL,
    quote_token_id bigint NOT NULL,
    CONSTRAINT markets_base_ne_quote CHECK ((base_token_id <> quote_token_id))
);


ALTER TABLE public.markets OWNER TO arbiuser;

--
-- TOC entry 220 (class 1259 OID 16647)
-- Name: markets_market_id_seq; Type: SEQUENCE; Schema: public; Owner: arbiuser
--

CREATE SEQUENCE public.markets_market_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.markets_market_id_seq OWNER TO arbiuser;

--
-- TOC entry 3557 (class 0 OID 0)
-- Dependencies: 220
-- Name: markets_market_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arbiuser
--

ALTER SEQUENCE public.markets_market_id_seq OWNED BY public.markets.market_id;


--
-- TOC entry 223 (class 1259 OID 16668)
-- Name: quotes; Type: TABLE; Schema: public; Owner: arbiuser
--

CREATE TABLE public.quotes (
    id bigint NOT NULL,
    snapshot_id uuid DEFAULT gen_random_uuid() NOT NULL,
    ts timestamp with time zone DEFAULT now() NOT NULL,
    chain_id integer NOT NULL,
    dex_id bigint NOT NULL,
    market_id bigint NOT NULL,
    side public.quote_side NOT NULL,
    kind public.quote_kind NOT NULL,
    fee_tier integer,
    amount_base numeric(78,0) NOT NULL,
    amount_quote numeric(38,0) NOT NULL,
    ok boolean DEFAULT true NOT NULL,
    error_message text,
    latency_ms integer,
    gas_quote numeric(38,0),
    block_number bigint,
    CONSTRAINT quotes_kind_side_consistency CHECK ((((side = 'SELL_BASE'::public.quote_side) AND (kind = 'EXACT_IN'::public.quote_kind)) OR ((side = 'BUY_BASE'::public.quote_side) AND (kind = 'EXACT_OUT'::public.quote_kind))))
);


ALTER TABLE public.quotes OWNER TO arbiuser;

--
-- TOC entry 222 (class 1259 OID 16667)
-- Name: quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: arbiuser
--

CREATE SEQUENCE public.quotes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quotes_id_seq OWNER TO arbiuser;

--
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 222
-- Name: quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arbiuser
--

ALTER SEQUENCE public.quotes_id_seq OWNED BY public.quotes.id;


--
-- TOC entry 219 (class 1259 OID 16637)
-- Name: tokens; Type: TABLE; Schema: public; Owner: arbiuser
--

CREATE TABLE public.tokens (
    token_id bigint NOT NULL,
    chain_id integer NOT NULL,
    address text NOT NULL,
    symbol text NOT NULL,
    decimals smallint NOT NULL
);


ALTER TABLE public.tokens OWNER TO arbiuser;

--
-- TOC entry 218 (class 1259 OID 16636)
-- Name: tokens_token_id_seq; Type: SEQUENCE; Schema: public; Owner: arbiuser
--

CREATE SEQUENCE public.tokens_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tokens_token_id_seq OWNER TO arbiuser;

--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 218
-- Name: tokens_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arbiuser
--

ALTER SEQUENCE public.tokens_token_id_seq OWNED BY public.tokens.token_id;


--
-- TOC entry 3350 (class 2604 OID 24986)
-- Name: arb_evals id; Type: DEFAULT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.arb_evals ALTER COLUMN id SET DEFAULT nextval('public.arb_evals_id_seq'::regclass);


--
-- TOC entry 3345 (class 2604 OID 16764)
-- Name: dex_pools pool_id; Type: DEFAULT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.dex_pools ALTER COLUMN pool_id SET DEFAULT nextval('public.dex_pools_pool_id_seq'::regclass);


--
-- TOC entry 3338 (class 2604 OID 16629)
-- Name: dexes dex_id; Type: DEFAULT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.dexes ALTER COLUMN dex_id SET DEFAULT nextval('public.dexes_dex_id_seq'::regclass);


--
-- TOC entry 3340 (class 2604 OID 16651)
-- Name: markets market_id; Type: DEFAULT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.markets ALTER COLUMN market_id SET DEFAULT nextval('public.markets_market_id_seq'::regclass);


--
-- TOC entry 3341 (class 2604 OID 16671)
-- Name: quotes id; Type: DEFAULT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.quotes ALTER COLUMN id SET DEFAULT nextval('public.quotes_id_seq'::regclass);


--
-- TOC entry 3339 (class 2604 OID 16640)
-- Name: tokens token_id; Type: DEFAULT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.tokens ALTER COLUMN token_id SET DEFAULT nextval('public.tokens_token_id_seq'::regclass);


--
-- TOC entry 3546 (class 0 OID 16761)
-- Dependencies: 225
-- Data for Name: dex_pools; Type: TABLE DATA; Schema: public; Owner: arbiuser
--

COPY public.dex_pools (pool_id, dex_id, market_id, pool_address, fee_tier, tick_spacing, is_active, created_ts, last_seen_ts, liquidity_raw, tvl_usd, amount_base) FROM stdin;
15	2	5	---	\N	\N	t	2025-09-23 22:03:57.052975+00	2025-09-23 22:03:57.052975+00	\N	\N	1000000000000000000
14	1	5	---	500	\N	t	2025-09-23 22:03:57.052975+00	2025-09-23 22:03:57.052975+00	\N	\N	1000000000000000000
13	2	4	---	\N	\N	t	2025-09-23 21:51:57.789379+00	2025-09-23 21:51:57.789379+00	\N	\N	1000000000000000000
12	1	4	---	500	\N	t	2025-09-23 21:51:57.789379+00	2025-09-23 21:51:57.789379+00	\N	\N	1000000000000000000
11	2	3	---	\N	\N	t	2025-09-23 21:39:50.446937+00	2025-09-23 21:39:50.446937+00	\N	\N	1000000000000000000
10	1	3	---	500	\N	t	2025-09-23 21:39:50.446937+00	2025-09-23 21:39:50.446937+00	\N	\N	1000000000000000000
8	2	2	---	\N	\N	t	2025-09-22 15:39:02.558561+00	2025-09-22 15:39:02.558561+00	\N	\N	1000000000000000000
7	1	2	---	500	\N	t	2025-09-22 15:39:02.558561+00	2025-09-22 15:39:02.558561+00	\N	\N	1000000000000000000
1	1	1	0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8	500	\N	t	2025-09-18 12:47:34.648871+00	2025-09-18 12:47:34.648871+00	\N	\N	1000000000000000000
4	2	1	---	\N	\N	t	2025-09-20 20:39:47.252016+00	2025-09-20 20:39:47.252016+00	\N	\N	1000000000000000000
\.


--
-- TOC entry 3539 (class 0 OID 16626)
-- Dependencies: 217
-- Data for Name: dexes; Type: TABLE DATA; Schema: public; Owner: arbiuser
--

COPY public.dexes (dex_id, name, type, chain_id, version, router_addr, quoter_addr, factory_addr) FROM stdin;
1	UniswapV3	univ3	42161	v3	0x68b3465833fb72A70ecDF485E0e4C7bd8665Fc45	0x61fFE014bA17989E743c5F6cB21bF9697530B21e	0x1F98431c8aD98523631AE4a59f267346ea31F984
2	SushiV2	univ2	42161	v2	0x1b02da8cb0d097eb8d57a175b88c7d8b47997506	\N	\N
\.


--
-- TOC entry 3543 (class 0 OID 16648)
-- Dependencies: 221
-- Data for Name: markets; Type: TABLE DATA; Schema: public; Owner: arbiuser
--

COPY public.markets (market_id, chain_id, base_token_id, quote_token_id) FROM stdin;
1	42161	1	2
2	42161	1	3
3	42161	1	4
4	42161	1	5
5	42161	1	6
\.


--
-- TOC entry 3541 (class 0 OID 16637)
-- Dependencies: 219
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: arbiuser
--

COPY public.tokens (token_id, chain_id, address, symbol, decimals) FROM stdin;
1	42161	0x82af49447d8a07e3bd95bd0d56f35241523fbab1	WETH	18
2	42161	0xaf88d065e77c8cC2239327C5EDb3A432268e5831	USDC	6
3	42161	0x912CE59144191C1204E64559FE8253a0e49E6548	ARB	18
4	42161	0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9	USDT	6
5	42161	0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1	DAI	18
6	42161	0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f	WBTC	18
\.


--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 226
-- Name: arb_evals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arbiuser
--

SELECT pg_catalog.setval('public.arb_evals_id_seq', 377180, true);


--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 224
-- Name: dex_pools_pool_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arbiuser
--

SELECT pg_catalog.setval('public.dex_pools_pool_id_seq', 15, true);


--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 216
-- Name: dexes_dex_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arbiuser
--

SELECT pg_catalog.setval('public.dexes_dex_id_seq', 2, true);


--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 220
-- Name: markets_market_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arbiuser
--

SELECT pg_catalog.setval('public.markets_market_id_seq', 5, true);


--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 222
-- Name: quotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arbiuser
--

SELECT pg_catalog.setval('public.quotes_id_seq', 972954, true);


--
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 218
-- Name: tokens_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arbiuser
--

SELECT pg_catalog.setval('public.tokens_token_id_seq', 6, true);


--
-- TOC entry 3386 (class 2606 OID 24990)
-- Name: arb_evals arb_evals_pkey; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.arb_evals
    ADD CONSTRAINT arb_evals_pkey PRIMARY KEY (id);


--
-- TOC entry 3388 (class 2606 OID 25110)
-- Name: arb_evals arb_evals_quote_id_uq; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.arb_evals
    ADD CONSTRAINT arb_evals_quote_id_uq UNIQUE (quote_id);


--
-- TOC entry 3378 (class 2606 OID 16771)
-- Name: dex_pools dex_pools_pkey; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.dex_pools
    ADD CONSTRAINT dex_pools_pkey PRIMARY KEY (pool_id);


--
-- TOC entry 3380 (class 2606 OID 16773)
-- Name: dex_pools dex_pools_unique; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.dex_pools
    ADD CONSTRAINT dex_pools_unique UNIQUE (dex_id, market_id, pool_address, fee_tier);


--
-- TOC entry 3356 (class 2606 OID 16635)
-- Name: dexes dexes_chain_id_name_key; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.dexes
    ADD CONSTRAINT dexes_chain_id_name_key UNIQUE (chain_id, name);


--
-- TOC entry 3358 (class 2606 OID 16633)
-- Name: dexes dexes_pkey; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.dexes
    ADD CONSTRAINT dexes_pkey PRIMARY KEY (dex_id);


--
-- TOC entry 3364 (class 2606 OID 16656)
-- Name: markets markets_chain_id_base_token_id_quote_token_id_key; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.markets
    ADD CONSTRAINT markets_chain_id_base_token_id_quote_token_id_key UNIQUE (chain_id, base_token_id, quote_token_id);


--
-- TOC entry 3366 (class 2606 OID 16654)
-- Name: markets markets_pkey; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.markets
    ADD CONSTRAINT markets_pkey PRIMARY KEY (market_id);


--
-- TOC entry 3372 (class 2606 OID 16679)
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- TOC entry 3374 (class 2606 OID 16681)
-- Name: quotes quotes_snapshot_id_dex_id_side_key; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_snapshot_id_dex_id_side_key UNIQUE (snapshot_id, dex_id, side);


--
-- TOC entry 3360 (class 2606 OID 16646)
-- Name: tokens tokens_chain_id_address_key; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_chain_id_address_key UNIQUE (chain_id, address);


--
-- TOC entry 3362 (class 2606 OID 16644)
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (token_id);


--
-- TOC entry 3381 (class 1259 OID 16786)
-- Name: idx_dex_pools_active; Type: INDEX; Schema: public; Owner: arbiuser
--

CREATE INDEX idx_dex_pools_active ON public.dex_pools USING btree (is_active);


--
-- TOC entry 3382 (class 1259 OID 16784)
-- Name: idx_dex_pools_dex; Type: INDEX; Schema: public; Owner: arbiuser
--

CREATE INDEX idx_dex_pools_dex ON public.dex_pools USING btree (dex_id);


--
-- TOC entry 3383 (class 1259 OID 16787)
-- Name: idx_dex_pools_last_seen; Type: INDEX; Schema: public; Owner: arbiuser
--

CREATE INDEX idx_dex_pools_last_seen ON public.dex_pools USING btree (last_seen_ts);


--
-- TOC entry 3384 (class 1259 OID 16785)
-- Name: idx_dex_pools_market; Type: INDEX; Schema: public; Owner: arbiuser
--

CREATE INDEX idx_dex_pools_market ON public.dex_pools USING btree (market_id);


--
-- TOC entry 3367 (class 1259 OID 16720)
-- Name: quotes_dex_ts_idx; Type: INDEX; Schema: public; Owner: arbiuser
--

CREATE INDEX quotes_dex_ts_idx ON public.quotes USING btree (dex_id, ts);


--
-- TOC entry 3368 (class 1259 OID 24981)
-- Name: quotes_market_dex_side_kind_ts_idx; Type: INDEX; Schema: public; Owner: arbiuser
--

CREATE INDEX quotes_market_dex_side_kind_ts_idx ON public.quotes USING btree (market_id, dex_id, side, kind, ts DESC) WHERE (ok = true);


--
-- TOC entry 3369 (class 1259 OID 16721)
-- Name: quotes_mkt_ts_idx; Type: INDEX; Schema: public; Owner: arbiuser
--

CREATE INDEX quotes_mkt_ts_idx ON public.quotes USING btree (market_id, ts);


--
-- TOC entry 3370 (class 1259 OID 16722)
-- Name: quotes_ok_idx; Type: INDEX; Schema: public; Owner: arbiuser
--

CREATE INDEX quotes_ok_idx ON public.quotes USING btree (ok) WHERE (ok = true);


--
-- TOC entry 3375 (class 1259 OID 16723)
-- Name: quotes_snapshot_idx; Type: INDEX; Schema: public; Owner: arbiuser
--

CREATE INDEX quotes_snapshot_idx ON public.quotes USING btree (snapshot_id);


--
-- TOC entry 3376 (class 1259 OID 16719)
-- Name: quotes_ts_idx; Type: INDEX; Schema: public; Owner: arbiuser
--

CREATE INDEX quotes_ts_idx ON public.quotes USING btree (ts);


--
-- TOC entry 3393 (class 2606 OID 16774)
-- Name: dex_pools dex_pools_dex_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.dex_pools
    ADD CONSTRAINT dex_pools_dex_id_fkey FOREIGN KEY (dex_id) REFERENCES public.dexes(dex_id) ON DELETE CASCADE;


--
-- TOC entry 3394 (class 2606 OID 16779)
-- Name: dex_pools dex_pools_market_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.dex_pools
    ADD CONSTRAINT dex_pools_market_id_fkey FOREIGN KEY (market_id) REFERENCES public.markets(market_id) ON DELETE CASCADE;


--
-- TOC entry 3389 (class 2606 OID 16657)
-- Name: markets markets_base_token_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.markets
    ADD CONSTRAINT markets_base_token_id_fkey FOREIGN KEY (base_token_id) REFERENCES public.tokens(token_id) ON DELETE RESTRICT;


--
-- TOC entry 3390 (class 2606 OID 16662)
-- Name: markets markets_quote_token_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.markets
    ADD CONSTRAINT markets_quote_token_id_fkey FOREIGN KEY (quote_token_id) REFERENCES public.tokens(token_id) ON DELETE RESTRICT;


--
-- TOC entry 3391 (class 2606 OID 16682)
-- Name: quotes quotes_dex_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_dex_id_fkey FOREIGN KEY (dex_id) REFERENCES public.dexes(dex_id) ON DELETE RESTRICT;


--
-- TOC entry 3392 (class 2606 OID 16687)
-- Name: quotes quotes_market_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arbiuser
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_market_id_fkey FOREIGN KEY (market_id) REFERENCES public.markets(market_id) ON DELETE RESTRICT;


-- Completed on 2025-10-07 20:37:45 UTC

--
-- PostgreSQL database dump complete
--

