import { CONTRACTS } from '@/lib/contracts';

export type SeedProduct = {
  vendor_id: string;
  vendor_name: string;
  vendor_erc8004: boolean;
  product_id: string;
  description: string;
  category: string;
  tags: string[];
  price_usdc: number;
  price_display: string;
  affiliate_bps: number;
  endpoint: string;
  method: 'GET' | 'POST';
  output_schema: object;
  monthly_volume: number;
  monthly_buyers: number;
  network: string;
  asset: string;
  source: 'pyrimid-seed';
  sdk_integrated: boolean;
  indexed_at: string;
};

export const SEED_PRODUCT_BASE = 'https://pyrimid.ai/api/v1/paid';

export const SEED_PRODUCTS: Omit<SeedProduct, 'indexed_at'>[] = [
  {
    vendor_id: 'pragma-trading',
    vendor_name: 'pragma.trading',
    vendor_erc8004: false,
    product_id: 'pragma-signal-snapshot',
    description: 'Paid BTC derivatives signal snapshot endpoint. Seed x402 product for buyer-agent testing and affiliate routing.',
    category: 'trading-data',
    tags: ['btc', 'perps', 'signals', 'x402', 'base', 'agent-api'],
    price_usdc: 250000,
    price_display: '$0.25',
    affiliate_bps: 5000,
    endpoint: `${SEED_PRODUCT_BASE}/signals`,
    method: 'GET',
    output_schema: { type: 'object', properties: { signal: { type: 'object' }, routed_by: { const: 'pyrimid' } } },
    monthly_volume: 0,
    monthly_buyers: 0,
    network: 'base',
    asset: 'USDC',
    source: 'pyrimid-seed',
    sdk_integrated: true,
  },
  {
    vendor_id: 'agentzone',
    vendor_name: 'AgentZone',
    vendor_erc8004: true,
    product_id: 'agentzone-trust-search',
    description: 'Paid trusted-agent search over AgentZone identity, reputation, and x402 discovery data.',
    category: 'agent-discovery',
    tags: ['agentzone', 'agent-search', 'erc8004', 'reputation', 'x402', 'base'],
    price_usdc: 50000,
    price_display: '$0.05',
    affiliate_bps: 2500,
    endpoint: `${SEED_PRODUCT_BASE}/agentzone-search?q=agent-commerce`,
    method: 'GET',
    output_schema: { type: 'object', properties: { result: { type: 'object' }, routed_by: { const: 'pyrimid' } } },
    monthly_volume: 0,
    monthly_buyers: 0,
    network: 'base',
    asset: 'USDC',
    source: 'pyrimid-seed',
    sdk_integrated: true,
  },
  {
    vendor_id: 'mya-launchpad',
    vendor_name: 'MYA Launchpad',
    vendor_erc8004: false,
    product_id: 'mya-agent-enrichment',
    description: 'Paid agent listing enrichment: category, monetization angle, agent-readable summary, and suggested paid-tool CTA.',
    category: 'agent-discovery',
    tags: ['mya', 'agent-directory', 'enrichment', 'monetization', 'x402', 'mcp'],
    price_usdc: 100000,
    price_display: '$0.10',
    affiliate_bps: 3000,
    endpoint: `${SEED_PRODUCT_BASE}/mya-agent-enrichment?agent=demo`,
    method: 'GET',
    output_schema: { type: 'object', properties: { enrichment: { type: 'object' }, routed_by: { const: 'pyrimid' } } },
    monthly_volume: 0,
    monthly_buyers: 0,
    network: 'base',
    asset: 'USDC',
    source: 'pyrimid-seed',
    sdk_integrated: true,
  },
  {
    vendor_id: 'mya-launchpad',
    vendor_name: 'MYA Launchpad',
    vendor_erc8004: false,
    product_id: 'mya-category-scout',
    description: 'Paid category scout for buyer agents: discover monetizable agents and vendors in a requested MYA category.',
    category: 'agent-discovery',
    tags: ['mya', 'category-search', 'agent-scouting', 'buyer-agent', 'x402'],
    price_usdc: 50000,
    price_display: '$0.05',
    affiliate_bps: 3000,
    endpoint: `${SEED_PRODUCT_BASE}/mya-category-scout?category=developer-tools`,
    method: 'GET',
    output_schema: { type: 'object', properties: { agents: { type: 'array' }, routed_by: { const: 'pyrimid' } } },
    monthly_volume: 0,
    monthly_buyers: 0,
    network: 'base',
    asset: 'USDC',
    source: 'pyrimid-seed',
    sdk_integrated: true,
  },
  {
    vendor_id: 'pyrimid-growth',
    vendor_name: 'Pyrimid Growth',
    vendor_erc8004: false,
    product_id: 'vendor-lead-discovery',
    description: 'Paid vendor lead discovery for agents: returns high-fit AI agent/API vendors to contact for x402 monetization.',
    category: 'growth-data',
    tags: ['vendor-discovery', 'lead-gen', 'ai-api', 'agent-frameworks', 'x402'],
    price_usdc: 250000,
    price_display: '$0.25',
    affiliate_bps: 4000,
    endpoint: `${SEED_PRODUCT_BASE}/vendor-lead-discovery?segment=mcp`,
    method: 'GET',
    output_schema: {
      type: 'object',
      properties: {
        segment: { type: 'string' },
        lead_count: { type: 'number' },
        discovery: {
          type: 'object',
          properties: {
            source: { const: 'github_repository_search' },
            searched_queries: { type: 'array', items: { type: 'string' } },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  query: { type: 'string' },
                  status: { type: 'number' },
                  message: { type: 'string' },
                },
              },
            },
            fallback_used: { type: 'boolean' },
            generated_at: { type: 'string' },
          },
          required: ['source', 'searched_queries', 'errors', 'fallback_used', 'generated_at'],
        },
        scoring_model: { type: 'object' },
        leads: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              source: { type: 'string' },
              target: { type: 'string' },
              repository: { type: 'string' },
              url: { type: 'string' },
              description: { type: 'string' },
              stars: { type: 'number' },
              language: { type: 'string' },
              topics: { type: 'array', items: { type: 'string' } },
              updated_at: { type: 'string' },
              fit_score: { type: 'number' },
              reason: { type: 'string' },
              discovery_query: { type: 'string' },
              suggested_paid_tool: { type: 'string' },
              price_usdc: { type: 'string' },
              affiliate_bps: { type: 'number' },
              outreach_hook: { type: 'string' },
              catalog_metadata_hint: { type: 'object' },
              evidence: { type: 'array', items: { type: 'string' } },
            },
            required: ['target', 'fit_score', 'reason', 'suggested_paid_tool', 'price_usdc', 'affiliate_bps', 'outreach_hook', 'catalog_metadata_hint'],
          },
        },
        strategy_templates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              target: { type: 'string' },
              fit_score: { type: 'number' },
              reason: { type: 'string' },
              discovery_queries: { type: 'array', items: { type: 'string' } },
              suggested_paid_tool: { type: 'string' },
              price_usdc: { type: 'string' },
              affiliate_bps: { type: 'number' },
              outreach_hook: { type: 'string' },
            },
          },
        },
        next_actions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              target: { type: 'string' },
              action: { type: 'string' },
              submit_to_catalog: { type: 'object' },
            },
            required: ['target', 'action', 'submit_to_catalog'],
          },
        },
        routed_by: { const: 'pyrimid' },
      },
      required: ['segment', 'lead_count', 'discovery', 'scoring_model', 'leads', 'strategy_templates', 'next_actions', 'routed_by'],
    },
    monthly_volume: 0,
    monthly_buyers: 0,
    network: 'base',
    asset: 'USDC',
    source: 'pyrimid-seed',
    sdk_integrated: true,
  },
  {
    vendor_id: 'pyrimid-growth',
    vendor_name: 'Pyrimid Growth',
    vendor_erc8004: false,
    product_id: 'mcp-server-audit',
    description: 'Paid MCP monetization audit: tells an MCP server how to add paid tools, x402 pricing, and affiliate routing.',
    category: 'devtools',
    tags: ['mcp', 'audit', 'monetization', 'paid-tools', 'x402', 'developer-tools'],
    price_usdc: 100000,
    price_display: '$0.10',
    affiliate_bps: 4000,
    endpoint: `${SEED_PRODUCT_BASE}/mcp-server-audit?url=https://example.com/mcp`,
    method: 'GET',
    output_schema: {
      type: 'object',
      properties: {
        audit: {
          type: 'object',
          properties: {
            url: { type: 'string' },
            normalized_url: { type: 'string' },
            server_kind: { type: 'string' },
            inspection: {
              type: 'object',
              properties: {
                inspected_as: { type: 'string' },
                detected_features: { type: 'array', items: { type: 'string' } },
                missing_features: { type: 'array', items: { type: 'string' } },
                evidence_urls: { type: 'array', items: { type: 'string' } },
                errors: { type: 'array', items: { type: 'string' } },
              },
              required: ['inspected_as', 'detected_features', 'missing_features', 'evidence_urls', 'errors'],
            },
            recommended_paid_tools: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  route: { type: 'string' },
                  price_usdc: { type: 'string' },
                  value: { type: 'string' },
                  output_schema: { type: 'object' },
                },
                required: ['name', 'route', 'price_usdc', 'value', 'output_schema'],
              },
            },
            pricing: { type: 'object' },
            route_shape: { type: 'object' },
            catalog_metadata: { type: 'object' },
            risk_notes: { type: 'array', items: { type: 'string' } },
            integration_steps: { type: 'array', items: { type: 'string' } },
          },
          required: ['url', 'normalized_url', 'server_kind', 'inspection', 'recommended_paid_tools', 'pricing', 'route_shape', 'catalog_metadata', 'risk_notes', 'integration_steps'],
        },
        routed_by: { const: 'pyrimid' },
      },
      required: ['audit', 'routed_by'],
    },
    monthly_volume: 0,
    monthly_buyers: 0,
    network: 'base',
    asset: 'USDC',
    source: 'pyrimid-seed',
    sdk_integrated: true,
  },
  {
    vendor_id: 'pyrimid-growth',
    vendor_name: 'Pyrimid Growth',
    vendor_erc8004: false,
    product_id: 'x402-integration-plan',
    description: 'Paid x402 integration plan for vendors: pricing, route shape, payment headers, and Pyrimid catalog metadata.',
    category: 'devtools',
    tags: ['x402', 'integration', 'sdk', 'vendor-onboarding', 'base-usdc', 'payments'],
    price_usdc: 100000,
    price_display: '$0.10',
    affiliate_bps: 4000,
    endpoint: `${SEED_PRODUCT_BASE}/x402-integration-plan?service=agent-api`,
    method: 'GET',
    output_schema: { type: 'object', properties: { plan: { type: 'object' }, routed_by: { const: 'pyrimid' } } },
    monthly_volume: 0,
    monthly_buyers: 0,
    network: 'base',
    asset: 'USDC',
    source: 'pyrimid-seed',
    sdk_integrated: true,
  },
];

export function getSeedProducts(now = new Date().toISOString()): SeedProduct[] {
  return SEED_PRODUCTS.map((product) => ({ ...product, indexed_at: now }));
}

export function getSeedProduct(productId: string) {
  return SEED_PRODUCTS.find((product) => product.product_id === productId);
}

export function paymentRequirement(product: Omit<SeedProduct, 'indexed_at'>, resource: string) {
  return {
    x402Version: 2,
    scheme: 'exact',
    network: 'base',
    asset: 'USDC',
    maxAmountRequired: product.price_display.replace('$', ''),
    payTo: CONTRACTS.ROUTER,
    resource,
    description: product.description,
    mimeType: 'application/json',
    vendorId: product.vendor_id,
    productId: product.product_id,
    affiliateBps: product.affiliate_bps,
    protocol: 'pyrimid',
  };
}
