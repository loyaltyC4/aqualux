"""Fill the four categories the competitor audit found we scored ZERO in.

Against Aura (196 products, the closest AU comparable) we were competitive
where we competed — CO2 7 vs their 10, lighting 6 vs 7 — and absent entirely
from filtration, air, breeding and general fishkeeping. Those categories carry
10-40x the demand of CO2. This closes that.

Everything here is deliberately NON-MAINS. Air pumps, heaters and powered
filters are EESS Level 3 and need a Certificate of Conformity before they can
be sold into Australia. Sponge filters are air-driven and passive, so they are
in scope for us; the pump that drives them is not, and we do not claim
otherwise in the copy.

These are basket fillers by value density, and priced accordingly. That is the
point rather than an apology: freight falls from 48% of order value on a
one-item order to 23% across four, so range that lifts basket size earns more
than its own margin line.

Three candidates were rejected on inspection, not economics:
  check valve   the only clean shot was inside an AQUARIUMVILLE retail bag
  hatchery box  in-tank lifestyle shot with goldfish, not an isolated product
  feeding ring  photographed with a betta in frame
"""
import json
import os
import shutil

P, M = "data/products.json", "data/collection-map.json"
doc = json.load(open(P))
prods = doc if isinstance(doc, list) else doc["products"]
NEXT = max(p["id"] for p in prods) + 1


def mk(n, handle, title, ptype, tags, price, compare, body, specs, faqs, alt, asset):
    nid = NEXT + n * 10
    img = {"id": nid + 3, "product_id": nid, "position": 1,
           "src": f"/products/{handle}/01.jpg", "width": 1200, "height": 1200,
           "alt": alt, "variant_ids": []}
    return dict(asset=asset, data={
        "id": nid, "handle": handle, "title": title, "body_html": body,
        "vendor": "Aqualux", "product_type": ptype, "status": "active",
        "tags": tags,
        "created_at": "2026-08-07T00:00:00+00:00",
        "updated_at": "2026-08-07T00:00:00+00:00",
        "published_at": "2026-08-07T00:00:00+00:00",
        "template_suffix": None, "published_scope": "web",
        "admin_graphql_api_id": f"gid://shopify/Product/{nid}",
        "options": [{"id": nid + 1, "product_id": nid, "name": "Title",
                     "position": 1, "values": ["Default Title"]}],
        "variants": [{
            "id": nid + 2, "product_id": nid, "title": "Default Title",
            "price": f"{price:.2f}", "compare_at_price": f"{compare:.2f}",
            "sku": f"AQL-{handle[:8].upper()}", "position": 1,
            "option1": "Default Title", "option2": None, "option3": None,
            "taxable": True, "requires_shipping": True,
            "inventory_management": None, "inventory_policy": "continue",
            "inventory_quantity": 40, "available": True,
            "weight": 0, "weight_unit": "kg",
            "created_at": "2026-08-07T00:00:00+00:00",
            "updated_at": "2026-08-07T00:00:00+00:00",
            "admin_graphql_api_id": f"gid://shopify/ProductVariant/{nid+2}"}],
        "images": [img], "image": dict(img), "specs": specs, "faqs": faqs})


ITEMS = [
    mk(0, "bio-sponge-filter-4-pack", "Bio Sponge Filter — 4 Pack", "tools",
       "filtration, breeding, shrimp, planted tank", 29.95, 39.00,
       "<p>Four air-driven sponge filters with uplift tubes. No impeller, so "
       "nothing can pull in fry or shrimp, and the sponge itself becomes the "
       "biological media once it colonises.</p>\n<ul>\n"
       "<li><strong>The standard filter for a breeding or shrimp tank.</strong> "
       "There is no intake to guard because there is no impeller — the reason "
       "experienced breeders use these and nothing else.</li>\n"
       "<li><strong>Biological, not just mechanical.</strong> An established "
       "sponge carries the bacterial colony. Rinse in tank water, never under "
       "the tap, or you restart the cycle.</li>\n"
       "<li><strong>Four of them.</strong> Seed a new tank instantly by moving "
       "a mature sponge across from an established one.</li>\n"
       "<li><strong>Needs an air pump.</strong> Driven by air, not mains — the "
       "pump is sold separately and is not included.</li>\n</ul>",
       [{"label": "Quantity", "value": "4 filters"},
        {"label": "Drive", "value": "Air-driven, pump not included"},
        {"label": "Suits", "value": "Tanks to ~40 L each"},
        {"label": "Best for", "value": "Fry, shrimp, quarantine, seeding"}],
       [{"q": "Do I need an air pump?",
         "a": "Yes. These run on air, not mains power. Any small aquarium air "
              "pump with airline will drive one or two."},
        {"q": "How often do I clean them?",
         "a": "When flow slows, usually every two to four weeks. Squeeze out in "
              "a jug of tank water — tap water kills the bacteria."}],
       "Four air-driven bio sponge filters with uplift tubes",
       "sponge-filter-4pk.jpg"),

    mk(1, "filter-media-foam-pads", "Filter Media Foam Pads — 4 Pack", "tools",
       "filtration, media, planted tank", 19.95, 26.00,
       "<p>Four cut-to-fit reticulated foam pads for canister trays and "
       "hang-on-back filters. Trim with scissors to whatever your filter "
       "takes.</p>\n<ul>\n"
       "<li><strong>Cut to fit anything.</strong> Filter-brand cartridges are "
       "priced as consumables precisely because they only fit one machine. "
       "These do not.</li>\n"
       "<li><strong>Mechanical first, biological after.</strong> New pads trap "
       "debris; established ones carry bacteria. Stagger replacement so you "
       "never swap the whole lot at once.</li>\n"
       "<li><strong>Reticulated open-cell foam.</strong> Rinses clean instead "
       "of clogging solid the way cheap bonded wool does.</li>\n</ul>",
       [{"label": "Quantity", "value": "4 pads"},
        {"label": "Material", "value": "Reticulated open-cell foam"},
        {"label": "Fitting", "value": "Trim to size with scissors"},
        {"label": "Suits", "value": "Canister trays, HOB filters"}],
       [{"q": "Will these fit my filter?",
         "a": "Almost certainly — they are oversized sheets meant to be cut. "
              "Measure the tray and trim about 2 mm over for a snug fit."},
        {"q": "Replace or rinse?",
         "a": "Rinse in tank water until the foam stops springing back, then "
              "replace. Never replace all pads in one go."}],
       "Four reticulated foam filter media pads",
       "filter-media-pads.jpg"),

    mk(2, "disc-air-stone-diffuser", "Disc Air Stone Diffuser", "tools",
       "air, aeration, filtration, planted tank", 14.95, 19.00,
       "<p>A wide ceramic disc that breaks air into a fine, even column instead "
       "of the coarse chugging you get from a cheap cylinder stone.</p>\n<ul>\n"
       "<li><strong>Finer bubbles, quieter tank.</strong> Small bubbles hold "
       "contact with the water longer, so gas exchange improves and the noise "
       "drops.</li>\n"
       "<li><strong>Wide flat base.</strong> Sits on the substrate without "
       "rolling, unlike a cylinder stone.</li>\n"
       "<li><strong>Drives a sponge filter.</strong> Also the right stone for "
       "a bubble column behind hardscape.</li>\n</ul>",
       [{"label": "Type", "value": "Ceramic disc"},
        {"label": "Connection", "value": "Standard 4 mm airline barb"},
        {"label": "Use", "value": "Aeration, sponge filter drive"}],
       [{"q": "Why does output drop over time?",
         "a": "Mineral deposits block the pores. Soak in dilute vinegar, rinse "
              "thoroughly, and it comes back."},
        {"q": "Does it need a strong pump?",
         "a": "A fine stone has more back-pressure than a coarse one. A very "
              "small pump may struggle to push a full disc."}],
       "Ceramic disc air stone diffuser with airline barb",
       "air-stone-disc.jpg"),

    mk(3, "airline-tubing-25ft", "Airline Tubing — 25 ft", "tools",
       "air, aeration, co2, planted tank", 16.95, 22.00,
       "<p>Twenty-five feet of clear 3/16\" airline. Standard bore, so it fits "
       "air pumps, sponge filters, check valves and CO2 fittings.</p>\n<ul>\n"
       "<li><strong>Stays flexible.</strong> Cheap tubing goes stiff and yellow "
       "within months, then kinks at every bend and cracks at the barb.</li>\n"
       "<li><strong>Standard 3/16\" bore.</strong> The size nearly all aquarium "
       "air fittings are built around.</li>\n"
       "<li><strong>25 ft.</strong> Enough to replumb several tanks rather than "
       "patching one run.</li>\n</ul>",
       [{"label": "Length", "value": "25 ft (7.6 m)"},
        {"label": "Bore", "value": '3/16" standard'},
        {"label": "Material", "value": "Clear flexible PVC"}],
       [{"q": "Can I use this for CO2?",
         "a": "For low-pressure runs from a diffuser, yes. For a pressurised "
              "regulator use dedicated CO2-resistant tubing — standard PVC is "
              "slightly permeable to CO2 over long runs."},
        {"q": "How do I stop it kinking?",
         "a": "Warm the end in hot water before pushing it onto a barb, and "
              "avoid tight radii. Suction clips hold the run in place."}],
       "Coil of clear 3/16 inch aquarium airline tubing",
       "airline-tubing.jpg"),

    mk(4, "airline-suction-clips-10pk", "Airline Suction Clips — 10 Pack",
       "tools", "air, aeration, accessories, planted tank", 12.95, 17.00,
       "<p>Ten suction cups with airline clips. They hold tubing, heater cables "
       "and CO2 lines flat against the glass instead of drifting through the "
       "scape.</p>\n<ul>\n"
       "<li><strong>Tidy is not cosmetic.</strong> Loose airline drifts into "
       "the flow path and across the front pane. This is the cheapest thing "
       "that makes a tank look considered.</li>\n"
       "<li><strong>Clip, not slot.</strong> The tube snaps in and stays; open "
       "slot holders release the moment the line is under tension.</li>\n"
       "<li><strong>Ten of them.</strong> Enough for a full run with spares — "
       "suction cups perish before anything else in a tank.</li>\n</ul>",
       [{"label": "Quantity", "value": "10 clips"},
        {"label": "Fits", "value": "4 mm airline and similar"},
        {"label": "Mounting", "value": "Suction cup, inside or outside glass"}],
       [{"q": "Why do suction cups stop sticking?",
         "a": "They harden with age and algae film. Clean the glass and the cup, "
              "and warm the cup in hot water to soften it before pressing."},
        {"q": "Will they hold a heater cable?",
         "a": "Yes for the cable. Do not use them to suspend the heater body — "
              "use its own bracket."}],
       "Ten aquarium airline suction cup clips",
       "suction-clips.jpg"),

    mk(5, "telescopic-fish-net", "Telescopic Fish Net — Fine Mesh", "tools",
       "equipment, breeding, shrimp, planted tank", 18.95, 24.00,
       "<p>A fine-mesh net on a telescopic stainless handle that extends to "
       "reach the bottom of a deep tank without putting your arm in it.</p>\n"
       "<ul>\n"
       "<li><strong>Reaches the substrate on a deep tank.</strong> The usual "
       "problem with a fixed net is that it is fine until you need the back "
       "corner of a 45 cm-deep scape.</li>\n"
       "<li><strong>Fine soft mesh.</strong> Holds shrimp and fry, and will not "
       "split a long fin.</li>\n"
       "<li><strong>Collapses for storage.</strong> Retracts to roughly a third "
       "of its extended length.</li>\n</ul>",
       [{"label": "Handle", "value": "Telescopic stainless"},
        {"label": "Mesh", "value": "Fine, soft"},
        {"label": "Suits", "value": "Shrimp, fry, small fish"}],
       [{"q": "Does the handle lock?",
         "a": "It friction-locks. Twist to set the length; it will hold against "
              "the weight of a wet net and a fish."},
        {"q": "Rinse or soap?",
         "a": "Rinse in tank water and air-dry. Never soap — residue is far "
              "more dangerous to the tank than a damp net."}],
       "Telescopic stainless aquarium fish net with fine mesh",
       "telescopic-net.jpg"),

    mk(6, "gravel-siphon-kit", "Gravel Siphon Kit — 5 Piece", "tools",
       "cleaning, maintenance, planted tank", 27.95, 36.00,
       "<p>A hand-pump siphon with gravel tube, plus an algae scraper, net and "
       "a stick-on thermometer strip. The water change kit in one box.</p>\n"
       "<ul>\n"
       "<li><strong>Primes with the pump, not your mouth.</strong> Squeeze the "
       "bulb and the siphon starts.</li>\n"
       "<li><strong>Gravel tube lifts detritus, not substrate.</strong> The "
       "wide tube slows flow enough that gravel drops back while waste "
       "leaves.</li>\n"
       "<li><strong>Five pieces.</strong> Siphon, gravel tube, scraper, net and "
       "thermometer strip.</li>\n"
       "<li><strong>Careful over aqua soil.</strong> Hover above it rather than "
       "digging in — soil granules will siphon straight out.</li>\n</ul>",
       [{"label": "Pieces", "value": "5"},
        {"label": "Priming", "value": "Hand pump bulb"},
        {"label": "Includes", "value": "Siphon, gravel tube, scraper, net, thermometer strip"}],
       [{"q": "Will it pull up my aqua soil?",
         "a": "It can. Hold the tube above the surface and let the flow lift "
              "detritus rather than pushing into the soil."},
        {"q": "How much water should I change?",
         "a": "20-30% weekly suits most planted tanks. Larger changes are for "
              "fixing a problem, not routine."}],
       "Five-piece aquarium gravel siphon and cleaning kit",
       "gravel-siphon-kit.jpg"),

    mk(7, "floating-algae-magnet-3pk", "Floating Algae Magnet — 3 Pack",
       "tools", "cleaning, maintenance, planted tank", 24.95, 32.00,
       "<p>Three floating magnetic cleaners. If the halves separate mid-clean "
       "the inner one floats up instead of burying itself in the "
       "substrate.</p>\n<ul>\n"
       "<li><strong>Floating inner half.</strong> The single feature worth "
       "paying for — a sinking magnet drops into the scape and drags substrate "
       "grit across the glass when you retrieve it.</li>\n"
       "<li><strong>Three sizes of grip.</strong> Use the strongest that still "
       "moves easily; over-strong magnets trap grit and scratch.</li>\n"
       "<li><strong>Keep it off the substrate line.</strong> Most scratched "
       "panes come from a grain of sand caught under the pad, not the pad "
       "itself.</li>\n</ul>",
       [{"label": "Quantity", "value": "3 cleaners"},
        {"label": "Type", "value": "Floating inner half"},
        {"label": "Suits", "value": "Glass to ~10 mm"}],
       [{"q": "Safe on acrylic?",
         "a": "Not recommended. Acrylic scratches far more easily than glass — "
              "use a dedicated acrylic-safe pad."},
        {"q": "Why did it scratch my glass?",
         "a": "Almost always a sand grain caught under the pad. Never run the "
              "magnet down to the substrate, and rinse the pad after each use."}],
       "Three floating magnetic aquarium algae cleaners",
       "algae-magnet-3pk.jpg"),

    mk(8, "plant-weights-10pk", "Plant Weights — 10 Pack", "tools",
       "aquascaping, planting, planted tank", 13.95, 18.00,
       "<p>Ten soft strips that wrap around a stem bundle and hold it down "
       "until it roots. The answer to plants that float free the day after "
       "planting.</p>\n<ul>\n"
       "<li><strong>Holds stems until they root.</strong> Freshly trimmed stems "
       "have no anchor and pop out. This is the standard fix.</li>\n"
       "<li><strong>Wrap, do not crush.</strong> Firm enough to hold, soft "
       "enough not to sever the stem.</li>\n"
       "<li><strong>Reusable.</strong> Unwrap once rooted and use them on the "
       "next batch of trimmings.</li>\n</ul>",
       [{"label": "Quantity", "value": "10 strips"},
        {"label": "Use", "value": "Stem bundles, mosses, loose trimmings"},
        {"label": "Reusable", "value": "Yes"}],
       [{"q": "Do I leave them in permanently?",
         "a": "No. Once the plant has rooted, unwrap and reuse. Left forever "
              "they eventually constrict a thickening stem."},
        {"q": "Are they safe for shrimp?",
         "a": "Yes, they are inert in fresh water. Bury the wrap under the "
              "substrate so it is out of sight."}],
       "Ten aquarium plant weight strips for anchoring stems",
       "plant-weights.jpg"),
]

existing = {p["handle"] for p in prods}
for it in ITEMS:
    d = it["data"]
    prods[:] = [x for x in prods if x["handle"] != d["handle"]]
    prods.append(d)
    os.makedirs(f"public/products/{d['handle']}", exist_ok=True)
    shutil.copy(f"../research/assets/{it['asset']}",
                f"public/products/{d['handle']}/01.jpg")
    print(f"  + {d['handle']:30} A${d['variants'][0]['price']}")

if isinstance(doc, list):
    doc = prods
else:
    doc["products"] = prods
json.dump(doc, open(P, "w"), indent=2, ensure_ascii=False)

m = json.load(open(M))
for it in ITEMS:
    h = it["data"]["handle"]
    m["tools"] = [x for x in m["tools"] if x != h] + [h]
json.dump(m, open(M, "w"), indent=2)
print(f"\n{len(prods)} products total; tools collection {len(m['tools'])}")
