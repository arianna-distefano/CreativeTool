
const imgUpload = document.getElementById("img-upload");

// CREATE STAGE
const stage = new Konva.Stage({
    container: 'container',
    width: 1080,
    height: 720
});

// CREATE LAYER
const layer = new Konva.Layer();
stage.add(layer);


// STICKER TRANSFORMER

const tr = new Konva.Transformer({
    rotateEnabled: true,
    enabledAnchors: [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
    ],
    boundBoxFunc: function (oldBox, newBox) {
        // prevent stickers from being too small
        if (newBox.width < 20 || newBox.height < 20) {
            return oldBox;
        }
        return newBox;
    }
});

layer.add(tr);


// UPLOAD IMAGE

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
                draggable: false,
                listening: false
            });

            // set uploaded image as the background
            layer.add(background);
            background.moveToBottom();

            layer.draw();
        };
    };

    reader.readAsDataURL(file);
});


// STICKER BAR

document.querySelectorAll('.asset').forEach(img => {
    img.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('src', e.target.src);
    });
});


// DRAG STICKERS INTO CANVAS

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

        // click to select sticker
        konvaImage.on('click', () => {
            tr.nodes([konvaImage]);
            layer.draw();
        });

        layer.add(konvaImage);
        layer.draw();
    };
});


// CLICK EMPTY SPACE TO DESELECT STICKER

stage.on('click', (e) => {
    if (e.target === stage) {
        tr.nodes([]);
        layer.draw();
    }
});