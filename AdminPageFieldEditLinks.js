/**
 * 
 * Adds edit links to Page fields which use AsmSelect, Select, PageListSelect, PageListSelectMultiple, or PageAutoComplete
 *
 * authors: thetuningspoon, macrura
 */
	
	// Watches the html content of the selector and executes the callback function if it changes
	function onDomChange(selector, callback, callbackArg) {
		var originalHtml = $(selector).html();
		  var timeout = window.setInterval(function(){
		
		      if($(selector).html() == originalHtml) {
		          //console.log('no change');
		      } else {
		          //console.log('changed!');
		          clearInterval(timeout);
		          if(callback) callback(callbackArg);
		          onDomChange(selector, callback, callbackArg); // Loop
		      }
		      		
		  }, 1000);
	}

	function addEditLinksToAsm(selector) {

		// Add links to Page List Select Multiple and Autocomplete fields
		$(selector).each(function(){
			var selectBox = $(this).find("input[type='text']");
			
			$('ol li', this).each(function(){
				var id = $(this).find('span.itemValue').text();
				$(this).find('span.itemLabel').wrapInner(" <a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/edit/?id="+id+"&modal=1' target='_blank'></a>").addClass('asmListItemEdit');
				
				if($(this).find('.fa-search').length == 0) {
					$(this).find('span.itemLabel a').append("&nbsp;<span class='fa fa-search'>");
				}
				
			});		
								
		});
	}
	
	function addEditLinkToAutocompleteSingle(selector) {
		// Add links to single selection autocompletes
		
		$(selector).each(function(){
			$('.InputfieldPageEditButton', this).remove(); // Remove edit button if it already exists
			
			var selectBox = $(this).find("input[type='text']");
			var id = $(this).find('.InputfieldPageAutocompleteData').val();
			
			if(id > 1) {
				selectBox.parent().after(" <span class='InputfieldPageEditButton'><a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/edit/?id="+id+"&modal=1' target='_blank'><i class='fa fa-search'></i> View</a></span> ");
			};
		});	
	}
	
	function addEditLinkToPageListSelect(selector) {
		$(selector).each(function(){
			$('.InputfieldPageEditButton', this).remove(); // Remove edit button if it already exists
			
			var input = $(this).children('input[type=text]');
			var id = input.val();
			
			if(id > 1) {
				input.after(" <span class='InputfieldPageEditButton'><a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/edit/?id="+id+"&modal=1' target='_blank'><i class='fa fa-search'></i> View</a></span> ");
			};
		});	
	}
		
	function addEditLinkToSelect(selector) {
		// Add links to Plain Page Selects
		
		$(selector).each(function(){
			$('.InputfieldPageEditButton', this).remove(); // Remove edit button if it already exists
			
			var selectBox = $(this).find('select');
			var id = $(this).find('select option:selected').val();
			
			if(id > 1) {
				selectBox.after(" <span class='InputfieldPageEditButton'><a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/edit/?id="+id+"&modal=1' target='_blank'><i class='fa fa-search'></i> View</a></span> ");
			};
		});	
	}
	
	function addEditLinksToAsmSelect(selector) {
		/*$(selector).each(function(){
			var selectBox = $(this).find("input[type='text']");
			
			$('ol li', this).each(function(){
				var id = $(this).find('span.itemValue').text();
				$(this).find('span.itemLabel').wrapInner(" <a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/edit/?id="+id+"&modal=1' target='_blank'></a>").addClass('asmListItemEdit');
				
				if($(this).find('.fa-search').length == 0) {
					$(this).find('span.itemLabel a').append("&nbsp;<span class='fa fa-search'>");
				}
				
			});		
								
		});
		*/
		$(selector).each(function() {
			var pageField = $(this);
			$('.asmListItem', this).each(function() {
				var rel = $(this).attr('rel');
				//console.log('rel= '+rel);
				var option = pageField.find('.asmSelect [rel="'+rel+'"]').first();
				//console.log('option= '+option);
				var id = option.val();
				//console.log('id= '+id);
				$(this).find('span.asmListItemLabel').wrapInner(" <a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/edit/?id="+id+"&modal=1' target='_blank'></a>").addClass('asmListItemEdit');
				
				if($(this).find('.fa-search').length == 0) {
					$(this).find('span.asmListItemLabel a').append("&nbsp;<span class='fa fa-search'>");
				}
			});
		});
	}
	
	function addNewLink(selector) {
		$(selector).each(function() {
			$('.InputfieldPageNewButton', this).remove(); // If the button already exists, remove it
			var parentId = $(this).attr('data-parent');
			var templateId = $(this).attr('data-template');
		
			$(this).append(" <span class='InputfieldPageNewButton'><a class='pw-modal pw-modal-medium' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/add/?parent_id="+parentId+"&template_id="+templateId+"&modal=1' target='_blank'><i class='fa fa-plus-circle'></i> New</a></span> ");
		});
	}
	
	
	$(document).ready(function() {
	
		// Find all of the InputfieldPage fields that have "add new" links enabled and add links to them
		$('.InputfieldPage .InputfieldPage-newPageLink').each(function() {
			addNewLink($(this));
		});
	
		// Find all of the InputfieldSelect page fields that have edit links enabled and add links to them
		$('.InputfieldPage div.InputfieldSelect.InputfieldPage-editLinks').each(function() {
			addEditLinkToSelect($(this));
			// Call function again for this select whenever there is a change to it
			$(this).change(function() {
				addEditLinkToSelect($(this));
			});
		});
		
		// Find all of the Asm page fields that have edit links enabled and add links to them
		$('.InputfieldPage div.InputfieldPageListSelectMultiple.InputfieldPage-editLinks, .InputfieldPage div.InputfieldPageAutocomplete.InputfieldPage-editLinks').each(function() {
			if($(this).find('.no_list').length) { // This is a single item select instead of list
				addEditLinkToAutocompleteSingle($(this));
				$(this).change(function() {
					addEditLinkToAutocompleteSingle($(this));
				});
				//onDomChange( $(this).find('ol'), addEditLinkToAutocompleteSingle, this );
			}
			else {
				addEditLinksToAsm($(this));
				// Monitor the dom and Re-run the addEditLinks function any time a new item is added to an asmselect
				onDomChange( $(this).find('ol'), addEditLinksToAsm, this );
			}		
		});
		
		// InputfieldPageListSelect
		$('.InputfieldPage div.InputfieldPageListSelect.InputfieldPage-editLinks').each(function() {
			addEditLinkToPageListSelect($(this));
			$(this).change(function() {
				addEditLinkToPageListSelect($(this));
			});
		});
		
		// Crazy hack alert: Using setTimeout ensures that the asmSelect script loads before we query the DOM. @todo: There's got to be a better way to do this
		setTimeout(function() {
			$('.InputfieldPage div.InputfieldAsmSelect.InputfieldPage-editLinks').each(function() {
				addEditLinksToAsmSelect($(this));
				onDomChange( $(this).find('ol'), addEditLinksToAsmSelect, this );
			});
		}, 100);
		
	});