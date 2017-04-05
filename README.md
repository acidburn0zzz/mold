# Mold

This is the current WIP branch for mold. For the previous version see the [1.0 tag](https://github.com/0X1A/mold/tree/9313bd528e7498194b05174b6eb62c2626d6b03b)

Dead simple blogging application. A product of getting tired of committing Markdown 
files to my server. For a glimpse check out my [personal site](https://albertocorona.com/).

- Create blog posts in Markdown with a live preview
- Create sub-pages (About, Contact etc)
- Upload images for use in posts or sub pages

## Setting Up
Unfortunately, `sequelize-cli` does not take care of database creation for us.
Since mold uses PostgreSQL you'll have to create these manually, and also 
enable the PostgreSQL extension `uuid-ossp`.

## Running

### Development
After database creation, run these commands:
```
gulp reset
yarn start
```

The default username and password is 'user' and 'password'.

### Production
`TODO`

## REST Server Endpoints

| Verb | Resource | Endpoint | Auth Required | Response |
| ---- | -------- | -------- | ------------- | -------- |
| GET | User | `/api/v1/user` | ✔️️ | Gets the single user |
| PUT | User | `/api/v1/user` | ✔️️ | Updates user information |
| GET | Post | `/api/v1/post` | ✔️️ | Gets all posts, drafts included |
| PUT | Post | `/api/v1/post/:path` | ✔️️ | Updates post information with path `path` |
| DELETE | Post | `/api/v1/post/:path` | ✔️️ | Deletes post information with path `path` |
| GET | Post | `/api/v1/post/published` | | Gets all posts, drafts excluded |
| GET | Post | `/api/v1/post/published/:path` | | Gets a published post with path `path` |
| POST | Post | `/api/v1/post` | ✔️️ | Creates a new post |
| GET | Page | `/api/v1/page ` |  ✔️️ | Gets all pages, drafts included |
| GET | Page | `/api/v1/page/:path` |  ✔️️ | Gets a page with path `path` |
| DELETE | Page | `/api/v1/page/:path` | ✔️️ | Deletes page with path `path` |
| GET | Page | `/api/v1/page/published` | | Gets all published pages |
| GET | Page | `/api/v1/page/published/:path` | | Gets a published page with path `path` |
| GET | Image | `/api/v1/image` | | Gets all image information |
| GET | Image | `/api/v1/image/:id` | | Gets an image's information with id `id` |
| GET | Image | `/api/v1/image/file/:file_name` | | Gets an image file with filename `file_name` |
| POST | Image | `/api/v1/image` | ✔️️ | Creates a new image file |
| GET | Site | `/api/v1/site` | | Gets all information pertaining to the site |
