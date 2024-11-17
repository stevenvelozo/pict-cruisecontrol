const libWorkflowStep = require('./Workflow-Step.js');

class WorkflowStep extends libWorkflowStep
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
		this.stepName = 'Generic Wait';
    }

	onExecuteStep(fCallback)
	{
		if (!this.AppData.CurrentWorkflowStep.WaitDuration)
		{
			this.log.error('No wait duration specified; waiting 100ms.');
			this.AppData.CurrentWorkflowStep.WaitDuration = 100;
		}
		this.log.trace(`...workflow waiting for ${this.AppData.CurrentWorkflowStep.WaitDuration} milliseconds...`);
		setTimeout(() => {
			this.log.trace(`...workflow waited for ${this.AppData.CurrentWorkflowStep.WaitDuration} milliseconds...`);
			return fCallback();
		}, this.AppData.CurrentWorkflowStep.WaitDuration);
	}
}

module.exports = WorkflowStep;
