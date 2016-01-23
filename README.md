# Page Field Edit Links for ProcessWire
Adds modal editing capability to ProcessWire's Page fields in the admin editor, allowing editors to easily view and edit the content of any page(s) that have been selected, as well as create new pages without leaving the current screen. Edit links are updated in real time when new pages are added to the field. Compatible with all available types of Inputfields including Select, SelectMultiple, Checkboxes, Radios, AsmSelect, PageListSelect, PageListSelectMultiple, and PageAutocomplete.

Also see https://github.com/thetuningspoon/AdminModalception for improved UI when working with nested modals.

## Instructions
After installation, you will see new options for "Enable view/edit links on selected pages?" and "Enable link to create new pages?" in the Page field configuration. These settings may be enabled/disabled on a per-field basis. The labels for these links are translatable, if you wish to change them.

## New in version 3.0
Removes the limitations of the previous releases!

* Now compatible with all Inputfield types including Select, SelectMultiple, Checkboxes, Radios, AsmSelect, PageListSelect, PageListSelectMultiple, and PageAutocomplete.

* When using the create new page feature, new pages are added to the field and selected automatically as soon as the modal is closed. No further input is required from the user. 

* The "View" and "+ New" strings are now translatable

* The add new page links may be enabled independent of the view/edit links 

* Code performance improvements
