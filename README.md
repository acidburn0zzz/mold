# Mold

Dead simple blogging application. A product of getting tired of committing Markdown 
files to my server. For a glimpse check out my [personal site](https://albertocorona.com/).

- Create blog posts in Markdown
- Create sub-pages (About, Contact etc)
- Upload images for use in posts or sub pages

## Setting Up
Mold requires a running mysql/mariadb server and imagemagick. The database can be changed easily thanks 
to Sequelize. Mold can also authenticate with a Google accounts.

For configuration see `config/config.js`

## Running
After changing the default configuration run:

```
npm install
mkdir ssl
gulp gen-ssl
gulp initial-setup
export NODE_ENV=production
npm start
```

The http/https server should be listening on 3000/8080. To change this you can 
set environment variables `HTTP_PORT` and `HTTPS_PORT`. To run this permanently 
check out [`strong-pm`](http://strong-pm.io/)

### Bugs
I'm sure there are creepy crawlies around, this is my first Node application c;
