/**
 * Calculator Panel UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const methodSelect = document.getElementById('methodSelect');
    const gammaSpanContainer = document.getElementById('gammaSpanContainer');
    const addLayerBtn = document.getElementById('addLayerBtn');
    const layersContainer = document.getElementById('layersContainer');
    const calculateBtn = document.getElementById('calculateBtn');
    
    const resultBox = document.getElementById('resultBox');
    const eiResult = document.getElementById('eiResult');
    const errorBox = document.getElementById('errorBox');
    const errorMsg = document.getElementById('errorMsg');

    let layerCount = 0;

    // Toggle Gamma specific inputs
    methodSelect.addEventListener('change', (e) => {
        if (e.target.value === 'gamma') {
            gammaSpanContainer.classList.remove('d-none');
        } else {
            gammaSpanContainer.classList.add('d-none');
        }
        validateLayerCount();
    });

    function createLayerHTML(index) {
        return `
            <div class="layer-item" id="layer-${index}">
                <div class="d-flex justify-content-between mb-2">
                    <h6 class="mb-0">Layer ${index}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger remove-layer" data-id="${index}">Remove</button>
                </div>
                <div class="row g-2">
                    <div class="col-md-3">
                        <label class="form-label small">Thickness (mm)</label>
                        <input type="number" class="form-control form-control-sm layer-thickness" value="40" min="1">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small">E Modulus (MPa)</label>
                        <input type="number" class="form-control form-control-sm layer-e" value="11000">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small">G Modulus (MPa)</label>
                        <input type="number" class="form-control form-control-sm layer-g" value="50">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small">Orientation</label>
                        <select class="form-select form-select-sm layer-orientation">
                            <option value="longitudinal">Longitudinal</option>
                            <option value="transverse">Transverse</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    function addLayer() {
        layerCount++;
        layersContainer.insertAdjacentHTML('beforeend', createLayerHTML(layerCount));
        
        // Default cross-lamination setup (Longitudinal, Transverse, Longitudinal...)
        const orientationSelects = layersContainer.querySelectorAll('.layer-orientation');
        if (orientationSelects.length > 0) {
            const lastSelect = orientationSelects[orientationSelects.length - 1];
            if (layerCount % 2 === 0) {
                lastSelect.value = 'transverse';
            }
        }
        
        validateLayerCount();
    }

    function validateLayerCount() {
        const method = methodSelect.value;
        const currentLayers = layersContainer.children.length;
        
        if (method === 'shear') {
            addLayerBtn.disabled = currentLayers >= 9;
        } else if (method === 'gamma') {
            addLayerBtn.disabled = currentLayers >= 5;
        }
    }

    layersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-layer')) {
            e.target.closest('.layer-item').remove();
            validateLayerCount();
        }
    });

    calculateBtn.addEventListener('click', () => {
        // Hide previous results/errors
        resultBox.classList.add('d-none');
        errorBox.classList.add('d-none');

        try {
            const layup = new CLTLayupType();
            const layerElements = layersContainer.querySelectorAll('.layer-item');
            
            layerElements.forEach(el => {
                const thickness = parseFloat(el.querySelector('.layer-thickness').value) || 0;
                const E = parseFloat(el.querySelector('.layer-e').value) || 0;
                const G = parseFloat(el.querySelector('.layer-g').value) || 0;
                const orientation = el.querySelector('.layer-orientation').value;
                
                const material = new MaterialGrade(`Grade E${E}`, E, G);
                const layer = new CLTLayerType(material, thickness, orientation);
                layup.addLayer(layer);
            });

            const method = methodSelect.value;
            let result;

            if (method === 'shear') {
                const calculator = new ShearAnalogyMethod();
                result = calculator.calculate(layup);
            } else if (method === 'gamma') {
                const spanL = parseFloat(document.getElementById('spanInput').value) || 4000;
                const calculator = new GammaMethod();
                result = calculator.calculate(layup, spanL);
            }
            
            // Format number (e.g. scientific or fixed depending on size, usually it's huge)
            eiResult.textContent = result.EI_eff.toExponential(4);
            resultBox.classList.remove('d-none');

        } catch (error) {
            errorMsg.textContent = error.message;
            errorBox.classList.remove('d-none');
        }
    });

    // Initialize with 3 layers (minimum for both methods)
    addLayer();
    addLayer();
    addLayer();
});