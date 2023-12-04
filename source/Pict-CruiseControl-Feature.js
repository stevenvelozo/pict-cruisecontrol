const libPictView = require('pict-view');

const libLocationDetection = require('./Pict-View-CruiseControl-LocationDetection.js');
const libNavigationPilot = require('./Pict-View-Cruisecontrol-NavigationPilot.js');

class PictCruiseControl extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// Create two child views, bound to this one to provide complex functionality
		this.LocationDetection = this.pict.addView(`LocationDetection-${this.UUID}`, libLocationDetection.default_configuration, libLocationDetection);
		this.NavigationPilot = this.pict.addView(`NavigationPilot-${this.UUID}`, libNavigationPilot.default_configuration, libNavigationPilot);
	}
}

module.exports = PictCruiseControl;


/**************************************
 *      Default View Configuration     *
 **************************************/
module.exports.default_configuration =
{
	ViewIdentifier: 'PictCruiseControl',

	DefaultRenderable: 'PictCruiseControl',
	DefaultDestinationAddress: '#PictCruiseControl_Container',
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
			Hash: 'PictCruiseControl-Template',
			Template: /*html*/`
<!-- PictCruiseControl pict view template: [PictCruiseControl-Template] -->
<!-- PictCruiseControl end view template:  [PictCruiseControl-Template] -->
`,
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'PictCruiseControl',
			TemplateHash: 'PictCruiseControl-Template',
			DestinationAddress: '#PictCruiseControl_Container',
			RenderMethod: 'replace'
		},
	],

	Manifests: {}
};
