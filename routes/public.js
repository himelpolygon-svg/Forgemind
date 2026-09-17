const express = require('express');
const router = express.Router();
const { getSection } = require('../db/content');
const { listActive } = require('../db/collections');

function homeData() {
  return {
    global: getSection('global'),
    hero: getSection('home_hero'),
    intro: getSection('home_intro'),
    productsHead: getSection('home_products'),
    products: listActive('products'),
    servicesHead: getSection('home_services'),
    services: listActive('services'),
    why: getSection('why_shared'),
    process: getSection('home_process'),
    contact: getSection('home_contact'),
    footer: getSection('footer'),
    footerServices: listActive('services').slice(0, 5),
  };
}

function aboutData() {
  return {
    global: getSection('global'),
    aboutHero: getSection('about_hero'),
    stats: getSection('about_stats'),
    story: getSection('about_story'),
    valuesHead: getSection('about_values'),
    coreValues: listActive('core_values'),
    teamHead: getSection('about_team'),
    team: listActive('team'),
    why: getSection('why_shared'),
    ceo: getSection('about_ceo'),
    cta: getSection('about_cta'),
    footer: getSection('footer'),
    footerServices: listActive('services').slice(0, 5),
  };
}

router.get(['/', '/index.html'], (req, res) => {
  res.render('public/home', homeData());
});

router.get(['/about', '/about.html'], (req, res) => {
  res.render('public/about', aboutData());
});

module.exports = router;
