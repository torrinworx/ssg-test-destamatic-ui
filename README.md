# SSG test using destamatic-ui new ssg system and stages

Key features that this demo repo shows:
- [ ] Main single page js app
- [ ] js client side routing
- [ ] ssg pages generated via `npm run build:ssg`
- [ ] demo prod backend server that serves ssg html pages
- [ ] auto dom re-rendering. When js is loaded, we re-mount the web app after html content has been served.
- [ ] ability to define 'index' pages per stage
- [ ] auto page generation for all entries in specifed StageContexts

The idea here is that the clients (users/scrapers/crawlers) initially receive the html file, then when js is run
(usually on a users browser), the js wipes the dom and continues a 'normal' destamatic-ui/destam-dom web app load.

The current system does not include advanced event listeners like onClick, or even styles. Since this ssg system
isn't designed for user facing content. It is purley an SEO tool.
