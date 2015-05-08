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
			$('ol li', this).each(function(){
				var id = $(this).find('span.itemValue').text();
				$(this).find('span.itemLabel').wrapInner(" <a class='pw-modal pw-modal-large' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/edit/?id="+id+"&modal=1' target='_blank'></a>").addClass('asmListItemEdit');
				
				if($(this).find('.fa-edit').length == 0) {
					$(this).find('span.itemLabel a').append("&nbsp;<span class='fa fa-edit'>");
				}
				
			});				
		});
	}
	
	function addEditLinkToPageListSelect(selector) {
		$(selector).each(function(){
			$('.InputfieldPageEditButton', this).remove(); // Remove edit button if it already exists
			
			var input = $(this).children('input[type=text]');
			var id = input.val();
			
			if(id > 1) {
				input.after("<span class='InputfieldPageEditButton'><a class='pw-modal pw-modal-large' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/edit/?id="+id+"&modal=1' target='_blank'><i class='fa fa-edit'></i> Edit</a></span>");
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
				selectBox.after("<span class='InputfieldPageEditButton'><a class='pw-modal pw-modal-large' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/edit/?id="+id+"&modal=1' target='_blank'><i class='fa fa-edit'></i> Edit</a></span>");
			};
		});	
	}
	
	function addEditLinksToAsmSelect(selector) {
		$(selector).each(function(){
			$('ol li', this).each(function(){
				var rel = $(this).attr('rel');
				//console.log('rel= '+rel);
				var option = $(this).find('[rel="'+rel+'"]');
				//console.log('option= '+option);
				var id = option.val();
				//console.log('id= '+id);
				$(this).find('span.itemLabel').wrapInner(" <a class='pw-modal pw-modal-large' data-buttons='#submit_save, #submit_publish, #submit_save_unpublished' data-autoclose href='"+config.urls.admin+"page/edit/?id="+id+"&modal=1' target='_blank'></a>").addClass('asmListItemEdit');
				
				if($(this).find('.fa-edit').length == 0) {
					$(this).find('span.itemLabel a').append("&nbsp;<span class='fa fa-edit'>");
				}
			});
		});
	}
	
	
	$(document).ready(function() {
	
		// Find all of the InputfieldSelect page fields that have edit links enabled and add links to them
		$('.InputfieldPage div.InputfieldSelect').each(function() {
			if( $(this).has('.InputfieldPage-editable').length ) {
				addEditLinkToSelect($(this));
				// Call function again for this select whenever there is a change to it
				$(this).change(function() {
					addEditLinkToSelect($(this));
				});
			}
		});
		
		// Find all of the Asm page fields that have edit links enabled and add links to them
		$('.InputfieldPage div.InputfieldPageListSelectMultiple, .InputfieldPage div.InputfieldPageAutocomplete').each(function() {
			// Note: The .InputfieldPage-editable class doesn't show for Page fields using ASM selects, so we can't apply the edit links only on a per-instance basis
			//if( $(this).has('.InputfieldPage-editable').length ) {
				addEditLinksToAsm($(this));
				// Monitor the dom and Re-run the addEditLinks function any time a new item is added to an asmselect
				onDomChange( $(this).find('ol'), addEditLinksToAsm, this );
			//}
		});
		
		// InputfieldPageListSelect
		$('.InputfieldPage div.InputfieldPageListSelect').each(function() {
			if( $(this).has('.InputfieldPage-editable').length ) {
				addEditLinkToPageListSelect($(this));
				$(this).change(function() {
					addEditLinkToPageListSelect($(this));
				});
			}
		});
		
		// AsmSelect
		$('.InputfieldPage div.InputfieldAsmSelect').each(function() {
			if( $(this).has('.InputfieldPage-editable').length ) {
				addEditLinksToAsmSelect($(this));
				onDomChange( $(this).find('ol'), addEditLinksToAsmSelect, this );
			}
		});
		
	});
	