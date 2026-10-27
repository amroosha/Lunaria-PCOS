/**
 * Educational content about PCOS. Every statement is drawn from the sources
 * listed in SOURCES (all checked when this content was written). Nothing here
 * is medical advice; the site presents it as general education only.
 */

export type SourceId = "who" | "nhs" | "owh" | "nichd" | "guideline" | "asrm" | "bda" | "eatwell";

export interface Source {
  id: SourceId;
  short: string;
  name: string;
  org: string;
  url: string;
  note: string;
}

export const SOURCES: Record<SourceId, Source> = {
  who: {
    id: "who",
    short: "WHO",
    name: "Polycystic ovary syndrome — fact sheet",
    org: "World Health Organization",
    url: "https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome",
    note: "Global overview: how common PCOS is, symptoms, how it is diagnosed, and long-term health.",
  },
  nhs: {
    id: "nhs",
    short: "NHS",
    name: "Polyendocrine metabolic ovarian syndrome (PMOS) — previously called PCOS",
    org: "NHS (UK)",
    url: "https://www.nhs.uk/conditions/polyendocrine-metabolic-ovarian-syndrome-pmos/",
    note: "Plain-language symptoms, tests, treatments and UK support organisations. The NHS now uses the name PMOS.",
  },
  owh: {
    id: "owh",
    short: "Office on Women's Health",
    name: "Polycystic ovary syndrome",
    org: "U.S. Department of Health & Human Services",
    url: "https://womenshealth.gov/a-z-topics/polycystic-ovary-syndrome",
    note: "Detailed questions and answers on symptoms, causes, fertility, pregnancy and linked conditions.",
  },
  nichd: {
    id: "nichd",
    short: "NICHD",
    name: "Polycystic ovary syndrome (PCOS) — fact sheet",
    org: "U.S. National Institutes of Health",
    url: "https://www.nichd.nih.gov/health/topics/factsheets/pcos",
    note: "Research-institute summary of the main features of PCOS.",
  },
  guideline: {
    id: "guideline",
    short: "International PCOS Guideline (2023)",
    name: "International evidence-based guideline for the assessment and management of PCOS — 2023 summary",
    org: "Monash University with international partner societies",
    url: "https://www.monash.edu/__data/assets/pdf_file/0003/3371133/PCOS-Guideline-Summary-2023.pdf",
    note: "The clinical guideline many doctors follow, including how irregular cycles are defined and how diagnosis differs for teenagers.",
  },
  asrm: {
    id: "asrm",
    short: "2023 Guideline recommendations (ASRM)",
    name: "Recommendations from the 2023 International Evidence-based Guideline for the Assessment and Management of PCOS/PMOS",
    org: "American Society for Reproductive Medicine",
    url: "https://www.asrm.org/practice-guidance/practice-committee-documents/recommendations-from-the-2023-international-evidence-based-guideline-for-the-assessment-and-management-of-polyendocrine-metabolic-ovarian-syndrome-2023",
    note: "The full numbered recommendation list. Section 3.3 covers diet: no one diet composition has been shown to be better than another, and sustainable healthy eating tailored to personal preferences is advised.",
  },
  bda: {
    id: "bda",
    short: "BDA",
    name: "Polyendocrine metabolic ovarian syndrome (PMOS) and diet — Food Fact Sheet",
    org: "British Dietetic Association",
    url: "https://www.bda.uk.com/resource/polycystic-ovary-syndrome-pcos-diet.html",
    note: "Dietitian-written guidance on eating with PCOS: regular balanced meals, lower-GI carbohydrates, protein, healthy fats and omega-3s — and why restrictive diets aren't recommended.",
  },
  eatwell: {
    id: "eatwell",
    short: "NHS Eatwell Guide",
    name: "The Eatwell Guide",
    org: "NHS (UK)",
    url: "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/",
    note: "How a balanced diet is made up overall: fruit and vegetables, higher-fibre starchy foods, protein foods, dairy or alternatives, and small amounts of unsaturated oils.",
  },
};

export const SOURCE_LIST: Source[] = [
  SOURCES.who,
  SOURCES.nhs,
  SOURCES.owh,
  SOURCES.nichd,
  SOURCES.guideline,
  SOURCES.asrm,
  SOURCES.bda,
  SOURCES.eatwell,
];

/* ------------------------------------------------------------------ */
/* "PCOS, in simple terms"                                             */
/* ------------------------------------------------------------------ */

export interface ExplainerStep {
  id: "ovulation" | "androgens" | "ovaries" | "insulin";
  label: string;
  title: string;
  body: string;
  takeaway: string;
  sources: SourceId[];
  /** Visual accent used by the diagram. */
  tone: "lilac" | "sage" | "coral" | "plum";
}

export const EXPLAINER_STEPS: ExplainerStep[] = [
  {
    id: "ovulation",
    label: "Ovulation",
    title: "Ovulation happens less often",
    body:
      "In a typical cycle an ovary releases an egg roughly once a month. With PCOS, ovulation often happens less regularly, or not at all in some months. Fewer ovulations are the main reason periods can become irregular, unpredictable, infrequent or absent — and, for some people, heavier when they do arrive.",
    takeaway: "Irregular periods are a signal about ovulation, not a sign that something is “wrong with you”.",
    sources: ["who", "owh"],
    tone: "lilac",
  },
  {
    id: "androgens",
    label: "Androgens",
    title: "Androgen levels can run higher",
    body:
      "Everyone makes androgens (sometimes called “male-type” hormones). In PCOS, levels can be higher than usual, or the body can be more sensitive to them. That can show up as acne, oilier skin, extra hair on the face or body, or thinning hair on the scalp. Many people have only some of these signs, and some have none.",
    takeaway: "Skin and hair changes are hormonal, common, and nothing to be ashamed of.",
    sources: ["who", "owh"],
    tone: "coral",
  },
  {
    id: "ovaries",
    label: "Ovaries",
    title: "What “polycystic” really means",
    body:
      "On an ultrasound, ovaries may show many small follicles — tiny fluid-filled sacs that each hold an immature egg. Despite the name, these are not harmful cysts and they don’t need removing. You can have PCOS without this finding, and ultrasound isn’t used to diagnose teenagers (the NHS only offers it over 18).",
    takeaway: "The name is a historical leftover; the condition is really about hormones and ovulation.",
    sources: ["who", "nhs", "guideline"],
    tone: "sage",
  },
  {
    id: "insulin",
    label: "Insulin",
    title: "Insulin plays a part for many people",
    body:
      "Many people with PCOS have insulin resistance: the body’s cells respond less to insulin, so the body makes more of it. Higher insulin can nudge the ovaries to make more androgens. It is also why PCOS is linked with a higher long-term risk of type 2 diabetes — and why regular check-ups are recommended, whatever your body size.",
    takeaway: "The exact cause of PCOS is still unknown. Genetics and family history play a part.",
    sources: ["owh", "who", "nhs"],
    tone: "plum",
  },
];

export const DIAGNOSIS_RULE = {
  title: "Diagnosis: two out of three",
  body:
    "Doctors diagnose PCOS in adults when at least two of three features are present — irregular ovulation or cycles, signs or blood evidence of higher androgens, and polycystic-looking ovaries on ultrasound (or a raised AMH blood level) — once other causes have been ruled out. For teenagers, both irregular cycles and androgen signs are needed, and ultrasound isn’t recommended.",
  sources: ["who", "guideline"] as SourceId[],
};

export const QUICK_FACTS = [
  {
    stat: "10–13%",
    label: "of women of reproductive age are estimated to have PCOS worldwide.",
    sources: ["who"] as SourceId[],
  },
  {
    stat: "Up to 70%",
    label: "of people with PCOS may not know they have it.",
    sources: ["who"] as SourceId[],
  },
  {
    stat: "2 of 3",
    label: "features are needed for an adult diagnosis — there is no single test.",
    sources: ["who", "owh"] as SourceId[],
  },
];

/* ------------------------------------------------------------------ */
/* Symptom map                                                         */
/* ------------------------------------------------------------------ */

export interface SymptomHotspot {
  id: string;
  title: string;
  /** Position over the body illustration, in percent of its width/height. */
  x: number;
  y: number;
  side: "left" | "right";
  summary: string;
  detail: string;
  sources: SourceId[];
  askPrompt: string;
}

export const SYMPTOM_HOTSPOTS: SymptomHotspot[] = [
  {
    id: "scalp",
    title: "Hair thinning on the scalp",
    x: 50,
    y: 5,
    side: "right",
    summary: "Some people notice thinning hair or hair loss from the head.",
    detail:
      "This is linked to higher androgen levels. It is sometimes called female-pattern hair loss. It is not experienced by everyone with PCOS, and there are treatments a clinician can discuss with you.",
    sources: ["who", "owh"],
    askPrompt: "Why can PCOS cause hair thinning on the scalp, and what kinds of options exist?",
  },
  {
    id: "mood",
    title: "Mood and wellbeing",
    x: 78,
    y: 12,
    side: "right",
    summary: "Anxiety and depression are more common with PCOS.",
    detail:
      "Living with unpredictable symptoms, and the stigma that can surround them, affects wellbeing. The WHO notes anxiety, depression, eating disorders and negative body image can all be part of PCOS. Support — including talking therapies — is available and worth asking about.",
    sources: ["who", "owh", "nhs"],
    askPrompt: "How can PCOS affect mood, and what kinds of support are there?",
  },
  {
    id: "sleep",
    title: "Tiredness and sleep",
    x: 22,
    y: 12,
    side: "left",
    summary: "Feeling very tired is a recognised symptom; sleep apnoea is more common.",
    detail:
      "The NHS lists feeling very tired among the main symptoms. Sleep apnoea — repeated pauses in breathing during sleep — is more common in people with PCOS. Loud snoring, waking unrefreshed or daytime sleepiness are worth mentioning to a clinician.",
    sources: ["nhs", "owh"],
    askPrompt: "Why might PCOS be linked with tiredness and sleep problems?",
  },
  {
    id: "face",
    title: "Skin and facial hair",
    x: 50,
    y: 15,
    side: "right",
    summary: "Acne, oilier skin, or extra hair on the face, chin or body.",
    detail:
      "These come from higher androgen levels. Extra hair growth (hirsutism) affects up to around 70% of women with PCOS, so it is very common. Options range from hair-removal methods to prescription treatments; a clinician can explain what suits you.",
    sources: ["who", "owh", "nhs"],
    askPrompt: "Why does PCOS cause acne and extra facial hair, and what options do people usually discuss with a doctor?",
  },
  {
    id: "neck",
    title: "Darker skin patches",
    x: 50,
    y: 24,
    side: "left",
    summary: "Thick, darker, velvety patches on the neck, armpits or skin folds.",
    detail:
      "Known as acanthosis nigricans, these patches are associated with insulin resistance. Small skin tags in the armpits or neck area can also occur. They are harmless in themselves but are a useful clue for your clinician.",
    sources: ["nhs", "owh"],
    askPrompt: "What are the dark skin patches linked with PCOS, and what do they indicate?",
  },
  {
    id: "heart",
    title: "Long-term health",
    x: 50,
    y: 36,
    side: "right",
    summary: "Higher long-term risk of type 2 diabetes, high blood pressure and heart disease.",
    detail:
      "PCOS is a long-term metabolic condition that continues beyond the reproductive years. Regular checks of blood sugar, blood pressure and cholesterol help catch changes early. Healthy eating and movement are recommended for everyone with PCOS, whether or not they lead to weight change.",
    sources: ["who", "nhs", "owh"],
    askPrompt: "Which long-term health checks are usually recommended for people with PCOS?",
  },
  {
    id: "body-hair",
    title: "Hair on chest or back",
    x: 31,
    y: 33,
    side: "left",
    summary: "Extra hair can also appear on the chest, back or abdomen.",
    detail:
      "Like facial hair, this is driven by androgens. Many people choose to remove it, manage it, or leave it — all are valid. If it bothers you, treatments exist and are worth raising with a clinician.",
    sources: ["who", "owh"],
    askPrompt: "What causes extra body hair in PCOS and what approaches do people take?",
  },
  {
    id: "abdomen",
    title: "Insulin, weight and metabolism",
    x: 50,
    y: 50,
    side: "right",
    summary: "Insulin resistance and weight changes are common, but not universal.",
    detail:
      "Many people with PCOS have insulin resistance, which can make weight gain easier and weight loss harder. PCOS occurs in people of every body size, and symptoms are not a matter of willpower. Doctors recommend regular screening for diabetes regardless of weight.",
    sources: ["who", "owh", "nhs"],
    askPrompt: "What does insulin resistance mean in PCOS, and how is it checked?",
  },
  {
    id: "pelvis",
    title: "Periods, ovulation and fertility",
    x: 50,
    y: 62,
    side: "left",
    summary: "Irregular, infrequent or absent periods; ovulating less often can affect fertility.",
    detail:
      "PCOS is the most common cause of irregular ovulation and one of the most common — and treatable — causes of infertility. Having PCOS does not mean you can’t get pregnant. Long gaps without periods can let the womb lining build up, which is one reason doctors may suggest treatment to regulate bleeds.",
    sources: ["who", "owh"],
    askPrompt: "How does PCOS affect periods and fertility?",
  },
];

/* ------------------------------------------------------------------ */
/* Topic cards                                                         */
/* ------------------------------------------------------------------ */

export interface Topic {
  id: "periods" | "hormones" | "skin-hair" | "fertility" | "wellbeing" | "diagnosis";
  title: string;
  teaser: string;
  points: string[];
  sources: SourceId[];
  askPrompt: string;
  tone: "lilac" | "sage" | "coral" | "plum" | "cream" | "mist";
}

export const TOPICS: Topic[] = [
  {
    id: "periods",
    title: "Periods & cycles",
    teaser: "Why cycles can be irregular, and what “irregular” actually means.",
    points: [
      "Ovulating less often is the usual reason periods become infrequent, unpredictable or absent with PCOS.",
      "For adults more than three years past their first period, the international guideline counts cycles shorter than 21 days, longer than 35 days, or fewer than eight a year as irregular. In the first year after periods begin, irregular cycles are a normal part of puberty.",
      "Long gaps without a period can let the womb lining build up over time, which is why clinicians sometimes suggest treatments that bring on regular bleeds.",
      "Keeping a simple record of bleeding and symptoms gives you and your clinician something concrete to look at together.",
    ],
    sources: ["who", "guideline", "owh"],
    askPrompt: "Why can PCOS make periods irregular, and what counts as irregular?",
    tone: "lilac",
  },
  {
    id: "hormones",
    title: "Hormones & insulin",
    teaser: "Androgens, insulin resistance, and why the cause is still being studied.",
    points: [
      "Androgens are hormones everyone makes. With PCOS they can be higher than usual, which drives many of the visible symptoms.",
      "Insulin resistance is common with PCOS and can push androgen levels higher. The exact cause of PCOS is unknown; it runs in families and genetics play a part.",
      "Blood tests can check hormone levels and insulin resistance, but results are always read alongside your symptoms and history — not on their own.",
      "PCOS is a long-term condition that continues beyond the reproductive years, which is why ongoing check-ups matter even when symptoms settle.",
    ],
    sources: ["who", "owh", "nhs"],
    askPrompt: "What do androgens and insulin have to do with PCOS?",
    tone: "plum",
  },
  {
    id: "skin-hair",
    title: "Skin & hair",
    teaser: "Acne, extra hair, thinning hair — common, hormonal, and manageable.",
    points: [
      "Acne, oilier skin, extra hair on the face or body, and thinning scalp hair are all linked to higher androgen levels.",
      "Extra hair growth affects up to around 70% of women with PCOS. It is one of the most common signs — and nothing to feel ashamed of.",
      "Darker, velvety skin patches (often on the neck or armpits) and skin tags can also occur and are associated with insulin resistance.",
      "Options range from hair-removal methods to prescription treatments. A clinician can explain which are suitable for you and any trade-offs.",
    ],
    sources: ["who", "owh", "nhs"],
    askPrompt: "What skin and hair changes are linked to PCOS, and what kinds of treatments exist?",
    tone: "coral",
  },
  {
    id: "fertility",
    title: "Fertility & pregnancy",
    teaser: "PCOS is a common, treatable cause of ovulation-related infertility.",
    points: [
      "PCOS is one of the most common causes of infertility because ovulation happens less often. Having PCOS does not mean you can’t get pregnant.",
      "Treatments to encourage ovulation include lifestyle support, medicines, and sometimes IVF or a surgical procedure — options a specialist can walk through with you.",
      "Pregnancies with PCOS carry higher rates of some complications, such as gestational diabetes, so extra monitoring is often recommended.",
      "If pregnancy might be part of your future, it is worth raising early with a clinician — even if it isn’t on the horizon yet.",
    ],
    sources: ["who", "owh", "nhs"],
    askPrompt: "How does PCOS affect fertility, and what kinds of options do people discuss with specialists?",
    tone: "sage",
  },
  {
    id: "wellbeing",
    title: "Mental wellbeing",
    teaser: "Anxiety, low mood and body image are part of the picture — and support exists.",
    points: [
      "Anxiety, depression, disordered eating and negative body image are more common with PCOS. They are recognised parts of the condition, not a personal failing.",
      "Stigma around hair growth, weight or fertility is a social problem, not a reflection of you.",
      "Talking therapies can help; the NHS suggests them when symptoms are affecting your mood. Peer support groups and charities can also make a real difference.",
      "If you are struggling, please reach out — to a clinician, a support organisation, or a crisis line if you are in distress right now.",
    ],
    sources: ["who", "owh", "nhs"],
    askPrompt: "How can PCOS affect mental wellbeing, and where can people find support?",
    tone: "mist",
  },
  {
    id: "diagnosis",
    title: "Getting diagnosed",
    teaser: "What to expect, which tests are used, and how it differs for teens.",
    points: [
      "There is no single test. An adult diagnosis needs at least two of three features — irregular ovulation or cycles, signs or blood evidence of higher androgens, and polycystic-looking ovaries on ultrasound (or a raised AMH level) — after other causes are ruled out.",
      "For teenagers, both irregular cycles and androgen signs are needed, and ultrasound isn’t recommended; the NHS only offers an ultrasound over 18.",
      "Expect questions about your cycle history, a physical exam and blood tests. Clinicians may also test for conditions that can look similar, such as thyroid problems.",
      "After a diagnosis, further checks for insulin resistance and cardiovascular risk are recommended.",
    ],
    sources: ["who", "guideline", "nhs", "owh"],
    askPrompt: "How is PCOS diagnosed, and what should I expect at the appointment?",
    tone: "cream",
  },
];

/* ------------------------------------------------------------------ */
/* Questions to bring to your appointment                              */
/* ------------------------------------------------------------------ */

export interface QuestionGroup {
  id: string;
  label: string;
  intro: string;
  questions: string[];
}

export const APPOINTMENT_QUESTIONS: QuestionGroup[] = [
  {
    id: "diagnosis",
    label: "Understanding my diagnosis",
    intro: "Helpful if you are newly diagnosed, or were told “it’s probably PCOS” without much explanation.",
    questions: [
      "Which of the three PCOS features do I have, and what showed them?",
      "Were other conditions with similar symptoms ruled out?",
      "Which of my symptoms are likely linked to PCOS, and which might have another cause?",
      "Should I see a specialist, such as a gynaecologist or endocrinologist?",
    ],
  },
  {
    id: "periods",
    label: "Periods & everyday symptoms",
    intro: "For the day-to-day things that affect how you feel.",
    questions: [
      "How often should I expect a period, and when should I get in touch if I don’t have one?",
      "What options exist for managing acne, extra hair or hair thinning — and what are their trade-offs?",
      "Is my tiredness worth investigating further, for example for sleep apnoea?",
      "How do I tell the difference between a PCOS symptom and something that needs urgent attention?",
    ],
  },
  {
    id: "long-term",
    label: "Long-term health",
    intro: "PCOS continues beyond the reproductive years, so regular checks matter.",
    questions: [
      "Should I be checked for insulin resistance or type 2 diabetes, and how often?",
      "How often should my blood pressure and cholesterol be checked?",
      "What signs would mean a check-up should happen sooner?",
      "Does PCOS change anything about the screening I need as I get older?",
    ],
  },
  {
    id: "fertility",
    label: "Fertility & future plans",
    intro: "Worth discussing early, whether or not pregnancy is on the horizon.",
    questions: [
      "If I want to get pregnant at some point, what is useful to know now?",
      "What options are available to encourage ovulation if cycles are irregular?",
      "Does PCOS affect which contraception options suit me?",
      "If I became pregnant, what extra monitoring would be suggested?",
    ],
  },
  {
    id: "wellbeing",
    label: "Mood & support",
    intro: "Your wellbeing is part of your care, not an afterthought.",
    questions: [
      "Can you refer me to mental health support that understands PCOS?",
      "Are there support groups or charities you would recommend?",
      "How can I get help with eating and movement that doesn’t focus only on weight?",
      "Who do I contact between appointments if something changes?",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Safety                                                              */
/* ------------------------------------------------------------------ */

export const URGENT_CARE_NOTE = {
  title: "When to seek care sooner",
  body:
    "This site and its chat are for general education — they can’t assess you personally. Please contact a clinician promptly if symptoms are affecting your everyday life, and seek urgent medical care or emergency services if you have severe pelvic or abdominal pain, very heavy bleeding (for example soaking through a pad or tampon every hour for several hours), fainting, a fever with pelvic pain, or bleeding or pain during pregnancy.",
  crisis:
    "If you are having thoughts of harming yourself, please contact your local emergency number or a crisis line right now. You deserve support.",
};
