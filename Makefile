.license:
	@echo "Government Purpose Rights (“GPR”)" > LICENSE
	@echo "Contract No.  W911NF-14-D-0005" >> LICENSE
	@echo "Contractor Name:   University of Southern California" >> LICENSE
	@echo "Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001" >> LICENSE
	@echo "Expiration Date:  Restrictions do not expire, GPR is perpetual" >> LICENSE
	@echo "Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) " >> LICENSE
	@echo "No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))" >> LICENSE

.PHONY: license
license: .license node_modules/license-check-and-add
	npm run license:fix

.PHONY: test-license
test-license: .license node_modules/license-check-and-add
	npm run test:license

node_modules/license-check-and-add:
	npm ci

.PHONY: clean
clean:
	rm -rf node_modules

.PHONY: format
format: node_modules/prettier
	npm run format

node_modules/mocha:
	npm ci

node_modules/prettier:
	npm ci

node_modules/eslint:
	npm ci

.PHONY: test
test: node_modules/mocha
	export NODE_PATH=$(shell pwd)/lib \
	&& npm test

PHONY: test-audit
test-audit:
	npm run test:audit

.PHONY: test-format
test-format: node_modules/prettier
	npm run test:format

.PHONY: test-lint
test-lint: node_modules/eslint
	npm run test:lint

.PHONY: test-all
test-all: test-audit test-format test-lint test-license test