/**
 * Search-led category hubs at root URLs (/planted-tank-lights, /aquarium-co2-systems, ...).
 *
 * Why: the competitors that rank for head terms on page one (Glass Aqua, Buce Plant, Nature Aquariums, BRS Fresh)
 * all have a collection page named exactly after the search, with products, a comparison and buying advice. Our
 * /search/<collection> URLs are broad buckets that rank at 40-65. Each hub below targets one real query and is
 * built only from catalogue products that exist (handles are checked at render; a hub with fewer than 3 live
 * products does not render and is left out of the sitemap).
 *
 * Copy rules: no PAR or output figures that are not in a product's own spec, no health or yield claims, nothing a
 * product page cannot back. Guidance is general aquarium practice.
 */

export type HubFaq = { q: string; a: string };
export type Hub = {
  slug: string;
  /** H1 and the base of the title tag. */
  name: string;
  /** The query this page is built to answer, shown in the meta description. */
  desc: string;
  /** Catalogue handles in display order. */
  handles: string[];
  collection: string;
  intro: string;
  choose: { h: string; p: string }[];
  faq: HubFaq[];
  guides: { href: string; label: string }[];
  tools?: { href: string; label: string }[];
  related: string[];
};

export const HUBS: Hub[] = [
  {
    slug: "planted-tank-lights", name: "Planted Tank Lights", collection: "lighting",
    desc: "Full-spectrum LED lights for planted aquariums, from nano clip-ons to 48 inch bars, with bundle options and sizing advice. Compare what each one is for.",
    handles: ["aurora-48-planted-tank-led", "aurora-pro-rgb-bluetooth", "aurora-smart-78-rgb-led", "rgbw-55-full-spectrum-led", "full-spectrum-led-40cm", "clip-on-nano-grow-light", "planted-starter-bundle-light-tools-test-kit"],
    intro: "Light decides how a planted tank grows, and the fixture has to match the tank before it can match the plants. These are the LED lights we sell for planted aquariums, from a clip-on for a nano tank to long bars and RGB fixtures for larger tanks. Each one lists its length and what it is for, so you can match the fixture to your tank's rim first and the plants second.",
    choose: [
      { h: "Match length to the tank", p: "Pick a bar roughly as long as the tank, not the water volume. A bar much shorter than the tank leaves dark ends where carpet plants stall." },
      { h: "Choose the spectrum for the job", p: "Full-spectrum fixtures add red and blue channels to white, which brings out red stems and supports growth. RGB fixtures let you adjust the colour balance for the look you want." },
      { h: "Plan the photoperiod before the brightness", p: "Most algae problems come from too many hours, not the wrong fixture. Start with a short, steady schedule and extend it only if plants keep up." },
    ],
    faq: [
      { q: "What is the best light for a planted tank?", a: "The one that fits your tank length and suits the plants you want to grow. Low-light plants need far less than carpeting plants, so decide the planting first, then pick the fixture." },
      { q: "How many hours should a planted tank light be on?", a: "Six to eight hours a day is a sensible start. Our light schedule guide explains how to adjust it and what algae is telling you." },
      { q: "Can I use one light for a nano tank?", a: "Yes. The clip-on nano light and clamp spotlight are made for small tanks where a full bar would be too long." },
    ],
    guides: [{ href: "/guides/best-led-lights-for-planted-tanks", label: "Best LED lights for planted tanks" }, { href: "/guides/best-light-for-planted-tank", label: "Best light for a planted tank" }, { href: "/guides/best-aquarium-light-schedule", label: "Aquarium light schedule" }],
    tools: [{ href: "/tools/aquarium-volume-calculator", label: "Tank volume calculator" }],
    related: ["nano-aquarium-lights", "aquarium-co2-systems", "planted-tank-starter-kit"],
  },
  {
    slug: "nano-aquarium-lights", name: "Nano Aquarium Lights", collection: "lighting",
    desc: "Small LED lights and clip-on grow lights for nano aquariums and desktop tanks. What to look for and which fit.",
    handles: ["clip-on-nano-grow-light", "spotlight-clamp-nano", "full-spectrum-led-40cm"],
    intro: "Small tanks need small lights. Clip-on and clamp fixtures fit on the rim of a nano tank without a hanging kit or a long bar overhanging the glass, and the 40 cm full-spectrum bar suits tanks up to that width.",
    choose: [
      { h: "Fit to the rim", p: "Clip and clamp lights need a rim or lip to grip; check your tank before choosing. A bar suits a tank with an open top." },
      { h: "Keep the output modest", p: "Nano tanks have little water to dilute mistakes. A modest light with a steady schedule is easier to run than a powerful one." },
      { h: "Think about heat and reach", p: "A clamp spotlight lights a small area, so it suits a single feature plant; a bar lights the whole tank." },
    ],
    faq: [
      { q: "What light does a 5 gallon planted tank need?", a: "A fixture around the width of the tank is enough for low-light plants. See our 5 gallon planted tank setup for the pairing." },
      { q: "Do nano tanks need a timer?", a: "A timer keeps the photoperiod consistent, which matters more in a small tank than a bigger one." },
    ],
    guides: [{ href: "/guides/best-light-for-planted-tank", label: "Best light for a planted tank" }, { href: "/guides/nano-tank-filter-guide", label: "Nano tank filters" }],
    tools: [{ href: "/tanks/5-gallon-planted-tank", label: "5 gallon planted tank setup" }],
    related: ["planted-tank-lights", "nano-tank-filters", "aquarium-heaters-and-thermometers"],
  },
  {
    slug: "aquarium-co2-systems", name: "Aquarium CO2 Systems", collection: "co2",
    desc: "Aquarium CO2 regulators, solenoids, diffusers, drop checkers and DIY kits for planted tanks. Everything except the gas cylinder.",
    handles: ["co2-starter-bundle-regulator-diffuser-checker", "dual-gauge-regulator-solenoid", "inline-atomiser-diffuser-16-22mm", "glass-drop-checker-4dkh-solution", "bubble-counter-check-valve-set", "co2-solenoid-valve-12v", "diy-co2-generator-kit-2l"],
    intro: "A CO2 system for a planted tank has four jobs: store the gas, regulate it, switch it with the lights and dissolve it in the water. These parts cover everything from a regulator and solenoid to an inline diffuser and a drop checker to watch the result. We do not ship the CO2 cylinder, which is a dangerous good; buy that locally.",
    choose: [
      { h: "Pressurised or DIY", p: "A regulator and cylinder is steadier and cheaper per month; a DIY generator needs no cylinder but needs regular refills. Our guide compares them." },
      { h: "Add a solenoid and a timer", p: "A solenoid valve switches the gas off at night so you do not gas the tank while plants are not using it." },
      { h: "Watch it with a drop checker", p: "A drop checker with 4 dKH reference solution shows whether CO2 is on target and is the better daily check than pH alone." },
    ],
    faq: [
      { q: "Do I need CO2 for a planted tank?", a: "Not for low-tech tanks with easy plants. Demanding plants and carpets grow much faster with it. See the carpet plants without CO2 guide." },
      { q: "What do I need for a CO2 setup?", a: "A cylinder, a regulator with a solenoid, a bubble counter and check valve, tubing and a diffuser. The CO2 starter kit bundles most of it." },
      { q: "Can I use these with any cylinder?", a: "Check the regulator's thread against your local cylinders before ordering; thread types differ between countries." },
    ],
    guides: [{ href: "/guides/co2-for-beginners-planted-tank", label: "CO2 for beginners" }, { href: "/guides/diy-co2-vs-pressurized-aquarium", label: "DIY CO2 vs pressurised" }, { href: "/guides/setting-up-co2-system-planted-tank", label: "Setting up a CO2 system" }],
    tools: [{ href: "/tools/co2-ppm-calculator", label: "CO2 ppm calculator" }],
    related: ["co2-regulators-and-solenoids", "diy-co2-kits", "planted-tank-lights"],
  },
  {
    slug: "co2-regulators-and-solenoids", name: "CO2 Regulators and Solenoid Valves", collection: "co2",
    desc: "Dual-gauge CO2 regulators with solenoid, 12V solenoid valves and bubble counters for planted aquarium CO2 injection.",
    handles: ["dual-gauge-regulator-solenoid", "co2-solenoid-valve-12v", "bubble-counter-check-valve-set", "co2-starter-bundle-regulator-diffuser-checker"],
    intro: "The regulator steps cylinder pressure down to something safe for an aquarium, and the solenoid switches it on and off with a timer. The bubble counter and check valve give you a visible rate and stop water running back up the line.",
    choose: [
      { h: "Dual gauge shows what is left", p: "One gauge reads cylinder pressure and the other working pressure, so you can see the cylinder running down before the tank notices." },
      { h: "12V solenoid, 12V supply", p: "A 12V solenoid needs a matching supply and a timer; check the plug that suits your country on our shipping page." },
      { h: "Always fit a check valve", p: "It prevents tank water siphoning back into the regulator when the gas is off." },
    ],
    faq: [
      { q: "What does a CO2 solenoid do?", a: "It opens and closes the gas line electrically so CO2 runs only while the lights are on, saving gas and protecting fish at night." },
      { q: "How many bubbles per second?", a: "It depends on tank size and the plants; start low and use a drop checker to confirm. Our setup guide walks through the steps." },
    ],
    guides: [{ href: "/guides/setting-up-co2-system-planted-tank", label: "Setting up a CO2 system" }, { href: "/guides/co2-for-beginners-planted-tank", label: "CO2 for beginners" }],
    tools: [{ href: "/tools/co2-ppm-calculator", label: "CO2 ppm calculator" }],
    related: ["aquarium-co2-systems", "diy-co2-kits"],
  },
  {
    slug: "diy-co2-kits", name: "DIY CO2 Kits for Planted Tanks", collection: "co2",
    desc: "DIY CO2 generator kit, atomiser diffuser, drop checker and tubing for small planted tanks. How it works and what it costs to run.",
    handles: ["diy-co2-generator-kit-2l", "inline-atomiser-diffuser-16-22mm", "glass-drop-checker-4dkh-solution", "bubble-counter-check-valve-set", "airline-tubing-25ft"],
    intro: "A DIY CO2 generator makes the gas from a sugar and yeast mix, so it needs no cylinder. It suits small tanks and anyone who cannot get a cylinder filled, with the trade-off that the output rises and falls and needs a fresh mix every few weeks.",
    choose: [
      { h: "Small tanks first", p: "DIY output is modest, so it suits tanks up to roughly 20 gallons; larger tanks are easier to run with a regulator and cylinder." },
      { h: "Use a diffuser that suits the tubing", p: "Match the diffuser to the tubing size and fit a check valve to stop back-flow." },
      { h: "Confirm with a drop checker", p: "Because output varies, a drop checker is the easiest way to see whether the tank is getting enough." },
    ],
    faq: [
      { q: "Is DIY CO2 worth it?", a: "For a nano or small tank on a tight budget, yes. For bigger tanks the steadier supply of a cylinder is worth the cost. Our guide compares both." },
      { q: "How often do I refill a DIY CO2 bottle?", a: "The mix is usually replaced every few weeks, depending on bottle size and temperature." },
    ],
    guides: [{ href: "/guides/diy-co2-vs-pressurized-aquarium", label: "DIY CO2 vs pressurised" }, { href: "/guides/co2-for-beginners-planted-tank", label: "CO2 for beginners" }],
    tools: [{ href: "/tools/co2-ppm-calculator", label: "CO2 ppm calculator" }],
    related: ["aquarium-co2-systems", "co2-regulators-and-solenoids"],
  },
  {
    slug: "aquascaping-tools", name: "Aquascaping Tools", collection: "tools",
    desc: "Stainless aquascaping tweezers, scissors, tool sets and plant weights for planting and trimming aquarium plants.",
    handles: ["aquascaping-tool-set-5-piece", "long-reach-tweezers-30cm", "tweezers-stainless-30cm", "curved-spring-scissors", "plant-weights-10pk", "pneumatic-sand-washer"],
    intro: "Long tweezers plant stems without wetting your sleeve, curved scissors trim carpets flat and weights keep new plants down until they root. These are the tools we sell for planting and trimming, as a five-piece set or individually.",
    choose: [
      { h: "Length for tank depth", p: "A 30 cm tool reaches the bottom of most tanks; a shorter one only suits nano tanks." },
      { h: "Stainless steel and a spring that works", p: "Tweezers need tension to grip stems and scissors need a clean cut; cheap tools fail on both." },
      { h: "Start with a set, add to it", p: "A five-piece set covers planting, trimming and a spatula for levelling substrate." },
    ],
    faq: [
      { q: "What aquascaping tools do I really need?", a: "Long tweezers, curved scissors and a spatula cover almost everything. Our tool kit guide separates essentials from extras." },
      { q: "Which scissors for trimming carpet plants?", a: "Curved spring scissors cut close to the substrate without uprooting plants." },
    ],
    guides: [{ href: "/guides/best-aquascaping-tool-kit-guide", label: "Best aquascaping tool kit" }, { href: "/guides/aquascaping-tools-set-guide", label: "Aquascaping tools set guide" }],
    related: ["aquarium-gravel-cleaners", "aquascape-rocks-and-driftwood", "planted-tank-starter-kit"],
  },
  {
    slug: "aquarium-gravel-cleaners", name: "Aquarium Gravel Cleaners and Siphons", collection: "tools",
    desc: "Manual and electric aquarium gravel siphons, water exchangers and sand washers for faster water changes.",
    handles: ["gravel-siphon-kit", "usb-siphon-gravel-cleaner-v2", "gravel-cleaner-battery-2in1", "electric-water-exchanger", "5-in-1-tank-cleaning-set", "pneumatic-sand-washer"],
    intro: "A gravel siphon removes waste from the substrate and drains the water in the same pass, which is why it is the heart of a weekly water change. Manual kits cost least, and battery, USB and electric versions move water without a bucket and a hose.",
    choose: [
      { h: "Manual or powered", p: "A manual siphon is cheap and reliable. Powered cleaners save effort on bigger tanks or where the sink is far away." },
      { h: "Plan the drain", p: "However you remove water, you need somewhere to put it; powered units still need a bucket or a hose." },
      { h: "Be gentle with planted substrate", p: "Hover above planted beds rather than digging; only vacuum the open gravel and sand." },
    ],
    faq: [
      { q: "How often should I clean the gravel?", a: "Every water change on open substrate, less often on densely planted areas. See our guide to faster water changes." },
      { q: "Can I use a gravel vacuum on sand?", a: "Yes, with a gentle hover, or use the sand washer to rinse new sand before it goes in the tank." },
    ],
    guides: [{ href: "/guides/faster-water-changes", label: "Faster water changes" }],
    tools: [{ href: "/tools/water-change-calculator", label: "Water change calculator" }],
    related: ["aquascaping-tools", "aquarium-glass-cleaners", "water-conditioners-and-treatments"],
  },
  {
    slug: "aquarium-glass-cleaners", name: "Aquarium Glass Cleaners and Algae Scrapers", collection: "tools",
    desc: "Magnetic glass cleaners, floating algae magnets and cleaning sets for aquarium glass.",
    handles: ["magnetic-glass-cleaner-float", "floating-algae-magnet-3pk", "5-in-1-tank-cleaning-set"],
    intro: "Algae on the glass is the first thing you see and the easiest to fix. A magnetic cleaner wipes the inside from outside the tank, and a floating version never falls to the bottom if the magnets separate.",
    choose: [
      { h: "Match the magnet to the glass", p: "Thicker glass needs a stronger magnet; check the glass thickness before buying." },
      { h: "Floating is safer", p: "A floating cleaner is easy to recover if the halves come apart." },
      { h: "Clean the cause too", p: "Glass algae usually comes back if light hours or nutrients are out of balance." },
    ],
    faq: [
      { q: "Will a magnetic cleaner scratch glass?", a: "Not if the pad is clean. Rinse it first, since a trapped grain of sand is what scratches." },
      { q: "Does it work on acrylic?", a: "Magnetic cleaners suit glass; acrylic needs a soft pad and care, so check before using." },
    ],
    guides: [{ href: "/guides/how-to-get-rid-of-algae-planted-tank", label: "How to get rid of algae in a planted tank" }, { href: "/guides/algae-in-fish-tank-bad-or-not", label: "Is algae bad?" }],
    related: ["aquarium-gravel-cleaners", "aquascaping-tools", "water-conditioners-and-treatments"],
  },
  {
    slug: "aquarium-water-test-kits", name: "Aquarium Water Test Kits", collection: "testing",
    desc: "Aquarium test strips, digital pH and EC meters and thermometers for testing tank water at home.",
    handles: ["test-strips-8-in-1-100-count", "gh-kh-test-strips-7in1", "ph-ec-meter-4in1", "digital-ph-meter-lcd", "digital-ph-pen-meter", "pro-ph-meter-backlit", "digital-thermometer-lcd"],
    intro: "Strips are quick for a routine check; digital meters read pH or temperature to a number and are better when you are tracking a trend. These are the testers we sell, so you can pick the right tool for each reading.",
    choose: [
      { h: "Strips for quick checks, meters for trends", p: "Strips tell you if something is off; a meter tells you by how much and lets you compare week to week." },
      { h: "Calibrate digital meters", p: "A meter is only as good as its last calibration, so use fresh buffer solution and follow the steps." },
      { h: "Test at the same time", p: "Readings move through the day, especially with CO2, so compare like with like." },
    ],
    faq: [
      { q: "Are test strips accurate?", a: "They are good for routine checks and spotting problems, not for tight control. Use a meter or liquid kit when you need precision." },
      { q: "Which tests matter most?", a: "Nitrate, pH and KH for a planted tank, plus ammonia and nitrite in a new tank. See our testing guide." },
    ],
    guides: [{ href: "/guides/aquarium-water-testing-guide", label: "Aquarium water testing guide" }, { href: "/guides/aquarium-water-test-kit-digital-review", label: "Digital test kits: are they worth it?" }],
    tools: [{ href: "/tools/water-change-calculator", label: "Water change calculator" }, { href: "/tools/co2-ppm-calculator", label: "CO2 ppm calculator" }],
    related: ["digital-ph-meters-for-aquariums", "water-conditioners-and-treatments", "aquarium-heaters-and-thermometers"],
  },
  {
    slug: "digital-ph-meters-for-aquariums", name: "Digital pH Meters for Aquariums", collection: "testing",
    desc: "Digital pH testers and pH/EC meters for aquariums, from pens to backlit meters with 3-point calibration.",
    handles: ["ph-ec-meter-4in1", "digital-ph-meter-lcd", "digital-ph-pen-meter", "pro-ph-meter-backlit"],
    intro: "A digital pH meter gives a number where a strip gives a colour, which matters when you are watching pH move with CO2 or adjusting for soft-water fish. The range runs from a simple pen to a backlit meter with three-point calibration.",
    choose: [
      { h: "Calibration points", p: "More calibration points give a more accurate reading across the range; two or three points are common." },
      { h: "Backlight and readability", p: "A backlit display helps in a dim fish room." },
      { h: "Keep the probe wet", p: "Store the probe in storage solution, never dry, and replace buffers as they age." },
    ],
    faq: [
      { q: "How often should I calibrate a pH meter?", a: "Before critical readings and regularly, for example monthly, or whenever readings seem off." },
      { q: "Can a pH meter tell me CO2 levels?", a: "With KH, yes: our CO2 calculator turns KH and pH into an estimated ppm." },
    ],
    guides: [{ href: "/guides/aquarium-water-test-kit-digital-review", label: "Digital test kits: are they worth it?" }, { href: "/guides/aquarium-water-testing-guide", label: "Water testing guide" }],
    tools: [{ href: "/tools/co2-ppm-calculator", label: "CO2 ppm calculator" }],
    related: ["aquarium-water-test-kits", "aquarium-co2-systems"],
  },
  {
    slug: "nano-tank-filters", name: "Nano Tank Filters", collection: "filtration",
    desc: "Small aquarium filters for nano tanks: USB hang-on, sponge, internal and submersible filters for shrimp and betta tanks.",
    handles: ["nano-hang-on-filter-usb", "bio-sponge-filter-4-pack", "xiten-submersible-filter", "4-in-1-internal-filter-pump", "three-in-one-built-in-filter", "ultra-quiet-nano-air-pump"],
    intro: "Small tanks need gentle, quiet filtration that will not suck up shrimp or blow a betta around the tank. Sponge filters, small hang-on filters and internal filters each suit a different kind of nano tank.",
    choose: [
      { h: "Flow that suits the livestock", p: "Shrimp, bettas and fry want low flow. Sponge filters are the gentlest; check the outlet can be baffled." },
      { h: "Mechanical, biological, or both", p: "Sponge and ceramic media grow bacteria; floss traps debris. Most nano filters do a bit of each." },
      { h: "Noise and power", p: "USB filters are quiet and easy to power; an air pump driving a sponge is quiet too, with a small hum." },
    ],
    faq: [
      { q: "What filter is best for a 5 gallon tank?", a: "A sponge filter or a small hang-on filter is plenty. See our nano filter guide for flow rates." },
      { q: "Are sponge filters good for shrimp?", a: "Yes. They are gentle, and shrimp graze on the biofilm." },
    ],
    guides: [{ href: "/guides/nano-tank-filter-guide", label: "Nano tank filter guide" }, { href: "/guides/best-small-fish-tank-filter-pump", label: "Best small tank filter and pump" }],
    related: ["aquarium-filters", "filter-media", "aquarium-air-pumps"],
  },
  {
    slug: "aquarium-filters", name: "Aquarium Filters and Pumps", collection: "filtration",
    desc: "Hang-on-back, internal, submersible and UV aquarium filters and pumps with filter media and pre-filter sponges.",
    handles: ["300g-filter-pump", "4-in-1-internal-filter-pump", "hob-waterfall-filter-3-stage", "submersible-uv-sterilizer", "xiten-submersible-filter", "nano-hang-on-filter-usb", "bio-sponge-filter-4-pack"],
    intro: "A filter does three jobs: it traps debris, it houses bacteria that convert waste and it moves water. These filters and pumps cover small and medium tanks, with a UV sterilizer for green-water problems.",
    choose: [
      { h: "Rated flow against tank volume", p: "Aim for a flow of several times the tank volume per hour in a planted tank, less for gentle livestock." },
      { h: "Media you can service", p: "Choose a filter with space for sponge, ceramic and floss so you can maintain it properly." },
      { h: "Add a pre-filter on intakes", p: "A sponge on the intake protects shrimp and fry." },
    ],
    faq: [
      { q: "Do planted tanks need a filter?", a: "Plants help, but a filter still moves water, traps debris and hosts the bacteria that handle waste." },
      { q: "How often should I clean a filter?", a: "Rinse sponges in old tank water when flow drops, never under chlorinated tap water." },
    ],
    guides: [{ href: "/guides/best-small-fish-tank-filter-pump", label: "Best small tank filter and pump" }, { href: "/guides/nano-tank-filter-guide", label: "Nano tank filter guide" }],
    related: ["filter-media", "nano-tank-filters", "aquarium-air-pumps"],
  },
  {
    slug: "filter-media", name: "Aquarium Filter Media", collection: "filtration",
    desc: "Activated carbon, ceramic rings, filter floss, foam pads and pre-filter sponges for aquarium filters.",
    handles: ["activated-carbon-filter-bags", "ceramic-bio-rings-filter-media", "aquarium-filter-floss-pad", "filter-media-foam-pads", "bio-sponge-filter-4-pack", "intake-pre-filter-sponge-9pack"],
    intro: "Filter media does the work inside the filter: floss and foam trap particles, ceramic rings and sponge house bacteria, and carbon removes dissolved colour and some odours. Layer them in that order so water meets the coarse stage first.",
    choose: [
      { h: "Mechanical first", p: "Floss or foam at the intake stops debris clogging the finer stages." },
      { h: "Biological in the middle", p: "Ceramic rings and sponge give bacteria surface area; do not replace them all at once." },
      { h: "Carbon only when needed", p: "Carbon helps after medication or to clear tannins, and wears out, so it is a short-term tool." },
    ],
    faq: [
      { q: "How often should I replace filter media?", a: "Replace floss often, rinse sponge and ceramic and replace only when falling apart; replace carbon every month or so when in use." },
      { q: "Do planted tanks need carbon?", a: "Not usually. It can remove some nutrients, so use it for a purpose and then take it out." },
    ],
    guides: [{ href: "/guides/nano-tank-filter-guide", label: "Nano tank filter guide" }],
    related: ["aquarium-filters", "nano-tank-filters", "aquarium-air-pumps"],
  },
  {
    slug: "aquarium-air-pumps", name: "Aquarium Air Pumps and Airline Accessories", collection: "filtration",
    desc: "Quiet aquarium air pumps, USB and battery pumps, air stones, tubing, clips and check valves.",
    handles: ["dual-outlet-air-pump", "ultra-quiet-nano-air-pump", "usb-portable-air-pump", "disc-air-stone-diffuser", "airline-tubing-25ft", "airline-suction-clips-10pk", "one-way-check-valve-2pack"],
    intro: "An air pump drives sponge filters, air stones and bubble effects, and a USB or battery pump keeps oxygen going during a power cut. Tubing, clips and a check valve complete the line.",
    choose: [
      { h: "Outlets for what you run", p: "A dual-outlet pump can drive two sponge filters or a filter and an air stone." },
      { h: "Quiet matters", p: "Quiet pumps are worth it in a bedroom or office; sit the pump on a soft pad." },
      { h: "Always fit a check valve", p: "It stops water siphoning back down the airline if the pump stops." },
    ],
    faq: [
      { q: "Do planted tanks need an air pump?", a: "Not always. Plants add oxygen in daylight, but a pump helps at night and drives sponge filters." },
      { q: "Where should the pump sit?", a: "Above the water line, or with a check valve if it sits below it, to prevent back-siphoning." },
    ],
    guides: [{ href: "/guides/best-small-fish-tank-filter-pump", label: "Best small tank filter and pump" }],
    related: ["nano-tank-filters", "aquarium-filters", "filter-media"],
  },
  {
    slug: "aquarium-heaters-and-thermometers", name: "Aquarium Heaters and Thermometers", collection: "heating",
    desc: "Adjustable submersible aquarium heaters, digital thermometers and stick-on temperature strips.",
    handles: ["adjustable-submersible-heater", "digital-thermometer-lcd", "stick-on-thermometer-strips", "turtle-heater-thermo"],
    intro: "Tropical fish and most aquatic plants want a steady temperature, which in a cool room means a heater and a thermometer you trust. These are the heaters and thermometers we sell.",
    choose: [
      { h: "Size the wattage to the tank", p: "Use our heater calculator with your tank volume and room temperature; two smaller heaters spread heat better in larger tanks." },
      { h: "Use a thermometer as a second opinion", p: "Do not trust the heater's own dial alone; a separate thermometer shows what the tank really is." },
      { h: "Check the plug and rating", p: "Heaters are mains devices; confirm the plug and voltage for your country on our country pages." },
    ],
    faq: [
      { q: "What size aquarium heater do I need?", a: "Roughly 2.5 to 5 watts per US gallon depending on how far above room temperature you keep it. Our heater calculator does the maths." },
      { q: "Where should a heater go?", a: "Near flow, fully submerged unless it says otherwise." },
    ],
    guides: [{ href: "/guides/aquarium-water-testing-guide", label: "Water testing guide" }],
    tools: [{ href: "/tools/aquarium-heater-size-calculator", label: "Heater size calculator" }],
    related: ["aquarium-water-test-kits", "nano-aquarium-lights", "aquarium-filters"],
  },
  {
    slug: "automatic-fish-feeders", name: "Automatic Fish Feeders and Feeding Tools", collection: "tools",
    desc: "Programmable auto feeder, in-tank feeding station and feeding tube for fish and shrimp.",
    handles: ["auto-feeder-programmable", "in-tank-feeding-station", "glass-shrimp-feeding-tube"],
    intro: "A programmable feeder drops measured portions while you are away, and a feeding station or glass tube keeps food in one spot so it does not scatter over the substrate.",
    choose: [
      { h: "Test before you travel", p: "Run the feeder for a week to confirm portions, and that the hopper does not clump in humid rooms." },
      { h: "Portion over timing", p: "Overfeeding while away is the main risk; set the smallest portion that works." },
      { h: "Contain the food", p: "Stations and tubes reduce waste, and make it easy to see what is eaten." },
    ],
    faq: [
      { q: "Is an automatic feeder safe for a holiday?", a: "For a few days, yes, after a trial run. For longer, ask someone to check the tank." },
      { q: "How much should I feed?", a: "What fish eat in about two minutes, once or twice a day." },
    ],
    guides: [{ href: "/guides/how-to-start-a-fish-tank-for-the-first-time", label: "How to start a fish tank" }],
    related: ["aquarium-fish-food", "shrimp-and-breeding-supplies", "aquascaping-tools"],
  },
  {
    slug: "aquarium-substrate-and-sand", name: "Aquarium Substrate, Soil and Sand", collection: "hardscape",
    desc: "Planted aquarium substrate: aqua soil, quartz gravel and a sand washer, with advice on depth and quantity.",
    handles: ["aqua-soil-planted-substrate", "crystal-quartz-gravel", "pneumatic-sand-washer", "luminous-pebbles"],
    intro: "Planted tanks grow best on a substrate that holds nutrients and lets roots spread. Aqua soil is made for that; gravel and sand suit unplanted or hardy planted tanks and are easier to clean.",
    choose: [
      { h: "Active soil for demanding plants", p: "Aqua soil releases nutrients and buffers water; it suits carpets and root feeders but needs a rinse routine." },
      { h: "Inert gravel for simplicity", p: "Gravel and sand add no nutrients but work with root tabs and easy plants." },
      { h: "Buy by volume", p: "Use our calculator to turn tank size and depth into litres, kilograms and bags." },
    ],
    faq: [
      { q: "How much substrate do I need?", a: "It depends on tank size and slope; the substrate calculator gives litres, kg and bag counts." },
      { q: "Soil or sand for a planted tank?", a: "Soil suits demanding plants; sand suits low-tech, easy planting. See our substrate guides." },
    ],
    guides: [{ href: "/guides/aquarium-soil-guide", label: "Aquarium soil guide" }, { href: "/guides/cheapest-aquarium-substrate", label: "Cheapest aquarium substrate" }, { href: "/guides/fish-tank-sand-vs-gravel", label: "Sand vs gravel" }],
    tools: [{ href: "/tools/substrate-calculator", label: "Substrate calculator" }],
    related: ["aquascape-rocks-and-driftwood", "planted-tank-fertiliser", "planted-tank-starter-kit"],
  },
  {
    slug: "aquascape-rocks-and-driftwood", name: "Aquascaping Rocks and Driftwood", collection: "hardscape",
    desc: "Dragon stone, spider wood, driftwood branches, labradorite and river rocks for aquascaping hardscape.",
    handles: ["dragon-stone-ohko-rock", "natural-driftwood-branch", "spider-wood-centrepiece-set", "labradorite-stone", "river-rocks-38lb"],
    intro: "Hardscape is the skeleton of an aquascape: rock and wood set the shape, and plants soften it. These stones and woods suit planted tanks, and each page lists size and weight so you can plan a layout.",
    choose: [
      { h: "Rock or wood, not both at random", p: "Use one rock type or one wood type for a coherent scape; mix only on purpose." },
      { h: "Check that wood sinks", p: "Soak new wood until it sinks, which also releases tannins." },
      { h: "Test rocks for hardness effects", p: "Some rocks raise hardness; check if you keep soft-water fish." },
    ],
    faq: [
      { q: "Will driftwood change my water?", a: "New wood releases tannins that tint water brown; soaking reduces it and it is harmless to most fish." },
      { q: "How much hardscape do I need?", a: "Plan a focal point and a flow of smaller pieces; see our aquascaping guide." },
    ],
    guides: [{ href: "/guides/how-to-start-aquascaping", label: "How to start aquascaping" }],
    related: ["aquarium-substrate-and-sand", "aquascaping-tools", "aquarium-decorations"],
  },
  {
    slug: "shrimp-and-breeding-supplies", name: "Shrimp and Breeding Supplies", collection: "breeding",
    desc: "Breeding caves, shrimp caves, breeder boxes, tank dividers, feeding tubes and shrimp food for small tanks.",
    handles: ["ceramic-breeding-cave", "shrimp-cave-2-pack", "acrylic-breeder-box-hang-on", "fish-tank-divider-grid", "betta-leaf-hammock", "glass-shrimp-feeding-tube", "blizzard-shrimp-tablets-spinach", "bio-sponge-filter-4-pack"],
    intro: "Shrimp and small fish breed best when there is somewhere to hide, graze and separate. Caves, boxes and dividers give shelter and let you protect fry, with sponge filters and shrimp food completing a quiet setup.",
    choose: [
      { h: "Hiding places first", p: "Shrimp and fry feel safer with caves and plants, and breed more readily." },
      { h: "Gentle, protected filtration", p: "Use sponge filters or covered intakes so fry and shrimplets are not sucked in." },
      { h: "Separate when you must", p: "A breeder box or divider lets you isolate fry or an aggressive fish without a second tank." },
    ],
    faq: [
      { q: "What do shrimp need to breed?", a: "Stable water, hiding places and a mature tank with biofilm to graze." },
      { q: "Do I need a breeder box?", a: "It helps with livebearer fry, less so with shrimp, which hide well in plants." },
    ],
    guides: [{ href: "/guides/nano-tank-filter-guide", label: "Nano tank filter guide" }],
    related: ["nano-tank-filters", "aquarium-fish-food", "betta-fish-supplies"],
  },
  {
    slug: "planted-tank-fertiliser", name: "Planted Tank Fertiliser", collection: "water-care",
    desc: "Liquid fertiliser, root tabs, nitrifying bacteria and mineral salt for planted aquariums.",
    handles: ["all-in-one-liquid-fertilizer", "root-fertilizer-tabs-40", "nitrifying-bacteria-300ml", "himalayan-mineral-salt-chunks"],
    intro: "Plants feed from the water column and the roots. A liquid fertiliser covers the water column, root tabs feed heavy rooters from below and a bacteria starter helps a new tank cycle.",
    choose: [
      { h: "Dose to light and CO2", p: "More light and CO2 means more plant demand; dose to growth, not to a calendar." },
      { h: "Root tabs for rooted plants", p: "Swords and crypts take nutrients through the roots; tabs go beside them." },
      { h: "Follow the label", p: "Measure carefully; overdosing is how a clean tank turns green." },
    ],
    faq: [
      { q: "Do planted tanks need fertiliser?", a: "Yes, over time; fish waste alone rarely covers demanding plants." },
      { q: "Liquid fertiliser or root tabs?", a: "Both feed different parts of the plant; many keepers use them together." },
    ],
    guides: [{ href: "/guides/how-to-get-rid-of-algae-planted-tank", label: "Algae in planted tanks" }, { href: "/guides/beginner-planted-aquarium-setup", label: "Beginner planted aquarium setup" }],
    related: ["aquarium-substrate-and-sand", "aquarium-co2-systems", "water-conditioners-and-treatments"],
  },
  {
    slug: "water-conditioners-and-treatments", name: "Water Conditioners and Treatments", collection: "water-care",
    desc: "Aquarium water conditioner, stabiliser, purifier liquid, treatment and purification tablets and nitrifying bacteria.",
    handles: ["water-conditioner-100ml", "water-stabilizer", "purifier-liquid", "water-purification-tablets", "treatment-tablets-35", "nitrifying-bacteria-300ml", "bio-cleaner-liquid"],
    intro: "Tap water needs treating before fish see it, and a new tank needs bacteria. These conditioners, stabilisers and treatments cover the basics of water care; always follow the dose on each label.",
    choose: [
      { h: "Condition every change", p: "Add conditioner to new water before it goes in, matched to the volume you are replacing." },
      { h: "Test before you treat", p: "Do not dose a treatment you do not need; test first." },
      { h: "Cycle a new tank", p: "Bacteria and patience beat any bottle; test ammonia and nitrite until they read zero." },
    ],
    faq: [
      { q: "Do I need a water conditioner?", a: "Yes, if your tap water contains chlorine or chloramine, as most do." },
      { q: "How long does a new tank take to cycle?", a: "Several weeks without help, faster with a bacteria starter; test to be sure." },
    ],
    guides: [{ href: "/guides/aquarium-water-testing-guide", label: "Water testing guide" }, { href: "/guides/faster-water-changes", label: "Faster water changes" }],
    tools: [{ href: "/tools/water-change-calculator", label: "Water change calculator" }],
    related: ["aquarium-water-test-kits", "planted-tank-fertiliser", "aquarium-gravel-cleaners"],
  },
  {
    slug: "aquarium-fish-food", name: "Aquarium Fish Food", collection: "food",
    desc: "Tropical flakes, betta pellets, goldfish sinking pellets, algae wafers, freeze-dried worms and shrimp food.",
    handles: ["tropical-fish-flakes-100g", "betta-micro-pellets-colour-boost", "ranchu-goldfish-sinking-pellets", "sinking-algae-wafers-bottom-feeder", "freeze-dried-bloodworm-cubes", "freeze-dried-tubifex-cubes", "blizzard-shrimp-tablets-spinach", "decapsulated-brine-shrimp-eggs"],
    intro: "A varied diet keeps fish healthy and colourful: a staple flake or pellet, a sinking food for bottom feeders and an occasional frozen or freeze-dried treat. These are the foods we sell for tropical fish, bettas, goldfish, shrimp and fry.",
    choose: [
      { h: "Match food to feeding level", p: "Surface feeders take flakes; bottom feeders need sinking wafers or pellets." },
      { h: "Staple plus treat", p: "Feed a quality staple daily and use freeze-dried food as a treat, not the whole diet." },
      { h: "Small portions", p: "Feed what is eaten in about two minutes and remove the rest." },
    ],
    faq: [
      { q: "How often should I feed fish?", a: "Once or twice a day, in small portions." },
      { q: "What do bottom feeders eat?", a: "Sinking pellets or wafers, plus leftovers; algae wafers suit many plecos and catfish." },
    ],
    guides: [{ href: "/guides/how-to-start-a-fish-tank-for-the-first-time", label: "How to start a fish tank" }],
    related: ["automatic-fish-feeders", "betta-fish-supplies", "shrimp-and-breeding-supplies"],
  },
  {
    slug: "betta-fish-supplies", name: "Betta Fish Supplies", collection: "breeding",
    desc: "Betta hammock, catappa leaves, betta pellets, a gentle USB filter and an adjustable heater for betta tanks.",
    handles: ["betta-leaf-hammock", "catappa-leaves-indian-almond", "betta-micro-pellets-colour-boost", "nano-hang-on-filter-usb", "adjustable-submersible-heater", "ultra-quiet-nano-air-pump"],
    intro: "Bettas like warm, still water, somewhere to rest near the surface and gentle filtration. A leaf hammock, catappa leaves, soft-flow filter and heater cover those needs, with betta pellets for a staple diet.",
    choose: [
      { h: "Rest near the surface", p: "Bettas breathe air, so a hammock or floating leaf gives them a place to rest." },
      { h: "Gentle flow", p: "Long fins struggle in strong current; baffle or choose a low-flow filter." },
      { h: "Stable warmth", p: "Use a heater and a thermometer; bettas are tropical." },
    ],
    faq: [
      { q: "What do betta fish need in a tank?", a: "A heated, filtered tank of 5 gallons or more with hiding places and a gentle flow." },
      { q: "Do bettas like catappa leaves?", a: "Many keepers use them for cover and tannins; they tint the water slightly." },
    ],
    guides: [{ href: "/guides/nano-tank-filter-guide", label: "Nano tank filter guide" }],
    related: ["nano-tank-filters", "aquarium-heaters-and-thermometers", "aquarium-fish-food"],
  },
  {
    slug: "aquarium-decorations", name: "Aquarium Decorations and Backgrounds", collection: "hardscape",
    desc: "Aquarium ornaments, luminous pebbles, glass crafts, plant decor sets and 3D and poster backgrounds.",
    handles: ["glass-crafts-ornament", "resin-cartoon-decor", "resin-ornament-wreck", "turtle-ornament", "luminous-pebbles", "aquatic-plants-decoration-set", "3d-aquarium-background", "double-sided-background-poster"],
    intro: "Decor gives fish hiding places and gives the tank its character. Backgrounds hide cables and make colours pop, and ornaments are an easy way to add a focal point to a tank.",
    choose: [
      { h: "Check for sharp edges", p: "Smooth resin and glass are safer for fish with long fins." },
      { h: "Hiding places count", p: "A wreck or cave doubles as shelter, which helps shy fish settle." },
      { h: "Background last", p: "Fit a background to the back glass before filling the tank." },
    ],
    faq: [
      { q: "Is resin decor safe for fish?", a: "Aquarium-grade resin is inert once cured; rinse new pieces before use." },
      { q: "How do I fit a background?", a: "Clean the glass, then tape or stick it to the outside of the back glass." },
    ],
    guides: [{ href: "/guides/how-to-start-aquascaping", label: "How to start aquascaping" }],
    related: ["aquascape-rocks-and-driftwood", "aquarium-substrate-and-sand", "betta-fish-supplies"],
  },
  {
    slug: "planted-tank-starter-kit", name: "Planted Tank Starter Kit: What You Need", collection: "starter-kits",
    desc: "Everything a first planted tank needs: light, CO2 starter, substrate, tools, fertiliser and test strips, with bundle options.",
    handles: ["planted-starter-bundle-light-tools-test-kit", "co2-starter-bundle-regulator-diffuser-checker", "aurora-48-planted-tank-led", "aqua-soil-planted-substrate", "aquascaping-tool-set-5-piece", "all-in-one-liquid-fertilizer", "test-strips-8-in-1-100-count"],
    intro: "A first planted tank needs six things beyond the tank and filter: a light, a substrate that feeds roots, planting tools, a fertiliser, a way to test the water and, if you want to grow demanding plants, CO2. These bundles and parts cover them.",
    choose: [
      { h: "Start low-tech", p: "A light, soil and fertiliser grow many plants without CO2; add CO2 later if you want carpets." },
      { h: "Buy the bundle if it fits", p: "The starter bundle covers the light, tools and test kit for tanks 48 to 58 cm wide." },
      { h: "Plan the tank size first", p: "Pick the tank, then size the light, substrate and filter from our setup pages." },
    ],
    faq: [
      { q: "What do I need to start a planted tank?", a: "A tank, filter, heater if needed, light, substrate, plants, fertiliser and test strips; CO2 is optional." },
      { q: "Do I need CO2 for a beginner planted tank?", a: "No. Start without it and add it if you want demanding plants." },
    ],
    guides: [{ href: "/guides/beginner-planted-aquarium-setup", label: "Beginner planted aquarium setup" }, { href: "/guides/how-to-start-a-fish-tank-for-the-first-time", label: "How to start a fish tank" }],
    tools: [{ href: "/tanks", label: "Setups by tank size" }, { href: "/tools", label: "Aquarium calculators" }],
    related: ["planted-tank-lights", "aquarium-substrate-and-sand", "aquarium-water-test-kits"],
  },
];

export const hubBySlug = (slug: string) => HUBS.find((h) => h.slug === slug);

export function hubUrls(): string[] {
  return HUBS.map((h) => `/${h.slug}`);
}
