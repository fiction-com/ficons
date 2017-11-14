define GetFromPkg
$(shell yaml get _config.yml $(1))
endef

PORT := $(call GetFromPkg,server.port)

all: deploy

search:
	hexo searchindex

generate: 
	rm -rf public db.json
	hexo generate

serve:
	$(MAKE) generate
	hexo serve 

serveopen: 
	$(MAKE) generate
	opn http://localhost:$(PORT)/
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
	npm --no-git-tag-version version patch
	hexo deploy
