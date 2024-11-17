const libAssertCondition = require('./Assert-Condition.js');

class AssertCondition extends libAssertCondition
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
		this.conditionName = 'Assert Element Exists';
		this.conditionHash = 'Assert-Element-Exists';
    }

	assertCondition(pConditionDataObject)
	{
		let tmpElementSet = this.pict.ContentAssignment.getElement(pConditionDataObject.ElementAddress);
		this.log.trace(`...checking to see if DOM element [${pConditionDataObject.ElementAddress}] exists.`);

		if (tmpElementSet.length > 0)
		{
			return true;
		}	
		else
		{
			this.log.error(`DOM Element [${pConditionDataObject.ElementAddress}] does not exist.`);
			return false;
		}
	}
}

module.exports = AssertCondition;
