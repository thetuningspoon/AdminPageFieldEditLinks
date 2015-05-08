# Page Field Edit Links for ProcessWire
Adds modal editing capability to ProcessWire's Page fields in the admin editor, allowing editors to easily view/edit the content of whichever page(s) have been selected. Edit links are updated in real time. Compatible with Select, AsmSelect, PageListSelect, PageListSelectMultiple, and PageAutoComplete inputfields.

## Instructions
After installation, you will see a new "Show edit links?" option in the Page field configuration. This may be enabled/disabled on a per-field basis.

### Limitations/Issues
1. When using PageListSelect, PageListSelectMultiple, and PageAutoComplete, if there is more than one page field on a given edit page and at least one of them has the edit link feature enabled, all of the Page fields using those inputs will show the edit links.

2. When using the standard AsmSelect, a page save is required before the edit link(s) will be made available.

3. Does not work with checkboxes or radio button inputs. 
