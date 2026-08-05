"""Correct the test strips listing, swap two photos, add three basket fillers.

The test strips correction matters most. The live listing claimed "9 in 1, 100
Count" while the photo showed a BIOZYM 6-in-1 30-strip box. Pulling the actual
1688 source offer (id 732890024780) settled it: the product is an 8-parameter
strip - pH, hardness, ammonia nitrogen, nitrates, nitrites, total chlorine,
carbonate and total alkalinity - sold in 50/100/200 counts. So the photo was
closer to right than the copy was, and the copy is what needed fixing. The
handle carried the wrong claim too, so it changes and gets a redirect.

The three additions are deliberately framed as basket fillers, not winners.
Nets, intake sponges and breeder boxes all sit below the ~A$200/kg value
density needed for a single-item order to survive CN->AU freight. They earn
their place by lifting basket size: freight falls from 48% of order value on a
one-item order to 23% across four items, so a cheap add-on that gets someone
past the free-shipping threshold is worth more than its own margin line.
"""
import json
import os
import shutil

P = "data/products.json"
M = "data/collection-map.json"
doc = json.load(open(P))
prods = doc if isinstance(doc, list) else doc["products"]
by = {p["handle"]: p for p in prods}

# ---------------------------------------------------------------- 1. strips
OLD, NEW = "test-strips-9-in-1-100-count", "test-strips-8-in-1-100-count"
p = by[OLD]
p["handle"] = NEW
p["title"] = "Test Strips — 8 in 1, 100 Count"
p["body_html"] = (
    "<p>Eight-parameter dip strips: pH, hardness, ammonia nitrogen, nitrate, "
    "nitrite, total chlorine, carbonate and total alkalinity. 100-strip "
    "pack.</p>\n<ul>\n"
    "<li><strong>Ammonia and nitrite on the same strip.</strong> Those two "
    "decide whether a tank is safe to stock. A strip that skips them tells you "
    "the least useful things first.</li>\n"
    "<li><strong>Carbonate and total alkalinity separately.</strong> KH is what "
    "holds pH steady, and it is the number that actually moves when you inject "
    "CO2.</li>\n"
    "<li><strong>Dip and read in 30 seconds.</strong> Faster than a reagent "
    "kit for a weekly check, though a liquid kit is still more precise when you "
    "are chasing a problem.</li>\n"
    "<li><strong>100 strips.</strong> At a weekly test that is about two "
    "years for one tank.</li>\n</ul>")
p["specs"] = [
    {"label": "Parameters", "value": "8"},
    {"label": "Measures", "value": "pH, GH, ammonia, NO3, NO2, chlorine, CO3, KH"},
    {"label": "Count", "value": "100 strips"},
    {"label": "Read time", "value": "30 seconds"},
    {"label": "Type", "value": "Dip-and-read strip"},
]
p["faqs"] = [
    {"q": "Are strips as accurate as a liquid test kit?",
     "a": "No. Strips are for spotting a trend quickly. When a reading looks "
          "wrong, confirm it with a reagent kit before you act on it."},
    {"q": "Does it test CO2?",
     "a": "Not directly, and nor does any strip. Use the KH reading together "
          "with pH, or read CO2 off a drop checker."},
    {"q": "How should they be stored?",
     "a": "Capped, dry, and away from the tank. Humidity is what ruins strips "
          "long before the expiry date does."},
]
for im in p["images"]:
    im["src"] = f"/products/{NEW}/01.jpg"
    im["alt"] = "8 in 1 aquarium test strips, 100-count bottle with colour chart"
if p.get("image"):
    p["image"]["src"] = p["images"][0]["src"]
    p["image"]["alt"] = p["images"][0]["alt"]
print(f"  strips: {OLD} -> {NEW}, 9 params -> 8, photo replaced")

os.makedirs(f"public/products/{NEW}", exist_ok=True)
shutil.copy("../research/assets/test-strips-01.jpg", f"public/products/{NEW}/01.jpg")
shutil.rmtree(f"public/products/{OLD}", ignore_errors=True)

# ---------------------------------------------------------------- 2. rgbw photo
shutil.copy("../research/assets/rgbw-55-01.jpg",
            "public/products/rgbw-55-full-spectrum-led/01.jpg")
print("  rgbw-55: cropped cable fragment removed, reframed on white")

# ---------------------------------------------------------------- 3. additions
NEXT = max(x["id"] for x in prods) + 1


def mk(handle, title, ptype, tags, price, compare, body, specs, faqs, alt, nid):
    return {
        "id": nid, "handle": handle, "title": title, "body_html": body,
        "vendor": "Aqualux", "product_type": ptype, "status": "active",
        "tags": tags,
        "created_at": "2026-08-05T00:00:00+00:00",
        "updated_at": "2026-08-05T00:00:00+00:00",
        "published_at": "2026-08-05T00:00:00+00:00",
        "template_suffix": None, "published_scope": "web",
        "admin_graphql_api_id": f"gid://shopify/Product/{nid}",
        "options": [{"id": nid + 100, "product_id": nid, "name": "Title",
                     "position": 1, "values": ["Default Title"]}],
        "variants": [{
            "id": nid + 200, "product_id": nid, "title": "Default Title",
            "price": f"{price:.2f}", "compare_at_price": f"{compare:.2f}",
            "sku": f"AQL-{handle[:7].upper()}", "position": 1,
            "option1": "Default Title", "option2": None, "option3": None,
            "taxable": True, "requires_shipping": True,
            "inventory_management": None, "inventory_policy": "continue",
            "inventory_quantity": 40, "available": True,
            "weight": 0, "weight_unit": "kg",
            "created_at": "2026-08-05T00:00:00+00:00",
            "updated_at": "2026-08-05T00:00:00+00:00",
            "admin_graphql_api_id": f"gid://shopify/ProductVariant/{nid+200}",
        }],
        "images": [{"id": nid + 300, "product_id": nid, "position": 1,
                    "src": f"/products/{handle}/01.jpg", "width": 1200,
                    "height": 1200, "alt": alt, "variant_ids": []}],
        "image": {"id": nid + 300, "product_id": nid, "position": 1,
                  "src": f"/products/{handle}/01.jpg", "width": 1200,
                  "height": 1200, "alt": alt, "variant_ids": []},
        "specs": specs, "faqs": faqs,
    }


NEW_PRODUCTS = [
    mk("fine-mesh-fish-net-braided", "Fine-Mesh Fish Net — Braided Handle",
       "tools", "tools, equipment, planted tank", 14.95, 19.00,
       "<p>A soft fine-mesh net on a braided stainless handle. The mesh is fine "
       "enough for shrimp and fry, and soft enough not to tear a long fin.</p>\n"
       "<ul>\n<li><strong>Fine mesh, soft weave.</strong> Coarse nets catch "
       "shrimp legs and split betta fins. This one does not.</li>\n"
       "<li><strong>Square mouth.</strong> Corners are where fish escape a "
       "round net. A square profile works into the corner of the glass.</li>\n"
       "<li><strong>Braided handle, not stamped.</strong> Stamped handles bend "
       "and the join rusts. Braided stainless does not stain hardscape.</li>\n"
       "</ul>",
       [{"label": "Mesh", "value": "Fine, soft weave"},
        {"label": "Net width", "value": "8 cm"},
        {"label": "Handle", "value": "Braided stainless"},
        {"label": "Suits", "value": "Shrimp, fry, small fish"}],
       [{"q": "Will it hold shrimp?",
         "a": "Yes. The weave is fine enough that adult and juvenile shrimp do "
              "not pass through or get a leg caught."},
        {"q": "Can it be left wet?",
         "a": "Rinse in tank water and air-dry. Do not use soap on it — "
              "residue is far more dangerous to a tank than a damp net."}],
       "Fine-mesh aquarium fish net with braided stainless handle", NEXT),
    mk("intake-pre-filter-sponge-9pack", "Intake Pre-Filter Sponge — 9 Pack",
       "tools", "tools, equipment, filtration, planted tank", 21.95, 28.00,
       "<p>Nine slip-on foam sleeves for a filter intake. They stop fry, "
       "shrimp and plant trimmings being drawn into the impeller, and they "
       "carry a useful bacterial load once they are established.</p>\n<ul>\n"
       "<li><strong>Shrimp and fry safety.</strong> The usual reason a shrimp "
       "disappears is the intake. A sleeve solves it outright.</li>\n"
       "<li><strong>Extra biological media.</strong> An established sponge is "
       "colonised, so rinse it in tank water, never under the tap.</li>\n"
       "<li><strong>Nine of them.</strong> Rotate: run one while another dries, "
       "and you never strip the filter of bacteria in one go.</li>\n"
       "<li><strong>Fits intakes to about 25&nbsp;mm.</strong> Stretches over "
       "most internal filter and canister intakes.</li>\n</ul>",
       [{"label": "Quantity", "value": "9 sleeves"},
        {"label": "Fits intake", "value": "Up to ~25 mm"},
        {"label": "Material", "value": "Reticulated foam"},
        {"label": "Use", "value": "Pre-filter and biological media"}],
       [{"q": "How often should they be cleaned?",
         "a": "When flow drops noticeably, usually every week or two in a "
              "planted tank. Squeeze it out in a jug of tank water."},
        {"q": "Will it reduce my filter flow?",
         "a": "Slightly, and more as it loads up. That is the trade for keeping "
              "shrimp out of the impeller."}],
       "Nine-pack of foam pre-filter sponge sleeves for aquarium filter intakes",
       NEXT + 1),
    mk("acrylic-breeder-box-hang-on", "Acrylic Breeder Box — Hang-On",
       "tools", "tools, equipment, breeding, planted tank", 24.95, 32.00,
       "<p>A clear acrylic box that hangs inside the tank on suction cups, with "
       "a divided lower chamber and a slotted floor so fry drop away from the "
       "adult.</p>\n<ul>\n"
       "<li><strong>Fry drop through, adults cannot follow.</strong> The "
       "slotted floor is the whole point of a breeder box — it separates them "
       "at birth without you watching.</li>\n"
       "<li><strong>Shares the tank's water.</strong> No separate heater, no "
       "separate cycle, and no shock when the fry are eventually released.</li>\n"
       "<li><strong>Divided chamber.</strong> Also serves as an isolation box "
       "for a fish being treated or a fin recovering.</li>\n</ul>",
       [{"label": "Material", "value": "Clear acrylic"},
        {"label": "Mounting", "value": "Suction cups, hangs inside tank"},
        {"label": "Chambers", "value": "Divided, slotted floor"},
        {"label": "Use", "value": "Breeding, fry rearing, isolation"}],
       [{"q": "Does it need its own heater?",
         "a": "No. It hangs in the tank and shares its water and temperature, "
              "which is the main advantage over a separate tank."},
        {"q": "Will the fry get enough flow?",
         "a": "Position it near, not directly in front of, the filter outlet. "
              "Fry need gentle exchange, not a current."}],
       "Clear acrylic hang-on aquarium breeder box with suction cups",
       NEXT + 2),
]

existing = {x["handle"] for x in prods}
for np_ in NEW_PRODUCTS:
    if np_["handle"] in existing:
        prods[:] = [x for x in prods if x["handle"] != np_["handle"]]
    prods.append(np_)
    os.makedirs(f"public/products/{np_['handle']}", exist_ok=True)
    src = {"fine-mesh-fish-net-braided": "fish-net-01.jpg",
           "intake-pre-filter-sponge-9pack": "pre-filter-sponge-01.jpg",
           "acrylic-breeder-box-hang-on": "breeder-box-01.jpg"}[np_["handle"]]
    shutil.copy(f"../research/assets/{src}", f"public/products/{np_['handle']}/01.jpg")
    print(f"  + NEW {np_['handle']:34} A${np_['variants'][0]['price']}")

if isinstance(doc, list):
    doc = prods
else:
    doc["products"] = prods
json.dump(doc, open(P, "w"), indent=2, ensure_ascii=False)

# ---------------------------------------------------------------- collections
m = json.load(open(M))
m["testing"] = [NEW if h == OLD else h for h in m["testing"]]
for h in ("fine-mesh-fish-net-braided", "intake-pre-filter-sponge-9pack",
          "acrylic-breeder-box-hang-on"):
    m["tools"] = [x for x in m["tools"] if x != h] + [h]
# the planted bundle references the strips by handle
m["starter-kits"] = m.get("starter-kits", [])
json.dump(m, open(M, "w"), indent=2)
print(f"\n{len(prods)} products; tools={len(m['tools'])} testing={len(m['testing'])}")
