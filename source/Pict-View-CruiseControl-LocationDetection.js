const libPictView = require('pict-view');

class PictCruiseControlLocationDetection extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	// Detect if the DOM has the site loaded
	isAtSite()
	{
		return false;
	}

	// Detect if a specific location is loaded into the DOM
	isAtLocation(pLocationHash)
	{
		return false;
	}

	// Infer the current location(s) loaded into the DOM
	inferLocation()
	{
		return false;
	}
}

module.exports = PictCruiseControlLocationDetection;


/**************************************
 *      Default View Configuration     *
 **************************************/
module.exports.default_configuration =
{
	ViewIdentifier: 'PictCruiseControlLocationDetection',

	DefaultRenderable: 'PictCruiseControl-LocationDetection',
	DefaultDestinationAddress: '#PictCruiseControl_LocationDetection_Container',
	DefaultTemplateRecordAddress: false,

	// If this is set to true, when the App initializes this will.
	// While the App initializes, initialize will be called.
	AutoInitialize: true,
	AutoInitializeOrdinal: 0,

	// If this is set to true, when the App autorenders (on load) this will.
	// After the App initializes, render will be called.
	AutoRender: true,
	AutoRenderOrdinal: 0,

	AutoSolveWithApp: true,
	AutoSolveOrdinal: 0,

	CSS: false,
	CSSPriority: 500,

	Templates:
	[
		{
			Hash: 'PictCruiseControl-LocationDetection-Template',
			Template: /*html*/`
<!-- PictCruiseControl pict view template: [PictCruiseControl-LocationDetection-Template] -->
<!-- PictCruiseControl end view template:  [PictCruiseControl-LocationDetection-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PictCruiseControl-LocationDetection',
			TemplateHash: 'PictCruiseControl-LocationDetection-Template',
			DestinationAddress: '#PictCruiseControl_LocationDetection_Container',
			RenderMethod: 'replace'
		}
	],

	Manifests: {}
};
