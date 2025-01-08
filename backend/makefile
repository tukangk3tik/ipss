
create-module:
	nest generate module $(name)
	nest generate service services/$(name) $(name) --flat
	nest generate controller controllers/$(name) $(name) --flat
	mkdir apps/_gateway/src/$(name)/dtos
	mkdir apps/_gateway/src/$(name)/repositories
	mkdir apps/_gateway/src/$(name)/entities