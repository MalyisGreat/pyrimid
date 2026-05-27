import { NextRequest, NextResponse } from 'next/server';
import { getSeedProduct, paymentRequirement } from '@/lib/seed-products';
import { verifyPyrimidPaymentTx } from '@/lib/payment-verification';

function paymentRequired(req: NextRequest, product: NonNullable<ReturnType<typeof getSeedProduct>>) {
  const requirement = paymentRequirement(product, req.url);
  return NextResponse.json(
    {
      error: 'payment_required',
      message: `Pay ${product.price_display} USDC on Base through Pyrimid, then retry with X-PAYMENT or X-PAYMENT-TX.`,
      accepts: [requirement],
      docs: 'https://pyrimid.ai/quickstart',
      catalog: 'https://pyrimid.ai/api/v1/catalog?source=pyrimid-seed',
    },
    {
      status: 402,
      headers: {
        'X-PAYMENT-REQUIRED': JSON.stringify(requirement),
        'X-Pyrimid-Vendor': product.vendor_id,
        'X-Pyrimid-Product': product.product_id,
        'Cache-Control': 'no-store',
      },
    }
  );
}

function payload(productId: string, req: NextRequest, proof: string) {
  const query = Object.fromEntries(req.nextUrl.searchParams.entries());

  switch (productId) {
    case 'mya-agent-enrichment': {
      const agent = query.agent || 'demo-agent';
      return {
        enrichment: {
          agent,
          category: 'developer-tools',
          agent_readable_summary: `${agent} can monetize API calls by exposing paid tools through x402 and listing them in the Pyrimid catalog.`,
          monetization_angle: 'Package one high-value tool as a paid MCP/API endpoint priced $0.05-$0.25 per call.',
          suggested_cta: 'Claim listing → add paid tool → route purchases through Pyrimid.',
        },
      };
    }
    case 'mya-category-scout': {
      const category = query.category || 'developer-tools';
      return {
        category,
        agents: [
          { name: 'MCP server vendors', fit: 'high', reason: 'Already expose tool interfaces; easiest path to paid tools.' },
          { name: 'AI API wrappers', fit: 'high', reason: 'Usage-based value maps cleanly to x402 per-call pricing.' },
          { name: 'agent directories', fit: 'medium', reason: 'Can route discovery traffic into paid vendor listings.' },
        ],
      };
    }
    case 'vendor-lead-discovery': {
      const segment = String(query.segment || 'mcp').toLowerCase();
      const leadSets: Record<string, Array<Record<string, unknown>>> = {
        mcp: [
          {
            target: 'Hosted MCP servers with metered data tools',
            fit_score: 94,
            reason: 'They already expose machine-readable tools, so adding a paid HTTP 402 gate does not change the agent workflow.',
            discovery_queries: ['site:smithery.ai "pricing"', 'site:mcpmarket.com "API"', '"mcp server" "data enrichment"'],
            suggested_paid_tool: 'premium_search',
            price_usdc: '0.05-0.25',
            affiliate_bps: 2500,
            outreach_hook: 'Your MCP server already has agent distribution; Pyrimid can turn the highest-cost tool into a paid endpoint with USDC settlement.',
          },
          {
            target: 'MCP wrappers around paid SaaS APIs',
            fit_score: 89,
            reason: 'The vendor has direct marginal API cost and a clear buyer value story for per-call pricing.',
            discovery_queries: ['"MCP" "API key" "enrich"', '"MCP server" "search API"', '"MCP" "credits"'],
            suggested_paid_tool: 'enrich_company',
            price_usdc: '0.10-0.50',
            affiliate_bps: 2000,
            outreach_hook: 'Move API-key friction behind x402 so agents can buy one result without creating a vendor account first.',
          },
          {
            target: 'Open-source MCP tools with hosted demos',
            fit_score: 82,
            reason: 'They can keep the local tool free while selling hosted execution, queue priority, or fresh data.',
            discovery_queries: ['"mcp" "hosted" "demo"', '"mcp server" "deploy"', '"MCP" "cloud" "tool"'],
            suggested_paid_tool: 'hosted_run',
            price_usdc: '0.02-0.15',
            affiliate_bps: 1500,
            outreach_hook: 'Keep open source free and monetize the hosted path agents can call reliably in production.',
          },
        ],
        'agent-frameworks': [
          {
            target: 'Agent frameworks with plugin or tool marketplaces',
            fit_score: 91,
            reason: 'A default commerce resolver lets every downstream agent recommend and buy tools without custom payment code.',
            discovery_queries: ['"agent framework" "marketplace"', '"AI agent" "plugin marketplace"', '"tool registry" "agent"'],
            suggested_paid_tool: 'catalog_recommendation',
            price_usdc: '0.01-0.10',
            affiliate_bps: 3000,
            outreach_hook: 'Pyrimid can be the paid-tool layer your framework does not have to build.',
          },
          {
            target: 'Vertical agents with recurring user questions',
            fit_score: 84,
            reason: 'Agents that repeatedly call data or research tools can route buyers into paid calls at the moment of intent.',
            discovery_queries: ['"AI agent" "research API"', '"agent" "lead generation"', '"agent" "market data"'],
            suggested_paid_tool: 'paid_recommendation',
            price_usdc: '0.05-0.25',
            affiliate_bps: 3500,
            outreach_hook: 'Let the agent earn when it recommends a paid result instead of handing off to a subscription page.',
          },
        ],
        'api-tools': [
          {
            target: 'AI data APIs with free demos and paid plans',
            fit_score: 93,
            reason: 'They already sell per-seat or credit-based access; x402 adds one-off agent purchases.',
            discovery_queries: ['"AI API" "free tier" "pricing"', '"data API" "credits"', '"enrichment API" "pricing"'],
            suggested_paid_tool: 'single_lookup',
            price_usdc: '0.05-1.00',
            affiliate_bps: 2000,
            outreach_hook: 'Add a no-login paid endpoint for agents that only need one result.',
          },
          {
            target: 'Scraping and enrichment services',
            fit_score: 87,
            reason: 'Their compute and proxy costs map naturally to per-call USDC pricing and clear output schemas.',
            discovery_queries: ['"web scraping API" "per request"', '"lead enrichment" "API"', '"SERP API" "pricing"'],
            suggested_paid_tool: 'fresh_record',
            price_usdc: '0.02-0.40',
            affiliate_bps: 1500,
            outreach_hook: 'Agent buyers want one clean JSON result, not a dashboard subscription.',
          },
        ],
      };
      const leads = leadSets[segment] || leadSets.mcp;
      return {
        segment,
        lead_count: leads.length,
        scoring_model: {
          high_fit: 'Existing tool/API surface + per-call value + machine-readable output + low account friction.',
          reject_if: ['requires private user data', 'no API or tool endpoint', 'unclear marginal value', 'no public pricing signal'],
        },
        leads,
        next_actions: leads.map((lead) => ({
          target: lead.target,
          action: `Run discovery query: ${(lead.discovery_queries as string[])[0]}`,
          submit_to_catalog: {
            vendor_id_hint: String(lead.target).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            product_id_hint: lead.suggested_paid_tool,
            affiliate_bps: lead.affiliate_bps,
          },
        })),
      };
    }
    case 'mcp-server-audit': {
      const url = query.url || 'https://example.com/mcp';
      const normalizedUrl = normalizeUrl(url);
      const host = safeHost(normalizedUrl);
      const serverKind = inferMcpServerKind(normalizedUrl);
      return {
        audit: {
          url,
          normalized_url: normalizedUrl,
          server_kind: serverKind,
          recommended_paid_tools: [
            {
              name: 'premium_search',
              route: '/api/paid/search',
              price_usdc: '0.03-0.10',
              value: 'Fresh indexed search or higher result limits.',
              output_schema: { results: 'array', citations: 'array', freshness: 'string' },
            },
            {
              name: 'enrich',
              route: '/api/paid/enrich',
              price_usdc: '0.10-0.50',
              value: 'Expensive third-party API calls, enrichment, or entity matching.',
              output_schema: { entity: 'object', confidence: 'number', sources: 'array' },
            },
            {
              name: 'export',
              route: '/api/paid/export',
              price_usdc: '0.05-0.25',
              value: 'Structured file generation, bulk export, or normalized JSON download.',
              output_schema: { download_url: 'string', row_count: 'number', expires_at: 'string' },
            },
            {
              name: 'analyze',
              route: '/api/paid/analyze',
              price_usdc: '0.15-1.00',
              value: 'LLM, crawling, browser, or compute-heavy analysis that should not be free.',
              output_schema: { summary: 'string', recommendations: 'array', risk_notes: 'array' },
            },
          ],
          pricing: {
            default_range: '$0.01-$0.25 per call',
            raise_price_when: ['external API cost is non-trivial', 'browser automation is required', 'fresh data must be fetched', 'LLM tokens are used'],
            keep_free_when: ['static metadata', 'health checks', 'tool discovery', 'documentation'],
          },
          route_shape: {
            unpaid_response: {
              status: 402,
              body: {
                error: 'payment_required',
                accepts: [
                  {
                    scheme: 'exact',
                    network: 'base',
                    asset: 'USDC',
                    maxAmountRequired: '0.10',
                    resource: `https://${host}/api/paid/analyze`,
                    mimeType: 'application/json',
                  },
                ],
              },
            },
            paid_retry_headers: ['X-PAYMENT', 'X-PAYMENT-TX'],
          },
          catalog_metadata: {
            vendor_id_hint: host.replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
            product_id_hint: `${serverKind}-paid-tool`,
            categories: ['mcp-tools', 'agent-commerce', 'developer-tools'],
            tags: ['mcp', 'x402', 'base-usdc', serverKind],
            affiliate_bps_recommendation: 1500,
          },
          risk_notes: [
            'Do not put authentication-only tools behind x402 if they still require a separate vendor account.',
            'Avoid charging for static MCP metadata; charge for fresh data, compute, or premium limits.',
            'Return deterministic JSON schemas so buyer agents can evaluate the purchase automatically.',
          ],
          integration_steps: [
            'Add 402 response with x402 accepts[] metadata',
            'Register vendor/product in Pyrimid catalog',
            'Expose tool schema in MCP server card',
            'Add affiliateBps for distribution agents',
          ],
        },
      };
    }
    case 'x402-integration-plan': {
      const service = query.service || 'agent-api';
      return {
        plan: {
          service,
          route_shape: 'GET /api/paid/{tool} returns 402 until X-PAYMENT or X-PAYMENT-TX is supplied',
          payment_network: 'Base USDC',
          pyrimid_metadata: ['vendorId', 'productId', 'affiliateBps', 'endpoint', 'output_schema'],
          launch_checklist: ['publish llms.txt', 'publish agents.txt', 'submit MCP server card', 'list product in Pyrimid catalog'],
        },
      };
    }
    default:
      return { result: 'unknown_seed_product' };
  }
}

function normalizeUrl(input: string) {
  try {
    const url = new URL(input);
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return 'https://example.com/mcp';
  }
}

function safeHost(input: string) {
  try {
    return new URL(input).host || 'example.com';
  } catch {
    return 'example.com';
  }
}

function inferMcpServerKind(input: string) {
  const text = input.toLowerCase();
  if (text.includes('search')) return 'search';
  if (text.includes('data') || text.includes('enrich')) return 'data';
  if (text.includes('audit') || text.includes('security')) return 'audit';
  if (text.includes('agent')) return 'agent-discovery';
  return 'general';
}

export async function GET(req: NextRequest, context: { params: Promise<{ product: string }> }) {
  const { product: productId } = await context.params;
  const product = getSeedProduct(productId);

  if (!product) {
    return NextResponse.json(
      { error: 'not_found', message: 'Unknown Pyrimid seed product', catalog: 'https://pyrimid.ai/api/v1/catalog' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const proof = req.headers.get('x-payment-tx') || req.headers.get('x-payment');
  if (!proof) return paymentRequired(req, product);

  const verification = await verifyPyrimidPaymentTx(proof, product.price_usdc);
  if (!verification.valid) {
    return NextResponse.json(
      {
        error: 'payment_invalid',
        message: verification.reason || 'Payment could not be verified on Base',
        docs: 'https://pyrimid.ai/quickstart',
        proof: 'https://pyrimid.ai/proof',
      },
      { status: 403, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return NextResponse.json({
    product_id: product.product_id,
    vendor_id: product.vendor_id,
    payment_tx: verification.txHash,
    payment_amount: verification.amount?.toString(),
    buyer: verification.buyer,
    ...payload(product.product_id, req, proof),
    routed_by: 'pyrimid',
    links: {
      docs: 'https://pyrimid.ai/quickstart',
      proof: 'https://pyrimid.ai/proof',
      stats: 'https://pyrimid.ai/stats',
      catalog: 'https://pyrimid.ai/api/v1/catalog',
    },
  }, { headers: { 'Cache-Control': 'no-store' } });
}
