const libFableService = require('fable-serviceproviderbase');

const libWorkflowStep = require('./workflow/Workflow-Step.js');

const libAssertCondition = require('./assert/Assert-Condition.js');
const libAssertCondition = require('./assert/Assert-Element-Exists.js');
const libAssertCondition = require('./assert/Assert-Title-Contains.js');

const libStepWait = require('./workflow/Generic-Step-Wait.js');

const _DefaultConfiguration = (
	{
	});

class FableCruiseControl extends libFableService
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.serviceType = 'CruiseControl';

		this.fable.addServiceTypeIfNotExists('AssertCondition', libAssertCondition);
		this.fable.addServiceTypeIfNotExists('WorkflowStep', libWorkflowStep);
		// For convenience.
		this.pict = this.fable;

		this.workflowSteps = {};

		this.workflowSteps.Wait = this.addWorkflowStep('Wait', libStepWait);

		this.workflowAssertions = {};

		this.addAssertion('TitleContains', require('./assert/Assert-Title-Contains.js'));
		this.addAssertion('ElementExists', require('./assert/Assert-Element-Exists.js'));
	}

	addAssertion(pAssertionHash, pAssertionPrototype)
	{
		if (pAssertionHash in this.workflowAssertions)
		{
			this.log.warn(`Assertion [${pAssertionHash}] already exists -- it will be overwritten.`);
		}
		this.workflowAssertions[pAssertionHash] = this.fable.instantiateServiceProviderFromPrototype('AssertCondition', {}, pAssertionHash, pAssertionPrototype);
	}

	addWorkflowStep(pStepHash, pStepPrototype)
	{
		if (pStepHash in this.workflowSteps)
		{
			this.log.warn(`Workflow step [${pStepHash}] already exists -- it will be overwritten.`);
		}
		this.workflowSteps[pStepHash] = this.fable.instantiateServiceProviderFromPrototype('WorkflowStep', {}, pStepHash, pStepPrototype);
	}

	startWorkflow(pWorkflowStep, fCallback)
	{
		let tmpCallback = (typeof(fCallback) === 'function') ? fCallback : ()=>{};

		this.fable.services.CruiseControlStateManagement.resetWorkflow();
		this.fable.services.CruiseControlStateManagement.getStoredWorkflow();
		if (!this.pict.AppData.CurrentWorkflow)
		{
			this.log.error(`No workflow is available while attempting to start workflow.`);
			return fCallback();
		}
		let tmpWorkflowState = {};
		this.initializeWorkflowState(tmpWorkflowState);
		this.setStepState('Inactive');
		this.executeWorkflowStep(tmpCallback, pWorkflowStep);
	}

	initializeWorkflowState(pWorkflowState)
	{
		this.fable.services.CruiseControlStateManagement.getStoredWorkflow();
		if (!this.pict.AppData.CurrentWorkflow)
		{
			this.log.error(`No workflow is available while attempting to initialize workflow state.`);
			return tmpCallback();
		}

		this.pict.AppData.CurrentWorkflow.State = pWorkflowState;
	}

	checkAndExecuteWorkflow(fCallback)
	{
		let tmpCallback = (typeof(fCallback) === 'function') ? fCallback : ()=>{};

		this.log.trace(`Checking and executing workflow...`, this.pict.AppData);

		if (!this.pict.AppData.CurrentWorkflow)
		{
			this.fable.services.CruiseControlStateManagement.getStoredWorkflow();
			if (!this.pict.AppData.CurrentWorkflow)
			{
				this.log.error(`No workflow is available.`);
				return tmpCallback();
			}
		}

		let tmpWorkflow = this.pict.AppData.CurrentWorkflow;

		// Check that the workflow is active
		if (!tmpWorkflow.Active)
		{
			this.log.trace(`Workflow [${tmpWorkflow.CurrentWorkflowName}] is not active; current step is ${tmpWorkflow.CurrentWorkflowStep} (${tmpWorkflow.CurrentWorkflowStepName}).`);
			return tmpCallback();
		}

		// Check that the current workflow step is valid
		if (!tmpWorkflow.CurrentWorkflowStep in this.workflowSteps)
		{
			this.log.error(`Workflow step [${tmpWorkflow.CurrentWorkflowStep}] is not a valid step hash.`);
			return tmpCallback();
		}

		if (tmpWorkflow.CurrentWorkflowStepStatus === 'NotRun')
		{
			this.executeWorkflowStep(tmpCallback, this.workflowSteps[tmpWorkflow.CurrentWorkflowStep]);
		}
	}

	setStepState(pStepState)
	{
		this.pict.AppData.CurrentWorkflow.State = pStepState;
		this.fable.services.CruiseControlStateManagement.storeCurrentWorkflow();
	}

	executeWorkflowStep(fCallback, pWorkflowStep)
	{
		// Try to execute the current workflow step
		let tmpAnticipate = this.fable.newAnticipate();

		let tmpCurrentStep = this.workflowSteps[pWorkflowStep];

		if (!tmpCurrentStep)
		{
			this.log.error(`Workflow step [${pWorkflowStep}] is not a valid step hash; workflow aborting.`);
			return fCallback();
		}

		if (this.pict.AppData.CurrentWorkflow.State == 'Inactive')
		{
			// Execute the on before workflow
			tmpAnticipate.anticipate(
				function (fNext)
				{
					let tmpCurrentStep = this.workflowSteps[pWorkflowStep];
					this.setStepState('PreExecution');
					this.log.trace(`Cruise Control workflow onBeforeExecuteStep ${tmpCurrentStep.stepName} [${tmpCurrentStep.stepHash}].`);
					tmpCurrentStep.onBeforeExecuteStep(fNext);
				}.bind(this));

			// Execute the actual workflow step
			tmpAnticipate.anticipate(
				function (fNext)
				{
					let tmpCurrentStep = this.workflowSteps[pWorkflowStep];
					this.setStepState('Executing');
					this.log.trace(`Cruise Control workflow executing step ${tmpCurrentStep.stepName} [${tmpCurrentStep.stepHash}].`);
					tmpCurrentStep.onExecuteStep(
						function()
						{
							return this.executeWorkflowStep(fNext, pWorkflowStep);
						}.bind(this));
				}.bind(this));
		}

		if (this.pict.AppData.CurrentWorkflow.State == 'Executing')
		{
			// Execute the after on after workflow
			tmpAnticipate.anticipate(
				function (fNext)
				{
					let tmpCurrentStep = this.workflowSteps[pWorkflowStep];
					this.setStepState('PostExecution');
					this.log.trace(`Cruise Control workflow onAfterExecuteStep ${tmpCurrentStep.stepName} [${tmpCurrentStep.stepHash}].`);
					tmpCurrentStep.onAfterExecuteStep(fNext);
				}.bind(this));

			// If there is a delay set, wait.
			if (tmpCurrentStep.nextStepDelay > 0)
			{
				tmpAnticipate.anticipate(
					function (fNext)
					{
						this.setStepState('Waiting');
						let tmpCurrentStep = this.workflowSteps[pWorkflowStep];
						this.log.trace(`...workflow waiting for ${tmpCurrentStep.nextStepDelay} milliseconds based on nextStepDelay...`);
						setTimeout(
							function()
							{
								this.setStepState('CheckingPostAssertions');
								return fNext();
							}.bind(this), tmpCurrentStep.nextStepDelay);
					}.bind(this));
			}

			// Then run the next step.
			tmpAnticipate.anticipate(
				function (fNext)
				{
					let tmpCurrentStep = this.workflowSteps[pWorkflowStep];
					this.setStepState('Completed');
					if (tmpCurrentStep.nextStepHash)
					{
						this.setStepState('Inactive');
						this.log.trace(`...workflow executing next step [${tmpCurrentStep.nextStepHash}]...`);
						this.executeWorkflowStep(fNext, tmpCurrentStep.nextStepHash);
					}
					else
					{
						this.log.trace(`...workflow has no next step -- workflow complete!`);
						return fNext();
					}
				}.bind(this));
		}

		// If there are assertions to be made after, make them and retry if they fail for retry count.
		// if (tmpCurrentStep.nextStepAssertions.length > 0)
		// {
		// 	tmpAnticipate.anticipate(
		// 		function (fNext)
		// 		{
		// 			let tmpAssertionsPassed = true;
		// 			for (let i = 0; i < tmpCurrentStep.nextStepAssertions.length; i++)
		// 			{
		// 				let tmpAssertion = tmpCurrentStep.nextStepAssertions[i];
		// 				if (!tmpAssertion.executeAssertion(this.pict.AppData.CurrentWorkflow.State))
		// 				{
		// 					tmpAssertionsPassed = false;
		// 					break;
		// 				}
		// 			}
		// 			if (!tmpAssertionsPassed)
		// 			{
		// 				this.log.trace(`...workflow assertions failed; retrying in ${tmpCurrentStep.nextStepRetryDelay} milliseconds...`);
		// 				setTimeout(fNext, tmpCurrentStep.nextStepRetryDelay);
		// 			}
		// 		}.bind(this));
		// }

		tmpAnticipate.wait(fCallback);
	}
}

module.exports = FableCruiseControl;

module.exports.WorkflowStep = libWorkflowStep;
module.exports.AssertCondition = libAssertCondition;

module.exports.BrowserStateManagement = require('./Pict-CruiseControl-BrowserStateManagement.js');

module.exports.default_configuration = (
	{
	});