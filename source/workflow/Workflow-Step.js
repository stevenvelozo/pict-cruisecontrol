const libFableService = require('fable-serviceproviderbase');

/**
 * Class representing a workflow step.
 * @extends libFableService
 */
class WorkflowStep extends libFableService
{
	/**
	 * Create a workflow step.
	 * @param {Object} pFable - The Fable service instance.
	 * @param {Object} pOptions - The options for the service.
	 * @param {string} pServiceHash - The service hash.
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.serviceType = 'WorkflowStep';
		this.stepName = 'Undefined Workflow Step';
		this.stepHash = 'Undefined-Workflow-Step';

		this.stepState = {};

		this.beforeStartAssertions = [];
		this.beforeStartDelay = 0;
		this.beforeStartAssertionState = {};
		this.beforeStartRetryDelay = 10;
		this.beforeStartRetryCount = 10000;

		this.nextStepHash = false;
		this.nextStepDelay = 0;
		this.nextStepAssertionState = {};
		this.nextStepAssertions = [];
		this.nextStepRetryDelay = 10;
		this.nextStepRetryCount = 10000;

		// For convenience.
		this.pict = this.fable;
	}

	onBeforeExecuteStep(fCallback)
	{
		return fCallback();
	}

	/**
	 * Execute the workflow step.
	 * @param {Function} fCallback - The callback function to execute after the step.
	 * @returns {Function} The callback function.
	 */
	onExecuteStep(fCallback)
	{
		this.log.error(`onExecuteStep for ${this.stepHash} (${this.stepName}) is not implemented.`);
		return fCallback();
	}

	onAfterExecuteStep(fCallback)
	{
		return fCallback();
	}
}

module.exports = WorkflowStep;

module.exports.default_configuration = (
	{
	});