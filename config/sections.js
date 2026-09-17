// Metadata for the generic section editor and dashboard navigation.
// Every entry here corresponds to a `section` value in content_blocks.
const SECTIONS = [
  { key: 'global', label: 'Global Settings', group: 'Global', help: 'Logo, social links, and the header booking button — used across every page.' },
  { key: 'footer', label: 'Footer', group: 'Global', help: 'Footer contact info and copyright line (shown on every page).' },

  { key: 'home_hero', label: 'Hero Section', group: 'Home Page', help: 'The big headline and photo at the top of the home page.' },
  { key: 'home_intro', label: 'Intro Text', group: 'Home Page', help: 'The short intro paragraph under the hero.' },
  { key: 'home_products', label: 'Products (heading)', group: 'Home Page', help: 'Badge, heading and filter tags above the product cards. Manage the cards themselves under Collections → Products.' },
  { key: 'home_services', label: 'Services (heading)', group: 'Home Page', help: 'Badge and heading above the service cards. Manage the cards themselves under Collections → Services.' },
  { key: 'home_process', label: 'Working Process', group: 'Home Page', help: 'The three "Discovery / Build / Launch" steps.' },
  { key: 'home_contact', label: 'Contact Section', group: 'Home Page', help: 'Contact card heading, phone/email/location, and background photo.' },

  { key: 'why_shared', label: 'Why Choose Us', group: 'Shared (Home + About)', help: 'This section appears on both the Home and About pages — editing it here updates both.' },

  { key: 'about_hero', label: 'About Hero', group: 'About Page', help: 'Headline, intro paragraph and photo at the top of the About page.' },
  { key: 'about_stats', label: 'Stats Bar', group: 'About Page', help: 'The four highlight numbers under the About hero.' },
  { key: 'about_story', label: 'Our Story', group: 'About Page', help: 'The "Built by Engineers" story block.' },
  { key: 'about_values', label: 'Core Values (heading)', group: 'About Page', help: 'Badge and heading above the values cards. Manage the cards themselves under Collections → Core Values.' },
  { key: 'about_team', label: 'Meet the Team (heading)', group: 'About Page', help: 'Badge and heading above the team cards. Manage the cards themselves under Collections → Team.' },
  { key: 'about_ceo', label: 'CEO Message', group: 'About Page', help: 'Leadership quote, CEO photo, name and role.' },
  { key: 'about_cta', label: 'Call To Action', group: 'About Page', help: 'The closing "Let\'s Build Something" banner.' },
];

const COLLECTIONS = [
  { key: 'products', label: 'Products', group: 'Home Page', help: 'Cards shown in the "Products We\'re Building" carousel.', fields: ['title', 'subtitle', 'body', 'image'], fieldLabels: { subtitle: 'Pill label (e.g. "In Development")' } },
  { key: 'services', label: 'Services', group: 'Home Page', help: 'The six service cards on the home page. Order here controls the numbering (01, 02, ...).', fields: ['title', 'image'] },
  { key: 'core_values', label: 'Core Values', group: 'About Page', help: 'The value cards on the About page.', fields: ['title', 'body', 'image'], fieldLabels: { image: 'Icon' } },
  { key: 'team', label: 'Team Members', group: 'About Page', help: 'The team cards on the About page.', fields: ['title', 'subtitle', 'image', 'link_1', 'link_2'], fieldLabels: { title: 'Name', subtitle: 'Role', link_1: 'Instagram URL', link_2: 'LinkedIn URL' } },
];

function findSection(key) {
  return SECTIONS.find(s => s.key === key);
}
function findCollection(key) {
  return COLLECTIONS.find(c => c.key === key);
}

module.exports = { SECTIONS, COLLECTIONS, findSection, findCollection };
