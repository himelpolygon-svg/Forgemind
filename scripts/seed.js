// Seeds the database with the ForgeMind site's current real content, so the
// CMS starts out showing exactly what's live today. Safe to re-run: it only
// inserts fields/items that don't already exist (won't clobber edits).
const bcrypt = require('bcryptjs');
const { db } = require('../db/db');
const { seedField } = require('../db/content');
const { seedItemIfEmpty } = require('../db/collections');

const U = (name) => `/uploads/${name}`;
const I = (name) => `/icons/${name}`;

function seedContent() {
  // ---------- GLOBAL ----------
  seedField('global', 'logo', U('logo.png'), 'image');
  seedField('global', 'cta_button_text', 'Book Appointment', 'text');
  seedField('global', 'cta_button_link', '#', 'text');
  seedField('global', 'social_facebook_url', '#', 'text');
  seedField('global', 'social_instagram_url', '#', 'text');
  seedField('global', 'social_twitter_url', '#', 'text');
  seedField('global', 'social_linkedin_url', '#', 'text');

  // ---------- HOME: HERO ----------
  seedField('home_hero', 'heading_pre', 'Forging the', 'text');
  seedField('home_hero', 'heading_highlight', 'Future', 'text');
  seedField('home_hero', 'heading_post', ' of Technology', 'text');
  seedField('home_hero', 'paragraph', 'We build digital solutions that help businesses move faster, work smarter, and turn ideas into impact.', 'richtext');
  seedField('home_hero', 'button_text', 'Contact Us', 'text');
  seedField('home_hero', 'button_link', '#', 'text');
  seedField('home_hero', 'bg_image', U('hero_image.png'), 'image');

  // ---------- HOME: INTRO ----------
  seedField('home_intro', 'paragraph', "ForgeMind helps businesses tackle challenges with intelligent digital solutions. We offer custom software, web platforms, mobile apps, automation.", 'richtext');
  seedField('home_intro', 'button_text', 'More About Us', 'text');

  // ---------- HOME: PRODUCTS (section head) ----------
  seedField('home_products', 'badge_text', 'Our Upcoming Products', 'text');
  seedField('home_products', 'heading', "Products We're Building", 'text');
  seedField('home_products', 'filters', 'All, Operations, Workforce, Finance, AI & Automation, Analysis', 'text');

  // ---------- HOME: SERVICES (section head) ----------
  seedField('home_services', 'badge_text', 'Our Services', 'text');
  seedField('home_services', 'heading', 'Tech Skills to Boost Your Business', 'text');

  // ---------- WHY CHOOSE US (shared: Home + About) ----------
  seedField('why_shared', 'badge_text', 'Why Choose Us', 'text');
  seedField('why_shared', 'heading', 'Built to Make a Difference', 'text');
  seedField('why_shared', 'emblem_image', U('image_42.png'), 'image');
  seedField('why_shared', 'item1_icon', I('icon-team.svg'), 'image');
  seedField('why_shared', 'item1_title', 'Expert Team', 'text');
  seedField('why_shared', 'item1_body', 'Our skilled designers, engineers, and strategists work together to deliver high-quality digital products built for real', 'richtext');
  seedField('why_shared', 'item2_icon', I('icon-data.svg'), 'image');
  seedField('why_shared', 'item2_title', 'Data-Driven Approach', 'text');
  seedField('why_shared', 'item2_body', 'We combine research, user insights, and meaningful data to make smarter decisions and build products that deliver results.', 'richtext');
  seedField('why_shared', 'item3_icon', I('icon-custom.svg'), 'image');
  seedField('why_shared', 'item3_title', 'Custom Solutions', 'text');
  seedField('why_shared', 'item3_body', 'We create tailored software solutions that align with your goals, workflows, customers, and unique business requirements for growth.', 'richtext');
  seedField('why_shared', 'item4_icon', I('icon-fast.svg'), 'image');
  seedField('why_shared', 'item4_title', 'Fast Delivery', 'text');
  seedField('why_shared', 'item4_body', 'Our streamlined process keeps projects moving efficiently, helping you launch faster without compromising quality, performance', 'richtext');

  // ---------- HOME: PROCESS ----------
  seedField('home_process', 'badge_text', 'Our Working Process', 'text');
  seedField('home_process', 'heading', 'From Idea to Impact, We Build With Purpose', 'text');
  seedField('home_process', 'step1_title', 'Discovery', 'text');
  seedField('home_process', 'step1_body', 'We understand your goals, users, and business challenges', 'richtext');
  seedField('home_process', 'step1_image', U('image_97.png'), 'image');
  seedField('home_process', 'step2_title', 'Build', 'text');
  seedField('home_process', 'step2_body', 'We create the roadmap, design, and technology to bring ideas.', 'richtext');
  seedField('home_process', 'step2_image', U('image_100.png'), 'image');
  seedField('home_process', 'step3_title', 'Launch & Evolute', 'text');
  seedField('home_process', 'step3_body', 'We test, refine, and launch your product with confidence.', 'richtext');
  seedField('home_process', 'step3_image', U('image_71.png'), 'image');

  // ---------- HOME: CONTACT ----------
  seedField('home_contact', 'heading', 'Get in Touch with Our Team', 'text');
  seedField('home_contact', 'phone', '+61 2 8015 4720', 'text');
  seedField('home_contact', 'email', 'hello@forgemind.io', 'text');
  seedField('home_contact', 'location', 'Level 12, 100 Mount St, North Sydney , Australia', 'text');
  seedField('home_contact', 'bg_image', U('placeholder_contact_bg.png'), 'image');

  // ---------- ABOUT: HERO ----------
  seedField('about_hero', 'badge_text', 'About Us', 'text');
  seedField('about_hero', 'heading_pre', 'Technology Built For ', 'text');
  seedField('about_hero', 'heading_gold', 'Business', 'text');
  seedField('about_hero', 'paragraph', 'We combine strategy, design, and technology to build meaningful digital solutions that help businesses grow, adapt, and move forward.', 'richtext');
  seedField('about_hero', 'image', U('Rectangle_81.png'), 'image');

  // ---------- ABOUT: STATS ----------
  seedField('about_stats', 'stat1_num', '15+', 'text');
  seedField('about_stats', 'stat1_label', 'Industries', 'text');
  seedField('about_stats', 'stat2_num', '50+', 'text');
  seedField('about_stats', 'stat2_label', 'Skilled Professionals', 'text');
  seedField('about_stats', 'stat3_num', '06+', 'text');
  seedField('about_stats', 'stat3_label', 'Core Solutions', 'text');
  seedField('about_stats', 'stat4_num', '10+', 'text');
  seedField('about_stats', 'stat4_label', 'Technologies', 'text');

  // ---------- ABOUT: STORY ----------
  seedField('about_story', 'badge_text', 'Our Story', 'text');
  seedField('about_story', 'heading', 'Built by Engineers, Made to Work.', 'text');
  seedField('about_story', 'paragraph', 'Our mission is to transform complex business challenges into simple, scalable, and meaningful digital solutions. We combine strategy, design, and technology to help businesses work smarter, grow faster, and create lasting value.', 'richtext');
  seedField('about_story', 'image', U('Rectangle_82.png'), 'image');

  // ---------- ABOUT: CORE VALUES (section head) ----------
  seedField('about_values', 'badge_text', 'Our Core Values', 'text');
  seedField('about_values', 'heading', 'The Values That Drive Us', 'text');

  // ---------- ABOUT: TEAM (section head) ----------
  seedField('about_team', 'badge_text', 'Our Teams', 'text');
  seedField('about_team', 'heading', 'Meet the Minds', 'text');
  seedField('about_team', 'see_all_text', 'See all', 'text');

  // ---------- ABOUT: CEO ----------
  seedField('about_ceo', 'badge_text', 'Leadership', 'text');
  seedField('about_ceo', 'heading', 'A Message From Our CEO', 'text');
  seedField('about_ceo', 'photo', U('Rectangle_84-3.png'), 'image');
  seedField('about_ceo', 'quote_p1', 'At ForgeMind, I believe technology should do more than simply work—it should create meaningful impact. Our goal is to understand the real challenges businesses face and turn them into practical, scalable digital solutions.', 'richtext');
  seedField('about_ceo', 'quote_p2', "By bringing together engineering, design, and strategic thinking, we build products that are reliable, adaptable, and built for the future. We're committed to working closely with our clients, challenging conventional thinking, and creating technology that helps businesses move forward with confidence.", 'richtext');
  seedField('about_ceo', 'name', 'Tanvir Ahmed', 'text');
  seedField('about_ceo', 'role', 'CEO & Founder', 'text');
  seedField('about_ceo', 'link_instagram', '#', 'text');
  seedField('about_ceo', 'link_linkedin', '#', 'text');

  // ---------- ABOUT: CTA ----------
  seedField('about_cta', 'heading', "Let's Build Something Intelligent Together", 'text');
  seedField('about_cta', 'paragraph', 'Tell us about your project and our team will get back to you within one business day.', 'richtext');
  seedField('about_cta', 'button_text', 'Book Appointment', 'text');
  seedField('about_cta', 'bg_image', U('placeholder_cta_bg.png'), 'image');

  // ---------- FOOTER ----------
  seedField('footer', 'contact_email', 'info@domainname.com', 'text');
  seedField('footer', 'contact_phone', '123 456 789', 'text');
  seedField('footer', 'copyright_text', 'Copyright © 2026 Forgemind. All Rights Reserved.', 'text');
}

function seedCollections() {
  seedItemIfEmpty('products', [
    { title: 'Simplify Invoicing & Payments', subtitle: 'In Development', body: 'A smart platform to create, send, track, and manage invoices while streamlining payments', image: U('placeholder_product.png') },
    { title: 'Smart Business Operations', subtitle: 'In Development', body: 'Manage tasks, workflows, approvals, and everyday operations from one intelligent platform.', image: U('placeholder_product.png') },
  ]);

  seedItemIfEmpty('services', [
    { title: 'Custom Software Development', image: U('Rectangle_74.png') },
    { title: 'Web & Application Development', image: U('Rectangle_75.png') },
    { title: 'AI & Intelligent Solutions', image: U('Rectangle_75-1.png') },
    { title: 'UI/UX Design', image: U('Rectangle_75-2.png') },
    { title: 'Technology Consulting', image: U('Rectangle_75-3.png') },
    { title: 'Cybersecurity Solutions', image: U('Rectangle_75-4.png') },
  ]);

  seedItemIfEmpty('core_values', [
    { title: 'People First', body: 'We put people at the heart of everything we build.', image: I('icon-team.svg') },
    { title: 'Purpose Driven', body: 'We build technology with a clear purpose and meaningful impact.', image: I('icon-purpose.svg') },
    { title: 'Ownership', body: 'We take responsibility from the first idea to the final outcome.', image: I('icon-ownership.svg') },
    { title: 'Continuous Growth', body: 'We embrace learning, change, and better ways of doing things.', image: I('icon-growth.svg') },
  ]);

  seedItemIfEmpty('team', [
    { title: 'Rafiq Hasan', subtitle: 'CEO & Founder', image: U('Rectangle_84.png'), link_1: '#', link_2: '#' },
    { title: 'Nadia Islam', subtitle: 'Product Designer', image: U('Rectangle_84-1.png'), link_1: '#', link_2: '#' },
    { title: 'Tanvir Ahmed', subtitle: 'Tech Lead', image: U('Rectangle_84-2.png'), link_1: '#', link_2: '#' },
  ]);
}

function seedAdminUser() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (count > 0) return null;
  const email = 'himel@polygontechlimited.com';
  const password = 'ForgeMind#' + Math.random().toString(36).slice(2, 8);
  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
    .run('Himel', email, hash, 'admin');
  return { email, password };
}

function run() {
  seedContent();
  seedCollections();
  const created = seedAdminUser();
  if (created) {
    console.log('\n=================================================');
    console.log('Admin account created:');
    console.log('  Email:    ' + created.email);
    console.log('  Password: ' + created.password);
    console.log('Log in at http://localhost:3000/admin/login and');
    console.log('change this password / add teammates from Users.');
    console.log('=================================================\n');
  } else {
    console.log('Users already exist — skipped admin creation.');
  }
  console.log('Seed complete.');
}

run();
