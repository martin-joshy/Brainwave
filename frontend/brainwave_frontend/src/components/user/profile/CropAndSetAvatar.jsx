import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDispatch } from 'react-redux';
import { uploadCroppedAvatar } from '../common/userProfileSlice';

// eslint-disable-next-line react/prop-types
const CropAndSetAvatar = ({ setOpen }) => {
  const editor = useRef(null);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (editor.current) {
      const canvasScaled = editor.current.getImageScaledToCanvas();
      const dataURL = canvasScaled.toDataURL('image/png');

      const res = await fetch(dataURL);
      const blob = await res.blob();

      const croppingRect = editor.current.getCroppingRect();

      setOpen(false);

      dispatch(uploadCroppedAvatar({ imageBlob: blob, croppingRect }));
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-700
      hover:file:bg-blue-100 hover:file:cursor-pointer"
      />
      {image && (
        <AvatarEditor
          ref={editor}
          image={image}
          width={250}
          height={250}
          border={50}
          color={[255, 255, 255, 0.6]} // RGBA
          scale={1.2}
          rotate={0}
        />
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-blue-50 mt-3 ml-3 rounded-lg h-7 w-14 hover:cursor-pointer "
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default CropAndSetAvatar;
