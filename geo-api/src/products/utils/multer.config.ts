import { diskStorage } from 'multer';
import { extname } from 'path';


// This method will be used to store the file in the uploads folder using the diskStorage method from multer
// The destination property will be used to specify the folder where the file will be stored
export const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const extension = extname(file.originalname);
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${name}-${randomName}${extension}`);
    },
});
