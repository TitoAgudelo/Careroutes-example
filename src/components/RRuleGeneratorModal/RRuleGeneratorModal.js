import React from 'react';
import RRuleGenerator from 'react-rrule-generator';
import './RRuleGeneratorModal.scss'

function RRuleGeneratorModal({ handleRecurrence }) {
    return (
        <div className="rrule-generator-modal">
            <RRuleGenerator onChange={handleRecurrence} />
        </div>
    )
}

export default RRuleGeneratorModal;