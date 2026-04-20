const imgUpload = document.getElementById("img-upload");

// Create stage
const stage = new Konva.Stage({
    container: 'container',
    width: 1080,
    height: 720
});

// Create layer
const layer = new Konva.Layer();
stage.add(layer);

// Upload handler
imgUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function () {
            const konvaImage = new Konva.Image({
                x: 50,
                y: 50,
                image: img,
                width: img.width / 2,
                height: img.height / 2,
                draggable: true
            });

            layer.add(konvaImage);
            layer.draw();
        };
    };

    reader.readAsDataURL(file);
});