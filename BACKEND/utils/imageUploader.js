const cloudinary = require('cloudinary').v2


exports.uploadImageToCloudinary  = async (file, folder, height, quality, isVideo = false) => {
    // Use env variable if folder is not provided
    let targetFolder = folder;
    if (!targetFolder) {
        targetFolder = isVideo ? process.env.CLOUDINARY_FOLDER_VIDEO : process.env.CLOUDINARY_FOLDER_NAME;
    }
    const options = { folder: targetFolder };
    if(height) {
        options.height = height;
    }
    if(quality) {
        options.quality = quality;
    }
    options.resource_type = isVideo ? "video" : "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}