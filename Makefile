all: deploy

search:
	export HEXO_ALGOLIA_INDEXING_KEY=d91c42913ac7b724ea0876609575339b
	hexo algolia

generate: 
	rm -rf public db.json
	hexo generate

serve: 
	$(MAKE) generate
	hexo serve 

servedebug: 
	$(MAKE) generate
	hexo serve --debug

servestatic: 
	$(MAKE) generate
	hexo serve -s

deploy:
	npm install 
	$(MAKE) generate
	$(MAKE) search
	hexo deploy
