import type { Program } from "./types";

/**
 * Academy programs (BUILD_PROMPT §9.3).
 *
 * The Fellowship in Advanced Clinical Optometry is published from the client's
 * brochure ("THE VISION DOCTOR ACADEMY FELLOWSHIP BROCHURE"). The two
 * certifications are published from "Certificate Course.pdf" (Oct 2026). Copy
 * stays close to those documents; nothing is added that they do not state,
 * except the scope-of-certificate note, which mirrors the fellowship brochure.
 *
 * The other entries are drafts that exist only for layout review in preview
 * mode (NEXT_PUBLIC_SHOW_DRAFTS=true) and are hidden in production.
 *
 * To publish a program: confirm every detail and the fee, then set
 * `status: "published"`. Without an intake the page says the dates are still
 * to be announced. `pnpm content:check` fails the build if a published program
 * is incomplete.
 */
const TBC = "To be confirmed";

export const programs: Program[] = [
  {
    slug: "fellowship-advanced-clinical-optometry",
    status: "published",
    type: "fellowship",
    title: "Fellowship in Advanced Clinical Optometry",
    outcome:
      "A six-month professional fellowship that strengthens clinical knowledge, enhances diagnostic understanding and develops a systematic approach to patient assessment and clinical decision-making.",
    stages: ["practising-optometrist"],
    specialities: ["diagnostics", "binocular-vision", "myopia", "contact-lenses"],
    eligibility: "B.Optom graduates, qualified optometrists and early-career optometrists.",
    eligibilityList: [
      "Bachelor of Optometry (B.Optom) graduates",
      "Qualified optometrists seeking to strengthen their clinical competencies",
      "Early-career optometrists interested in structured professional development",
    ],
    duration: "6 months",
    mode: "hybrid",
    venue: "Chennai, Tamil Nadu",
    partner: "Aradhana Eye Care Hospital",
    batchSize: "10–15 learners (first batch)",
    fee: { amountINR: 30000, instalments: true },
    intakes: [{ start: "2027-01", status: "open" }],
    outcomes: [
      "Strengthen your clinical knowledge",
      "Enhance your diagnostic understanding",
      "Develop a systematic approach to patient assessment and clinical decision-making",
      "Bridge the gap between academic learning and practical clinical experience",
    ],
    highlights: [
      "Six months of structured professional training",
      "Hybrid learning format",
      "Supervised clinical exposure",
      "Case-based discussions and clinical learning",
      "Exposure to contemporary clinical optometry practices",
      "Assessment based on the program's prescribed requirements",
    ],
    curriculum: [
      {
        title: "Basics of clinical optometry",
        topics: [
          "Comprehensive eye examination and clinical assessment",
          "Case history taking and clinical documentation",
          "Refractive assessment and complex clinical cases",
        ],
      },
      {
        title: "Ocular disease screening and diagnostics",
        topics: [
          "Clinical signs and screening approaches for common ocular conditions",
          "Introduction to ophthalmic diagnostic investigations",
          "Recognition of referral indicators and appropriate referral pathways",
        ],
      },
      {
        title: "Binocular vision and vision therapy",
        topics: [
          "Binocular vision assessment",
          "Ocular motility, accommodation and vergence evaluation",
          "Principles of vision therapy and visual rehabilitation",
        ],
      },
      {
        title: "Myopia management",
        topics: [
          "Assessment and monitoring of myopia",
          "Overview of contemporary myopia management approaches",
          "Patient education and follow-up principles",
        ],
      },
      {
        title: "Specialty contact lenses",
        topics: [
          "Clinical indications for specialty contact lenses",
          "Introduction to complex corneal and contact lens cases",
          "Principles of fitting assessment and patient follow-up",
        ],
      },
      {
        title: "Case-based learning and clinical decision-making",
        topics: [
          "Clinical case discussions and presentations",
          "Interpretation of examination findings",
          "Patient counselling and clinical communication",
          "Clinical reasoning and referral decisions",
        ],
      },
    ],
    curriculumNote:
      "The final curriculum and practical components will be based on the training facilities, available equipment, faculty and approved program structure.",
    handsOn:
      "A hybrid format that combines academic learning with supervised clinical exposure, in association with Aradhana Eye Care Hospital, and case-based discussions throughout.",
    assessment: "Assessment based on the program's prescribed requirements.",
    certificate:
      "Fellowship certificate, awarded on successful completion of the prescribed program requirements.",
    importantNote:
      "This is a professional training fellowship. The award of the fellowship certificate is subject to successful completion of the prescribed program requirements. Completion does not, by itself, confer a statutory licence, specialist registration, or additional legal scope of practice.",
    accreditation: { status: "none" },
    facultyIds: ["subash-v"],
    // Client copy (Nov 2026); "Leading" and "renowned" removed under the no-superlatives rule.
    guestFaculty: {
      title: "Learn from expert guest faculty",
      text: "The fellowship features selected guest sessions by national-level speakers and experienced eye care professionals. These sessions offer insights, clinical perspectives and exposure to current advancements in optometry, complementing your regular clinical training. Guest speakers are announced to enrolled students closer to each session.",
    },
  },
  {
    slug: "certification-clinical-ocular-diagnostics-examination-skills",
    status: "published",
    type: "certification",
    title: "Certification in Clinical Ocular Diagnostics and Examination Skills (CODES)",
    outcome:
      "A four-week certificate course that enhances optometrists’ clinical examination skills and strengthens their ability to identify common ocular abnormalities and recognise conditions requiring further evaluation or referral.",
    stages: ["practising-optometrist"],
    specialities: ["diagnostics"],
    eligibility: "B.Optom graduates, qualified optometrists and Diploma in Optometry graduates.",
    eligibilityList: [
      "B.Optom graduates",
      "Qualified optometrists",
      "Diploma in Optometry graduates",
    ],
    duration: "4 weeks",
    mode: "hybrid",
    venue: "Chennai, Tamil Nadu",
    partner: "Aradhana Eye Care Hospital",
    batchSize: "10–15 participants",
    fee: { amountINR: 10000, instalments: true },
    outcomes: [
      "Comprehensive clinical eye examination",
      "Slit-lamp examination and tonometry principles",
      "Anterior and posterior segment assessment",
      "Glaucoma, diabetic retinopathy and other ocular disease screening",
      "Interpretation of diagnostic findings and identification of referral indications",
      "Clinical documentation and case presentation",
    ],
    handsOn:
      "The course combines theoretical learning, practical demonstrations, supervised clinical exposure where available, and case-based discussions covering comprehensive eye examination, anterior segment assessment, tonometry principles, posterior segment evaluation, ocular disease screening and clinical decision-making.",
    assessment: "Course requirements and assessments set by the Academy.",
    certificate:
      "Certification in Clinical Ocular Diagnostics and Examination Skills (CODES) from The Vision Doctor Academy, awarded on successful completion of the course requirements and assessments.",
    importantNote:
      "This is a professional training course. The certificate is awarded on successful completion of the course requirements and assessments. Completion does not, by itself, confer a statutory licence, specialist registration, or additional legal scope of practice.",
    accreditation: { status: "none" },
    facultyIds: ["subash-v"],
    relatedSlugs: [
      "certification-retinal-diagnostics-imaging",
      "fellowship-advanced-clinical-optometry",
    ],
  },
  {
    slug: "certification-retinal-diagnostics-imaging",
    status: "published",
    type: "certification",
    title: "Certification in Retinal Diagnostics and Imaging (CRDI)",
    outcome:
      "A four-week certificate course to understand retinal imaging technologies, interpret common retinal findings and recognise abnormalities that require further ophthalmic evaluation.",
    // Meeting of 29 Oct 2026: also open to Diploma graduates, students and interns.
    stages: ["practising-optometrist", "student-intern"],
    specialities: ["diagnostics"],
    eligibility:
      "B.Optom graduates, qualified optometrists, Diploma in Optometry graduates, and optometry students and interns.",
    eligibilityList: [
      "B.Optom graduates",
      "Qualified optometrists",
      "Diploma in Optometry graduates",
      "Optometry students and interns",
    ],
    duration: "4 weeks",
    mode: "hybrid",
    venue: "Chennai, Tamil Nadu",
    batchSize: "10–15 participants",
    fee: { amountINR: 10000, instalments: true },
    outcomes: [
      "Fundamentals of retinal anatomy and pathology",
      "Fundus photography techniques and image quality assessment",
      "Optical Coherence Tomography (OCT): principles and interpretation",
      "Recognition of common retinal abnormalities",
      "Diabetic retinopathy screening and grading fundamentals",
      "Identification of macular and optic nerve head abnormalities",
      "Understanding retinal imaging findings and their clinical significance",
      "Recognising urgent referral indicators and appropriate referral pathways",
      "Clinical documentation and image-based case presentation",
    ],
    handsOn:
      "Designed for optometry students, graduates and qualified optometrists who want to strengthen their knowledge of retinal assessment, diagnostic imaging and clinical decision-making. The course combines theoretical learning, image-based case discussions and practical demonstrations to build a strong foundation in retinal imaging and ocular disease screening.",
    assessment: "Course requirements and assessments set by the Academy.",
    certificate:
      "Certification in Retinal Diagnostics and Imaging (CRDI) from The Vision Doctor Academy, awarded on successful completion of the course requirements and assessments.",
    importantNote:
      "This is a professional training course. The certificate is awarded on successful completion of the course requirements and assessments. Completion does not, by itself, confer a statutory licence, specialist registration, or additional legal scope of practice.",
    accreditation: { status: "none" },
    facultyIds: ["subash-v"],
    relatedSlugs: [
      "certification-clinical-ocular-diagnostics-examination-skills",
      "fellowship-advanced-clinical-optometry",
    ],
  },
  {
    slug: "clinical-training-ocular-diagnostics",
    status: "draft",
    type: "clinical-training",
    title: "[Draft] Clinical training — Ocular diagnostics (title TBC)",
    outcome: "Outcome statement to be confirmed by the Academy.",
    stages: ["student-intern"],
    specialities: ["diagnostics"],
    eligibility: TBC,
    duration: TBC,
    schedule: TBC,
    venue: TBC,
    accreditation: { status: "none" },
    facultyIds: ["subash-v"],
  },
  {
    slug: "workshop-binocular-vision",
    status: "draft",
    type: "workshop",
    title: "[Draft] Workshop — Binocular vision & vision therapy (title TBC)",
    outcome: "Outcome statement to be confirmed by the Academy.",
    stages: ["practising-optometrist", "student-intern", "other-eyecare"],
    specialities: ["binocular-vision"],
    eligibility: TBC,
    duration: TBC,
    venue: TBC,
    accreditation: { status: "none" },
    facultyIds: ["subash-v"],
  },
  {
    slug: "cme-ocular-diagnostics",
    status: "draft",
    type: "cme",
    title: "[Draft] CME — Ocular diagnostics (title TBC)",
    outcome: "Outcome statement to be confirmed by the Academy.",
    stages: ["practising-optometrist", "other-eyecare"],
    specialities: ["diagnostics"],
    eligibility: TBC,
    duration: TBC,
    venue: TBC,
    accreditation: { status: "none" },
    facultyIds: ["subash-v"],
  },
];
