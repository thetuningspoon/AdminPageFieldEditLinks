/**
 * Adds edit links to Page fields so that pages can be added or edited in a modal window without leaving the edit screen
 *
 * @todo: Refactor to consolidate some of the initialization/reload code, switch to object literal style
 *
 * authors: Mike Spooner (thetuningspoon), macrura
 */

function AdminPageFieldEditLinks() {
	var newPageId = 0;

	// Grab the new page ID from the modal window when it closes and trigger a newPageCompleted event on the field it was created for
	$(document).on('pw-modal-closed', '.InputfieldPageNewButton > a', function() {
		var $modalContents = $(document).find('iframe.pw-modal-window').last().contents();
		newPageId = $modalContents.find('#Inputfield_id').val() || 0;
		$field = $(this).closest('.InputfieldPage');
		if(newPageId) {
			$field.trigger('newPageCompleted');
			console.log('New Page: ' + newPageId);
		}
	});

	initEditLinks($('.Inputfields')); // Initialize all of the fields with edit links on the page

	/**
	 * Given a jQuery object, adds edit and new links and attaches event handlers for each the page field element(s) it contains that have those features enabled
	 *
	 * @param wrapper jQuery object that wraps the Page field(s) we want to initialize
	 */
	function initEditLinks($wrapper) {
		// Find all of the InputfieldPage fields that have "add new" links enabled and add links to them (Same for all inputfields)
		$wrapper.find('.InputfieldPage-newPageLink').each(function () {
			addNewLink($(this));
		});


		// Init links for InputfieldSelect
		$wrapper.find('div.InputfieldSelect.InputfieldPage-editLinks').each(function () {
			var $this = $(this);

			addEditLinkToSelect($this);
			// Call function again for this select whenever there is a change to it
			$this.off('change').on('change', function () {
				addEditLinkToSelect($this);
			});
		});
		$wrapper.find('div.InputfieldSelect.InputfieldPage-newPageLink').each(function() {
			// Reload the field when a new page is created and the modal is closed
			$(this).closest('.InputfieldPage').off('newPageCompleted').on('newPageCompleted', function(event) {
				addNewPageToSelect($(this));
			});
		});


		// Init for InputfieldSelectMultiple
		$wrapper.find('div.InputfieldSelectMultiple.InputfieldPage-newPageLink').each(function() {
			// Reload the field when a new page is created and the modal is closed
			$(this).closest('.InputfieldPage').off('newPageCompleted').on('newPageCompleted', function(event) {
				addNewPageToSelectMultiple($(this));
			});
		});


		// Init for InputfieldCheckboxes
		$wrapper.find('div.InputfieldCheckboxes.InputfieldPage-editLinks').each(function () {
			addEditLinksToCheckboxes($(this));
		});
		$wrapper.find('div.InputfieldCheckboxes.InputfieldPage-newPageLink').each(function() {
			// Reload the field when a new page is created and the modal is closed
			$(this).closest('.InputfieldPage').off('newPageCompleted').on('newPageCompleted', function(event) {
				addNewPageToCheckboxes($(this));
			});
		});


		// Init for InputfieldRadios
		$wrapper.find('div.InputfieldRadios.InputfieldPage-editLinks').each(function () {
			addEditLinksToCheckboxes($(this)); // Code is same as checkboxes
		});
		$wrapper.find('div.InputfieldRadios.InputfieldPage-newPageLink').each(function() {
			// Reload the field when a new page is created and the modal is closed
			$(this).closest('.InputfieldPage').off('newPageCompleted').on('newPageCompleted', function(event) {
				addNewPageToRadios($(this));
			});
		});


		// Init links for InputfieldPageAutocomplete
		$wrapper.find('div.InputfieldPageAutocomplete.InputfieldPage-editLinks').each(function() {
			var $this = $(this);

			// Single item
			if ($this.find('.no_list').length) {
				addEditLinkToAutocompleteSingle($this);
				$this.off('change').on('change', function () {
					addEditLinkToAutocompleteSingle($this);
				});
			}
			// Multiple items
			else {
				addEditLinksToBarLists($this);

				// Re-run the addEditLinks function any time a new item is added to the asmselect
				$this.off('change').on('change', function() {
					var $this = $(this);
					setTimeout(function() { // Wait for the item to be added to the list
						addEditLinksToBarLists($this);
					}, 100);
				});
			}
		});
		$wrapper.find('div.InputfieldPageAutocomplete.InputfieldPage-newPageLink').each(function () {
			// Reload the field when a new page is created and the modal is closed
			$(this).closest('.InputfieldPage').off('newPageCompleted').on('newPageCompleted', function(event) {
				if ($(this).find('.no_list').length) {
					addNewPageToAutocompleteSingle($(this));
				}
				else {
					addNewPageToAutocompleteMultiple($(this));
				}
			});
		});


		// Init links for InputfieldPageListSelectMultiple
		$wrapper.find('div.InputfieldPageListSelectMultiple.InputfieldPage-editLinks').each(function () {
			var $this = $(this);
			addEditLinksToBarLists($this);

			// Re-run the function any time a new item is added to the asmselect
			$this.off('change').on('change', function() {
				var $this = $(this);
				setTimeout(function() { // Wait for the item to be added to the list
					addEditLinksToBarLists($this);
				}, 100);
			});
		});
		$wrapper.find('div.InputfieldPageListSelectMultiple.InputfieldPage-newPageLink').each(function () {
			// Reload the field when a new page is created and the modal is closed
			$(this).closest('.InputfieldPage').off('newPageCompleted').on('newPageCompleted', function(event) {
				addNewPageToPageListSelectMultiple($(this));
			});
		});


		// Init links for InputfieldPageListSelect
		$wrapper.find('div.InputfieldPageListSelect.InputfieldPage-editLinks').each(function () {
			var $this = $(this);

			addEditLinkToPageListSelect($this);
			$this.on('change', function () {
				addEditLinkToPageListSelect($this);
			});
		});
		$wrapper.find('div.InputfieldPageListSelect.InputfieldPage-newPageLink').each(function () {
			// Reload the field when a new page is created and the modal is closed
			$(this).closest('.InputfieldPage').on('newPageCompleted', function(event) {
				addNewPageToPageListSelect($(this));
			});
		});


		// Init links for InputfieldAsmSelect
		// Using setTimeout ensures that the asmSelect script loads before we query the DOM. @todo: There might be a better way to do this - watch for init event instead?
		setTimeout(function () {
			$wrapper.find('div.InputfieldAsmSelect.InputfieldPage-editLinks').each(function () {
				var $this = $(this);

				addEditLinksToAsmSelect($this);

				$this.off('change').on('change', function () {
					var $this = $(this);
					setTimeout(function () { // Wait for the item to be added to the list
						addEditLinksToAsmSelect($this);
					}, 100);
				});
			});
			$wrapper.find('div.InputfieldAsmSelect.InputfieldPage-newPageLink').each(function () {
				// Reload the field when a new page is created and the modal is closed
				$(this).closest('.InputfieldPage').off('newPageCompleted').on('newPageCompleted', function(event) {
					addNewPageToAsmSelect($(this));
				});
			});
		}, 100);

	}





	function addEditLinksToBarLists($field) {

		// Add links to Page List Select Multiple and Autocomplete fields
		$field.each(function () {
			$('ol li', $(this)).not('.itemTemplate').each(function () {
				var $this = $(this);
				var id = $this.find('span.itemValue').text();
				$this.find('span.itemLabel').wrapInner(" <a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='" + config.urls.admin + "page/edit/?id=" + id + "&modal=1' target='_blank'></a>").addClass('asmListItemEdit');

				if ($this.find('.fa-search').length == 0) {
					$this.find('span.itemLabel a').append("<i class='fa fa-search' style='margin-left:.5em;'></i>");
				}

			});

		});
	}

	function addEditLinksToCheckboxes($field) {
		// Add links to Page List Select Multiple and Autocomplete fields
		$field.each(function () {
			$('ul li', $(this)).each(function () {
				var $this = $(this);
				var id = $this.find('input').val();

				if($this.find('.fa-search').length == 0) {
					$this.find('span').append("<a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='" + config.urls.admin + "page/edit/?id=" + id + "&modal=1' target='_blank'><i class='fa fa-search' style='margin-left:.5em;'></i></a>");
				}
			});

		});
	}

	function addEditLinkToAutocompleteSingle($field) {
		// Add links to single selection autocompletes

		$field.each(function () {
			$('.InputfieldPageEditButton', this).remove(); // Remove edit button if it already exists

			var selectBox = $(this).find("input[type='text']");
			var id = $(this).find('.InputfieldPageAutocompleteData').val();

			if (id > 1) {
				selectBox.parent().after(" <span class='InputfieldPageEditButton'><a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='" + config.urls.admin + "page/edit/?id=" + id + "&modal=1' target='_blank'><i class='fa fa-search'></i> " + config.AdminPageFieldEditLinks.editPageLabel + "</a></span> ");
			}
		});
	}

	function addEditLinkToPageListSelect($field) {
		$field.each(function () {
			$('.InputfieldPageEditButton', this).remove(); // Remove edit button if it already exists

			var input = $(this).children('input[type=text]');
			var id = input.val();

			if (id > 1) {
				input.after(" <span class='InputfieldPageEditButton'><a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='" + config.urls.admin + "page/edit/?id=" + id + "&modal=1' target='_blank'><i class='fa fa-search'></i> " + config.AdminPageFieldEditLinks.editPageLabel + "</a></span> ");
			}
		});
	}

	function addEditLinkToSelect($field) {
		// Add links to Plain Page Selects

		$field.each(function () {
			$('.InputfieldPageEditButton', this).remove(); // Remove edit button if it already exists

			var selectBox = $(this).find('select');
			var id = $(this).find('select option:selected').val();

			if (id > 1) {
				selectBox.after(" <span class='InputfieldPageEditButton'><a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='" + config.urls.admin + "page/edit/?id=" + id + "&modal=1' target='_blank'><i class='fa fa-search'></i> " + config.AdminPageFieldEditLinks.editPageLabel + "</a></span> ");
			}
		});
	}

	function addEditLinksToAsmSelect($field) {
		$field.each(function () {
			var pageField = $(this);
			$('.asmListItem', this).each(function () {
				var rel = $(this).attr('rel');
				var option = pageField.find('.asmSelect [rel="' + rel + '"]').first();
				var id = option.val();
				$(this).find('span.asmListItemLabel').wrapInner(" <a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='" + config.urls.admin + "page/edit/?id=" + id + "&modal=1' target='_blank'></a>").addClass('asmListItemEdit');

				if ($(this).find('.fa-search').length == 0) {
					$(this).find('span.asmListItemLabel a').append("<i class='fa fa-search' style='margin-left:.5em;'></i>");
				}
			});
		});
	}

	function addNewPageToSelect($field) {
		$field.trigger('reload'); // see inputfields.js for where the reload event is handled

		$field.on('reloaded', function () {
			var $this = $(this);
			var $fieldSelect = $this.find('select[id*="Inputfield_"]');

			// Make the new page that was just created selected.
			if(newPageId) {
				$fieldSelect.removeAttr('selected'); // Remove any existing selection first
				var $match = $fieldSelect.find('option[value="' + newPageId + '"]');
				if ($match.length) {
					$match.attr('selected', 'selected');
				}
			}

			initEditLinks($this); // Reinitialize edit links on the field that was reloaded
		});
	}

	function addNewPageToSelectMultiple($field) {
		var $selectedElements = $field.find('select[id*="Inputfield_"]').find('option:selected'); // Make a copy of the selected elements
		$field.trigger('reload'); // see inputfields.js for where the reload event is handled

		$field.on('reloaded', function () {
			var $this = $(this);
			var $fieldSelect = $this.find('select[id*="Inputfield_"]');

			$selectedElements.each(function () {
				var $this = $(this);
				var pageId = $this.val();

				var $match = $fieldSelect.find('option[value="' + pageId + '"]');
				if ($match.length) {
					$match.attr('selected', 'selected');
				}

				// Add the new page that was just created to the list of selected pages as well
				if(newPageId) {
					var $match = $fieldSelect.find('option[value="' + newPageId + '"]');
					if ($match.length) {
						$match.attr('selected', 'selected');
					}
				}
			});

			initEditLinks($this); // Reinitialize edit links on the field that was reloaded
		});
	}

	function addNewPageToCheckboxes($field) {
		var $selectedElements = $field.find('input[type="checkbox"]:checked'); // Make a copy of the selected elements
		$field.trigger('reload'); // see inputfields.js for where the reload event is handled

		$field.on('reloaded', function () {
			var $field = $(this);

			$selectedElements.each(function () {
				var $this = $(this);
				var pageId = $this.val();

				// Check off existing
				var $match = $field.find('input[value="' + pageId + '"]');
				if ($match.length) {
					$match.attr('checked', true);
				}

				// Add the new page that was just created to the list of selected pages as well
				if(newPageId) {
					var $match = $field.find('input[value="' + newPageId + '"]');
					if ($match.length) {
						$match.attr('checked', true);
					}
				}
			});

			initEditLinks($field); // Reinitialize edit links on the field that was reloaded
		});
	}

	function addNewPageToRadios($field) {
		$field.trigger('reload'); // see inputfields.js for where the reload event is handled

		$field.on('reloaded', function () {
			var $field = $(this);

			// Select the new page
			if(newPageId) {
				$field.find('input[type="radio"]').removeAttr('checked'); // Remove any existing selection first
				var $match = $field.find('input[value="' + newPageId + '"]');
				if ($match.length) {
					$match.attr('checked', true);
				}
			}

			initEditLinks($field); // Reinitialize edit links on the field that was reloaded
		});
	}

	// @todo: Revisit this at some point as the reload here may be unnecessary.
	function addNewPageToPageListSelect($field) {
		$field.trigger('reload'); // see inputfields.js for where the reload event is handled

		$field.on('reloaded', function () {
			var $field = $(this);
			var $dataInputfield = $field.find('.InputfieldPageListSelectData');

			if(newPageId) $dataInputfield.val(newPageId); // Add the new page

			initEditLinks($field); // Reinitialize edit links on the field that was reloaded
		});
	}

	function addNewPageToPageListSelectMultiple($field) {
		var $ol = $field.find('ol');
		var $dataInputfield = $field.find('.InputfieldPageListSelectMultipleData');
		var labelField = $field.find('.findPagesSelector').attr('data-label');

		$.getJSON('./', {action: 'getPageLabel', pageId: newPageId, labelField: labelField}, function (data) {
			var page = {id: newPageId, title: data};
			$dataInputfield.trigger('pageSelected', page);

			$field.find('.InputfieldPageListSelectMultiple').change(); // Trigger edit links to refresh
		});
	}

	function addNewPageToAutocompleteSingle($field) {
		var $ol = $field.find('ol');
		var $dataInput = $field.find('.InputfieldPageAutocompleteData');
		var $textInput = $field.find('input[type="text"]');
		var labelField = $dataInput.attr('data-label');

		$.getJSON('./', {action: 'getPageLabel', pageId: newPageId, labelField: labelField}, function (data) {
			$textInput.val(data).change();
			$textInput.attr('data-selectedLabel', data);
			$textInput.closest('.InputfieldPageAutocomplete')
				.find('.InputfieldPageAutocompleteData').val(newPageId).change();
			$textInput.blur();
		});
	}

	function addNewPageToAutocompleteMultiple($field) {
		var $ol = $field.find('ol');
		var $dataInput = $field.find('.InputfieldPageAutocompleteData');
		var labelField = $dataInput.attr('data-label');

		$.getJSON('./', {action: 'getPageLabel', pageId: newPageId, labelField: ''}, function (data) {
			var page = {page_id: newPageId, label: data};
			InputfieldPageAutocomplete.pageSelected($ol, page);

			$field.find('.InputfieldPageAutocomplete').change(); // Trigger edit links to refresh
		});
	}

	function addNewPageToAsmSelect($field) {
		var $selectedElements = $field.find('select[id*="Inputfield_"]').find('option:selected'); // Make a copy of the selected elements from the input that stores that actual selected options

		$field.trigger('reload'); // see inputfields.js for where the reload event is handled

		$field.off('reloaded').on('reloaded', function () {
			var $this = $(this);

			var $fieldSelect = $this.find('select[id*="Inputfield_"]');

			// Add all of the previously selected items back to the list of selected pages
			$selectedElements.each(function () {
				var $this = $(this);
				var pageId = $this.val();

				var $match = $fieldSelect.find('option[value="' + pageId + '"]');
				if ($match.length) { // If there is a matching element already, make it selected and move it to the bottom of the list so it will be in the order it was before the reload
					$match.detach();
					$match.attr('selected', 'selected');
					$fieldSelect.append($match);
				}
			});

			// Add the new page that was just created to the list of selected pages as well
			if(newPageId) {
				var $match = $fieldSelect.find('option[value="' + newPageId + '"]');
				if ($match.length) {
					$match.detach();
					$match.attr('selected', 'selected');
					$fieldSelect.append($match);
				}
			}

			initEditLinks($this); // Reinitialize edit links on the field that was reloaded
		});
	}

	function addNewLink($field) {
		$field.each(function () {
			$('.InputfieldPageNewButton', this).remove(); // If the button already exists, remove it
			var parentId = $(this).attr('data-parent');
			var templateId = $(this).attr('data-template');

			$(this).append(" <span class='InputfieldPageNewButton'><a class='pw-modal pw-modal-medium' data-buttons='#Inputfield_submit_save, #submit_save, #submit_publish, #submit_save_unpublished' href='" + config.urls.admin + "page/add/?parent_id=" + parentId + "&template_id=" + templateId + "&modal=1' target='_blank'><i class='fa fa-plus-circle'></i> " + config.AdminPageFieldEditLinks.newPageLabel + "</a></span> ");

		});
	}
}

$(document).ready(function() {
	AdminPageFieldEditLinks();
});