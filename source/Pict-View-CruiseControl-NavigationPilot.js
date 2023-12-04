const libPictView = require('pict-view');

class PictCruiseControlNavigationPilot extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	// Navigate to a specific location.  Optional scope object with data (for things like identifiers).
	navigateTo(pLocationHash, pLocationScope)
	{
		return false;
	}

	// Perform an action. Optional scope object with data (for things like identifiers or other action state).
	performAction(pActionHash, pActionScope)
	{

	}
}

module.exports = PictCruiseControlNavigationPilot;


/**************************************
 *      Default View Configuration     *
 **************************************/
module.exports.default_configuration =
{
	ViewIdentifier: 'PictCruiseControlNavigationPilot',

	DefaultRenderable: 'PictCruiseControl-NavigationPilot',
	DefaultDestinationAddress: '#PictCruiseControl_NavigationPilot_Container',
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
			Hash: 'PictCruiseControl-NavigationPilot-Template',
			Template: /*html*/`
<!-- PictCruiseControl pict view template: [PictCruiseControl-NavigationPilot-Template] -->
<!-- PictCruiseControl end view template:  [PictCruiseControl-NavigationPilot-Template] -->
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'PictCruiseControl-NavigationPilot',
			TemplateHash: 'PictCruiseControl-NavigationPilot-Template',
			DestinationAddress: '#PictCruiseControl_NavigationPilot_Container',
			RenderMethod: 'replace'
		}
	],

	Manifests: {}
};
