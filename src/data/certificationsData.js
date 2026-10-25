// Real certificates, read from the CERTIFICATES/ folder of this repo.
// Titles, issuers, dates and credential IDs below are taken directly from the
// issued documents (nothing here is placeholder data).
//
// Add a new certificate by dropping the file into CERTIFICATES/ and importing
// it below. Sort order is handled by `issuedOn` (newest first).

import mongodbBasics from '../../CERTIFICATES/MONGODB BASICS.webp'
import azureFoundations from '../../CERTIFICATES/Introduction to Microsoft Azure.webp'
import generativeAiConcepts from '../../CERTIFICATES/Introduction to generative AI concepts.webp'
import responsibleAiCopilot from '../../CERTIFICATES/Responsible AI with GitHub Copilot.webp'
import promptEngineeringCopilot from '../../CERTIFICATES/Introduction to prompt engineering with GitHub Copilot.webp'
import novitechFullstack from '../../CERTIFICATES/NOVITECH FULLSTACK.webp'
import academicRank from '../../CERTIFICATES/ACADEMIC RANK 2.webp'
import deloitteCert from '../../CERTIFICATES/Deloitte Data Analytics Job Simulation.webp'
import tataCert from '../../CERTIFICATES/TATA GenAI Powered Data Analytics Job Simulation.webp'
import bcgCert from '../../CERTIFICATES/BCG Gen AI.webp'
import elevateLabsIntern from '../../CERTIFICATES/INTERN/ELEVATE LAB INTERN.webp'
import empowerIntern from '../../CERTIFICATES/INTERN/EMPOWER GUIDING HUB INTERN.webp'
import zeptowareIntern from '../../CERTIFICATES/INTERN/ZEPTOWARE INTERN.webp'
import hackintymWinning from '../../CERTIFICATES/COMPETITIONS/HACKINTYM 2K25 V1.0 WINNING.webp'
import hackintymEvo from '../../CERTIFICATES/COMPETITIONS/HACKINTYM 2K25 V1.0 PARTICIPATION.webp'
import hackintymTwo from '../../logos/hackintym 2k26 v2.0.webp'
import hackintymEvoLogo from '../../logos/hackintym 2k25 evo.webp'
import hackintymTwoCert from '../../CERTIFICATES/COMPETITIONS/HACKINTYM 2K26 V2.0 PARTICIPATION.webp'
import msecLogo from '../../logos/mseclogo.webp'
import microsoftLogo from '../../logos/microsoft.webp'
import novitechLogo from '../../logos/novitech.webp'
import elevateLabLogo from '../../logos/elevatelab.webp'
import zeptowareLogo from '../../logos/zeptoware.webp'
import kprLogo from '../../logos/kpr.webp'
import mongodbLogo from '../../logos/mongodb.webp'
import empowerLogo from '../../logos/empower.webp'
import saLogo from '../../logos/sa.webp'
import deloitteLogo from '../../logos/deloitte.webp'
import tataLogo from '../../logos/tata.webp'
import bcgLogo from '../../logos/BCG logo.webp'
import nakshatraShipwreck from '../../CERTIFICATES/COMPETITIONS/SA SKIPWRECK WINNING.webp'
import exploitX from '../../CERTIFICATES/COMPETITIONS/KPR EXPLOIX PARTICIPATION.webp'

const CERTIFICATION = 'Certification'
const INTERNSHIP = 'Internship'
const COMPETITION = 'Competition'
const ACHIEVEMENT = 'Achievement'

export const certificationCategories = [
  CERTIFICATION,
  INTERNSHIP,
  COMPETITION,
  ACHIEVEMENT,
]

export const certificationsData = [
  {
    id: 18,
    title: 'GenAI Job Simulation',
    issuer: 'Boston Consulting Group',
    date: 'Oct 2026',
    issuedOn: '2026-10-25',
    category: CERTIFICATION,
    description:
      'Certificate of Completion for the BCG GenAI Job Simulation (via Forage), completed in October 2026 with practical tasks in data extraction and critical analysis and in developing an AI-powered financial chatbot.',
    image: bcgLogo,
    fullImage: bcgCert,
    // The wordmark ships as BCG green on transparency — on dark cards that green
    // sits too close to the background, so lift it with a brightness boost.
    logoClass: 'dark:brightness-200',
    credentialUrl: null,
  },
  {
    id: 16,
    title: 'Data Analytics Job Simulation',
    issuer: 'Deloitte',
    date: 'Oct 2026',
    issuedOn: '2026-10-20',
    category: CERTIFICATION,
    credentialId: '6BeKec758TTbdr1t69xdz3',
    description:
      'Certificate of Completion for the Deloitte Data Analytics Job Simulation (via Forage), completed between September 2025 and October 2026 with practical tasks in data analysis and forensic technology.',
    image: deloitteLogo,
    fullImage: deloitteCert,
    // The Deloitte wordmark is black-on-transparent — turn it white in dark
    // mode so it stays legible on the dark frosted thumbnail well.
    logoClass: 'dark:brightness-0 dark:invert',
    credentialUrl: null,
  },
  {
    id: 17,
    title: 'GenAI Powered Data Analytics Job Simulation',
    issuer: 'Tata',
    date: 'Oct 2026',
    issuedOn: '2026-10-20',
    category: CERTIFICATION,
    credentialId: '6BeKec758TTbdr1t69xdz3',
    description:
      'Certificate of Completion for the Tata GenAI Powered Data Analytics Job Simulation (via Forage), completed in October 2026 with practical tasks in exploratory data analysis and risk profiling, predictive modelling, business reporting, and an AI-driven collections strategy.',
    image: tataLogo,
    fullImage: tataCert,
    credentialUrl: null,
  },
  {
    id: 1,
    title: "HACKINTYM '26 2.0 — 30 Hour Hackathon",
    issuer: 'Meenakshi Sundararajan Engineering College',
    date: 'Oct 2026',
    issuedOn: '2026-10-11',
    category: COMPETITION,
    description:
      'Certificate of Participation in HACKINTYM ’26 2.0, a 30-hour hackathon celebrating innovation, creativity and collaboration, held on 10th & 11th October 2026 at Meenakshi Sundararajan Engineering College.',
    image: hackintymTwo,
    fullImage: hackintymTwoCert,
    credentialUrl: null,
  },
  {
    id: 2,
    title: 'EXPLOIT-X E2 — National Level CTF',
    issuer: 'IEEE KPRIET CS SBC',
    date: 'Jul 2026',
    issuedOn: '2026-07-27',
    category: COMPETITION,
    description:
      'Certificate of Participation in “EXPLOIT-X E2”, a National Level Capture The Flag Competition organised by IEEE KPRIET CS SBC and the Department of CSE on 27.07.2026.',
    image: kprLogo,
    fullImage: exploitX,
    credentialUrl: null,
  },
  {
    id: 3,
    title: 'AI & Machine Learning Internship',
    issuer: 'Elevate Labs',
    date: 'Jul 2026',
    issuedOn: '2026-07-17',
    category: INTERNSHIP,
    alsoIn: [ACHIEVEMENT],
    award: 'Best Performer',
    description:
      'Completed the AI & ML internship (29 May – 15 July 2026) with the “Best Performer” recognition. Supported by MSME, Govt. of India and Skill India.',
    image: elevateLabLogo,
    fullImage: elevateLabsIntern,
    credentialUrl: null,
  },
  {
    id: 4,
    title: 'AI & Data Science Internship',
    issuer: 'Zeptoware System Private Limited',
    date: 'Jun 2026',
    issuedOn: '2026-06-30',
    category: INTERNSHIP,
    credentialId: 'ZWSPL-1046',
    description:
      'Internship confirmation for the AI & Data Science internship (01 June – 30 June 2026) at Zeptoware System Private Limited, Chennai.',
    image: zeptowareLogo,
    fullImage: zeptowareIntern,
    credentialUrl: null,
  },
  {
    id: 5,
    title: "Hackintym & Product Design Challenge ’26",
    issuer: 'MSIIC Clubs, Meenakshi Sundararajan Engineering College',
    date: 'Apr 2026',
    issuedOn: '2026-04-19',
    category: COMPETITION,
    alsoIn: [ACHIEVEMENT],
    award: '3rd Prize',
    description:
      'Awarded 3rd Prize in the Hackintym / Product Design Challenge (30-hour hackathon) conducted by the MSIIC Clubs on 18th & 19th April 2026.',
    image: msecLogo,
    fullImage: hackintymWinning,
    credentialUrl: null,
  },
  {
    id: 6,
    title: "HACKINTYM ’26 EVO",
    issuer: 'Meenakshi Sundararajan Engineering College',
    date: 'Apr 2026',
    issuedOn: '2026-04-18',
    category: COMPETITION,
    description:
      'Certificate of Participation in “HACKINTYM ’26 EVO”, a hackathon fostering innovation, technical excellence and problem solving, held on 18th & 19th April 2026.',
    image: hackintymEvoLogo,
    fullImage: hackintymEvo,
    credentialUrl: null,
  },
  {
    id: 7,
    title: 'Full Stack Development — 30 Days MasterClass',
    issuer: 'NoviTech R&D Private Limited',
    date: 'Jan 2026',
    issuedOn: '2026-01-19',
    category: CERTIFICATION,
    credentialId: 'NT_054F0DE765',
    description:
      'Certificate of Completion for the 30 Days MasterClass in Full Stack Development, conducted from 09 December 2025 to 19 January 2026.',
    image: novitechLogo,
    fullImage: novitechFullstack,
    credentialUrl: null,
  },
  {
    id: 8,
    title: 'Shipwreck — NAKSHATRA ’25',
    issuer: 'S.A. Engineering College',
    date: 'Sep 2025',
    issuedOn: '2025-09-26',
    category: COMPETITION,
    award: '1st Place',
    description:
      'Secured First Place in the Shipwreck event at NAKSHATRA ’25, a National Level Technical Symposium organised by the Department of CSE on 26th September 2025.',
    image: saLogo,
    fullImage: nakshatraShipwreck,
    credentialUrl: null,
  },
  {
    id: 9,
    title: 'Introduction to Microsoft Azure',
    issuer: 'Microsoft',
    date: 'Aug 2025',
    issuedOn: '2025-08-27',
    category: CERTIFICATION,
    description:
      '“Introduction to Microsoft Azure: Describe cloud concepts” — completed on 27 August 2025.',
    image: microsoftLogo,
    fullImage: azureFoundations,
    credentialUrl: null,
  },
  {
    id: 10,
    title: 'Introduction to Generative AI Concepts',
    issuer: 'Microsoft',
    date: 'Aug 2025',
    issuedOn: '2025-08-26',
    category: CERTIFICATION,
    description:
      '“Introduction to generative AI concepts” — completed on 27 August 2025.',
    image: microsoftLogo,
    fullImage: generativeAiConcepts,
    credentialUrl: null,
  },
  {
    id: 11,
    title: 'Responsible AI with GitHub Copilot',
    issuer: 'Microsoft',
    date: 'Aug 2025',
    issuedOn: '2025-08-25',
    category: CERTIFICATION,
    description:
      '“Responsible AI with GitHub Copilot” — completed on 27 August 2025.',
    image: microsoftLogo,
    fullImage: responsibleAiCopilot,
    credentialUrl: null,
  },
  {
    id: 12,
    title: 'Prompt Engineering with GitHub Copilot',
    issuer: 'Microsoft',
    date: 'Aug 2025',
    issuedOn: '2025-08-24',
    category: CERTIFICATION,
    description:
      '“Introduction to prompt engineering with GitHub Copilot” — completed on 27 August 2025.',
    image: microsoftLogo,
    fullImage: promptEngineeringCopilot,
    credentialUrl: null,
  },
  {
    id: 13,
    title: 'Web Development Internship',
    issuer: 'Empower Software Hub',
    date: 'Aug 2025',
    issuedOn: '2025-08-04',
    category: INTERNSHIP,
    award: 'Commendable',
    description:
      'Completed the web development internship including project work from 4th July 2025 to 4th August 2025, rated “Commendable”.',
    image: empowerLogo,
    fullImage: empowerIntern,
    credentialUrl: null,
  },
  {
    id: 14,
    title: 'MongoDB Basics for Students',
    issuer: 'MongoDB, Inc.',
    date: 'Jun 2025',
    issuedOn: '2025-06-18',
    category: CERTIFICATION,
    credentialId: 'MDBcdca2oiqvq',
    description:
      'Proof of Completion for “MongoDB Basics for Students”, issued on 06-18-2025.',
    image: mongodbLogo,
    fullImage: mongodbBasics,
    credentialUrl: null,
  },
  {
    id: 15,
    title: '2nd Rank — 1st Semester, AI & Data Science',
    issuer: 'Meenakshi Sundararajan Engineering College',
    date: 'AY 2024-25',
    issuedOn: '2025-04-01',
    category: ACHIEVEMENT,
    award: '2nd Rank — Semester I',
    description:
      'Certificate of Appreciation for securing 2nd Rank in Semester I of the I year, AI & DS department during the academic year 2024-2025.',
    image: msecLogo,
    fullImage: academicRank,
    credentialUrl: null,
  },
]

export default certificationsData
