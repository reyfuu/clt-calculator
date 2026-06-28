class CLTLayerType {
    constructor(materialGrade, thickness, orientation) {
        /**
         * @type {MaterialGrade}
         */
        this.materialGrade = materialGrade;
        this.thickness = thickness; // in mm
        this.orientation = orientation; // 'longitudinal' or 'transverse'
    }
}