class ChordProgressionRule {
    constructor() {
        this.rule = null;
    }
    getRule(){
        return this.rule;
    }
}

class ChordProgressionRule1 extends ChordProgressionRule {
    constructor() {
        super();
        this.rule = {
            "I": ["I", "ii", "iii", "IV", "V", "vi"],
            "ii": ["ii", "iii", "V"],
            "iii": ["ii", "iii", "vi"],
            "IV": ["I", "IV", "V", "vi"],
            "V": ["I", "IV", "V", "vi"],
            "vi": ["I", "iii", "IV", "V", "vi"],
        };
    }
}

export { ChordProgressionRule, ChordProgressionRule1 };