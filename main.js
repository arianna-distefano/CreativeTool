const imgUpload = document.getElementById("img-upload");

// Create stage (UNCHANGED)
const stage = new Konva.Stage({
    container: 'container',
    width: 1080,
    height: 720
});

// Create layer
const layer = new Konva.Layer();
stage.add(layer);

/////////////////////////////////////////////////////
// ✅ ADD TRANSFORMER (THIS IS THE NEW PART)
/////////////////////////////////////////////////////
const tr = new Konva.Transformer({
    rotateEnabled: true,
    enabledAnchors: [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
    ],
    boundBoxFunc: function (oldBox, newBox) {
        // prevent images from being too small
        if (newBox.width < 20 || newBox.height < 20) {
            return oldBox;
        }
        return newBox;
    }
});

layer.add(tr);

/////////////////////////////////////////////////////
// UPLOAD IMAGE
/////////////////////////////////////////////////////
imgUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function () {

            const background = new Konva.Image({
                x: 0,
                y: 0,
                image: img,
                width: stage.width(),
                height: stage.height(),
                draggable: false,   // ❌ cannot move
                listening: false    // ❌ cannot be selected or clicked
            });

            // Put it at the bottom
            layer.add(background);
            background.moveToBottom();

            layer.draw();
        };
    };

    reader.readAsDataURL(file);
});

/////////////////////////////////////////////////////
// SIDEBAR DRAG START
/////////////////////////////////////////////////////
document.querySelectorAll('.asset').forEach(img => {
    img.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('src', e.target.src);
    });
});

/////////////////////////////////////////////////////
// DROP INTO CANVAS
/////////////////////////////////////////////////////
const container = document.getElementById('container');

container.addEventListener('dragover', (e) => {
    e.preventDefault();
});

container.addEventListener('drop', (e) => {
    e.preventDefault();

    const src = e.dataTransfer.getData('src');

    const rect = container.getBoundingClientRect();

    const pos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    const imageObj = new Image();
    imageObj.src = src;

    imageObj.onload = () => {
        const konvaImage = new Konva.Image({
            x: pos.x - 50,
            y: pos.y - 50,
            image: imageObj,
            width: 100,
            height: 100,
            draggable: true
        });

        // ✅ CLICK TO SELECT + RESIZE
        konvaImage.on('click', () => {
            tr.nodes([konvaImage]);
            layer.draw();
        });

        layer.add(konvaImage);
        layer.draw();
    };
});

/////////////////////////////////////////////////////
// CLICK EMPTY SPACE → DESELECT
/////////////////////////////////////////////////////
stage.on('click', (e) => {
    if (e.target === stage) {
        tr.nodes([]);
        layer.draw();
    }
});