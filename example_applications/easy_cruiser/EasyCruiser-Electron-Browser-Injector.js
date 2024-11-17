/*
 * This file is part of the Easy Cruiser application.
 *
 * Hotload a page into another page and follow it around.
 */
console.log('EasyCruiser injection waiting for DocumentReady event...');

// Simple javascript-only initialization on document ready status.
// Taken from the pict code.
function onDocumentReady(fApplicationInitialize)
{
	console.log('EasyCruiser onDocumentReady firing.');
	// In case the document is already rendered
	if (document.readyState!='loading') fApplicationInitialize();
	// Modern browsers have event listener capabilities
	else if (document.addEventListener) document.addEventListener('DOMContentLoaded', fApplicationInitialize);
	// IE <= 8 and ... other abominations
	else document.attachEvent('onreadystatechange', function() { if (document.readyState=='complete') fApplicationInitialize(); });
}

function initializeInjectedApplication()
{
	// Create the style tag in the head for pict styles
	let tmpStyles = document.createElement("style");
	tmpStyles.id = "PICT-CSS";
	document.head.appendChild(tmpStyles);

	// Construct the pict instance and set it on the window object explicitly
	let tmpPict = new Pict(window.InjectedApplication.pict_configuration);
	// Set _Pict on the window object explicitly
	window._Pict = tmpPict;
	//tmpPict.LogNoisiness = 2;
	tmpPict.log.info('Pict initialized.  Loading the application.');
	tmpPict.addApplication('EasyCruiser', window.InjectedApplication.default_configuration, window.InjectedApplication);
	tmpPict.InjectedApplication.initializeAsync(
		function (pError)
		{
			if (pError)
			{
				_Pict.log.error('Error initializing injected application: '+pError)
			}
			else
			{
				_Pict.log.info('Injected web application and associated views initialized.');
			}
		});

	return true;
}

onDocumentReady(initializeInjectedApplication);
