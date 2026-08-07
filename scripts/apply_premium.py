"""Add the premium lily pipe sets — the one category that cleared every gate.

Lily pipes are the first genuinely PREMIUM addition: A$80.95 and A$89.95 against
18 tight Amazon AU comparables (A$58.99-105.77), 62-64% gross margin, and value
density above the ~200 A$/kg line where CN freight stops eating the sale. They
also matter strategically — only six existing SKUs net over $15 an order, and
those are the only products that can fund any paid acquisition.

Every other premium and adjacent-niche candidate was rejected on measured
grounds, not taste:
  terrarium mesh lids / misting   30% GM, ~100-127 A$/kg — bulky for the price
  bonsai tools and wire           22% / 14% GM — same shape problem
  shrimp minerals                 31% GM
  pocket TDS-EC pens              generic AU shelf is A$17-49, under landed cost
  titanium tools                  phantom category; the regex matched generic
                                  stainless kits we already sell at A$33.95
The pattern that wins is not a niche, it is a product shape: small, light,
expensive instruments and glassware.
"""
import json
import os
import shutil

P = "data/products.json"
M = "data/collection-map.json"
doc = json.load(open(P))
prods = doc if isinstance(doc, list) else doc["products"]
NEXT = max(p["id"] for p in prods) + 1


def mk(handle, title, tags, price, compare, body, specs, faqs, alt, nid):
    img = {"id": nid + 300, "product_id": nid, "position": 1,
           "src": f"/products/{handle}/01.jpg", "width": 1200, "height": 1200,
           "alt": alt, "variant_ids": []}
    return {
        "id": nid, "handle": handle, "title": title, "body_html": body,
        "vendor": "Aqualux", "product_type": "tools", "status": "active",
        "tags": tags,
        "created_at": "2026-08-07T00:00:00+00:00",
        "updated_at": "2026-08-07T00:00:00+00:00",
        "published_at": "2026-08-07T00:00:00+00:00",
        "template_suffix": None, "published_scope": "web",
        "admin_graphql_api_id": f"gid://shopify/Product/{nid}",
        "options": [{"id": nid + 100, "product_id": nid, "name": "Tubing",
                     "position": 1, "values": ["12/16 mm", "16/22 mm"]}],
        "variants": [
            {
                "id": nid + 200 + i, "product_id": nid, "title": t,
                "price": f"{price + i * 8:.2f}",
                "compare_at_price": f"{compare + i * 10:.2f}",
                "sku": f"AQL-{handle[:6].upper()}-{t.split('/')[0]}",
                "position": i + 1, "option1": t, "option2": None, "option3": None,
                "taxable": True, "requires_shipping": True,
                "inventory_management": None, "inventory_policy": "continue",
                "inventory_quantity": 15, "available": True,
                "weight": 0, "weight_unit": "kg",
                "created_at": "2026-08-07T00:00:00+00:00",
                "updated_at": "2026-08-07T00:00:00+00:00",
                "admin_graphql_api_id": f"gid://shopify/ProductVariant/{nid+200+i}",
            }
            for i, t in enumerate(["12/16 mm", "16/22 mm"])
        ],
        "images": [img], "image": dict(img),
        "specs": specs, "faqs": faqs,
    }


NEW = [
    mk("glass-lily-pipe-set", "Glass Lily Pipe Set — Inflow & Outflow",
       "tools, equipment, glassware, planted tank, aquascaping",
       80.95, 105.00,
       "<p>A matched pair of borosilicate glass pipes that replace the black "
       "plastic intake and spraybar most filters ship with. The outflow returns "
       "water in a rolling surface curve; the slotted inflow draws evenly "
       "without pinning fish against it.</p>\n<ul>\n"
       "<li><strong>The reason aquascapers switch.</strong> Glass disappears "
       "against the background. Plastic intakes are the single most visible "
       "piece of hardware in an otherwise clean tank.</li>\n"
       "<li><strong>Surface agitation without a ripple tank.</strong> The "
       "outflow curve breaks the surface film and helps gas exchange, which "
       "matters more once you are injecting CO2.</li>\n"
       "<li><strong>Slotted intake.</strong> Wide slots pass debris to the "
       "filter instead of clogging, and keep shrimp and fry out of the "
       "impeller.</li>\n"
       "<li><strong>Borosilicate, not soda-lime.</strong> Thicker walls and "
       "better thermal tolerance. Still glass — see the FAQ on cleaning.</li>\n"
       "</ul>",
       [{"label": "Material", "value": "Borosilicate glass"},
        {"label": "Fits tubing", "value": "12/16 mm or 16/22 mm"},
        {"label": "Includes", "value": "Inflow, outflow, suction fittings"},
        {"label": "Suits", "value": "Canister and hang-on-back filters"},
        {"label": "Rim", "value": "Rimless and rimmed tanks"}],
       [{"q": "How do I clean the inside?",
         "a": "A flexible pipe brush, or soak in a dilute bleach solution then "
              "rinse and dechlorinate thoroughly. Do not run wire down it — "
              "scratched glass is where the next crack starts."},
        {"q": "Will it fit my filter?",
         "a": "Match the tubing bore, not the filter brand. 12/16 mm suits most "
              "small canisters, 16/22 mm the larger ones. Measure your existing "
              "hose if unsure."},
        {"q": "Is glass a risk?",
         "a": "Honestly, yes — it is the trade for the look. The common failure "
              "is over-tightening a hose onto the pipe or knocking it against "
              "the rim during a water change, not spontaneous breakage."}],
       "Glass lily pipe set, inflow with slotted intake and curved outflow",
       NEXT),
    mk("steel-lily-pipe-set", "Stainless Lily Pipe Set — Inflow & Outflow",
       "tools, equipment, glassware, planted tank, aquascaping",
       89.95, 115.00,
       "<p>The same geometry as a glass lily pipe set in 304 stainless. It gives "
       "up the invisibility of glass and gets back the one thing glass cannot "
       "offer: you can knock it against the rim and nothing happens.</p>\n<ul>\n"
       "<li><strong>For tanks that get worked on.</strong> If you rescape often, "
       "or the tank is somewhere it gets bumped, this is the set that survives "
       "it.</li>\n"
       "<li><strong>304, not 201.</strong> The cheaper grade spots and bleeds "
       "rust into hardscape within months in fresh water. 304 does not.</li>\n"
       "<li><strong>Reads as intentional.</strong> Brushed steel against a "
       "rimless tank looks deliberate in a way black plastic never does.</li>\n"
       "<li><strong>Same slotted intake.</strong> Debris passes to the filter, "
       "shrimp and fry stay out of the impeller.</li>\n</ul>",
       [{"label": "Material", "value": "304 stainless steel"},
        {"label": "Fits tubing", "value": "12/16 mm or 16/22 mm"},
        {"label": "Includes", "value": "Inflow, outflow, clamps"},
        {"label": "Finish", "value": "Brushed"},
        {"label": "Suits", "value": "Canister and hang-on-back filters"}],
       [{"q": "Glass or stainless?",
         "a": "Glass if the tank is a display piece and stays undisturbed. "
              "Stainless if you rescape regularly or the tank lives somewhere "
              "it gets knocked."},
        {"q": "Will stainless rust?",
         "a": "304 will not in fresh water. Avoid steel wool on it — embedded "
              "iron particles are what usually causes 'stainless' to spot."},
        {"q": "Is it as quiet as glass?",
         "a": "Yes. Flow noise comes from the water level and the outflow angle, "
              "not the material. Sit the outflow just under the surface."}],
       "Stainless steel lily pipe set, inflow and outflow with clamps",
       NEXT + 1),
]

existing = {p["handle"] for p in prods}
SRC = {"glass-lily-pipe-set": "lily-glass-01.jpg",
       "steel-lily-pipe-set": "lily-steel-01.jpg"}
for np_ in NEW:
    if np_["handle"] in existing:
        prods[:] = [x for x in prods if x["handle"] != np_["handle"]]
    prods.append(np_)
    os.makedirs(f"public/products/{np_['handle']}", exist_ok=True)
    shutil.copy(f"../research/assets/{SRC[np_['handle']]}",
                f"public/products/{np_['handle']}/01.jpg")
    v = np_["variants"]
    print(f"  + {np_['handle']:24} A${v[0]['price']} / A${v[1]['price']}")

if isinstance(doc, list):
    doc = prods
else:
    doc["products"] = prods
json.dump(doc, open(P, "w"), indent=2, ensure_ascii=False)

m = json.load(open(M))
for h in SRC:
    m["tools"] = [x for x in m["tools"] if x != h] + [h]
json.dump(m, open(M, "w"), indent=2)
print(f"\n{len(prods)} products; tools collection now {len(m['tools'])}")
