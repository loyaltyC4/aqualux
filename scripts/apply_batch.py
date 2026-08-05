"""Apply the verified repricing and add the two new products.

Every price here was set by reading the actual Amazon AU comparables for that
exact product class, not by taking a percentile of a keyword search. The first
attempt did the latter and it was wrong in both directions: it inflated
ph-meter to A$47 on the back of Bluelab SOIL meters at A$279, and it deflated
the premium LED bars to A$47 by averaging them against A$16 clip lights.

Two products are being repriced because they were LOSING money or close to it:
  spider-wood   A$29.95 against a A$31.05 landed cost - every sale lost A$1.10
  regulator     A$134.95 against an AU band of A$77-102 - priced out of market
"""
import json
import os

P = "data/products.json"
doc = json.load(open(P))
prods = doc if isinstance(doc, list) else doc["products"]
by = {p["handle"]: p for p in prods}

# handle -> (new price, compare_at or None, why)
REPRICE = {
    "aurora-48-planted-tank-led":       (109.95, 149.00, "hygger premium bar holds A$116.70; we sat above the ceiling"),
    "aurora-smart-78-rgb-led":          (119.95, 159.00, "bracket hygger A$116.70 / bamboo A$126.31 instead of topping them"),
    "aurora-pro-rgb-bluetooth":         (124.95, 169.00, "was above every AU comparable"),
    "dual-gauge-regulator-solenoid":    (99.95, 139.00, "AU dual-gauge+solenoid band A$77-102, median A$85"),
    "inline-atomiser-diffuser-16-22mm": (59.95, 79.00, "generic glass inline A$40-75, JBL A$87, CO2 Art A$99"),
    "bubble-counter-check-valve-set":   (32.95, 42.00, "LINLAN counter+check valve is a direct match at A$34.75"),
    "glass-drop-checker-4dkh-solution": (27.95, 36.00, "AU band A$23.76-48.71, median A$30"),
    "test-strips-9-in-1-100-count":     (21.95, 28.00, "23 clean comparables, median A$18.99"),
    "digital-ph-pen-meter":             (29.95, 39.00, "between the A$14.36 basic pen and the A$50.10 backlit unit"),
    "spider-wood-centrepiece-set":      (49.95, 65.00, "WAS LOSS-MAKING at A$29.95 vs A$31.05 landed; Tfwadmx spider wood A$45.55"),
}

for handle, (price, compare, why) in REPRICE.items():
    p = by.get(handle)
    if not p:
        print(f"  !! missing {handle}")
        continue
    old = p["variants"][0]["price"]
    for v in p["variants"]:
        v["price"] = f"{price:.2f}"
        v["compare_at_price"] = f"{compare:.2f}" if compare else None
    print(f"  {handle:36} {old:>8} -> {price:>7.2f}   {why}")

# ---------------------------------------------------------------- new products
NEXT_ID = max(p["id"] for p in prods) + 1


def mk(handle, title, ptype, tags, price, compare, body, specs, faqs, images,
       nid):
    return {
        "id": nid, "handle": handle, "title": title,
        "body_html": body, "vendor": "Aqualux", "product_type": ptype,
        "status": "active", "tags": tags,
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
            "sku": f"AQL-{handle[:6].upper()}", "position": 1,
            "option1": "Default Title", "option2": None, "option3": None,
            "taxable": True, "requires_shipping": True,
            "inventory_management": None, "inventory_policy": "continue",
            "inventory_quantity": 25, "available": True,
            "weight": 0, "weight_unit": "kg",
            "created_at": "2026-08-05T00:00:00+00:00",
            "updated_at": "2026-08-05T00:00:00+00:00",
            "admin_graphql_api_id": f"gid://shopify/ProductVariant/{nid+200}",
        }],
        "images": [
            {"id": nid + 300 + i, "product_id": nid, "position": i + 1,
             "src": f"/products/{handle}/{i+1:02d}.jpg",
             "width": 1200, "height": 1200, "alt": alt, "variant_ids": []}
            for i, alt in enumerate(images)
        ],
        "_specs": specs, "_faqs": faqs,
    }


NEW = [
    mk("auto-feeder-programmable",
       "Programmable Auto Feeder",
       "equipment",
       "equipment, feeding, planted tank",
       44.95, 59.00,
       "<p>A rim-mounted feeder with a sealed hopper that drops a measured "
       "portion on a schedule you set once. Runs on USB-C or batteries, so a "
       "power cut does not mean a missed feed.</p>\n<ul>\n"
       "<li><strong>Two feeds a day, or one.</strong> The 12 and 24 hour "
       "buttons set the interval; the manual button gives an extra portion "
       "without changing the schedule.</li>\n"
       "<li><strong>The hopper stays dry.</strong> A sealed drum and a "
       "rotating outlet keep humidity off the food, which is what turns "
       "cheap feeders into a clogged mess after a fortnight.</li>\n"
       "<li><strong>Portion control.</strong> A sliding gate sets how much "
       "leaves the drum per turn, so you can tune it to the tank rather than "
       "overfeeding and fighting the algae afterwards.</li>\n"
       "<li><strong>Fits rims to 15&nbsp;mm.</strong> The clamp takes both "
       "open-top and braced rims, and the arm angles so the outlet clears "
       "the glass.</li>\n</ul>",
       [{"name": "Feed intervals", "value": "Manual, 12 h, 24 h"},
        {"name": "Hopper", "value": "Sealed 100 ml drum"},
        {"name": "Power", "value": "USB-C rechargeable or 2×AAA"},
        {"name": "Mounts", "value": "Rim clamp up to 15 mm"},
        {"name": "Suits", "value": "Flake, micro pellet, granule"}],
       [{"q": "Will it work with flake food?",
         "a": "Yes. Flake needs the gate opened wider than pellets because it "
              "bridges more easily. Set the gate, watch one cycle, then adjust."},
        {"q": "What happens in a blackout?",
         "a": "It keeps its schedule on the internal cell or the AAAs. That is "
              "the reason to pick a battery-backed feeder over a mains one."},
        {"q": "Is it safe to leave for a week away?",
         "a": "For a week, yes, provided you run it for a few days first and "
              "confirm the portion size. Do not set a feeder for the first "
              "time the day you leave."}],
       ["Programmable Auto Feeder", "Programmable Auto Feeder rim clamp"],
       NEXT_ID),
    mk("digital-thermometer-lcd",
       "Digital Thermometer with Probe",
       "testing",
       "testing, equipment, planted tank",
       22.95, 29.00,
       "<p>A stick-on LCD with a sealed probe on a one-metre lead. It reads "
       "to 0.1&nbsp;°C and remembers the high and low since you last cleared "
       "it, which is how you catch a heater that is drifting at night.</p>\n"
       "<ul>\n"
       "<li><strong>Max and min memory.</strong> A spot reading tells you "
       "nothing about the overnight swing. This holds both extremes until you "
       "reset it.</li>\n"
       "<li><strong>Probe in the water, display outside.</strong> No hunting "
       "for an angle to read a glass thermometer through a planted "
       "foreground.</li>\n"
       "<li><strong>0.1&nbsp;°C resolution, &deg;C or &deg;F.</strong> Fine "
       "enough to see the difference between a stable tank and a heater "
       "cycling too wide.</li>\n"
       "<li><strong>Suction cup and adhesive pad.</strong> Mount the display "
       "on the cabinet or the glass, and route the probe behind the "
       "hardscape.</li>\n</ul>",
       [{"name": "Range", "value": "−50 to 70 °C"},
        {"name": "Resolution", "value": "0.1 °C"},
        {"name": "Accuracy", "value": "±1 °C"},
        {"name": "Memory", "value": "Max / min, resettable"},
        {"name": "Lead", "value": "1 m sealed probe"},
        {"name": "Power", "value": "1×LR44 (included)"}],
       [{"q": "Is the probe fully submersible?",
         "a": "The probe and its lead are sealed for permanent submersion. The "
              "display housing is not — keep it outside the tank."},
        {"q": "Why does it read differently to my glass thermometer?",
         "a": "Usually because they are in different places. Water stratifies, "
              "especially in a tank with low flow. Put both in the same spot "
              "for a fair comparison."},
        {"q": "Can I calibrate it?",
         "a": "No, it is a fixed ±1 °C sensor. For stability tracking that is "
              "plenty; if you need certified accuracy you want a lab probe."}],
       ["Digital Thermometer with Probe",
        "Digital Thermometer with Probe and suction cup"],
       NEXT_ID + 1),
]

existing = {p["handle"] for p in prods}
for p in NEW:
    if p["handle"] in existing:
        print(f"  ~~ {p['handle']} already present, replacing")
        prods[:] = [x for x in prods if x["handle"] != p["handle"]]
    prods.append(p)
    print(f"  + NEW {p['handle']:32} A${p['variants'][0]['price']}")

if isinstance(doc, list):
    doc = prods
else:
    doc["products"] = prods
json.dump(doc, open(P, "w"), indent=2, ensure_ascii=False)
print(f"\n{len(prods)} products written to {P}")
