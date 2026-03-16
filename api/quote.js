export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { description } = req.body;
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Missing description' });
  }

  const SYSTEM = `You are a quote assistant for ReFloorCo, a home renovation company.
Extract project details from a rep's job description and return ONLY valid JSON — no markdown, no extra text.

Services:
- lvp: LVP Flooring (tier 0=Standard $3.25/sqft, 1=Mid-grade $4.25/sqft, 2=Premium $5.50/sqft)
- paint: Interior Paint (tier 0=Walls only $1.75/sqft, 1=Full room $2.50/sqft, 2=Full home $2.25/sqft)
- epoxy: Epoxy Floors (tier 0=Solid color $3.00/sqft, 1=Full chip $4.50/sqft, 2=Metallic $6.50/sqft)
- cab: Cabinet Paint (tier 0=Per door $50/door qty=door count, 1=Full kitchen $950 flat, 2=Premium $1400 flat)
- ext: Exterior Paint (tier 0=Body only $1800 flat, 1=Body+trim $2800 flat, 2=Full package $3600 flat)

Return this exact JSON shape:
{"customer":{"name":"","phone":"","address":"","email":""},"services":[{"id":"lvp","tier":0,"qty":850}],"summary":"One friendly sentence confirming what was understood."}

Rules:
- Only include services explicitly mentioned
- qty = square footage for lvp/paint/epoxy, door count for cab (0 if unknown), 1 for ext
- Tier mapping: standard/basic/entry=0, mid/mid-grade=1, premium/high-end/metallic/full=2
- Default tier to 0 if not specified
- Default qty to 0 if sq ft not mentioned
- summary should be short and confirm the key details`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: SYSTEM,
        messages: [{ role: 'user', content: description }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const raw = data.content[0].text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process quote: ' + err.message });
  }
}
