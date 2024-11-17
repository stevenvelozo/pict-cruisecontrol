const libFableService = require('fable-serviceproviderbase');

/**
 * Class representing an assertion condition for workflow steps.
 * @extends libFableService
 */
class AssertCondition extends libFableService
{
	/**
	 * Creates an instance of AssertCondition.
	 * @param {Object} pFable The fable object.
	 * @param {Object} pOptions The options object.
	 * @param {string} pServiceHash The service hash object.
	 * @memberof AssertCondition
	 * @constructor
	 */
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
        this.serviceType = 'AssertCondition';
		this.conditionName = 'Undefined Assert Condition';
		this.conditionHash = 'Undefined-Assert-Condition';

		// For convenience.
		this.pict = this.fable;
    }

	/**
	 * 
	 * @param {Object} pConditionDataObject The object parameters that will be used to assert the condition.
	 * @returns boolean
	 */
	assertCondition(pConditionDataObject)
	{
		this.log.error(`assertCondition for ${this.conditionHash} (${this.conditionName}) is not implemented.`);
		return false;
	}
}

module.exports = AssertCondition;

module.exports.default_configuration = (
	{
	});