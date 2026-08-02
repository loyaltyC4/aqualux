/**
 * Long-form copy per collection page.
 *
 * The bare category list was 68 words on every collection page, which SEO
 * audits flag as thin content, and every collection body was near-identical,
 * which flagged as duplicate content. This adds a category-specific guide-
 * length passage that targets the real high-volume keywords for each category
 * and gives Google a reason to see each collection page as unique.
 *
 * Rendered UNDER the product grid so it does not push products below the fold.
 */

export type CollectionCopy = {
  intro: string;
  sections: { heading: string; body: string }[];
};

export const COLLECTION_COPY: Record<string, CollectionCopy> = {
  lighting: {
    intro:
      "Aquarium lighting is the single variable that decides whether a planted tank succeeds. Get it right and slow-growing carpeting plants pearl at midday; get it wrong and algae takes over within a fortnight. The lights on this page are picked on measurable output at the substrate — PAR — rather than raw watts or subjective brightness.",
    sections: [
      {
        heading: "How much light does a planted tank need?",
        body:
          "Low-light plants such as Anubias, Java fern and Cryptocoryne do well at roughly 20-30 PAR at the substrate. Carpeting plants and demanding red stems generally want 50+ PAR, which usually also means CO2 injection. High light without matching CO2 and fertiliser is the most common cause of algae in a planted tank.",
      },
      {
        heading: "How to size a light bar to your tank",
        body:
          "Match the fixture length to the tank rim, not the water volume. A 30in tank works with the 30in bar; a 36-48in tank needs the Aurora Pro. Where a tank falls between sizes, size up rather than down. All our LED bars have extendable end brackets, so a nominal 20in unit fits 20-24in rims.",
      },
      {
        heading: "What full-spectrum actually means",
        body:
          "Full-spectrum LED aquarium lights include red and blue chips alongside the standard white channel. Red brings out red pigmentation in stems like Rotala rotundifolia, blue supports photosynthesis at depth, and warm whites make the tank look natural to a human eye. Cheap plant lights skew heavily pink; ours run a balanced curve.",
      },
    ],
  },

  co2: {
    intro:
      "A CO2 system stops being optional the moment you run high light or want a dense carpet. The regulator holds cylinder pressure steady, the solenoid opens and closes with the timer, the atomiser dissolves CO2 into a fine mist that the water column absorbs, and the drop checker gives you an at-a-glance colour readout of dissolved concentration.",
    sections: [
      {
        heading: "Do I actually need CO2?",
        body:
          "No. Low-tech planted tanks work well without it. CO2 becomes worthwhile when you want fast growth, dense carpets, or red-pigmented stem plants. If you are running high light, CO2 stops being optional, because the plants cannot use the light without the carbon to match it.",
      },
      {
        heading: "Why we don't ship cylinders",
        body:
          "Pressurised gas cylinders are dangerous goods and cannot go by standard carriers. We sell every other part of a CO2 system: regulator with solenoid, needle valve, bubble counter, check valve, tubing, inline atomiser and drop checker. Cylinders are cheap to source or refill locally at a welding supplier, a homebrew shop or a paintball store.",
      },
      {
        heading: "What a drop checker actually tells you",
        body:
          "It measures dissolved CO2 indirectly using a 4dKH reference solution. The indicator turns blue at low CO2, green around 30 ppm, and yellow when CO2 is too high. It lags real conditions by an hour or two, so read it as a trend across the day rather than a live number.",
      },
    ],
  },

  tools: {
    intro:
      "Aquascaping tools stay in the tank longer than any other piece of gear in this shop. Cheap stamped steel corrodes within a month and leaves rust stains on hardscape; the tools we stock are 304 stainless with proper machined edges, weighted so tweezers stay closed until you press them.",
    sections: [
      {
        heading: "What length tweezers do you actually need?",
        body:
          "For a 30cm nano tank, a 27cm tweezer reaches the substrate from outside the rim without wet sleeves. For 45-60cm tanks pick the 32cm. Longer than that and precision suffers. Curved-tip tweezers place stems at a natural angle; straight tips are better for lifting existing pieces.",
      },
      {
        heading: "Curved scissors versus straight",
        body:
          "Curved-blade aquascaping scissors trim carpeting plants like Monte Carlo and dwarf hairgrass flush without gouging the substrate. Straight scissors are for stem plants where you want a clean vertical cut. Wave-edge scissors are a specialised option for cutting sword-plant leaves without shredding.",
      },
      {
        heading: "Algae scrapers you can actually leave in the tank",
        body:
          "Magnetic float cleaners with a blade attachment handle spot algae on glass without a scratched pane. The float side lifts free of the substrate if the two halves separate, so nothing gets buried. Stainless blade edges are safer on acrylic than plastic blades once they wear.",
      },
    ],
  },

  hardscape: {
    intro:
      "Substrate and hardscape are the parts of a planted tank you cannot swap out easily once it is running. Get the layout right on day one and the aquascape earns itself for years; get it wrong and you're rebuilding the tank to fix it. This page carries the substrate and hardscape we would buy for our own builds.",
    sections: [
      {
        heading: "Aqua soil versus inert substrate",
        body:
          "Use an active aqua soil if you are growing rooted stem plants or keeping shrimp: it holds nutrients, buffers pH downward and lasts about 18-24 months before nutrient release tapers off. Use inert sand or fine gravel if you mainly keep epiphytes like Anubias and moss attached to hardscape, or if you want your tap water parameters unchanged.",
      },
      {
        heading: "Seiryu stone and iwagumi layouts",
        body:
          "Seiryu is the classic iwagumi hardscape — angular grey rock with deep white mineral veining that catches light through the water column. It hardens the water slightly, which suits Amazon-style planted tanks and does not bother most shrimp species. Layouts use one dominant stone (the oyaishi) with two or three supporting pieces.",
      },
      {
        heading: "Spider wood and driftwood soaking",
        body:
          "Fresh spider wood floats until saturated. Soak it in a bucket of dechlorinated water for a few days before planting, changing the water once when it turns brown from tannins. Once waterlogged it stays put without weighting, and the tannin release settles down within a week or two.",
      },
    ],
  },

  testing: {
    intro:
      "Water testing is the diagnostic layer of the hobby. Liquid reagent kits measure the three parameters that actually kill fish — ammonia, nitrite and pH — accurately to the tenth. Multi-parameter test strips are faster for a weekly sanity check. Digital meters cover pH and TDS reliably once calibrated.",
    sections: [
      {
        heading: "Which parameters matter most in a planted tank?",
        body:
          "Ammonia and nitrite should read zero on an established tank. Nitrate reads 5-20 ppm in a healthy planted tank and gets consumed by plants. pH sits where your tap water and substrate settle it. GH and KH matter for shrimp keepers. Everything else — phosphate, iron, magnesium — matters only when you are pushing high-tech growth.",
      },
      {
        heading: "Liquid reagent versus test strips",
        body:
          "Liquid reagent kits are more precise: dropped in test tubes and read against a graded colour card, they give you pH to 0.2 and ammonia to about 0.25 ppm. Test strips are faster and read multiple parameters at once but only to the nearest colour band. For a new tank, use a liquid kit; for weekly monitoring on an established tank, strips are fine.",
      },
      {
        heading: "How to actually cycle a tank",
        body:
          "Add ammonia to about 2 ppm and wait. Test daily. Once ammonia drops to zero within 24 hours, then nitrite drops to zero within 24 hours, and nitrate is present, the biological filter has established. This usually takes 3-6 weeks. Skip the cycle and you kill the first fish.",
      },
    ],
  },
};
