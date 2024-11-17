const libFableService = require('fable-serviceproviderbase');

const _DefaultConfiguration = (
	{
		"DefaultWorkflowState": 	{
				Active: false,
				CurrentWorkflowName: 'No active workflow.',
				CurrentWorkflowStep: 'Inactive',
				CurrentWorkflowStepName: 'No active workflow.',
				CurrentWorkflowStepStatus: 'NotRun',
				CurrentWorkflowStepExitRetryCount: 0
			}
	});

class FableCruiseControlBrowserStateManagement extends libFableService
{
    constructor(pFable, pOptions, pServiceHash)
    {
		let tmpOptions = Object.assign({}, _DefaultConfiguration, pOptions);
        super(pFable, tmpOptions, pServiceHash);
        this.serviceType = 'CruiseControl';
		// For convenience.
		this.pict = this.fable;
    }

	/**
	 * Creates a new workflow object.
	 * @returns {Object} The new workflow object.
	 */
	createNewWorkflow()
	{
		return JSON.parse(JSON.stringify(this.options.DefaultWorkflowState));
	}

	/**
	 * Resets the workflow state in AppData and local storage.
	 * @returns boolean
	 */
	resetWorkflow()
	{
		this.pict.AppData.CurrentWorkflow = this.createNewWorkflow();
		return this.deleteStoredWorkflow();
	}

	/**
	 * Validates the current workflow for storage... if this returns false, it gets reset.
	 * @returns boolean
	 */
	validateCurrentWorkflowForStorage()
	{
		return true;
	}

	/**
	 * Stores the current workflow in local browser storage as JSON.
	 */
	storeCurrentWorkflow()
	{
		window.localStorage.setItem('PictCruiseControlWorkflow', JSON.stringify(this.pict.AppData.CurrentWorkflow));
	}

	/**
	 * Fetches stored workflow from browser local storage and puts it in AppData.
	 * @returns boolean
	 */
	getStoredWorkflow()
	{
		let tmpWorkflow = window.localStorage.getItem('PictCruiseControlWorkflow');

		if (tmpWorkflow)
		{
			try
			{
				this.pict.AppData.CurrentWorkflow = JSON.parse(tmpWorkflow);
				return true;
			}
			catch (pError)
			{
				this.log.error(`Error parsing stored Cruise Control workflow: ${pError}`, pError);
				return this.resetWorkflow();
			}
		}
		else
		{
			return this.resetWorkflow();
		}
	}

	deleteStoredWorkflow()
	{
		window.localStorage.removeItem('PictCruiseControlWorkflow');
		return true;
	}
}

module.exports = FableCruiseControlBrowserStateManagement;

module.exports.default_configuration = _DefaultConfiguration;