import type { BlogPost } from "./types";

/**
 * Eye health blog — from the client's "BLOGS" document (Oct 2026).
 *
 * Medical content stays faithful to the client's text; it has been reorganised
 * for readers and search (keyword-led titles, clear symptom / cause /
 * management headings, FAQs and links to the related service). It is general
 * information, not a diagnosis. Images in the source document came from third
 * parties or showed patients' eyes, so each article uses a brand illustration.
 */
const PUBLISHED = "2026-10-21";

const SEE_PRO =
  "If you notice any of these signs, book an eye examination with an eye care professional. Early assessment makes it easier to manage most eye conditions.";

export const blogPosts: BlogPost[] = [
  // ---------------------------------------------------------------- Eye diseases
  {
    slug: "dry-eye-disease-symptoms-causes-treatment",
    status: "published",
    category: "eye-diseases",
    cover: "dry-eye",
    title: "Dry eye disease: symptoms, causes and treatment",
    seoTitle: "Dry Eye Disease: Symptoms, Causes & Treatment in Chennai",
    description:
      "Gritty, red or watery eyes? Learn the common symptoms of dry eye disease, what causes it, and how an eye care professional can help you manage it.",
    keywords: [
      "dry eye disease",
      "dry eye symptoms",
      "dry eye treatment in Chennai",
      "gritty eyes",
      "watery eyes",
      "eye drops for dry eyes",
    ],
    published: PUBLISHED,
    condition: "Dry eye disease",
    symptoms: [
      "A feeling of dryness or grittiness in the eyes",
      "Red, irritated or itchy eyes",
      "Watery eyes (due to irritation)",
      "Blurry vision that improves with blinking",
      "Sensitivity to wind or smoke",
    ],
    intro:
      "Dry eye disease is a condition where your eyes don't produce enough tears — or the right kind of tears — to stay moist and comfortable. The good news: it can often be managed once it's recognised.",
    sections: [
      {
        heading: "What is dry eye disease?",
        body: [
          "Your tears keep the front of your eye smooth, clear and comfortable. With dry eye, the tear film isn't enough to do that job, so the eyes feel dry, irritated or tired.",
        ],
      },
      { heading: "Common symptoms of dry eye", list: ["__SYMPTOMS__"] },
      {
        heading: "What causes dry eye?",
        list: [
          "Age — tear production can change as we get older",
          "Environmental factors, such as wind or smoke",
          "Certain medications",
        ],
      },
      {
        heading: "How is dry eye managed?",
        body: [
          "Dry eye can often be managed with eye drops, lifestyle changes or other treatments that help keep your eyes comfortable. The right approach depends on an examination of your eyes, so it's worth getting them checked rather than guessing.",
        ],
      },
      { heading: "When to see an eye care professional", body: [SEE_PRO] },
    ],
    faqs: [
      {
        q: "Why do my eyes water if I have dry eye?",
        a: "Dryness irritates the eye, and irritation can trigger extra watering. That's why watery eyes are a common symptom of dry eye disease.",
      },
      {
        q: "Can dry eye be treated?",
        a: "Yes. Dry eye can often be managed with eye drops, lifestyle changes or other treatments. An eye care professional can suggest what suits your eyes.",
      },
      {
        q: "Does blurry vision from dry eye go away when I blink?",
        a: "Blurry vision that improves with blinking is a typical sign of dry eye, because blinking spreads a fresh layer of tears across the eye.",
      },
    ],
    relatedService: "comprehensive-eye-examination",
  },
  {
    slug: "keratoconus-symptoms-specialty-contact-lenses",
    status: "published",
    category: "eye-diseases",
    cover: "keratoconus",
    title: "Keratoconus: symptoms, diagnosis and specialty contact lenses",
    seoTitle: "Keratoconus Symptoms & Specialty Contact Lenses | Chennai",
    description:
      "Keratoconus thins the cornea into a cone shape, causing blurred and distorted vision. Learn the early signs and how specialty contact lenses can help.",
    keywords: [
      "keratoconus",
      "keratoconus symptoms",
      "keratoconus contact lenses in Chennai",
      "scleral lenses",
      "cone-shaped cornea",
      "distorted vision",
    ],
    published: PUBLISHED,
    condition: "Keratoconus",
    symptoms: [
      "Blurry or distorted vision",
      "Increased sensitivity to light and glare",
      "Difficulty seeing clearly at night",
      "Frequent changes in glasses or contact lens prescription",
      "Double vision in one eye",
    ],
    intro:
      "Keratoconus is a condition where the cornea — the clear front surface of the eye — becomes thin and starts to bulge outwards into a cone shape. It usually starts in the teenage years and can affect both eyes.",
    sections: [
      {
        heading: "What is keratoconus?",
        body: [
          "A healthy cornea has a smooth, dome-like curve that focuses light evenly. In keratoconus the cornea thins and bulges into a cone, so light focuses unevenly and vision becomes blurry or distorted.",
        ],
      },
      { heading: "Common symptoms of keratoconus", list: ["__SYMPTOMS__"] },
      {
        heading: "How is keratoconus managed?",
        body: [
          "In some cases keratoconus can be managed with special contact lenses; in others, surgery may be needed. An eye care professional can assess your corneas and explain which option suits your eyes.",
        ],
        items: [
          {
            title: "Specialty contact lenses",
            text: "Lenses such as scleral lenses vault over the cornea and rest on the white of the eye (the sclera), with a liquid reservoir in between. This gives the eye a smooth optical surface and can help people with keratoconus see more clearly.",
          },
          {
            title: "Surgery",
            text: "Where lenses aren't enough, an eye surgeon may recommend a surgical option. We refer you when this is needed.",
          },
        ],
      },
      {
        heading: "When to see an eye care professional",
        body: [
          "If your glasses or contact lens prescription keeps changing, or your vision is becoming distorted, have your corneas checked. Early diagnosis helps you plan the right management.",
        ],
      },
    ],
    faqs: [
      {
        q: "Who gets keratoconus?",
        a: "Keratoconus usually starts in the teenage years and can affect both eyes.",
      },
      {
        q: "Why does my glasses prescription keep changing?",
        a: "Frequent changes in your glasses or contact lens prescription can be a sign of keratoconus, so it's worth having your corneas examined.",
      },
      {
        q: "What are scleral lenses?",
        a: "Scleral lenses are specialty contact lenses that vault over the cornea and rest on the sclera, with a liquid reservoir in between. They are one of the options used to help people with keratoconus see more clearly.",
      },
    ],
    relatedService: "specialty-contact-lenses",
  },
  {
    slug: "cataract-symptoms-and-treatment",
    status: "published",
    category: "eye-diseases",
    cover: "cataract",
    title: "Cataract: early symptoms and when to consider treatment",
    seoTitle: "Cataract Symptoms: Cloudy Vision, Glare & Treatment",
    description:
      "A cataract clouds the eye's natural lens, making vision blurry or dim — like a foggy window. Learn the early symptoms of cataract and how it is treated.",
    keywords: [
      "cataract",
      "cataract symptoms",
      "cloudy vision",
      "glare at night",
      "cataract treatment",
      "eye check-up in Chennai",
    ],
    published: PUBLISHED,
    condition: "Cataract",
    symptoms: [
      "Blurry or cloudy vision",
      "Difficulty seeing at night or in low light",
      "Sensitivity to bright lights or glare",
      "Fading or yellowing of colours",
      "Double vision in one eye",
    ],
    intro:
      "A cataract is a clouding of the lens inside your eye, which can make your vision blurry or dim. It's like looking through a foggy window. Cataracts develop slowly and can affect one or both eyes.",
    sections: [
      {
        heading: "What is a cataract?",
        body: [
          "Behind your iris sits a clear lens that focuses light onto the retina. When that lens becomes cloudy, less light gets through clearly — and vision gradually becomes hazy.",
        ],
      },
      { heading: "Early symptoms of cataract", list: ["__SYMPTOMS__"] },
      {
        heading: "How is cataract treated?",
        body: [
          "Cataracts can often be treated with surgery to restore clear vision. An eye examination shows how much a cataract is affecting your sight; when treatment is needed, we refer you to an ophthalmologist.",
        ],
      },
      { heading: "When to see an eye care professional", body: [SEE_PRO] },
    ],
    faqs: [
      {
        q: "Do cataracts develop quickly?",
        a: "No — cataracts usually develop slowly, which is why changes can be easy to miss at first.",
      },
      {
        q: "Can a cataract affect both eyes?",
        a: "Yes. A cataract can affect one or both eyes.",
      },
      {
        q: "Why do colours look faded?",
        a: "Fading or yellowing of colours is a common symptom of cataract, because the clouded lens changes how light reaches the back of the eye.",
      },
    ],
    relatedService: "comprehensive-eye-examination",
  },
  {
    slug: "squint-strabismus-signs-causes-treatment",
    status: "published",
    category: "eye-diseases",
    cover: "squint",
    title: "Squint (strabismus) in children and adults: signs and treatment",
    seoTitle: "Squint (Strabismus): Signs, Causes & Treatment Options",
    description:
      "Squint, or strabismus, is when the eyes don't line up. Learn the signs of squint in children and adults, and how glasses, eye exercises or surgery can help.",
    keywords: [
      "squint",
      "strabismus",
      "squint in children",
      "crossed eyes",
      "eye misalignment",
      "squint treatment in Chennai",
    ],
    published: PUBLISHED,
    condition: "Strabismus (squint)",
    symptoms: [
      "Eyes that don't look in the same direction",
      "Double vision",
      "Difficulty with depth perception (judging distances)",
      "One eye that appears to drift or turn",
      "Frequent tilting of the head to focus",
    ],
    intro:
      "A squint — also known as strabismus — is a condition where the eyes are not aligned properly and point in different directions. It can affect vision and depth perception, and it can be treated, especially when found early.",
    sections: [
      {
        heading: "What is a squint?",
        body: [
          "With a squint, one eye may turn inward, outward, upward or downward while the other eye focuses straight ahead. Because the two eyes aren't working as a team, judging distances and seeing comfortably can become harder.",
        ],
      },
      { heading: "Signs of a squint", list: ["__SYMPTOMS__"] },
      {
        heading: "Who can get a squint?",
        body: ["Squint can develop in children or in adults."],
      },
      {
        heading: "How is a squint treated?",
        body: [
          "Depending on the cause, a squint can sometimes be treated with glasses, eye exercises (vision therapy) or surgery to realign the eyes.",
        ],
      },
      {
        heading: "Why early detection matters",
        body: [
          "Early detection and treatment are important to prevent long-term vision problems. If you notice a child's eye drifting, or they often tilt their head to see, book an eye examination.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can adults develop a squint?",
        a: "Yes. Squint can develop in children or in adults.",
      },
      {
        q: "Is a squint always treated with surgery?",
        a: "No. Some squints can be treated with glasses or eye exercises; others may need surgery to realign the eyes.",
      },
      {
        q: "Why does my child tilt their head to look at things?",
        a: "Frequent head tilting to focus can be a sign of a squint. An eye examination will find the cause.",
      },
    ],
    relatedService: "vision-therapy",
    urgentNote:
      "Double vision that comes on suddenly needs urgent attention — go to the nearest hospital emergency department.",
  },
  {
    slug: "glaucoma-symptoms-early-detection",
    status: "published",
    category: "eye-diseases",
    cover: "glaucoma",
    title: "Glaucoma: early signs, symptoms and why regular eye checks matter",
    seoTitle: "Glaucoma Symptoms & Early Detection | Eye Care Chennai",
    description:
      "Glaucoma damages the optic nerve, often with no early symptoms. Learn the warning signs of glaucoma and why early detection protects your vision.",
    keywords: [
      "glaucoma",
      "glaucoma symptoms",
      "early signs of glaucoma",
      "eye pressure",
      "optic nerve damage",
      "glaucoma test in Chennai",
    ],
    published: PUBLISHED,
    condition: "Glaucoma",
    symptoms: [
      "In the early stages, there may be no symptoms",
      "Gradual loss of peripheral (side) vision",
      "Blurry or hazy vision",
      "Eye pain, headache or nausea (in some cases)",
      "Seeing rainbow-coloured rings around lights",
    ],
    intro:
      "Glaucoma is a condition that damages the optic nerve, usually because of high pressure inside the eye. It often develops slowly, and you might not notice any change in your vision until it's advanced — which is why regular eye checks matter.",
    sections: [
      {
        heading: "What is glaucoma?",
        body: [
          "The optic nerve carries what you see from your eye to your brain. In glaucoma it is gradually damaged, usually because of high eye pressure. If it isn't treated, glaucoma can lead to complete vision loss.",
        ],
      },
      { heading: "Symptoms of glaucoma", list: ["__SYMPTOMS__"] },
      {
        heading: "How is glaucoma treated?",
        body: [
          "Glaucoma can be controlled with medication, laser treatment or surgery. Early detection is key to preventing further damage — treatment protects the vision you still have.",
        ],
      },
      {
        heading: "Why regular eye examinations matter",
        body: [
          "Because early glaucoma often has no symptoms, an eye examination may be the first place it's noticed. If you notice any of the symptoms above, see an eye care professional as soon as possible.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does glaucoma have early symptoms?",
        a: "Often not. In the early stages there may be no symptoms at all, so regular eye examinations are important.",
      },
      {
        q: "Can glaucoma be treated?",
        a: "Yes. Glaucoma can be controlled with medication, laser treatment or surgery. Early detection is key to preventing further damage.",
      },
      {
        q: "What part of my vision does glaucoma affect first?",
        a: "Glaucoma often causes a gradual loss of peripheral (side) vision first.",
      },
    ],
    relatedService: "comprehensive-eye-examination",
    urgentNote:
      "Sudden eye pain with headache or nausea, or rainbow-coloured rings around lights, needs urgent care — go to the nearest hospital emergency department.",
  },
  {
    slug: "age-related-macular-degeneration-armd",
    status: "published",
    category: "eye-diseases",
    cover: "armd",
    title: "Age-related macular degeneration (ARMD): symptoms and early detection",
    seoTitle: "ARMD (Macular Degeneration): Symptoms & Early Detection",
    description:
      "Age-related macular degeneration affects central vision, making reading and recognising faces harder. Learn the symptoms of ARMD and why early checks matter.",
    keywords: [
      "ARMD",
      "AMD",
      "age-related macular degeneration",
      "macular degeneration symptoms",
      "central vision loss",
      "wavy lines vision",
    ],
    published: PUBLISHED,
    condition: "Age-related macular degeneration",
    symptoms: [
      "Blurry or dimmed central vision",
      "Difficulty seeing fine details, especially when reading or driving",
      "Distorted vision — straight lines may look wavy",
      "Dark or empty spots in the centre of your vision",
      "Reduced colour perception",
    ],
    intro:
      "Age-related macular degeneration (ARMD) affects the macula — the part of the eye responsible for sharp, central vision. It commonly occurs in people over 50 and can make it difficult to see fine details, like reading or recognising faces.",
    sections: [
      {
        heading: "What is ARMD?",
        body: [
          "The macula sits at the centre of the retina and lets you see detail straight ahead. When it is affected by ARMD, central vision becomes blurred or distorted, while side vision is usually kept.",
        ],
      },
      { heading: "Symptoms of macular degeneration", list: ["__SYMPTOMS__"] },
      {
        heading: "Can ARMD be treated?",
        body: [
          "There is no treatment that reverses ARMD, but treatment can help slow its progression and manage symptoms — especially when it is detected early.",
        ],
      },
      { heading: "When to see an eye care professional", body: [SEE_PRO] },
    ],
    faqs: [
      {
        q: "Who is at risk of ARMD?",
        a: "ARMD commonly occurs in people over 50.",
      },
      {
        q: "Why do straight lines look wavy?",
        a: "Distorted vision, where straight lines appear wavy, is a common symptom of macular degeneration. Have your eyes examined if you notice it.",
      },
      {
        q: "Can ARMD be slowed down?",
        a: "Treatment can help slow its progression and manage symptoms, especially when ARMD is detected early.",
      },
    ],
    relatedService: "comprehensive-eye-examination",
  },
  {
    slug: "diabetic-retinopathy-symptoms-prevention",
    status: "published",
    category: "eye-diseases",
    cover: "diabetic",
    title: "Diabetic retinopathy: symptoms, prevention and regular eye exams",
    seoTitle: "Diabetic Retinopathy: Symptoms & Prevention | Chennai",
    description:
      "Diabetes can damage the blood vessels in the retina. Learn the symptoms of diabetic retinopathy and how blood sugar control and regular eye exams help.",
    keywords: [
      "diabetic retinopathy",
      "diabetic retinopathy symptoms",
      "diabetes eye check-up",
      "floaters",
      "diabetic eye exam in Chennai",
    ],
    published: PUBLISHED,
    condition: "Diabetic retinopathy",
    symptoms: [
      "Blurry or fluctuating vision",
      "Dark spots or floaters in your vision",
      "Difficulty seeing at night",
      "In severe cases, sudden vision loss",
    ],
    intro:
      "Diabetic retinopathy affects the blood vessels in the retina — the back part of your eye — because of high blood sugar levels from diabetes. Over time these vessels can leak, swell or become blocked, which can harm your vision.",
    sections: [
      {
        heading: "What is diabetic retinopathy?",
        body: [
          "The retina needs a healthy blood supply to work. Long periods of high blood sugar can damage the small blood vessels that feed it, and that damage is diabetic retinopathy.",
        ],
      },
      { heading: "Symptoms of diabetic retinopathy", list: ["__SYMPTOMS__"] },
      {
        heading: "How to protect your vision",
        list: [
          "Manage your blood sugar levels",
          "Have regular eye examinations — even when your vision seems fine",
          "Get checked promptly if you notice any change in your vision",
        ],
      },
      {
        heading: "When to see an eye care professional",
        body: [
          "If you have diabetes and notice any of these symptoms, visit an eye care professional. Early detection and treatment can help prevent serious vision problems.",
        ],
      },
    ],
    faqs: [
      {
        q: "Should people with diabetes have regular eye exams?",
        a: "Yes. Regular eye examinations are key to finding diabetic retinopathy early, before it seriously affects your vision.",
      },
      {
        q: "Can diabetic retinopathy be prevented?",
        a: "Managing your blood sugar levels and having regular eye examinations are key to preventing diabetic retinopathy and protecting your vision.",
      },
      {
        q: "What should I do about sudden vision loss?",
        a: "Sudden vision loss is an emergency. Go to the nearest hospital emergency department immediately.",
      },
    ],
    relatedService: "comprehensive-eye-examination",
    urgentNote:
      "Sudden vision loss is an emergency — go to the nearest hospital emergency department immediately.",
  },
  {
    slug: "hypertensive-retinopathy-high-blood-pressure-eyes",
    status: "published",
    category: "eye-diseases",
    cover: "hypertensive",
    title: "Hypertensive retinopathy: how high blood pressure affects your eyes",
    seoTitle: "Hypertensive Retinopathy: High Blood Pressure & Your Eyes",
    description:
      "High blood pressure can damage the blood vessels in your retina. Learn the symptoms of hypertensive retinopathy and how regular eye exams protect your vision.",
    keywords: [
      "hypertensive retinopathy",
      "high blood pressure eyes",
      "blood pressure and vision",
      "retina damage",
      "eye check-up for hypertension",
    ],
    published: PUBLISHED,
    condition: "Hypertensive retinopathy",
    symptoms: [
      "Blurry or hazy vision",
      "Seeing spots or floaters",
      "Sudden vision loss (in severe cases)",
      "Difficulty seeing clearly in bright or low light",
    ],
    intro:
      "Hypertensive retinopathy is a condition where high blood pressure damages the blood vessels in the retina, the part of the eye that helps you see. Over time, uncontrolled high blood pressure can change these vessels and affect your vision.",
    sections: [
      {
        heading: "What is hypertensive retinopathy?",
        body: [
          "Your retina is fed by tiny blood vessels. When blood pressure stays high, those vessels can narrow, harden or leak — and that can affect how well you see.",
        ],
      },
      { heading: "Symptoms of hypertensive retinopathy", list: ["__SYMPTOMS__"] },
      {
        heading: "How to protect your vision",
        body: [
          "Often there are no early symptoms, so if you have high blood pressure it's important to have regular eye examinations. Treating and controlling your blood pressure can help prevent or slow hypertensive retinopathy and protect your vision.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does hypertensive retinopathy have early symptoms?",
        a: "Often there are no early symptoms, which is why regular eye examinations matter if you have high blood pressure.",
      },
      {
        q: "How can I protect my eyes if I have high blood pressure?",
        a: "Keep your blood pressure under control with your doctor's help and have regular eye examinations.",
      },
      {
        q: "Can hypertensive retinopathy be slowed?",
        a: "Yes. Treating and controlling your blood pressure can help prevent or slow its progression.",
      },
    ],
    relatedService: "comprehensive-eye-examination",
    urgentNote:
      "Sudden vision loss is an emergency — go to the nearest hospital emergency department immediately.",
  },

  // ----------------------------------------------------------- Vision disorders
  {
    slug: "amblyopia-lazy-eye-signs-treatment",
    status: "published",
    category: "vision-disorders",
    cover: "amblyopia",
    title: "Amblyopia (lazy eye): signs, causes and treatment options",
    seoTitle: "Lazy Eye (Amblyopia): Signs, Causes & Vision Therapy",
    description:
      "Amblyopia, or lazy eye, happens when one eye doesn't develop normal vision. Learn the signs in children and how glasses, patching and vision therapy help.",
    keywords: [
      "amblyopia",
      "lazy eye",
      "lazy eye treatment",
      "lazy eye in children",
      "eye patching",
      "vision therapy in Chennai",
    ],
    published: PUBLISHED,
    condition: "Amblyopia (lazy eye)",
    symptoms: [
      "Squinting or tilting the head to see better",
      "Difficulty seeing clearly with one eye",
      "Eyes that appear misaligned (crossed or wandering)",
      "Poor depth perception",
      "Vision problems that don't improve with glasses or contact lenses",
    ],
    intro:
      'Amblyopia, also known as "lazy eye", is a condition where one eye does not develop normal vision, often because the brain favours the other eye. It usually begins in childhood, and the earlier treatment starts, the better it tends to work.',
    sections: [
      {
        heading: "What is amblyopia?",
        body: [
          "When the brain relies on one eye more than the other, the weaker eye's vision doesn't develop fully. The eye itself may look normal, but it doesn't see as clearly.",
        ],
      },
      {
        heading: "What causes lazy eye?",
        list: [
          "Crossed eyes (strabismus)",
          "A large difference in vision between the two eyes",
          "A blockage in the eye, such as a cataract",
        ],
      },
      { heading: "Signs of amblyopia", list: ["__SYMPTOMS__"] },
      {
        heading: "How is amblyopia treated?",
        body: [
          "Treatment is most effective when started early. Depending on the cause, it can include wearing glasses, patching the stronger eye to strengthen the weaker one, and vision therapy — and in some cases surgery.",
        ],
      },
      {
        heading: "When to see an eye care professional",
        body: [
          "If you notice any of these signs, have an eye examination with an eye care professional so amblyopia can be found and treated as early as possible.",
        ],
      },
    ],
    faqs: [
      {
        q: "What causes lazy eye?",
        a: "Common causes include crossed eyes (strabismus), a large difference in vision between the two eyes, or a blockage in the eye such as a cataract.",
      },
      {
        q: "Can glasses alone fix a lazy eye?",
        a: "Glasses are often part of treatment, but amblyopia may also need patching or vision therapy, because vision in the weaker eye may not improve with glasses alone.",
      },
      {
        q: "When should amblyopia treatment start?",
        a: "As early as possible. Treatment is most effective when it starts in childhood.",
      },
    ],
    relatedService: "vision-therapy",
  },
  {
    slug: "vergence-problems-eye-strain-double-vision",
    status: "published",
    category: "vision-disorders",
    cover: "vergence",
    title: "Vergence problems: eye strain, double vision and how vision therapy helps",
    seoTitle: "Vergence Problems: Eye Strain, Double Vision & Therapy",
    description:
      "Vergence problems make it hard for your eyes to work together, causing eye strain, headaches and double vision when reading. Learn the signs and treatment.",
    keywords: [
      "vergence dysfunction",
      "convergence insufficiency",
      "eye strain when reading",
      "double vision reading",
      "binocular vision problems",
      "vision therapy in Chennai",
    ],
    published: PUBLISHED,
    condition: "Vergence dysfunction",
    symptoms: [
      "Eye strain or fatigue, especially when reading or using a computer",
      "Blurry or double vision",
      "Headaches",
      "Difficulty focusing on nearby objects",
      "Frequently squinting or closing one eye to see better",
    ],
    intro:
      "Vergence abnormalities — such as convergence insufficiency — happen when the eyes have difficulty working together to focus on objects at different distances. They can cause eye strain and blurry vision, especially during long periods of reading or close work.",
    sections: [
      {
        heading: "What are vergence abnormalities?",
        body: [
          "To see one clear image, both eyes turn inward together for near objects and outward for far ones. When that teamwork is weak, reading and screen work become tiring, and depth perception can suffer.",
        ],
      },
      { heading: "Symptoms of vergence problems", list: ["__SYMPTOMS__"] },
      {
        heading: "How are vergence problems treated?",
        body: [
          "Vergence issues can often be treated with eye exercises, corrective lenses or other vision therapy. A binocular vision assessment shows how well your eyes work together and guides the plan.",
        ],
      },
      {
        heading: "When to see an eye care professional",
        body: [
          "If you experience these symptoms, see an eye care professional who can diagnose the problem and help improve your vision and comfort.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why do my eyes hurt after reading?",
        a: "Eye strain or fatigue during reading or computer use is a common sign that your eyes are struggling to work together. A binocular vision assessment can find out why.",
      },
      {
        q: "Can vergence problems be treated?",
        a: "Yes. They can often be treated with eye exercises, corrective lenses or other vision therapy.",
      },
      {
        q: "Is sudden double vision a vergence problem?",
        a: "Double vision that comes on suddenly needs urgent attention — go to the nearest hospital emergency department.",
      },
    ],
    relatedService: "vision-therapy",
    urgentNote:
      "Double vision that comes on suddenly needs urgent attention — go to the nearest hospital emergency department.",
  },
  {
    slug: "accommodative-dysfunction-focusing-problems",
    status: "published",
    category: "vision-disorders",
    cover: "accommodation",
    title: "Accommodative dysfunction: when your eyes struggle to focus",
    seoTitle: "Accommodative Dysfunction: Focusing Problems & Treatment",
    description:
      "Trouble switching focus between near and far? Learn the symptoms of accommodative dysfunction, what causes it and how glasses or therapy can help.",
    keywords: [
      "accommodative dysfunction",
      "eye focusing problems",
      "blurry vision when reading",
      "headache after reading",
      "vision therapy",
    ],
    published: PUBLISHED,
    condition: "Accommodative dysfunction",
    symptoms: [
      "Blurry vision when reading or doing close-up work",
      "Difficulty switching focus between near and distant objects",
      "Eye strain or fatigue, especially after reading for a while",
      "Headaches after reading or working on a computer",
      "Frequently squinting to see clearly",
    ],
    intro:
      "Accommodative abnormalities happen when your eyes have trouble focusing on objects at different distances — especially when switching between something far away and something up close.",
    sections: [
      {
        heading: "What is accommodative dysfunction?",
        body: [
          "Your eye's focusing system adjusts constantly as you look from near to far. When it doesn't adjust well, close work becomes blurry or tiring.",
        ],
      },
      { heading: "Symptoms of focusing problems", list: ["__SYMPTOMS__"] },
      {
        heading: "What causes it?",
        body: [
          "Accommodative problems can come from a problem with the eye's focusing ability, and are often related to age or certain health conditions.",
        ],
      },
      {
        heading: "How is it treated?",
        body: [
          "Accommodative problems can be treated with corrective glasses, eye exercises or other therapies. Seeing an eye care professional is important for the right diagnosis and treatment.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why is my near vision blurry when I read?",
        a: "Blurry vision during reading or close work can be a sign of an accommodative (focusing) problem. An eye examination can confirm the cause.",
      },
      {
        q: "What causes eye focusing problems?",
        a: "They are often related to age or certain health conditions affecting the eye's focusing ability.",
      },
      {
        q: "How are focusing problems treated?",
        a: "With corrective glasses, eye exercises or other therapies, depending on the cause.",
      },
    ],
    relatedService: "vision-therapy",
  },
  {
    slug: "myopia-control-children-symptoms-management",
    status: "published",
    category: "vision-disorders",
    cover: "myopia",
    title: "Myopia (nearsightedness) in children: symptoms and myopia control options",
    seoTitle: "Myopia Control for Children: Symptoms & Management Options",
    description:
      "Is your child's spectacle power increasing? Learn what myopia is, its symptoms, and the myopia management options used to slow its progression.",
    keywords: [
      "myopia",
      "nearsightedness",
      "myopia control",
      "myopia management in Chennai",
      "increasing spectacle power",
      "Ortho-K",
      "atropine eye drops for myopia",
    ],
    published: PUBLISHED,
    condition: "Myopia (nearsightedness)",
    symptoms: [
      "Blurry vision for distant objects, such as road signs or the board at school",
      "Squinting to see clearly",
      "Eye strain, especially after reading or long screen time",
      "Frequent headaches",
    ],
    intro:
      "Myopia, also known as nearsightedness, means you can see objects up close clearly, but distant objects look blurry. If your child's spectacle power keeps increasing, myopia management can help slow it down.",
    sections: [
      {
        heading: "What is myopia?",
        body: [
          "Myopia happens when the eyeball is too long or the cornea is too curved, so light focuses in front of the retina instead of directly on it.",
        ],
      },
      { heading: "Symptoms of myopia", list: ["__SYMPTOMS__"] },
      {
        heading: "Myopia management options",
        items: [
          {
            title: "Glasses or contact lenses",
            text: "The most common way to correct myopia: they focus light properly on the retina and improve distance vision.",
          },
          {
            title: "Orthokeratology (Ortho-K)",
            text: "Special contact lenses worn overnight temporarily reshape the cornea, so you can see clearly during the day without glasses or contacts.",
          },
          {
            title: "Low-dose atropine eye drops",
            text: "Low-dose atropine drops can sometimes be prescribed to slow the progression of myopia, particularly in children.",
          },
          {
            title: "Myopia control lenses",
            text: "Special glasses or contact lenses designed to slow myopia progression, particularly in children.",
          },
          {
            title: "Refractive surgery (LASIK or PRK)",
            text: "Surgery that permanently reshapes the cornea to correct myopia and reduce or remove the need for glasses or contact lenses. It is an option for adults, not children.",
          },
        ],
      },
      {
        heading: "Which option is right for my child?",
        body: [
          "Management plans depend on an individual assessment — your child's age, prescription and how quickly their myopia is changing. Proper management can improve vision and, in some cases, slow the progression of myopia.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can myopia progression be slowed?",
        a: "In some cases, yes. Options such as low-dose atropine drops, myopia control lenses and Ortho-K are used to slow myopia progression, particularly in children.",
      },
      {
        q: "What is Ortho-K?",
        a: "Orthokeratology uses special contact lenses worn overnight to temporarily reshape the cornea, improving vision during the day without glasses or contacts.",
      },
      {
        q: "Is laser surgery suitable for children with myopia?",
        a: "No. Refractive surgery such as LASIK or PRK is an option for adults. Children are usually managed with glasses, contact lenses, Ortho-K, myopia control lenses or atropine drops.",
      },
    ],
    relatedService: "myopia-management",
  },
  {
    slug: "computer-vision-syndrome-digital-eye-strain",
    status: "published",
    category: "vision-disorders",
    cover: "screen",
    title: "Computer vision syndrome: digital eye strain and the 20-20-20 rule",
    seoTitle: "Computer Vision Syndrome: Digital Eye Strain & 20-20-20 Rule",
    description:
      "Screens all day? Learn the symptoms of computer vision syndrome (digital eye strain) and simple fixes: the 20-20-20 rule, screen settings, lighting and posture.",
    keywords: [
      "computer vision syndrome",
      "digital eye strain",
      "20-20-20 rule",
      "screen time eye strain",
      "computer glasses",
      "eye strain headache",
    ],
    published: PUBLISHED,
    condition: "Computer vision syndrome",
    symptoms: [
      "Eye strain or fatigue",
      "Dry or itchy eyes",
      "Blurry or double vision",
      "Headaches, especially after long screen time",
      "Difficulty focusing on nearby objects",
      "Neck, shoulder or back pain from poor posture",
    ],
    intro:
      "Computer vision syndrome (CVS), or digital eye strain, comes from long hours in front of a computer, smartphone or other screen without proper breaks or adjustments. A few simple habits make a big difference.",
    sections: [
      { heading: "Symptoms of computer vision syndrome", list: ["__SYMPTOMS__"] },
      {
        heading: "How to reduce digital eye strain",
        items: [
          {
            title: "Follow the 20-20-20 rule",
            text: "Every 20 minutes, take a 20-second break and look at something 20 feet away.",
          },
          {
            title: "Adjust your screen settings",
            text: "Increase text size, reduce screen brightness and set a comfortable contrast.",
          },
          {
            title: "Get the lighting right",
            text: "Reduce glare on your screen with soft ambient lighting and a well-arranged workspace.",
          },
          {
            title: "Use computer glasses",
            text: "Glasses designed for screen work can reduce eye strain when you use digital devices.",
          },
          {
            title: "Keep a good posture",
            text: "Sit with your back straight, shoulders relaxed and your screen at eye level.",
          },
        ],
      },
      {
        heading: "When to see an eye care professional",
        body: [
          "If you still have symptoms after changing your habits, an eye care professional can find the cause and suggest solutions to make screen use more comfortable.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the 20-20-20 rule?",
        a: "Every 20 minutes, take a 20-second break and look at something 20 feet away. It gives your focusing muscles a rest.",
      },
      {
        q: "Do computer glasses help?",
        a: "Glasses designed for screen work can reduce eye strain when using digital devices. An eye examination shows whether they suit you.",
      },
      {
        q: "Can screen time cause headaches?",
        a: "Yes. Headaches, especially after long screen time, are a common symptom of computer vision syndrome.",
      },
    ],
    relatedService: "comprehensive-eye-examination",
  },
  {
    slug: "colour-blindness-color-vision-deficiency",
    status: "published",
    category: "vision-disorders",
    cover: "colour",
    title: "Colour blindness (colour vision deficiency): signs, testing and support",
    seoTitle: "Colour Blindness (Color Vision Deficiency): Signs & Testing",
    description:
      "Colour blindness makes certain colours hard to tell apart. Learn the signs of colour vision deficiency, who it affects, how it's tested and the aids that help.",
    keywords: [
      "colour blindness",
      "color blindness",
      "colour vision deficiency",
      "colour blindness test",
      "red green colour blindness",
    ],
    published: PUBLISHED,
    condition: "Colour vision deficiency",
    symptoms: [
      "Difficulty telling red from green, or blue from yellow",
      "Trouble seeing the difference between shades of the same colour",
      "Colours that look dull or washed out",
    ],
    intro:
      "Colour blindness — also called colour (or color) vision deficiency — means you have difficulty telling certain colours apart. It doesn't cause complete blindness, but it can make some colours hard to identify.",
    sections: [
      {
        heading: "What is colour blindness?",
        body: [
          "Colour blindness is most often inherited and affects more men than women. Most people with it see colours, but some shades look alike or less vivid.",
        ],
      },
      { heading: "Signs of colour vision deficiency", list: ["__SYMPTOMS__"] },
      {
        heading: "Can colour blindness be treated?",
        body: [
          "Inherited colour blindness can't be reversed, but aids such as special glasses and contact lenses, or colour-identifying apps, can help with everyday tasks.",
        ],
      },
      {
        heading: "Getting tested",
        body: [
          "If you suspect colour blindness, or have trouble telling colours apart, talk to an eye care professional for testing and support.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is colour blindness inherited?",
        a: "Most often, yes. Colour blindness is usually inherited.",
      },
      {
        q: "Who is more likely to be colour blind?",
        a: "Colour blindness affects more men than women.",
      },
      {
        q: "What helps with colour blindness?",
        a: "Aids such as special glasses and contact lenses, or colour-identifying apps, can help, although inherited colour blindness can't be reversed.",
      },
    ],
    relatedService: "comprehensive-eye-examination",
  },
];
