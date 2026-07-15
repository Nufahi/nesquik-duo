/*
 * Единственная точка настройки пресетов для генерации изображений.
 * Добавляйте объекты в массив ниже, не редактируя разметку страницы.
 *
 * Схема объекта:
 * {
 *     id: "IMAGE_PRESET_ID",
 *     title: "НАЗВАНИЕ_ПОЗЖЕ",
 *     type: "image-preset",
 *     description: "ОПИСАНИЕ_ПОЗЖЕ",
 *     version: "ВЕРСИЯ_ПОЗЖЕ",
 *     downloadUrl: "",
 *     previewImage: "",
 *     objectPosition: "center",
 *     imageFit: "cover", // используйте "contain" только для особых превью
 *     model: "IMAGE_MODEL_NAME",
 *     tags: ["Изображения"]
 * }
 */
window.NESQUIK_IMAGE_PRESETS = [
    {
        id: 'kamtionochnyi-preset',
        title: 'Камтиночный!!! пресет',
        type: 'image-preset',
        description: 'Пресет для генерации изображений',
        version: '',
        downloadUrl: 'assets/downloads/image-presets/Камтиночный!!! пресет.json',
        previewImage: '',
        objectPosition: 'center',
        imageFit: 'cover',
        model: '',
        tags: ['Изображения']
    }
];
