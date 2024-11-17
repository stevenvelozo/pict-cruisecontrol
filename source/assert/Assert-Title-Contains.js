const libAssertCondition = require('./Assert-Condition.js');

class AssertCondition extends libAssertCondition
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
		this.conditionName = 'Undefined Assert Condition';
		this.conditionHash = 'Undefined-Assert-Condition';
    }

	assertCondition(pConditionDataObject)
	{
		this.log.trace(`...checking to see if the window title contains the substring [${pConditionDataObject.Text}].`);
		return window.jQuery('title').text().trim().indexOf(pConditionDataObject.Text) > -1;
	}
}

module.exports = AssertCondition;
