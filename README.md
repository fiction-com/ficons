# Fiction Blog

This site is built with [hexo](http://hexo.io/). 

Site content is written in Markdown format located in `src`.

All other content should be configurable via the Hexo _config.yml file. 

## Development 
\
First, install needed scripts...
```
# SETUP
$ npm install -g hexo-cli
$ npm install (or yarn)
```

This repository uses a makefile. To run a local server: 
```
# LOCAL SERVER
$ make serve
```

To deploy to the repository (also generates static files)
```
# DEPLOY TO LIVE SITE
$ make deploy
```

Only generate static files to "public" folder...
```
# GENERATE STATIC FILES
$ make generate
```