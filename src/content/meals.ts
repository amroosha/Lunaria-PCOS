
import { MEAL_PHOTOS, type MealPhoto } from "@/content/meal-photos";
import type { SourceId } from "@/content/pcos";

/**
 * Meal-plan content for "7-Day Meal Plans You Can Mix and Match" and
 * "Foods to Avoid with PCOS".
 *
 * Principles follow the 2023 International PCOS Guideline (section 3.3: no one
 * diet composition has been shown to be better than another; sustainable healthy
 * eating tailored to preferences; avoid unduly restrictive diets), the British
 * Dietetic Association food fact sheet and the NHS Eatwell Guide. Nothing here is
 * a prescription: no portion sizes, no calorie targets, no weight-loss framing.
 * Photos are real food photography from Pexels (free licence) and are credited;
 * see `meal-photos.ts` for how they are stored and restored.
 */

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Optional snack",
};

export const SLOT_ORDER: MealSlot[] = ["breakfast", "lunch", "dinner", "snack"];

export type MealTag = "budget" | "quick" | "batch" | "vegan option" | "oily fish";

export interface MealOption {
  id: string;
  slot: MealSlot;
  title: string;
  description: string;
  /** Short chips explaining what makes the plate balanced. */
  balance: string[];
  /** A practical tweak or substitution for this specific meal. */
  tip: string;
  vegetarian: boolean;
  tags: MealTag[];
  image: MealPhoto;
  /** Short, literal description of what the photo shows. */
  alt: string;
  credit: { name: string; url: string };
}

export const MEAL_OPTIONS: MealOption[] = [
  /* ------------------------------- Breakfasts ------------------------------- */
  {
    id: "b-porridge",
    slot: "breakfast",
    title: "Porridge with banana, blueberries and walnuts",
    description:
      "Oats cooked with milk or a plant drink, topped with sliced banana, a few blueberries, a small handful of walnuts and a pinch of cinnamon. Oats are a wholegrain, the milk adds protein, and the walnuts bring plant omega-3 fats.",
    balance: ["Wholegrain: oats", "Protein: milk, walnuts", "Fibre: fruit"],
    tip: "Frozen blueberries work just as well and cost less. Stir in a spoon of chia or ground flaxseed if you have it.",
    vegetarian: true,
    tags: ["budget", "quick"],
    image: MEAL_PHOTOS["breakfast-porridge-banana-walnuts"],
    alt: "Bowl of porridge topped with sliced banana, blueberries, walnuts, chia seeds and a dusting of cinnamon.",
    credit: { name: "Cup of Couple", url: "https://www.pexels.com/photo/flat-lay-photography-of-delicious-oatmeal-on-white-ceramic-bowl-7655885/" },
  },
  {
    id: "b-yoghurt",
    slot: "breakfast",
    title: "Yoghurt bowl with berries and oaty granola",
    description:
      "Plain Greek-style yoghurt (or a soya alternative) with a handful of berries, a sprinkle of oat granola or whole oats, and a few nuts or seeds. The yoghurt brings protein and calcium, the oats are a wholegrain, and the berries add fibre and natural sweetness.",
    balance: ["Protein: yoghurt", "Wholegrain: oats", "Fibre: berries, nuts"],
    tip: "Not a yoghurt person? Porridge made with milk and topped the same way works just as well.",
    vegetarian: true,
    tags: ["quick"],
    image: MEAL_PHOTOS["breakfast-yoghurt-berries"],
    alt: "Bowl of yoghurt topped with blackberries, blueberries, strawberries, granola and fresh mint.",
    credit: { name: "Antoni Shkraba", url: "https://www.pexels.com/photo/strawberries-and-blackberries-in-a-ceramic-bowl-6823332/" },
  },
  {
    id: "b-scrambled-eggs",
    slot: "breakfast",
    title: "Scrambled eggs on wholegrain toast with rocket and avocado",
    description:
      "Two eggs scrambled softly, piled on a slice of wholegrain or seeded toast with a handful of rocket and a few slices of avocado. Eggs are an inexpensive protein, the bread is a higher-fibre starch, and the avocado adds unsaturated fat.",
    balance: ["Protein: eggs", "Wholegrain: bread", "Healthy fat: avocado"],
    tip: "No avocado? A spoon of hummus or a drizzle of olive oil does the same job.",
    vegetarian: true,
    tags: ["budget", "quick"],
    image: MEAL_PHOTOS["breakfast-scrambled-eggs-toast"],
    alt: "Scrambled eggs on toast with rocket leaves and sliced avocado on a blue plate.",
    credit: { name: "Anthony Rahayel", url: "https://www.pexels.com/photo/scrambled-eggs-and-avocado-on-toast-with-greens-32134464/" },
  },
  {
    id: "b-avocado-egg",
    slot: "breakfast",
    title: "Avocado and poached egg on toast",
    description:
      "Sliced avocado on toasted sourdough or wholegrain bread with a poached egg and fresh herbs. A simple plate that pairs starch with protein and healthy fat so it keeps you going through the morning.",
    balance: ["Protein: egg", "Healthy fat: avocado", "Starch: bread"],
    tip: "Add tomatoes or spinach on the side to count towards your five a day.",
    vegetarian: true,
    tags: ["quick"],
    image: MEAL_PHOTOS["breakfast-avocado-egg-toast"],
    alt: "Slice of toast topped with sliced avocado, a poached egg and fresh dill.",
    credit: { name: "Nicola Barts", url: "https://www.pexels.com/photo/bread-with-avocado-7936964/" },
  },
  {
    id: "b-overnight-oats",
    slot: "breakfast",
    title: "Overnight oats and berries jar",
    description:
      "Oats soaked overnight in milk or a plant drink with a spoon of yoghurt, topped in the morning with strawberries and blueberries. Make a few jars at once for grab-and-go mornings.",
    balance: ["Wholegrain: oats", "Protein: milk, yoghurt", "Fibre: berries"],
    tip: "Chia seeds thicken the oats and add plant omega-3s; a spoon of nut butter adds staying power.",
    vegetarian: true,
    tags: ["budget", "batch", "vegan option"],
    image: MEAL_PHOTOS["breakfast-oats-berries-jar"],
    alt: "Glass jar of oats topped with strawberries and blueberries, with raspberries and blueberries scattered around it.",
    credit: { name: "Abdullah", url: "https://www.pexels.com/photo/variety-of-fresh-berries-7752365/" },
  },
  {
    id: "b-omelette",
    slot: "breakfast",
    title: "Vegetable omelette with toast",
    description:
      "A two-egg omelette folded around whatever vegetables you have — peppers, mushrooms, spinach, tomato — with a slice of wholegrain toast and some cucumber or tomato on the side. Good for using up odds and ends.",
    balance: ["Protein: eggs", "Veg: filling & sides", "Starch: toast"],
    tip: "Works for lunch or a quick dinner too. Add a little cheese or beans to the filling if you like.",
    vegetarian: true,
    tags: ["budget", "quick"],
    image: MEAL_PHOTOS["breakfast-omelette-toast"],
    alt: "Folded omelette on a plate with two slices of toast, cucumber, tomato and a floret of broccoli.",
    credit: { name: "Atlantic Ambience", url: "https://www.pexels.com/photo/breakfast-on-a-plate-12944792/" },
  },

  /* --------------------------------- Lunches -------------------------------- */
  {
    id: "l-quinoa-salad",
    slot: "lunch",
    title: "Quinoa and chickpea salad with roasted peppers and feta",
    description:
      "Cooked quinoa (or bulgur wheat or brown rice) tossed with chickpeas, roasted red peppers, leafy greens and herbs, a little crumbled feta, and a dressing of olive oil and lemon. Pulses count as both protein and fibre, quinoa is a wholegrain, and the olive oil provides unsaturated fat.",
    balance: ["Protein & fibre: chickpeas", "Wholegrain: quinoa", "Healthy fat: olive oil", "Veg: peppers, greens"],
    tip: "Leave out the feta for a vegan version, or add leftover chicken, tofu or a boiled egg.",
    vegetarian: true,
    tags: ["batch", "vegan option"],
    image: MEAL_PHOTOS["lunch-quinoa-chickpea-salad"],
    alt: "Plate of quinoa salad with roasted chickpeas, strips of red pepper and crumbled feta.",
    credit: { name: "Mohammed-Ali Hamadache", url: "https://www.pexels.com/photo/healthy-quinoa-salad-with-chickpeas-on-wooden-table-38499046/" },
  },
  {
    id: "l-soup",
    slot: "lunch",
    title: "Chunky vegetable and bean soup with wholegrain bread",
    description:
      "A big pot of soup made from onion, carrot, potato, tinned tomatoes and stock, bulked out with a tin of beans or a handful of pearl barley or lentils. Serve with a slice of wholegrain bread. It freezes well, so one pot covers several lunches.",
    balance: ["Protein & fibre: beans or lentils", "Veg: carrot, potato, tomato", "Starch: bread"],
    tip: "Frozen mixed vegetables make this even quicker. Stir in spinach or kale at the end.",
    vegetarian: true,
    tags: ["budget", "batch", "vegan option"],
    image: MEAL_PHOTOS["lunch-vegetable-soup-bread"],
    alt: "Bowl of chunky vegetable soup with potato, carrot and grains, beside a small bowl of torn crusty bread.",
    credit: { name: "Victor Cayke", url: "https://www.pexels.com/photo/soup-in-a-bowl-served-with-bread-on-the-side-17312402/" },
  },
  {
    id: "l-sandwich",
    slot: "lunch",
    title: "Wholegrain sandwich with a side salad",
    description:
      "A sandwich on wholegrain or seeded bread with a protein-rich filling — egg, hummus and grated carrot, cheese and tomato, or tinned tuna or leftover chicken if you eat them — plus a simple side salad. A packed-lunch classic that travels well.",
    balance: ["Protein: filling", "Wholegrain: bread", "Veg: salad"],
    tip: "Add a piece of fruit or a small pot of yoghurt to round it out.",
    vegetarian: true,
    tags: ["budget", "quick"],
    image: MEAL_PHOTOS["lunch-sandwich-salad"],
    alt: "Lunchbox of small sandwiches with a green salad and two pots of dressing.",
    credit: { name: "Elly Mar Tamayor", url: "https://www.pexels.com/photo/healthy-lunch-with-sandwiches-and-salad-35482981/" },
  },
  {
    id: "l-wraps",
    slot: "lunch",
    title: "Veggie wraps with hummus and crunchy salad",
    description:
      "Wholemeal tortillas spread with hummus and rolled around lettuce, cucumber, grated carrot and herbs. Add beans, falafel, cheese or leftover roast chicken for extra protein.",
    balance: ["Protein & fibre: hummus, beans", "Starch: wholemeal wrap", "Veg: salad"],
    tip: "Make two and keep one in the fridge for tomorrow — wrap it tightly so it doesn't go soggy.",
    vegetarian: true,
    tags: ["quick", "vegan option"],
    image: MEAL_PHOTOS["lunch-veggie-wraps"],
    alt: "Tortilla wraps filled with lettuce, cucumber and herbs, sliced in half on a wooden board.",
    credit: { name: "Shameel mukkath", url: "https://www.pexels.com/photo/wraps-on-wooden-board-5112578/" },
  },
  {
    id: "l-burrito-bowl",
    slot: "lunch",
    title: "Bean burrito bowl",
    description:
      "Black beans warmed with cumin and paprika, served with sweetcorn, diced avocado, a little cheese and roasted sweet potato. Everything can be prepped ahead and assembled in minutes.",
    balance: ["Protein & fibre: black beans", "Healthy fat: avocado", "Veg: corn, sweet potato"],
    tip: "A spoon of plain yoghurt stands in for sour cream; add a handful of rice or a wholemeal tortilla if you want more starch.",
    vegetarian: true,
    tags: ["batch", "vegan option"],
    image: MEAL_PHOTOS["lunch-bean-burrito-bowl"],
    alt: "Two bowls with black beans, sweetcorn, diced avocado, cubes of cheese and roasted sweet potato.",
    credit: { name: "Alesia Kozik", url: "https://www.pexels.com/photo/cooked-food-on-white-ceramic-plate-6065181/" },
  },
  {
    id: "l-rice-bean-bowl",
    slot: "lunch",
    title: "Rice and bean bowl with roasted sweet potato",
    description:
      "Brown rice topped with black beans, sweetcorn, roasted sweet potato, lettuce, tomato and red onion, with lime juice and a drizzle of olive oil. A good way to use up leftover rice and roasted veg.",
    balance: ["Protein & fibre: beans", "Wholegrain: brown rice", "Veg: sweet potato, salad"],
    tip: "Any beans work — kidney, pinto or chickpeas. Cool leftover rice quickly and keep it in the fridge for no more than a day.",
    vegetarian: true,
    tags: ["budget", "batch", "vegan option"],
    image: MEAL_PHOTOS["lunch-rice-bean-bowl"],
    alt: "Bowl of brown rice with black beans, sweetcorn, roasted sweet potato, lettuce, tomato and red onion.",
    credit: { name: "Heather Brock", url: "https://www.pexels.com/photo/mouthwatering-buddha-bowl-6978234/" },
  },
  {
    id: "l-sweet-potato",
    slot: "lunch",
    title: "Baked sweet potato with feta, pomegranate and greens",
    description:
      "A sweet potato baked until soft, split and topped with crumbled feta, pomegranate seeds and herbs, with salad leaves on the side. Add a spoon of chickpeas or beans to make the protein go further.",
    balance: ["Starch & fibre: sweet potato", "Protein: feta, beans", "Veg: salad"],
    tip: "Microwave the potato for 6–8 minutes first to speed things up. Cottage cheese or hummus works instead of feta.",
    vegetarian: true,
    tags: ["budget"],
    image: MEAL_PHOTOS["lunch-baked-sweet-potato"],
    alt: "Two baked sweet potatoes split open and topped with crumbled feta, pomegranate seeds and herbs, with salad leaves.",
    credit: { name: "Anthony Rahayel", url: "https://www.pexels.com/photo/delicious-stuffed-sweet-potato-with-feta-and-pomegranate-32127741/" },
  },

  /* --------------------------------- Dinners -------------------------------- */
  {
    id: "d-salmon",
    slot: "dinner",
    title: "Grilled salmon with roasted vegetables",
    description:
      "A salmon fillet grilled or baked with lemon, served with a tray of roasted courgette, peppers, mushrooms and tomatoes, plus new potatoes with the skins on or wholegrain couscous. Oily fish such as salmon is the richest source of omega-3 fats; the NHS suggests two portions of fish a week, one of them oily.",
    balance: ["Protein & omega-3: salmon", "Higher-fibre starch: skin-on potatoes", "Veg: roasted tray"],
    tip: "Sardines, mackerel or trout are oily fish too, and often cheaper — tinned works fine.",
    vegetarian: false,
    tags: ["oily fish"],
    image: MEAL_PHOTOS["dinner-salmon-roasted-vegetables"],
    alt: "Grilled salmon fillet topped with diced pepper salsa, served with charred courgette, red pepper, mushrooms and half a lemon.",
    credit: { name: "Cristian Mihaila", url: "https://www.pexels.com/photo/grilled-vegetables-and-fish-served-on-white-plate-14537684/" },
  },
  {
    id: "d-dal",
    slot: "dinner",
    title: "Lentil dal with rice and greens",
    description:
      "Red or brown lentils simmered with onion, tomato, garlic, ginger and spices, topped with coriander and a scattering of nuts or seeds, served with rice (wholegrain if you like it) and wilted spinach or a side salad. Lentils are an inexpensive source of protein and fibre.",
    balance: ["Protein & fibre: lentils, chickpeas", "Starch: rice", "Healthy fat: nuts, seeds", "Veg: spinach, tomato"],
    tip: "Make a double batch — dal reheats well and freezes for a month.",
    vegetarian: true,
    tags: ["budget", "batch", "vegan option"],
    image: MEAL_PHOTOS["dinner-lentil-dal-rice"],
    alt: "Bowl of lentil curry with chickpeas, pistachios, sesame seeds and coriander, served with rice.",
    credit: { name: "Alesia Kozik", url: "https://www.pexels.com/photo/food-healthy-lunch-meal-6544376/" },
  },
  {
    id: "d-veg-stir-fry",
    slot: "dinner",
    title: "Vegetable stir-fry with rice",
    description:
      "Broccoli, cauliflower, mushrooms and peppers stir-fried with garlic, ginger and soy sauce, served over rice. Add tofu, a handful of cashews or a fried egg for protein. On the table in about twenty minutes.",
    balance: ["Veg: broccoli, peppers, mushrooms", "Protein: tofu, cashews or egg", "Starch: rice"],
    tip: "A bag of frozen stir-fry vegetables is a perfectly good shortcut.",
    vegetarian: true,
    tags: ["quick", "vegan option"],
    image: MEAL_PHOTOS["dinner-vegetable-stir-fry"],
    alt: "Bowl of stir-fried broccoli, cauliflower, mushrooms and peppers over rice, with chopsticks resting on the rim.",
    credit: { name: "Skyler Ewing", url: "https://www.pexels.com/photo/rice-bowl-with-mixed-vegetable-toppings-10695966/" },
  },
  {
    id: "d-chicken-stir-fry",
    slot: "dinner",
    title: "Chicken and mushroom stir-fry with rice",
    description:
      "Sliced chicken thigh or breast stir-fried with mushrooms, spring onion, garlic and soy sauce, served over rice. Toss in any vegetables that need using — peppers, green beans, pak choi.",
    balance: ["Protein: chicken", "Veg: mushrooms, spring onion", "Starch: rice"],
    tip: "Swap the chicken for tofu, prawns or a tin of drained chickpeas.",
    vegetarian: false,
    tags: ["quick"],
    image: MEAL_PHOTOS["dinner-chicken-stir-fry"],
    alt: "Ceramic bowl of chicken and mushroom stir-fry with spring onion served over rice.",
    credit: { name: "Nadin Sh", url: "https://www.pexels.com/photo/a-bowl-of-chicken-and-rice-24738520/" },
  },
  {
    id: "d-bean-chilli",
    slot: "dinner",
    title: "Bean chilli with avocado and a tortilla",
    description:
      "Kidney and black beans simmered with onion, peppers, tinned tomatoes, cumin and smoked paprika, topped with sliced avocado, a little cheese and shredded red cabbage, with a warm wholemeal tortilla or rice on the side. Cheap, filling and better the next day.",
    balance: ["Protein & fibre: beans", "Healthy fat: avocado", "Veg: peppers, cabbage, tomato", "Starch: tortilla"],
    tip: "Add lean mince if you like, or keep it all-bean. Freeze portions for busy nights.",
    vegetarian: true,
    tags: ["budget", "batch", "vegan option"],
    image: MEAL_PHOTOS["dinner-bean-chilli"],
    alt: "Bowl of bean chilli topped with sliced avocado, cheese and red cabbage, with a folded tortilla on the side.",
    credit: { name: "Magda Ehlers", url: "https://www.pexels.com/photo/hearty-mexican-chili-with-tortilla-and-avocado-32667184/" },
  },
  {
    id: "d-veg-curry",
    slot: "dinner",
    title: "Vegetable curry with rice",
    description:
      "Potato, carrot and peas simmered in a mild curry sauce made from onion, curry paste or powder and a little coconut milk or yoghurt, served with rice. Stir in a tin of chickpeas or lentils so there's protein in the pot.",
    balance: ["Veg: potato, carrot, peas", "Protein & fibre: chickpeas or lentils", "Starch: rice"],
    tip: "Frozen peas and mixed veg are ideal here. Leftovers make a good lunch with a wholemeal wrap.",
    vegetarian: true,
    tags: ["budget", "batch", "vegan option"],
    image: MEAL_PHOTOS["dinner-vegetable-curry"],
    alt: "Plate of mild vegetable curry with potato, carrot and peas next to white rice, with a wooden spoon.",
    credit: { name: "Cats Coming", url: "https://www.pexels.com/photo/cooked-rice-and-curry-food-served-on-white-plate-674574/" },
  },
  {
    id: "d-tofu-broccoli",
    slot: "dinner",
    title: "Crispy tofu and broccoli in a creamy sauce with rice",
    description:
      "Firm tofu baked or pan-fried until golden, tossed with steamed broccoli in a sauce of peanut butter, soy, lime and a splash of coconut milk, served over rice. Tofu is an affordable complete plant protein.",
    balance: ["Protein: tofu", "Veg: broccoli", "Healthy fat: peanut butter", "Starch: rice"],
    tip: "Press the tofu for ten minutes first so it crisps up. Cashew or tahini sauce works too.",
    vegetarian: true,
    tags: ["quick", "vegan option"],
    image: MEAL_PHOTOS["dinner-tofu-broccoli-rice"],
    alt: "Two bowls of crispy tofu cubes and broccoli in a creamy sauce served over rice.",
    credit: { name: "Alesia Kozik", url: "https://www.pexels.com/photo/close-up-photo-of-food-in-a-bowl-6120241/" },
  },
  {
    id: "d-pasta",
    slot: "dinner",
    title: "Wholewheat spaghetti with spinach, cherry tomatoes and feta",
    description:
      "Wholewheat spaghetti tossed with garlic, olive oil, wilted spinach, halved cherry tomatoes and crumbled feta. A fifteen-minute dinner; add a tin of cannellini beans or some grilled chicken for extra protein.",
    balance: ["Wholegrain: wholewheat pasta", "Protein: feta, beans", "Veg: spinach, tomatoes", "Healthy fat: olive oil"],
    tip: "Ordinary pasta is fine if you prefer it — the beans and vegetables matter more than the type of pasta.",
    vegetarian: true,
    tags: ["quick"],
    image: MEAL_PHOTOS["dinner-wholewheat-pasta"],
    alt: "Plate of wholewheat spaghetti with wilted spinach, halved cherry tomatoes and crumbled feta, twirled on a fork.",
    credit: { name: "Lisa Fotios", url: "https://www.pexels.com/photo/selective-focus-photography-of-pasta-with-tomato-and-basil-1279330/" },
  },
  {
    id: "d-fish-tacos",
    slot: "dinner",
    title: "Fish tacos with red cabbage slaw",
    description:
      "Flakes of baked white fish in taco shells or small tortillas with a yoghurt-and-lime dressing, herbs and a crunchy red cabbage slaw. White fish is a lean protein and counts towards the two portions of fish a week the NHS suggests.",
    balance: ["Protein: white fish", "Veg: cabbage slaw", "Starch: tortillas", "Healthy fat: yoghurt dressing, avocado"],
    tip: "Frozen fish fillets keep the cost down. Make it vegetarian with spiced black beans or roasted cauliflower.",
    vegetarian: false,
    tags: ["quick"],
    image: MEAL_PHOTOS["dinner-fish-tacos"],
    alt: "Three fish tacos in crisp shells with a creamy dressing and herbs, beside a bowl of red cabbage slaw.",
    credit: { name: "Shameel mukkath", url: "https://www.pexels.com/photo/top-view-of-a-plate-with-tacos-and-red-cabbage-salad-10296421/" },
  },
  {
    id: "d-chicken-tray-bake",
    slot: "dinner",
    title: "Roast chicken tray bake with vegetables",
    description:
      "A chicken (or chicken thighs) roasted in one tray with potatoes, courgette, peppers and onion in olive oil, lemon and herbs. Leftover chicken becomes tomorrow's sandwiches or wraps, and the carcass makes stock.",
    balance: ["Protein: chicken", "Veg: courgette, peppers, onion", "Starch: potatoes", "Healthy fat: olive oil"],
    tip: "Use the same tray method with chickpeas and halloumi or tofu for a vegetarian version.",
    vegetarian: false,
    tags: ["batch"],
    image: MEAL_PHOTOS["dinner-chicken-tray-bake"],
    alt: "Whole roast chicken in a roasting tin with courgette, peppers and potatoes, being basted with a spoon.",
    credit: { name: "Lionel Ntasano", url: "https://www.pexels.com/photo/baked-chicken-with-roasted-vegetables-in-kitchen-37100056/" },
  },
  {
    id: "d-shakshuka",
    slot: "dinner",
    title: "Shakshuka — eggs baked in spiced tomato sauce",
    description:
      "Eggs cracked into a pan of simmering tomatoes, peppers, onion, garlic, cumin and paprika, finished with herbs and served with wholegrain bread or pitta to mop up the sauce. Works for brunch as well as dinner.",
    balance: ["Protein: eggs", "Veg: tomatoes, peppers", "Starch: bread"],
    tip: "Stir a tin of chickpeas or butter beans into the sauce for extra protein and fibre; add feta if you like.",
    vegetarian: true,
    tags: ["budget", "quick"],
    image: MEAL_PHOTOS["dinner-shakshuka"],
    alt: "Frying pan of shakshuka: eggs cooked in a chunky tomato and pepper sauce, sprinkled with herbs.",
    credit: { name: "Jahra Tasfia Reza", url: "https://www.pexels.com/photo/delicious-shakshuka-with-poached-eggs-in-pan-39833278/" },
  },

  /* --------------------------------- Snacks --------------------------------- */
  {
    id: "s-apple-peanut",
    slot: "snack",
    title: "Apple with peanut butter on wholegrain toast",
    description:
      "A sliced apple with a spoon of peanut butter, or a slice of wholegrain toast spread thinly with it. Pairing fruit or wholegrain carbohydrate with nuts adds protein and healthy fats. Snacks are optional — this is for days with a long gap between meals.",
    balance: ["Protein & healthy fat: peanut butter", "Wholegrain: seeded bread", "Fibre: apple"],
    tip: "Any nut or seed butter works, and so does a small handful of nuts with the fruit.",
    vegetarian: true,
    tags: ["budget", "quick", "vegan option"],
    image: MEAL_PHOTOS["snack-apple-peanut-butter-toast"],
    alt: "Slices of wholegrain toast with peanut butter next to two green apples and a jar of peanut butter.",
    credit: { name: "Denis Liendo", url: "https://www.pexels.com/photo/bread-with-peanut-butter-and-apples-11405133/" },
  },
  {
    id: "s-hummus",
    slot: "snack",
    title: "Hummus with crunchy vegetables",
    description:
      "Hummus with carrot, cucumber, pepper or celery sticks, or with a couple of oatcakes. Chickpeas and tahini give protein, fibre and healthy fats, and the vegetables add crunch while counting towards your five a day.",
    balance: ["Protein & fibre: chickpeas", "Healthy fat: tahini, olive oil", "Veg: crudités"],
    tip: "Cottage cheese, a boiled egg or a small pot of plain yoghurt are equally good protein-rich options.",
    vegetarian: true,
    tags: ["quick", "vegan option"],
    image: MEAL_PHOTOS["snack-hummus"],
    alt: "Three small bowls of hummus topped with whole chickpeas, olive oil and fresh herbs.",
    credit: { name: "Nataliya Vaitkevich", url: "https://www.pexels.com/photo/close-up-shot-of-hummus-on-bowls-6252676/" },
  },
  {
    id: "s-nuts",
    slot: "snack",
    title: "A handful of mixed nuts with a piece of fruit",
    description:
      "A small handful of unsalted mixed nuts — almonds, cashews, hazelnuts, walnuts — with an apple, a pear or a satsuma. Nuts bring protein, fibre and unsaturated fats; the fruit adds sweetness and more fibre.",
    balance: ["Protein & healthy fat: nuts", "Fibre: fruit"],
    tip: "Buy nuts in larger bags and portion them into small pots for the week — much cheaper than snack packs.",
    vegetarian: true,
    tags: ["quick", "vegan option"],
    image: MEAL_PHOTOS["snack-mixed-nuts"],
    alt: "Dark bowl filled with mixed nuts, including almonds, cashews, hazelnuts and pecans.",
    credit: { name: "Engin Akyurt", url: "https://www.pexels.com/photo/flatlay-of-assorted-nuts-on-black-bowl-5472169/" },
  },
  {
    id: "s-yoghurt",
    slot: "snack",
    title: "Plain yoghurt with berries",
    description:
      "A small pot of plain or Greek-style yoghurt with a few berries and, if you like, a sprinkle of seeds or granola. Protein-rich, quick, and easy to keep at work.",
    balance: ["Protein: yoghurt", "Fibre: berries, seeds"],
    tip: "Soya yoghurt is the closest plant-based swap for protein. Frozen berries thaw by mid-morning.",
    vegetarian: true,
    tags: ["quick", "vegan option"],
    image: MEAL_PHOTOS["breakfast-yoghurt-berries"],
    alt: "Bowl of yoghurt topped with blackberries, blueberries, strawberries, granola and fresh mint.",
    credit: { name: "Antoni Shkraba", url: "https://www.pexels.com/photo/strawberries-and-blackberries-in-a-ceramic-bowl-6823332/" },
  },
];

export const MEAL_BY_ID: Record<string, MealOption> = Object.fromEntries(MEAL_OPTIONS.map((meal) => [meal.id, meal]));

/* ------------------------------------------------------------------ */
/* Plans                                                               */
/* ------------------------------------------------------------------ */

export type PlanId = "everyday" | "mediterranean" | "plant";

export type DayMeals = Record<MealSlot, string>;

export interface ShoppingGroup {
  group: string;
  items: string[];
}

export interface Substitution {
  instead: string;
  use: string;
}

export interface MealPlanDef {
  id: PlanId;
  name: string;
  tagline: string;
  description: string;
  badges: string[];
  /** Only vegetarian meals are offered as swaps when true. */
  vegetarianOnly: boolean;
  days: DayMeals[];
  shoppingList: ShoppingGroup[];
  substitutions: Substitution[];
}

export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MEAL_PLANS: MealPlanDef[] = [
  {
    id: "everyday",
    name: "Everyday basics",
    tagline: "Simple, affordable meals built from tins, eggs, oats and frozen veg.",
    description:
      "For weeks when you want food to be easy. Most ingredients keep for ages, nothing needs special shopping, and several dinners make enough for the next day's lunch. Four of the seven dinners are vegetarian.",
    badges: ["Budget-friendly", "Minimal cooking", "Vegetarian choices"],
    vegetarianOnly: false,
    days: [
      { breakfast: "b-porridge", lunch: "l-soup", dinner: "d-dal", snack: "s-apple-peanut" },
      { breakfast: "b-yoghurt", lunch: "l-sandwich", dinner: "d-chicken-stir-fry", snack: "s-nuts" },
      { breakfast: "b-porridge", lunch: "l-rice-bean-bowl", dinner: "d-pasta", snack: "s-hummus" },
      { breakfast: "b-scrambled-eggs", lunch: "l-soup", dinner: "d-veg-curry", snack: "s-yoghurt" },
      { breakfast: "b-overnight-oats", lunch: "l-sandwich", dinner: "d-fish-tacos", snack: "s-apple-peanut" },
      { breakfast: "b-omelette", lunch: "l-wraps", dinner: "d-bean-chilli", snack: "s-nuts" },
      { breakfast: "b-avocado-egg", lunch: "l-sweet-potato", dinner: "d-chicken-tray-bake", snack: "s-hummus" },
    ],
    shoppingList: [
      {
        group: "Store cupboard",
        items: [
          "Porridge oats",
          "Rice and wholewheat (or ordinary) pasta",
          "Tinned beans, chickpeas and lentils (or dried red lentils)",
          "Tinned tomatoes and a stock cube or two",
          "Curry paste or powder, cumin, smoked paprika",
          "Peanut butter and a bag of mixed nuts",
          "Olive or rapeseed oil, soy sauce",
          "Wholegrain bread and wholemeal tortillas",
        ],
      },
      {
        group: "Fresh and fridge",
        items: [
          "Eggs, milk (dairy or plant), plain yoghurt, a block of cheese",
          "Chicken thighs or breast; white fish fillets (frozen is fine)",
          "Onions, garlic, carrots, potatoes, sweet potatoes",
          "Salad leaves, cucumber, tomatoes, peppers, red cabbage",
          "Bananas, apples, a lemon or lime, one or two avocados",
          "Hummus",
        ],
      },
      { group: "Freezer", items: ["Mixed vegetables and peas", "Spinach", "Berries"] },
    ],
    substitutions: [
      { instead: "Fresh berries", use: "Frozen berries — cheaper, and just as good in porridge, oats and yoghurt." },
      { instead: "Chicken", use: "An extra tin of beans, tofu or eggs. The chicken nights are the only non-vegetarian dinners besides the fish tacos." },
      { instead: "White fish", use: "Tinned fish, or make the tacos with spiced black beans." },
      { instead: "Dairy milk and yoghurt", use: "Soya versions have the closest protein; choose ones fortified with calcium." },
      { instead: "Wholewheat pasta or brown rice", use: "Ordinary pasta or rice with extra vegetables and beans — the overall balance of the plate matters more than any single swap." },
      { instead: "Avocado", use: "A spoon of hummus, a few nuts or a drizzle of olive oil for the healthy-fat part of the meal." },
      { instead: "Wheat (if gluten-free)", use: "Gluten-free oats, rice, potatoes, corn tortillas and gluten-free bread or pasta." },
    ],
  },
  {
    id: "mediterranean",
    name: "Mediterranean-inspired",
    tagline: "Olive oil, pulses, plenty of vegetables, yoghurt, and fish twice a week.",
    description:
      "A pattern many national guidelines point to as an example of healthy eating. It isn't a special PCOS diet — the 2023 guideline found no single diet composition beats another — but it's a flavourful, flexible way to get fibre, protein and unsaturated fats in every meal. Two dinners repeat on purpose: cook once, eat twice.",
    badges: ["Fish twice a week", "Olive oil & pulses", "Vegetarian choices"],
    vegetarianOnly: false,
    days: [
      { breakfast: "b-yoghurt", lunch: "l-quinoa-salad", dinner: "d-salmon", snack: "s-nuts" },
      { breakfast: "b-avocado-egg", lunch: "l-soup", dinner: "d-pasta", snack: "s-hummus" },
      { breakfast: "b-overnight-oats", lunch: "l-wraps", dinner: "d-chicken-tray-bake", snack: "s-yoghurt" },
      { breakfast: "b-porridge", lunch: "l-sandwich", dinner: "d-shakshuka", snack: "s-apple-peanut" },
      { breakfast: "b-scrambled-eggs", lunch: "l-sweet-potato", dinner: "d-fish-tacos", snack: "s-nuts" },
      { breakfast: "b-yoghurt", lunch: "l-quinoa-salad", dinner: "d-pasta", snack: "s-hummus" },
      { breakfast: "b-avocado-egg", lunch: "l-soup", dinner: "d-salmon", snack: "s-yoghurt" },
    ],
    shoppingList: [
      {
        group: "Store cupboard",
        items: [
          "Olive oil",
          "Tinned chickpeas and cannellini beans; tinned tomatoes",
          "Wholewheat pasta; quinoa, bulgur wheat or couscous; oats",
          "Tinned sardines or mackerel (a back-up oily fish)",
          "Mixed nuts and seeds; tahini or hummus",
          "Cumin, smoked paprika, dried oregano",
          "Wholegrain bread or pitta; wholemeal tortillas",
        ],
      },
      {
        group: "Fresh and fridge",
        items: [
          "Salmon (or other oily fish) and white fish fillets",
          "Chicken thighs",
          "Feta, plain Greek-style yoghurt, eggs",
          "Lemons, garlic, onions",
          "Peppers, courgettes, tomatoes, spinach, cucumber, red cabbage",
          "Sweet potatoes and new potatoes",
          "Berries, oranges, apples, avocados",
        ],
      },
      { group: "Freezer", items: ["Peas", "Spinach", "Berries", "Fish fillets if fresh is pricey"] },
    ],
    substitutions: [
      { instead: "Salmon", use: "Tinned sardines or mackerel — cheaper, still oily fish; or trout when it's on offer." },
      { instead: "Feta", use: "Crumbled firm tofu with lemon and salt, cottage cheese, or simply leave it out." },
      { instead: "Quinoa", use: "Bulgur wheat, couscous, brown rice or pearl barley." },
      { instead: "Chicken", use: "Chickpeas, halloumi or tofu roasted in the same tray." },
      { instead: "Fish altogether", use: "Eggs, beans and tofu for protein; walnuts, chia and flaxseed for plant omega-3s." },
      { instead: "Fresh herbs", use: "Dried herbs — about a third of the amount." },
    ],
  },
  {
    id: "plant",
    name: "Plant-forward vegetarian",
    tagline: "Lentils, beans, tofu, eggs and dairy, with vegan swaps for every meal.",
    description:
      "A fully vegetarian week that still puts protein in every meal — pulses, tofu, eggs, yoghurt and nuts — alongside wholegrains and lots of vegetables. Every meal here has a vegan option, and the whole week is naturally budget-friendly.",
    badges: ["All vegetarian", "Vegan swaps", "Budget-friendly"],
    vegetarianOnly: true,
    days: [
      { breakfast: "b-porridge", lunch: "l-rice-bean-bowl", dinner: "d-dal", snack: "s-hummus" },
      { breakfast: "b-yoghurt", lunch: "l-quinoa-salad", dinner: "d-tofu-broccoli", snack: "s-nuts" },
      { breakfast: "b-scrambled-eggs", lunch: "l-soup", dinner: "d-veg-curry", snack: "s-apple-peanut" },
      { breakfast: "b-overnight-oats", lunch: "l-burrito-bowl", dinner: "d-pasta", snack: "s-yoghurt" },
      { breakfast: "b-omelette", lunch: "l-wraps", dinner: "d-veg-stir-fry", snack: "s-hummus" },
      { breakfast: "b-avocado-egg", lunch: "l-sweet-potato", dinner: "d-bean-chilli", snack: "s-nuts" },
      { breakfast: "b-yoghurt", lunch: "l-soup", dinner: "d-shakshuka", snack: "s-apple-peanut" },
    ],
    shoppingList: [
      {
        group: "Store cupboard",
        items: [
          "Red lentils; tinned lentils, chickpeas, black beans and kidney beans",
          "Rice, wholewheat pasta, quinoa or bulgur; oats",
          "Tinned tomatoes; a tin of coconut milk",
          "Peanut butter, mixed nuts, seeds (chia, flax, pumpkin)",
          "Curry paste, soy sauce, cumin, smoked paprika",
          "Olive or rapeseed oil",
          "Wholegrain bread and wholemeal tortillas",
        ],
      },
      {
        group: "Fresh and fridge",
        items: [
          "Firm tofu",
          "Eggs; plain yoghurt (dairy or soya); milk or a fortified plant drink; feta or cheese (optional)",
          "Onions, garlic, ginger",
          "Broccoli, cauliflower, mushrooms, peppers, spinach or kale, red cabbage",
          "Sweet potatoes, carrots, potatoes",
          "Bananas, berries, apples, lemons or limes, avocados",
          "Hummus",
        ],
      },
      { group: "Freezer", items: ["Peas and mixed vegetables", "Spinach", "Berries", "Sweetcorn"] },
    ],
    substitutions: [
      { instead: "Tofu", use: "Tinned beans, tempeh, paneer or eggs." },
      { instead: "Eggs, yoghurt and cheese (vegan)", use: "Scrambled tofu, soya yoghurt and nutritional yeast; choose plant drinks fortified with calcium, vitamin B12 and iodine." },
      { instead: "Nuts (allergy)", use: "Pumpkin and sunflower seeds, or a seed butter such as tahini or sunflower butter." },
      { instead: "Fresh vegetables", use: "Frozen or tinned vegetables are just as nutritious and often cheaper." },
      { instead: "Soy sauce (gluten-free)", use: "Tamari." },
      { instead: "Coconut milk", use: "A spoon of yoghurt or peanut butter stirred in at the end for creaminess." },
    ],
  },
];

/** All meals a plan can offer in a given slot (used by the swap control). */
export function swapOptionsFor(plan: MealPlanDef, slot: MealSlot): MealOption[] {
  return MEAL_OPTIONS.filter((meal) => meal.slot === slot && (!plan.vegetarianOnly || meal.vegetarian));
}

/* ------------------------------------------------------------------ */
/* How the plans are built                                             */
/* ------------------------------------------------------------------ */

export interface EatingPrinciple {
  id: string;
  title: string;
  body: string;
  sources: SourceId[];
}

export const EATING_PRINCIPLES: EatingPrinciple[] = [
  {
    id: "no-single-diet",
    title: "No single “PCOS diet”",
    body: "The 2023 international guideline found no evidence that any one diet composition is better than another for PCOS, and advises sustainable healthy eating tailored to your preferences.",
    sources: ["asrm", "guideline"],
  },
  {
    id: "regular",
    title: "Regular, balanced meals",
    body: "Regular meals with protein, fibre-rich carbohydrates and some healthy fat help keep blood sugar steadier — useful because insulin resistance is common with PCOS.",
    sources: ["bda"],
  },
  {
    id: "carbs",
    title: "Fibre-rich carbohydrates",
    body: "Oats, wholegrain bread, brown rice, pulses, potatoes with skins and most fruit and vegetables release their energy more slowly than refined versions.",
    sources: ["bda", "eatwell"],
  },
  {
    id: "variety",
    title: "Variety over perfection",
    body: "Plenty of vegetables and fruit, oily fish or plant omega-3s, and foods you actually enjoy. Swaps and repeats are built in — that's what makes a plan sustainable.",
    sources: ["eatwell", "bda"],
  },
];

export const PLAN_NOTE = {
  title: "Please read: what these plans are — and aren't",
  paragraphs: [
    "These meal plans are general examples of balanced eating, not personal medical advice. They won't cure PCOS, “balance hormones” or cause weight loss, and we don't claim they will. Needs differ with age, activity, culture, budget, other medical conditions, and whether you are pregnant or breastfeeding — which is why there are no portion sizes or calorie targets here.",
    "Healthy eating is recommended for everyone with PCOS, whatever their body size, and the guideline specifically cautions against unduly restrictive diets. If food feels stressful, or you've experienced disordered eating, please talk to a clinician before changing how you eat. A registered dietitian can adapt these ideas to you, and it's worth asking a doctor or dietitian before starting any supplement.",
  ],
  sources: ["asrm", "guideline", "bda", "who"] as SourceId[],
};

/* ------------------------------------------------------------------ */
/* Foods to avoid with PCOS                                            */
/* ------------------------------------------------------------------ */

export interface LimitIdea {
  id: string;
  title: string;
  why: string;
  alternatives: string[];
  sources: SourceId[];
}

export const FOODS_TO_AVOID = {
  intro:
    "The honest answer is that there is no universal list of foods that everyone with PCOS must avoid. PCOS affects people differently, and the evidence doesn't single out any food as off-limits for everyone. What the research does support is an overall pattern of sustainable, balanced eating — built around what you enjoy and can keep up.",
  guidelineQuotes: [
    {
      ref: "Recommendation 3.3.1",
      text: "There is no evidence to support any one type of diet composition over another for anthropometric, metabolic, hormonal, reproductive or psychological outcomes.",
    },
    {
      ref: "Recommendation 3.3.2",
      text: "Any diet composition consistent with population guidelines for healthy eating will have health benefits, and within this, healthcare professionals should advise sustainable healthy eating tailored to individual preferences and goals.",
    },
    {
      ref: "Practice point 3.3.3",
      text: "Tailoring of dietary changes to food preferences, allowing for a flexible, individual and co-developed approach to achieving nutritional goals, and avoiding unduly restrictive and nutritionally unbalanced diets, are important.",
    },
  ],
  limits: [
    {
      id: "sugary-drinks",
      title: "Sugary drinks",
      why: "Fizzy drinks, energy drinks, sweetened coffees and large glasses of juice deliver a lot of sugar quickly with little to fill you up. Some people with PCOS choose to have them less often — a choice, not a rule.",
      alternatives: [
        "Water, plain or with slices of lemon, cucumber or frozen berries",
        "Sparkling water with a splash of juice",
        "Tea and coffee with less (or no) added sugar; milk counts towards your dairy",
        "If you like juice or smoothies, the NHS suggests keeping them to about 150 ml a day",
      ],
      sources: ["eatwell", "bda"],
    },
    {
      id: "processed-snacks",
      title: "Highly processed snacks eaten often",
      why: "Crisps, biscuits and confectionery are fine now and then — the NHS Eatwell Guide says “less often and in small amounts”, not never. If they're a daily default, swapping some of them for snacks with protein or fibre can help you feel fuller for longer.",
      alternatives: [
        "Fruit with a spoon of nut butter or a pot of plain yoghurt",
        "A small handful of unsalted nuts or seeds",
        "Oatcakes or wholegrain crackers with hummus, cheese or cottage cheese",
        "Plain popcorn, or vegetable sticks with a dip",
      ],
      sources: ["eatwell", "bda"],
    },
    {
      id: "refined-carbs-alone",
      title: "Refined carbohydrates on their own",
      why: "White bread, white rice and sugary cereals aren't forbidden. On their own they raise blood sugar faster than wholegrain versions; paired with protein, fat and vegetables, the whole meal lands more gently. Dietitians call this balancing the plate.",
      alternatives: [
        "Keep the food you like and add to it: beans in the rice, eggs or cheese with the bread, vegetables with everything",
        "Choose wholegrain or higher-fibre versions when you enjoy them — oats, seeded bread, brown rice, wholewheat pasta",
        "Add nuts, seeds or yoghurt to breakfast cereal",
      ],
      sources: ["bda", "eatwell"],
    },
  ] as LimitIdea[],
  noNeed: {
    title: "What you don't need to cut out",
    body:
      "You may have read that people with PCOS should give up carbohydrates, dairy, gluten, soy or fruit. The 2023 guideline found no evidence that any particular diet composition is better than another for PCOS and specifically cautions against unduly restrictive, nutritionally unbalanced diets. So unless you have another reason — an allergy, an intolerance, coeliac disease, or advice from your own clinician — there is no PCOS-specific need to remove whole food groups. Dietitians suggest focusing on what you can add to your meals rather than what to take away.",
    sources: ["asrm", "guideline", "bda"] as SourceId[],
  },
  gentle: {
    title: "A kinder way to think about it",
    body:
      "Food is also culture, budget, comfort and celebration. There are no “good” or “bad” foods, and eating a biscuit does not undo a week of balanced meals. Eating disorders and disordered eating are more common with PCOS, so if food rules feel heavy, or you notice guilt around eating, that's a reason to talk to a clinician — not a reason to try harder alone. A registered dietitian can help you find a way of eating that fits your life.",
    sources: ["asrm", "bda", "who"] as SourceId[],
  },
};
