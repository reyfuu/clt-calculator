class CLTLayupType {
    constructor() {
        this.name = 'CLT Layup';
        /**
         * @type {CLTLayerType[]}
         */
        this.layers = [];
    }

    addLayer(layer) {
        this.layers.push(layer);
    }
    
    getLayers() {
        return this.layers;
    }

    isSymmetric() {
        if (this.layers.length === 0) return true;
        const n = this.layers.length;
        for (let i = 0; i < Math.floor(n / 2); i++) {
            const top = this.layers[i];
            const bottom = this.layers[n - 1 - i];
            if (top.thickness !== bottom.thickness || 
                top.orientation !== bottom.orientation || 
                top.materialGrade.E !== bottom.materialGrade.E) {
                return false;
            }
        }
        return true;
    }
}