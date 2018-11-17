'use strict';

module.exports = function(app) {
  var router = app.loopback.Router();

  router.get('/overview', function(req, res) {
    res.render('overview');
  });

  router.get('/partners', function(req, res) {
    res.render('partners');
  });

  router.get('/partners/new', function(req, res) {
    res.render('partners-new');
  });

  router.post('/partners/new', function(req, res) {
    const Partner = app.models.Partner;

    return Partner.create(req.body)
      .then(ignore => res.redirect('/partners'))
      .catch(ignore => res.redirect('/partners'));
  });

  router.get('/partners/login', function(req, res) {
    res.render('partners/login');
  });

  router.get('/partners/overview', function(req, res) {
    res.render('partners/overview');
  });

  router.post('/partners/login', function(req, res) {
    const Partner = app.models.Partner;
    console.log(req.body);

    return Partner.login(req.body)
      .then(partner => {
        console.log(partner);
        res.cookie('partner_id', partner.id);
        res.set('X-Partner-ID', partner.id);
        res.redirect('/partners/overview')
      })
      .catch(failed => res.redirect('/partners/login'));
  });

  router.get('/partners/menu', function(req, res) {
    res.render('partners/menu');
  });

  router.get('/partners/:partnerId', function(req, res) {
    const Partner = app.models.Partner;

    return Partner.findById(req.params.partnerId)
      .then(partner => res.render('partners-edit', { partner, }))
  });


  router.post('/partners/menu', function(req, res) {
    const Menu = app.models.Menu;

    return Menu.create({
      ...req.body,
      partnerId: req.cookies.partner_id,
    })
      .then(menu => res.redirect('/partners/menu'))
      .catch(err => {
        console.log(err);
        res.redirect('/partners/menu/new')
      })
  });

  router.post('/partners/:partnerId', function(req, res) {
    const Partner = app.models.Partner;

    return Partner.findById(req.params.partnerId)
      .then(currentPartner => {
        return Partner.upsert({
          id: currentPartner.id,
          ...req.body,
        })
      })
      .then(ignore => res.redirect(`/partners/${req.params.partnerId}`))
      .catch(err => {
        console.log(err);
        res.redirect(`/partners/${req.params.partnerId}`)
      })
  });

  router.get('/partners/menu/new', function(req, res) {
    res.render('partners/menu-new');
  });

  router.get('/partners/menu/:menuId', function(req, res) {
    const Menu = app.models.Menu;

    return Menu.findById(req.params.menuId)
      .then(menu => res.render('partners/menu-edit', { menu, }))
  });

  app.use(router);
};
